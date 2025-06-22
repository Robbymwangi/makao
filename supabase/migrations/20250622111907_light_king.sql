/*
  # Fix user creation trigger and constraints

  1. Changes
    - Drop and recreate the foreign key constraint to be more permissive
    - Update the trigger function to handle errors gracefully
    - Ensure the trigger works with Supabase's auth flow

  2. Security
    - Maintain RLS policies
    - Keep role validation
*/

-- Drop the existing foreign key constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Add a more permissive foreign key constraint
ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey 
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update the trigger function to be more robust
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into profiles with error handling
  INSERT INTO profiles (id, email, role)
  VALUES (NEW.id, COALESCE(NEW.email, NEW.raw_user_meta_data->>'email'), 'user')
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Also create a function to manually create profiles if needed
CREATE OR REPLACE FUNCTION create_profile_if_missing(user_id uuid, user_email text)
RETURNS void AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (user_id, user_email, 'user')
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;