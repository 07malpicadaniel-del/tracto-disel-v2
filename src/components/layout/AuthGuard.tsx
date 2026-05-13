"use client";

// El proxy.ts ya nos protegió en el servidor, 
// así que aquí solo dejamos pasar la vista directamente.
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}