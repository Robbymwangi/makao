// routes/auth.js
import express from 'express';
import supabase from '../utils/supabaseClient.js';

const router = express.Router();

// Sign up endpoint
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    
    const { email, password, role = 'user' } = req.body;

    console.log('Signup attempt for:', email, 'with role:', role);

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format');
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Validate password length
    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Validate role
    const validRoles = ['user', 'systemAdmin', 'consultantAdmin', 'agentAdmin'];
    if (!validRoles.includes(role)) {
      console.log('Invalid role:', role);
      return res.status(400).json({ 
        error: 'Invalid role specified' 
      });
    }

    console.log('Attempting Supabase signup...');

    // Sign up user with Supabase Auth - redirect to frontend confirmation page with type=signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:5173/auth/confirm?type=signup',
        data: {
          role: role // Store role in user metadata
        }
      }
    });

    console.log('Supabase auth response:', { 
      user: authData?.user ? 'User created' : 'No user', 
      session: authData?.session ? 'Session created' : 'No session',
      error: authError 
    });

    if (authError) {
      console.error('Auth error:', authError);
      return res.status(400).json({ error: authError.message });
    }

    // Check if user was created successfully
    if (authData.user) {
      console.log('User created successfully:', authData.user.id);
      
      // If user has a session, they're auto-confirmed (development mode)
      if (authData.session) {
        // Wait a moment for the database trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if profile was created by the trigger
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        console.log('Profile check:', { profile, profileError });

        let userRole = role;
        
        if (profileError) {
          console.log('Profile not found, creating manually...');
          // If profile doesn't exist, create it manually
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: authData.user.email,
              role: role
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            userRole = 'user';
          } else {
            console.log('Profile created manually:', newProfile);
            userRole = newProfile.role;
          }
        } else {
          userRole = profile.role;
        }

        res.json({
          user: authData.user,
          session: authData.session,
          role: userRole,
          message: 'User created and logged in successfully'
        });
      } else {
        // User needs to confirm email
        res.json({
          user: authData.user,
          session: null,
          role: role,
          message: 'Please check your email to confirm your account before logging in',
          requiresConfirmation: true
        });
      }
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
    console.log('Login request received:', { email: req.body.email });
    
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

    console.log('Login auth response:', { 
      user: authData?.user ? 'User found' : 'No user', 
      session: authData?.session ? 'Session created' : 'No session',
      error: authError 
    });

    if (authError) {
      console.error('Login error:', authError);
      
      // Check if it's an email not confirmed error
      if (authError.message.includes('email not confirmed')) {
        return res.status(400).json({ 
          error: 'Please confirm your email address before logging in',
          code: 'email_not_confirmed'
        });
      }
      
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

// Resend confirmation email endpoint
router.post('/resend-confirmation', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('Resending confirmation email for:', email);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: 'http://localhost:5173/auth/confirm?type=signup'
      }
    });

    if (error) {
      console.error('Resend confirmation error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Confirmation email sent successfully' });
  } catch (error) {
    console.error('Resend confirmation error:', error);
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