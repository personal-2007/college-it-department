import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const missingVariables = [
  !supabaseUrl && 'VITE_SUPABASE_URL',
  !supabaseKey && 'VITE_SUPABASE_PUBLISHABLE_KEY',
].filter(Boolean);

if (missingVariables.length > 0) {
  throw new Error(
    `Missing Supabase environment variable(s): ${missingVariables.join(', ')}. ` +
    'Add them to client/.env or client/.env.local, then restart the Vite development server.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
