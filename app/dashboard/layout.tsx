"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { MainNav } from "@/components/layout/main-nav";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SidebarProvider } from "../../components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, checkSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado y tiene una sesión válida
    if (!isLoading && (!isAuthenticated || !checkSession())) {
      // Redirigir al login si no hay sesión válida
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, checkSession, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated || !checkSession()) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen flex-row w-screen ">
        {/* <SidebarNav /> */}
        <div className="flex flex-1 w-full flex-col">
          <MainNav />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
