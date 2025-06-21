// index.js
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.js'; 

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Supabase client setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(express.json());

// Register your auth routes here
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
