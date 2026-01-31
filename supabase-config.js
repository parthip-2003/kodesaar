// Supabase Configuration
const SUPABASE_URL = 'https://vskalrepzuzaneglzdez.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_aWd31fqNw-4w6Dwk-sD8CQ_umT2tBhZ';

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabase;
