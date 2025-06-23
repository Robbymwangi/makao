/*
  # Fix RLS Policies for Profiles Table

  1. Security Changes
    - Drop existing policies that cause recursion
    - Create simplified policies that avoid table self-references
    - Use auth.users metadata for admin role checking
    - Prevent users from changing their own roles

  2. New Policies
    - Users can read/update their own profiles
    - System admins can read/update all profiles
    - Profile creation allowed during signup
    - Only system admins can delete profiles
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "System admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "System admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON profiles;

-- Drop the function if it exists
DROP FUNCTION IF EXISTS is_system_admin();

-- Create a helper function to check if current user is system admin
-- This function checks the auth.users table instead of profiles to avoid recursion
CREATE OR REPLACE FUNCTION is_system_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_user_meta_data->>'role')::text = 'systemAdmin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy 1: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy 2: Users can update their own profile (but cannot change their role)
-- Split into two policies to handle role protection properly
CREATE POLICY "Users can update own profile basic fields"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role IN ('user', 'systemAdmin', 'consultantAdmin', 'agentAdmin')
  );

-- Policy 3: System admins can read all profiles
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
    is_system_admin() OR auth.uid() = id
  );

-- Policy 5: Allow profile creation during signup
CREATE POLICY "Allow profile creation"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id 
    AND role IN ('user', 'systemAdmin', 'consultantAdmin', 'agentAdmin')
  );

-- Policy 6: Allow deletion for system admins only
CREATE POLICY "System admins can delete profiles"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (is_system_admin());

-- Create a trigger to prevent role changes for non-admin users
CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow if user is system admin (checked via auth.users metadata)
  IF EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_user_meta_data->>'role')::text = 'systemAdmin'
  ) THEN
    RETURN NEW;
  END IF;
  
  -- For non-admin users, prevent role changes
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    RAISE EXCEPTION 'Users cannot change their own role';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS prevent_role_change_trigger ON profiles;
CREATE TRIGGER prevent_role_change_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_role_change();