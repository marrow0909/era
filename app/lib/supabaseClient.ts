// app/lib/supabaseClient.ts
"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

// ⚠️ ここに自分の Supabase の URL / anon key を入れる
// （絶対にこのままコピペじゃなくて、自分のプロジェクトの値に書き換えてね）
const supabaseUrl = "https://zsiowtpsryvanjuktknh.supabase.co/";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzaW93dHBzcnl2YW5qdWt0a25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjE2ODksImV4cCI6MjA3OTczNzY4OX0.gjSoO3RsGE1CnUZ2gAnt0nFvQKWtfMHFWmFDMAMLxGE";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase env missing: check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export function getSupabaseClient(): SupabaseClient {
  return createClientComponentClient({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  });
}