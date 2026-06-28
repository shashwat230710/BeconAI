import { Link, useRouterState } from "@tanstack/react-router";
import {
  ShieldCheck,
  ScanSearch,
  FileBarChart2,
  Newspaper,
  Activity,
  Trophy,
  UserCircle2,
  Settings2,
  Home,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const main = [
  { title: "Home", url: "/", icon: Home },
  { title: "Verify News", url: "/verify", icon: ScanSearch },
  { title: "AI Report", url: "/report", icon: FileBarChart2 },
];

const intel = [
  { title: "Verified News", url: "/browse", icon: Newspaper },
  { title: "Live Dashboard", url: "/live", icon: Activity },
  { title: "Source Leaderboard", url: "/sources", icon: Trophy },
];

const account = [
  { title: "My Dashboard", url: "/profile", icon: UserCircle2 },
  { title: "Admin", url: "/admin", icon: Settings2 },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (p: string) => (p === "/" ? currentPath === "/" : currentPath.startsWith(p));

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-primary to-info shadow-[0_0_24px_-4px_oklch(0.62_0.22_278_/_0.7)]">
            <ShieldCheck className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-display text-base font-semibold tracking-tight">VeritAI</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Verification Platform
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Verify</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {main.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Intelligence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {intel.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {account.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 rounded-md bg-sidebar-accent/60 p-2 group-data-[collapsible=icon]:hidden">
          <div className="h-2 w-2 animate-pulse rounded-full bg-verified" />
          <div className="text-xs">
            <div className="font-medium text-sidebar-foreground">8 agents online</div>
            <div className="text-muted-foreground">Pipeline healthy</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
