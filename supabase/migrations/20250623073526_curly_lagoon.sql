/*
  # Fix Supabase Connection Test and RLS Policies

  1. Security Updates
    - Fix RLS policies to allow proper access patterns
    - Ensure connection tests can work with anonymous access for health checks
    - Maintain security while allowing necessary operations

  2. Policy Improvements
    - Allow anonymous access for connection testing
    - Fix user profile access patterns
    - Ensure proper role-based access control

  3. Function Updates
    - Improve error handling in functions
    - Fix potential recursion issues
    - Add better logging for debugging
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
DROP POLICY IF EXISTS "Allow anonymous access for connection testing" ON profiles;

-- Drop triggers before dropping functions
DROP TRIGGER IF EXISTS prevent_role_change_trigger ON profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Drop functions safely
DROP FUNCTION IF EXISTS is_system_admin();
DROP FUNCTION IF EXISTS prevent_role_change();
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create improved system admin check function
CREATE OR REPLACE FUNCTION is_system_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- First try to get role from JWT metadata
  user_role := COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'role')::text,
    (auth.jwt() -> 'app_metadata' ->> 'role')::text
  );
  
  -- If not found in JWT, check the profiles table
  IF user_role IS NULL AND auth.uid() IS NOT NULL THEN
    SELECT role INTO user_role 
    FROM profiles 
    WHERE id = auth.uid();
  END IF;
  
  RETURN COALESCE(user_role = 'systemAdmin', false);
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
DECLARE
  user_role TEXT;
BEGIN
  -- Get role from user metadata, default to 'user'
  user_role := COALESCE(
    NEW.raw_user_meta_data->>'role',
    NEW.user_metadata->>'role',
    'user'
  );
  
  -- Ensure role is valid
  IF user_role NOT IN ('user', 'systemAdmin', 'consultantAdmin', 'agentAdmin') THEN
    user_role := 'user';
  END IF;
  
  INSERT INTO public.profiles (id, email, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    user_role,
    now(),
    now()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't prevent user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
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
    RAISE EXCEPTION 'Insufficient permissions to change role from % to %', OLD.role, NEW.role;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anonymous access for connection testing (count operations only)
CREATE POLICY "Allow anonymous connection testing"
  ON profiles
  FOR SELECT
  TO anon
  USING (false); -- This allows count operations but no actual data access

-- Policy 2: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy 3: System admins can read all profiles
CREATE POLICY "System admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (is_system_admin());

-- Policy 4: Users can update their own profile (role changes prevented by trigger)
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 5: System admins can update all profiles
CREATE POLICY "System admins can update all profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (is_system_admin())
  WITH CHECK (is_system_admin());

-- Policy 6: Allow profile creation during signup
CREATE POLICY "Allow profile creation"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id 
    AND role IN ('user', 'systemAdmin', 'consultantAdmin', 'agentAdmin')
  );

-- Policy 7: Allow service role to insert profiles (for triggers)
CREATE POLICY "Allow service role profile creation"
  ON profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy 8: System admins can delete profiles
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON profiles TO anon; -- For connection testing only
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;