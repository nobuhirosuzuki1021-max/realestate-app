import { createClient } from '@supabase/supabase-js'

// Viteの環境変数（VITE_プレフィックスが必須）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
