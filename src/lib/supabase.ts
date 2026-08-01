import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xxmmmdtpnngvldhykoqy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4bW1tZHRwbm5ndmxkaHlrb3F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NjE0MTQsImV4cCI6MjEwMDUzNzQxNH0.YcCp8UDTGGO5VlbZxHaWWM1upaTw1Sz9nov6WPUYcQo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
