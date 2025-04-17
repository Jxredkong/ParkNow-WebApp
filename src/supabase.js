import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hdkopmqkflnrjhodcupv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhka29wbXFrZmxucmpob2RjdXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDcyNjEsImV4cCI6MjA1OTYyMzI2MX0.9sQO9fyOLJMQnUA6UgqCCWGz6kXlLQwL_4En54IPAYc";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
