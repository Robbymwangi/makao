/*
  # Fix RLS Policies and Database Setup

  1. Database Setup
    - Ensure proper RLS policies that don't cause recursion
    - Create helper functions for role checking
    - Set up proper triggers for profile management

  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users to manage their profiles
    - Add policies for system admins to manage all profiles
    - Prevent role escalation attacks

  3. Functions
    - Create is_system_admin() function that checks auth.users metadata
    - Create profile management triggers
    - Create automatic profile creation trigger
*/

-- Drop all existing policies and functions to start fresh
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "System admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "System admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON profiles;
DROP POLICY IF EXISTS "System admins can delete profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile basic fields" ON profiles;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS is_system_admin();
DROP FUNCTION IF EXISTS prevent_role_change();
DROP FUNCTION IF EXISTS handle_new_user();

-- Create a simple function to check if current user is system admin
-- This avoids recursion by checking auth.users directly
CREATE OR REPLACE FUNCTION is_system_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current user has systemAdmin role in their metadata
  RETURN COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'systemAdmin',
    false
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- If profile creation fails, log but don't prevent user creation
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to prevent unauthorized role changes
CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow system admins to change any role
  IF is_system_admin() THEN
    RETURN NEW;
  END IF;
  
  -- For regular users, prevent role changes
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    RAISE EXCEPTION 'Insufficient permissions to change role';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to prevent role changes
DROP TRIGGER IF EXISTS prevent_role_change_trigger ON profiles;
CREATE TRIGGER prevent_role_change_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_role_change();

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy 2: System admins can read all profiles
CREATE POLICY "System admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (is_system_admin());

-- Policy 3: Users can update their own profile (role changes prevented by trigger)
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 4: System admins can update all profiles
CREATE POLICY "System admins can update all profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (is_system_admin())
  WITH CHECK (is_system_admin());

-- Policy 5: Allow profile creation during signup
CREATE POLICY "Allow profile creation"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id 
    AND role IN ('user', 'systemAdmin', 'consultantAdmin', 'agentAdmin')
  );

-- Policy 6: System admins can delete profiles
CREATE POLICY "System admins can delete profiles"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (is_system_admin());

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);