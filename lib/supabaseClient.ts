import { createBrowserClient } from '@supabase/ssr'
import { env } from './env'

// Browser client uses secure, SSR-compatible cookie session handling.
export const supabase = createBrowserClient(
  env.supabaseUrl,
  env.supabaseAnonKey
)
