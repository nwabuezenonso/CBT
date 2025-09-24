"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Settings, LogOut, Award, BarChart3, FileText } from "lucide-react";
import { NotificationCenter } from "@/components/notification-center";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarToggle,
  SidebarNav,
  SidebarNavItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SettingsDialog } from "@/components/examiner";

const sidebarItems = [
  { id: "overview", label: "Overview", icon: BarChart3, path: "/dashboard" },
  { id: "exams", label: "Exams", icon: FileText, path: "/dashboard/exams" },
  { id: "students", label: "Students", icon: Users, path: "/dashboard/students" },
  { id: "results", label: "Results", icon: Award, path: "/dashboard/results" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname(); // ✅ get current route

  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <SidebarProvider defaultCollapsed={false}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card absolute top-0 w-full z-20">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">CBT Pro Admin</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <NotificationCenter />
              <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}

        <div className="flex h-[100px]">
          <Sidebar>
            <div className="">
              <SidebarToggle />
              <SidebarContent>
                <SidebarNav className="my-[80px]">
                  {sidebarItems.map((item) => {
                    const isActive = pathname === item.path; // ✅ check active state
                    return (
                      <Link key={item.id} href={item.path}>
                        <SidebarNavItem
                          icon={item.icon}
                          active={isActive}
                          className={`hover:cursor-pointer ${
                            isActive ? "hover:text-white font-medium" : "text-muted-foreground"
                          }`}
                        >
                          {item.label}
                        </SidebarNavItem>
                      </Link>
                    );
                  })}
                </SidebarNav>
              </SidebarContent>
            </div>

            <SidebarFooter>
              <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </SidebarFooter>
          </Sidebar>

          {/* Main Content */}
          <main className="flex-1 px-6 py-24">{children}</main>
        </div>

        {/* Settings Dialog */}
        <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </SidebarProvider>
  );
}
