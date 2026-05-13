import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/layout/Sidebar";
import { Toaster } from 'react-hot-toast'; // 1. Importamos la librería

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tracto-disel POS",
  description: "Sistema de Punto de Venta e Inventario B2B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-950 text-slate-50 flex h-screen overflow-hidden selection:bg-blue-500/30`}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>

        {/* 2. Inyectamos el Toaster global con estilo oscuro personalizado */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0f172a', // bg-slate-950
              color: '#f8fafc',      // text-slate-50
              border: '1px solid #1e293b', // border-slate-800
              borderRadius: '1rem',
              fontWeight: '500',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#0f172a' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#0f172a' },
            },
          }}
        />
      </body>
    </html>
  );
}