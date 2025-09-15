"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BarChart3, CheckCircle, Users, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, href: "/dashboard" },
  { id: "exams", label: "Exams", icon: CheckCircle, href: "/exams" },
  { id: "users", label: "Users", icon: Users, href: "/users" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar(); // state === "collapsed" when icon-only

  return (
    <Sidebar collapsible="icon" className="border-r bg-background">
      {/* HEADER */}
      <SidebarHeader className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
            Q
          </div>
          {state !== "collapsed" && (
            <h2 className="text-xl font-semibold tracking-tight">Quizly</h2>
          )}
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="px-2 py-4">
        <SidebarMenu className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname.startsWith(tab.href);

            return (
              <SidebarMenuItem key={tab.id} className="group relative">
                <Link
                  href={tab.href}
                  className={`flex items-center gap-3 px-2 py-2 rounded-md transition-colors duration-200
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                >
                  <Icon size={18} className="shrink-0" />
                  {state !== "collapsed" && (
                    <span className="text-base font-medium">{tab.label}</span>
                  )}
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t px-4 py-3 text-xs text-muted-foreground">
        {state !== "collapsed" && "© 2025 Quizly"}
      </SidebarFooter>
    </Sidebar>
  );
}
