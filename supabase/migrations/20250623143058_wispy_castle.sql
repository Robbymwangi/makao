/*
  # Complete profiles table setup with authentication integration - CLEAN SLATE

  This migration completely resets and recreates the profiles table setup:
  1. Drops all existing policies, triggers, and functions
  2. Recreates the profiles table with proper structure
  3. Sets up comprehensive RLS policies
  4. Creates all necessary functions and triggers

  ## Tables
  - `profiles` table with user authentication integration

  ## Security
  - Row Level Security (RLS) enabled
  - Policies for all user types and operations
  - Role-based access control

  ## Functions
  - User profile management
  - Role validation
  - Automatic profile creation

  ## Triggers
  - Auto-create profiles on user signup
  - Prevent unauthorized role changes
  - Update timestamps automatically
*/

-- =====================================================
-- STEP 1: CLEAN SLATE - Drop everything existing
-- =====================================================

-- Drop all existing policies (ignore errors if they don't exist)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on profiles table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON profiles';
    END LOOP;
END $$;

-- Drop all triggers on profiles table
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT trigger_name FROM information_schema.triggers WHERE event_object_table = 'profiles')
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.trigger_name) || ' ON profiles';
    END LOOP;
END $$;

-- Drop trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop all functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS prevent_role_change() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS is_system_admin() CASCADE;

-- =====================================================
-- STEP 2: CREATE/RECREATE PROFILES TABLE
-- =====================================================

-- Create profiles table (or ensure it exists with correct structure)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  role text DEFAULT 'user'::text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraint for valid roles
DO $$
BEGIN
    -- Drop existing constraint if it exists
    ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    
    -- Add new constraint
    ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role = ANY (ARRAY['user'::text, 'systemAdmin'::text, 'consultantAdmin'::text, 'agentAdmin'::text]));
EXCEPTION
    WHEN OTHERS THEN
        -- Constraint might already exist, ignore error
        NULL;
END $$;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- =====================================================
-- STEP 3: CREATE FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get role from user metadata, default to 'user'
  user_role := COALESCE(
    NEW.raw_user_meta_data->>'role',
    'user'
  );
  
  -- Ensure role is valid
  IF user_role NOT IN ('user', 'systemAdmin', 'consultantAdmin', 'agentAdmin') THEN
    user_role := 'user';
  END IF;
  
  -- Insert profile
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

-- Function to prevent unauthorized role changes
CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER AS $$
DECLARE
  current_user_role TEXT;
BEGIN
  -- Get current user's role
  SELECT role INTO current_user_role 
  FROM profiles 
  WHERE id = auth.uid();
  
  -- Allow system admins to change any role
  IF current_user_role = 'systemAdmin' THEN
    RETURN NEW;
  END IF;
  
  -- For regular users, prevent role changes
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    RAISE EXCEPTION 'Insufficient permissions to change role from % to %', OLD.role, NEW.role;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is system admin
CREATE OR REPLACE FUNCTION is_system_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Get user's role from profiles table
  SELECT role INTO user_role 
  FROM profiles 
  WHERE id = auth.uid();
  
  RETURN COALESCE(user_role = 'systemAdmin', FALSE);
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 4: CREATE TRIGGERS
-- =====================================================

-- Trigger to update updated_at on profile changes
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to prevent unauthorized role changes
CREATE TRIGGER prevent_role_change_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_role_change();

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- STEP 5: CREATE RLS POLICIES
-- =====================================================

-- Policy 1: Allow users to create their own profile
CREATE POLICY "Allow users to create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy 2: Allow users to read their own profile
CREATE POLICY "Allow users to read their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy 3: Allow users to update their own profile
CREATE POLICY "Allow users to update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 4: Allow users to delete their own profile
CREATE POLICY "Allow users to delete their own profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Policy 5: Allow service role full access (for triggers and admin operations)
CREATE POLICY "Allow service role full access"
  ON profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- STEP 6: GRANT PERMISSIONS
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON profiles TO authenticated, service_role;

-- =====================================================
-- STEP 7: VERIFICATION
-- =====================================================

-- Create a simple function to verify the setup
CREATE OR REPLACE FUNCTION verify_profiles_setup()
RETURNS TEXT AS $$
DECLARE
  policy_count INTEGER;
  trigger_count INTEGER;
  function_count INTEGER;
BEGIN
  -- Count policies
  SELECT COUNT(*) INTO policy_count 
  FROM pg_policies 
  WHERE tablename = 'profiles';
  
  -- Count triggers
  SELECT COUNT(*) INTO trigger_count 
  FROM information_schema.triggers 
  WHERE event_object_table = 'profiles';
  
  -- Count functions
  SELECT COUNT(*) INTO function_count 
  FROM pg_proc 
  WHERE proname IN ('handle_new_user', 'prevent_role_change', 'update_updated_at_column', 'is_system_admin');
  
  RETURN format('Setup complete: %s policies, %s triggers, %s functions', 
                policy_count, trigger_count, function_count);
END;
$$ LANGUAGE plpgsql;

-- Run verification
SELECT verify_profiles_setup();

-- Clean up verification function
DROP FUNCTION verify_profiles_setup();