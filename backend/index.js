// Load environment variables FIRST, before any imports that might need them
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the backend directory BEFORE other imports
dotenv.config({ path: path.join(__dirname, '.env') });

// Now import other modules that depend on environment variables
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Check environment variables
console.log('Backend Environment Check:');
console.log('- SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Missing');
console.log('- SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing');
console.log('- FRONTEND_URL:', process.env.FRONTEND_URL ? 'Set' : 'Missing');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('❌ Missing required environment variables!');
  console.error('Please create a .env file in the backend directory with:');
  console.error('SUPABASE_URL=your-supabase-url');
  console.error('SUPABASE_ANON_KEY=your-anon-key');
  console.error('FRONTEND_URL=http://localhost:5173');
  process.exit(1);
}

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5173', 'https://localhost:5173', /\.webcontainer-api\.io$/],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', { ...req.body, password: req.body.password ? '[HIDDEN]' : undefined });
  }
  next();
});

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running',
    env: {
      supabaseUrl: process.env.SUPABASE_URL ? 'Set' : 'Missing',
      supabaseKey: process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      frontendUrl: process.env.FRONTEND_URL ? 'Set' : 'Missing'
    }
  });
});

// Import auth routes AFTER environment variables are confirmed to be loaded
import authRoutes from './src/routes/auth.js'; 

// Register auth routes
app.use('/auth', authRoutes);

// Import user routes
import userRoutes from './src/routes/users.js';

// Register user routes
app.use('/users', userRoutes);


// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server listening on port ${port}`);
  console.log(`🔗 Health check available at http://localhost:${port}/health`);
  console.log('✅ Environment variables loaded successfully');
});