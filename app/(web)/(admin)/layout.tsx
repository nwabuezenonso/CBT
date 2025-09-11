"use client";

import AdminDashboard from "@/components/AdminDashboard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminDashboard>{children}</AdminDashboard>;
}
