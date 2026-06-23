import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://uurnubmzzyztebifxudq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1cm51Ym16enl6dGViaWZ4dWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxOTQyMDIsImV4cCI6MjA5Nzc3MDIwMn0.ASwhpz89_I4Rp038xJgsUuwWHhbKvEXYdQi3haH56XI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
