import 'dotenv/config';
import { createServiceClient } from '../src/utils/supabaseClient.js';

const supabase = createServiceClient();

const agents = [
  { full_name: 'Esther Mumo', email: 'esther.mumo@example.com', phone: '0712345678' },
  { full_name: 'Brian Otieno', email: 'brian.otieno@example.com', phone: '0723456789' },
  { full_name: 'Grace Wanjiku', email: 'grace.wanjiku@example.com', phone: '0734567890' }
];

for (const agent of agents) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: agent.email,
    password: 'Pass123!',
    user_metadata: { full_name: agent.full_name }
  });

  if (error) {
    console.error('Error creating user:', error);
    continue;
  }

  const id = data.user.id;

  await supabase.from('profiles').insert({
    id,
    email: agent.email,
    role: 'agentAdmin'
  });

  await supabase.from('agents').insert({
    id,
    name: agent.full_name,
    email: agent.email,
    phone: agent.phone
  });

  await supabase.from('admins').insert({
    id,
    email: agent.email,
    full_name: agent.full_name,
    role: 'agentAdmin'
  });

  console.log(`✅ Created ${agent.full_name}`);
}
console.log('All agents seeded successfully.');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY);