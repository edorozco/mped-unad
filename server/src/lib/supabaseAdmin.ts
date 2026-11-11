import { createClient } from '@supabase/supabase-js'

// Cliente con service role — solo para operaciones administrativas del propio
// servidor (crear usuarios en el seed, firmar URLs de Storage si hiciera falta).
// NUNCA exponer este cliente ni la service role key al frontend.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
