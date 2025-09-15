"use client";

import AdminDashboard from "@/components/AdminDashboard";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/AppSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <div className="flex-1">
          <header className="border-b p-4 flex items-center justify-between">
            <SidebarTrigger /> {/* This toggles the sidebar on mobile */}
            <h1 className="font-bold">Dashboard</h1>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
