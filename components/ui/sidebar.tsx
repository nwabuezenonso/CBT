"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

export function SidebarProvider({ children, defaultCollapsed = false }: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Sidebar({ children, className, ...props }: SidebarProps) {
  const { collapsed } = useSidebar();

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-card border-r transition-all duration-300 ease-in-out h-screen",
        collapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SidebarHeader({ children, className, ...props }: SidebarHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between p-4 border-b", className)} {...props}>
      {children}
    </div>
  );
}

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SidebarContent({ children, className, ...props }: SidebarContentProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto p-4", className)} {...props}>
      {children}
    </div>
  );
}

interface SidebarToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SidebarToggle({ className, ...props }: SidebarToggleProps) {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "absolute -right-3 top-24 z-10 h-6 w-6 rounded-full border bg-background p-0",
        className
      )}
      onClick={() => setCollapsed(!collapsed)}
      {...props}
    >
      {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
    </Button>
  );
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function SidebarNav({ children, className, ...props }: SidebarNavProps) {
  return (
    <nav className={cn("space-y-2", className)} {...props}>
      {children}
    </nav>
  );
}

interface SidebarNavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  active?: boolean;
}

export function SidebarNavItem({
  icon: Icon,
  children,
  active = false,
  className,
  ...props
}: SidebarNavItemProps) {
  const { collapsed } = useSidebar();

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 px-3 py-2 h-auto font-medium transition-all",
        active
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "hover:bg-muted text-muted-foreground hover:text-foreground",
        collapsed && "justify-center px-2",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="h-5 w-5 shrink-0" />}
      {!collapsed && <span className="truncate">{children}</span>}
    </Button>
  );
}

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  onLogout?: () => void;
}

export function SidebarFooter({ className, onLogout, ...props }: SidebarFooterProps) {
  const { collapsed } = useSidebar();

  return (
    <div
      className={cn("mt-auto p-4 border-t", collapsed && "flex justify-center p-2", className)}
      {...props}
    >
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 px-3 py-2 h-auto font-medium transition-all text-muted-foreground hover:text-foreground hover:bg-muted",
          collapsed && "justify-center px-2 w-auto"
        )}
        onClick={onLogout}
      >
        <LogOut className="h-5 w-5 shrink-0" />
        {!collapsed && <span className="truncate">Logout</span>}
      </Button>
    </div>
  );
}
