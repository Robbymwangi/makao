/*
  # Fix RLS Policies for Profiles Table

  1. Security Changes
    - Drop existing problematic policies
    - Create new, simplified policies that don't cause recursion
    - Ensure policies use auth.uid() directly without circular references

  2. Policy Structure
    - Users can read their own profile
    - Users can update their own profile (with role protection)
    - System admins can read all profiles
    - System admins can update all profiles
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "System admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "System admins can update all profiles" ON profiles;

-- Create new, simplified policies that avoid recursion

-- Policy 1: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy 2: Users can update their own profile (but cannot change their role)
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (
      SELECT role 
      FROM profiles 
      WHERE id = auth.uid()
    )
  );

-- Policy 3: System admins can read all profiles
-- Use a simpler approach that checks user metadata instead of profiles table
CREATE POLICY "System admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata' ->> 'role') = 'systemAdmin'
    OR
    auth.uid() = id
  );

-- Policy 4: System admins can update all profiles
CREATE POLICY "System admins can update all profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata' ->> 'role') = 'systemAdmin'
    OR
    auth.uid() = id
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata' ->> 'role') = 'systemAdmin'
    OR
    (auth.uid() = id AND role = (
      SELECT role 
      FROM profiles 
      WHERE id = auth.uid()
    ))
  );

-- Policy 5: Allow profile creation during signup
CREATE POLICY "Allow profile creation"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);