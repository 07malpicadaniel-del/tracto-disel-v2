import { createBrowserClient } from '@supabase/ssr';

// Al usar createBrowserClient, la sesión se guarda automáticamente 
// en las Cookies para que tu proxy.ts pueda validar el acceso.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);