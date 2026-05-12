import { createClient } from '@supabase/supabase-js';

// 1. Next.js requiere el prefijo NEXT_PUBLIC_ para que el navegador vea las llaves.
// 2. Usamos process.env en lugar de import.meta.env.
// 3. El signo "!" al final le dice a TypeScript: "Confía en mí, estas variables existen".

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Verificación de seguridad en consola para desarrollo
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Error de Configuración: No se encontraron las variables de Supabase en .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);