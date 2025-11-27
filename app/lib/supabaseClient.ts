// app/lib/supabaseClient.ts
"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function getSupabaseClient() {
  // 環境変数は auth-helpers が勝手に NEXT_PUBLIC_SUPABASE_URL / ANON_KEY から読む
  return createClientComponentClient();
}
