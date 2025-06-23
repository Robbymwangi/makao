/*
  # Fix RLS Policies to Prevent Infinite Recursion

  1. Security Changes
    - Remove circular references in RLS policies
    - Simplify admin role checks
    - Add proper INSERT policy for profile creation
    - Prevent users from changing their own roles

  2. Policy Structure
    - Users can read/update their own profiles
    - System admins can read/update all profiles
    - Profile creation allowed during signup
    - Role changes restricted to system admins
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "System admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "System admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON profiles;

-- Create new, simplified policies that avoid recursion

-- Policy 1: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy 2: Users can update their own profile (but cannot change their role)
-- This policy avoids recursion by not checking the profiles table in WITH CHECK
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = OLD.role  -- Use OLD.role to reference the existing role value
  );

-- Policy 3: System admins can read all profiles
-- Simplified approach that checks if user has systemAdmin role in their current profile
-- We'll use a function to avoid recursion
CREATE OR REPLACE FUNCTION is_system_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'systemAdmin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "System admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    is_system_admin() OR auth.uid() = id
  );

-- Policy 4: System admins can update all profiles
CREATE POLICY "System admins can update all profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    is_system_admin() OR auth.uid() = id
  )
  WITH CHECK (
    is_system_admin() OR (auth.uid() = id AND role = OLD.role)
  );

-- Policy 5: Allow profile creation during signup
CREATE POLICY "Allow profile creation"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy 6: Allow deletion for system admins only
CREATE POLICY "System admins can delete profiles"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (is_system_admin());