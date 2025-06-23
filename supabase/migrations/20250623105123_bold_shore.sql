/*
  # Revert to dry shadow migration state
  
  1. Tables
    - `profiles` table with proper structure
    - Proper RLS policies
    - Trigger functions for user management
  
  2. Security
    - Enable RLS on profiles table
    - Policies for user access control
    - Trigger for automatic profile creation
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  role text DEFAULT 'user'::text CHECK (role = ANY (ARRAY['user'::text, 'systemAdmin'::text, 'consultantAdmin'::text, 'agentAdmin'::text])),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for handling new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'role', 'user'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger function to prevent role changes
CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    RAISE EXCEPTION 'Role changes are not allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to check if user is system admin
CREATE OR REPLACE FUNCTION is_system_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'systemAdmin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS prevent_role_change_trigger ON profiles;
CREATE TRIGGER prevent_role_change_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_role_change();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- RLS Policies
DROP POLICY IF EXISTS "profiles_anonymous_select_policy" ON profiles;
CREATE POLICY "profiles_anonymous_select_policy"
  ON profiles FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "profiles_authenticated_insert" ON profiles;
CREATE POLICY "profiles_authenticated_insert"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK ((auth.uid() = id) AND (role = ANY (ARRAY['user'::text, 'systemAdmin'::text, 'consultantAdmin'::text, 'agentAdmin'::text])));

DROP POLICY IF EXISTS "profiles_service_role_insert" ON profiles;
CREATE POLICY "profiles_service_role_insert"
  ON profiles FOR INSERT
  TO service_role
  WITH CHECK (true);

DROP POLICY IF EXISTS "profiles_users_read_own" ON profiles;
CREATE POLICY "profiles_users_read_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_users_update_own" ON profiles;
CREATE POLICY "profiles_users_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_system_admins_read_all" ON profiles;
CREATE POLICY "profiles_system_admins_read_all"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_system_admin());

DROP POLICY IF EXISTS "profiles_system_admins_update_all" ON profiles;
CREATE POLICY "profiles_system_admins_update_all"
  ON profiles FOR UPDATE
  TO authenticated
  USING (is_system_admin())
  WITH CHECK (is_system_admin());

DROP POLICY IF EXISTS "profiles_system_admins_delete" ON profiles;
CREATE POLICY "profiles_system_admins_delete"
  ON profiles FOR DELETE
  TO authenticated
  USING (is_system_admin());