# How to Apply the Supabase Migration

## Option 1: Using Supabase CLI (Recommended)

If you have the Supabase CLI installed:

```bash
# Navigate to your project root
cd /path/to/your/project

# Apply the migration
supabase db push

# Or if you want to reset and apply all migrations
supabase db reset
```

## Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the entire content of `supabase/migrations/20250623093852_autumn_cliff.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the migration

## Option 3: Manual Verification

After applying the migration, you can verify it worked by running this query in the SQL Editor:

```sql
-- Check if profiles table exists and has correct structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check RLS policies
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Check triggers
SELECT trigger_name, event_manipulation, action_timing 
FROM information_schema.triggers 
WHERE event_object_table = 'profiles';

-- Test profile creation (this should work after login)
SELECT id, email, role, created_at 
FROM profiles 
WHERE id = auth.uid();
```

## What This Migration Does

1. **Completely resets** all existing policies, triggers, and functions
2. **Recreates the profiles table** with proper structure and constraints
3. **Sets up RLS policies** that allow:
   - Users to manage their own profiles
   - Service role to handle internal operations
4. **Creates functions** for:
   - Automatic profile creation on user signup
   - Role change prevention
   - Timestamp updates
   - Admin role checking
5. **Establishes triggers** for automatic operations

## Expected Result

After applying this migration, your login should work properly because:
- The `handle_new_user()` function will automatically create a profile when a user signs up
- The RLS policies will allow users to read their own profile data
- The backend will be able to fetch user profiles without permission errors

## Troubleshooting

If you still encounter issues after applying the migration:

1. Check the Supabase logs for any error messages
2. Verify that the migration was applied successfully
3. Test creating a new user account to see if the profile is created automatically
4. Check if existing users have profiles in the database