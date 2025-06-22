// routes/auth.js
import express from 'express';
import supabase from '../utils/supabaseClient.js';

const router = express.Router();

// Sign up endpoint
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role = 'user' } = req.body;

    console.log('Signup attempt for:', email, 'with role:', role);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Validate role
    const validRoles = ['user', 'systemAdmin', 'consultantAdmin', 'agentAdmin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role specified' 
      });
    }

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Disable email confirmation
        data: {
          role: role // Store role in user metadata
        }
      }
    });

    console.log('Supabase auth response:', { authData, authError });

    if (authError) {
      console.error('Auth error:', authError);
      return res.status(400).json({ error: authError.message });
    }

    // Check if user was created successfully
    if (authData.user) {
      console.log('User created successfully:', authData.user.id);
      
      // The profile should be created automatically by the database trigger
      // Let's wait a moment and then fetch the profile to confirm
      setTimeout(async () => {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', authData.user.id)
            .single();

          console.log('Profile check:', { profile, profileError });
        } catch (err) {
          console.error('Profile check error:', err);
        }
      }, 1000);

      res.json({
        user: authData.user,
        session: authData.session,
        role: role
      });
    } else {
      console.error('No user data returned from Supabase');
      res.status(500).json({ error: 'Failed to create user account' });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Database error saving new user' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for:', email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Sign in user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Login auth response:', { authData, authError });

    if (authError) {
      console.error('Login error:', authError);
      return res.status(400).json({ error: authError.message });
    }

    // Fetch user's profile to get their role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    console.log('Profile fetch:', { profile, profileError });

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      // If profile doesn't exist, create it with default role
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          role: 'user'
        });

      if (createError) {
        console.error('Error creating profile:', createError);
        return res.status(500).json({ error: 'Error setting up user profile' });
      }

      // Return with default role
      return res.json({
        user: authData.user,
        session: authData.session,
        role: 'user'
      });
    }

    res.json({
      user: authData.user,
      session: authData.session,
      role: profile.role
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Fetch user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return res.status(500).json({ error: 'Error fetching profile' });
    }

    res.json({
      user,
      profile
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;