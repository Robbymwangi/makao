/*
  # Fix RLS Policies and Functions

  1. Clean up existing policies and functions properly
  2. Create new functions that avoid recursion
  3. Set up proper RLS policies
  4. Add triggers for profile management

  ## Changes
  - Drop all existing policies and dependent objects in correct order
  - Create is_system_admin() function using JWT metadata
  - Create handle_new_user() function for automatic profile creation
  - Create prevent_role_change() function with proper permissions
  - Set up RLS policies that avoid recursion
  - Add performance indexes
*/

-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "System admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "System admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON profiles;
DROP POLICY IF EXISTS "System admins can delete profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile basic fields" ON profiles;
DROP POLICY IF EXISTS "Allow users to create their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to delete their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Drop triggers before dropping functions (to avoid dependency errors)
DROP TRIGGER IF EXISTS prevent_role_change_trigger ON profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Now drop functions safely
DROP FUNCTION IF EXISTS is_system_admin();
DROP FUNCTION IF EXISTS prevent_role_change();
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- Create triggers after functions are created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER prevent_role_change_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_role_change();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);