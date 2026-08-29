import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jhuwxajevgxygmmkxzwu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpodXd4YWpldmd4eWdtbWt4end1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTExNjIsImV4cCI6MjA3OTU2NzE2Mn0.gd-onKvQSX9KeLYDCvAJYC-fgbkRAIQcVQoSs3Y_a7Q";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});
