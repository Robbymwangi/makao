// routes/auth.js
import express from 'express';
import createSupabaseClient from '../utils/supabaseClient.js';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// ——— Helpers ——— //

// Retry helper (unchanged)
const withRetry = async (operation, maxRetries = 2) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try { return await operation(); }
    catch (err) {
      if (attempt === maxRetries || !err.message.includes('fetch failed')) throw err;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
};

// Build clients (unchanged)
const makeClient = (key, token) => {
  const url = process.env.SUPABASE_URL;
  const opts = token ? {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
  } : {};
  return createClient(url, key, opts);
};

// Helpers (unchanged)
const getFrontendUrl = () =>
  (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');

const fail = (res, status, code, message) =>
  res.status(status).json({ code, error: message });

// ——— SIGNUP ——— //
router.post('/signup', async (req, res) => {
  const { email, password, role = 'user' } = req.body;
  if (!email || !password) {
    return fail(res, 400, 'validation_error', 'Email & password required');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const service = makeClient(process.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: rows, error: rpcErr } = await withRetry(() =>
    service.rpc('get_user_by_email', { p_email: normalizedEmail })
  );
  if (rpcErr) {
    console.error('RPC lookup error:', rpcErr);
    return fail(res, 500, 'lookup_error', rpcErr.message);
  }

  const existing = Array.isArray(rows) && rows.length ? rows[0] : null;

  if (existing) {
    if (!existing.email_confirmed_at) {
      return fail(res, 409, 'pending_verification', 'Account exists but not yet verified');
    }
    return fail(res, 409, 'email_already_registered', 'Email already registered');
  }

  try {
    const client = createSupabaseClient();
    const { data: signUpData, error: signUpErr } = await withRetry(() =>
      client.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: `${getFrontendUrl()}/verify-email`,
          data: { role },
        },
      })
    );
    if (signUpErr) {
      console.error('signUp error:', signUpErr);
      return fail(res, 400, 'signup_failed', signUpErr.message);
    }

    // After user signs up successfully, insert into users table
    if (signUpData && signUpData.user) {
      try {
        await service
          .from("users")
          .insert({
            id: signUpData.user.id,
            email: signUpData.user.email,
            full_name: "",
            role, // optional but helps
          });

        return res.status(201).json({
          code: 'verification_sent',
          message: 'Verification email sent',
        });
      } catch (err) {
        console.error('Failed to insert into users table:', err.message);
        return fail(res, 500, 'insert_error', err.message);
      }
    } else {
      // If for some reason signUpData.user is missing
      return fail(res, 500, 'signup_failed', 'User not created');
    }
  } catch (err) {
    console.error('Unexpected signup error:', err);
    return fail(res, 500, 'unexpected_error', err.message);
  }
});

// ——— LOGIN ——— //
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return fail(res, 400, 'validation_error', 'Email & password required');
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const client = createSupabaseClient();

    const { data: auth, error: authErr } = await withRetry(() =>
      client.auth.signInWithPassword({ email: normalizedEmail, password })
    );

    if (authErr) {
      if (authErr.message?.toLowerCase().includes('email not confirmed')) {
        return fail(res, 403, 'pending_verification', 'Please verify your email before logging in');
      }
      return fail(res, 401, 'invalid_credentials', 'Invalid email or password');
    }

    const token = auth.session.access_token;
    const authed = makeClient(process.env.SUPABASE_ANON_KEY, token);

    // Block admin login on user route
    const { data: adminRow } = await withRetry(() =>
      authed.from('admins').select('role').eq('id', auth.user.id).maybeSingle()
    );

    if (adminRow) {
      return fail(res, 403, 'admin_misroute', 'Please log in via the staff portal');
    }

    // Fetch user role + full name
    const { data: userRow } = await withRetry(() =>
      authed.from('users').select('role, full_name').eq('id', auth.user.id).single()
    );

    const role = userRow?.role || null;
    const full_name = userRow?.full_name || '';

    return res.json({
      user: {
        ...auth.user,
        full_name,
      },
      session: auth.session,
      role
    });

  } catch (err) {
    console.error('Unexpected login error:', err);
    return fail(res, 500, 'unexpected_error', err.message);
  }
});

// ——— STAFF LOGIN ——— //
router.post('/staff-login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return fail(res, 400, 'validation_error', 'Email & password required');
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const client = createSupabaseClient();

    // Step 1: Sign in via Supabase Auth
    const { data: auth, error: authErr } = await withRetry(() =>
      client.auth.signInWithPassword({ email: normalizedEmail, password })
    );

    if (authErr) {
      if (authErr.message?.toLowerCase().includes('email not confirmed')) {
        return fail(res, 403, 'pending_verification', 'Please verify your email before logging in');
      }
      return fail(res, 401, 'invalid_credentials', 'Invalid email or password');
    }

    const token = auth.session.access_token;
    const authed = makeClient(process.env.SUPABASE_ANON_KEY, token);

    // Step 2: Fetch from `admins` using user id
    const { data: adminRow, error: adminErr } = await withRetry(() =>
      authed.from('admins').select('*').eq('id', auth.user.id).single()
    );

    if (adminErr || !adminRow) {
      return fail(res, 403, 'not_staff', 'Account is not recognized as a staff member');
    }

    const { role, full_name } = adminRow;
    const staffRoles = ['systemAdmin', 'consultantAdmin', 'agentAdmin'];

    if (!staffRoles.includes(role)) {
      return fail(res, 403, 'not_staff', 'Access denied: not a staff account');
    }

    // Step 3: Return enriched session
    return res.json({
      user: {
        ...auth.user,
          role,
          full_name,
        
      },
      session: auth.session,
      role,
    });

  } catch (err) {
    console.error('Unexpected staff login error:', err);
    return fail(res, 500, 'unexpected_error', err.message);
  }
});


// ——— RESEND CONFIRMATION ——— //
router.post('/resend-confirmation', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return fail(res, 400, 'validation_error', 'Email is required');
  }

  const client = createSupabaseClient();
  const { error } = await withRetry(() =>
    client.auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: `${getFrontendUrl()}/verify-email` }
    })
  );
  if (error) return fail(res, 400, 'resend_failed', error.message);

  res.json({ code: 'resend_sent', message: 'Confirmation email resent' });
});


// ——— LOGOUT ——— //
router.post('/logout', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const supabase = createSupabaseClient();
      await withRetry(() => supabase.auth.signOut());
    } catch (e) {
      console.error('Logout error:', e);
    }
  }
  res.json({ message: 'Logged out successfully' });
});


// ——— PROFILE ——— //
router.get('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return fail(res, 401, 'no_token', 'Authorization header missing');
  }
  const token = authHeader.replace('Bearer ', '');

  const client = createSupabaseClient();
  const { data: userData, error: userErr } = await withRetry(() =>
    client.auth.getUser(token)
  );
  if (userErr || !userData.user) {
    return fail(res, 401, 'invalid_token', 'Token invalid');
  }

  const authed = makeClient(process.env.SUPABASE_ANON_KEY, token);
  const { data: profile, error: profErr } = await withRetry(() =>
    authed.from('profiles').select('*').eq('id', userData.user.id).single()
  );
  if (profErr) return fail(res, 500, 'profile_error', profErr.message);

  res.json({ user: userData.user, profile });
});

export default router;
