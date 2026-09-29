import { createClient } from '@supabase/supabase-js'

// Misma base de datos publica (solo lectura) que usa inazuma-draft — reutiliza
// su catalogo de cartas/tecnicas ya curado. Clave publishable, segura de exponer.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://xacgoiaejdgjrvvsnqyi.supabase.co'
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY ?? 'sb_publishable_iaMxVv0YacdSYbqOArEMJw_7OMGCMhb'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
