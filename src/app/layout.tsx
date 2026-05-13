"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/layout/Sidebar";
import AuthGuard from "../components/layout/AuthGuard";
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const esLogin = pathname === '/login';

  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-950 text-slate-50 flex h-screen overflow-hidden`}>
        <AuthGuard>
          {!esLogin && <Sidebar />}
          <main className={`flex-1 overflow-y-auto ${esLogin ? '' : 'p-4 md:p-8'}`}>
            {children}
          </main>
        </AuthGuard>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}