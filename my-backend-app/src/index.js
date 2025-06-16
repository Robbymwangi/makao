  const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Supabase client setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.send('Express + Supabase backend is running!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});