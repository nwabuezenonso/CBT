"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Settings, LogOut, Award, BarChart3, FileText, LayoutDashboard, Database, PieChart, FileOutput, HelpCircle } from "lucide-react";
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
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";


import { SettingsDialog } from "@/components/examiner";

const sidebarItems = [
  {
    group: "Main",
    items: [
       { id: "overview", label: "Overview", icon: BarChart3, path: "/dashboard" },
       { id: "exams", label: "Exams", icon: FileText, path: "/dashboard/exams" },
       { id: "students", label: "Students", icon: Users, path: "/dashboard/students" },
       { id: "results", label: "Results", icon: Award, path: "/dashboard/results" },
    ]
  }
];

const examinerSidebarGroups = [
    {
      group: "Main",
      items: [
        { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/dashboard/examiner" },
      ]
    },
    {
      group: "Management",
      items: [
        { id: "manage-exams", label: "Manage Exams", icon: FileText, path: "/dashboard/examiner/exams" },
        { id: "question-bank", label: "Question Bank", icon: Database, path: "/dashboard/examiner/question-bank" },
        { id: "examinees", label: "Examinees", icon: Users, path: "/dashboard/examiner/examinees" },
      ]
    },
    {
      group: "Analysis",
      items: [
         { id: "results", label: "Results & Grading", icon: Award, path: "/dashboard/examiner/results" },
         { id: "analytics", label: "Analytics", icon: PieChart, path: "/dashboard/examiner/analytics" },
         { id: "reports", label: "Reports", icon: FileOutput, path: "/dashboard/examiner/reports" },
      ]
    },
    {
      group: "System",
      items: [
         { id: "help", label: "Help & Support", icon: HelpCircle, path: "/dashboard/examiner/help" },
      ]
    }
];

const orgAdminSidebarGroups = [
  {
    group: "Main",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/dashboard/org-admin" },
      { id: "teachers", label: "Teachers", icon: Users, path: "/dashboard/org-admin/teachers" },
      { id: "students", label: "Students", icon: Users, path: "/dashboard/org-admin/students" },
    ]
  },
  {
    group: "Settings",
    items: [
       { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/org-admin/settings" },
    ]
  }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading, isAuthenticated } = useAuth(); // Destructure loading and isAuthenticated
  const pathname = usePathname();
  const router = useRouter(); // Use router
  const [mounted, setMounted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  console.log("user", user)

  // DISABLED: This useEffect was causing a race condition
  // The middleware already handles authentication redirects
  // useEffect(() => {
  //   if (mounted && !loading && !isAuthenticated) {
  //     console.log("Logging out...")
  //     router.push("/auth/login");
  //   }
  // }, [mounted, loading, isAuthenticated, router]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // if (!isAuthenticated || !user) {
  //     return null; // Or a fallback, but useEffect will redirect
  // }



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
                  {(pathname?.startsWith("/dashboard/examiner") 
                    ? examinerSidebarGroups 
                    : pathname?.startsWith("/dashboard/org-admin")
                      ? orgAdminSidebarGroups
                      : sidebarItems
                  ).map((group, index) => (
                    <div key={group.group || index} className="mb-6">
                      <h4 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
                        {group.group}
                      </h4>
                      <div className="space-y-1">
                        {group.items.map((item) => {
                          const isActive = pathname === item.path;
                          return (
                            <Link key={item.id} href={item.path}>
                              <SidebarNavItem
                                icon={item.icon}
                                active={isActive}
                                className={`hover:cursor-pointer transition-colors ${
                                  isActive 
                                    ? "bg-primary/10 text-primary font-medium hover:bg-primary/15" 
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                }`}
                              >
                                {item.label}
                              </SidebarNavItem>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </SidebarNav>
              </SidebarContent>
            </div>

            <SidebarFooter onClick={logout}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
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
