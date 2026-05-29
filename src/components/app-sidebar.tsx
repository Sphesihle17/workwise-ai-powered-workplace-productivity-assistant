import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  CalendarRange,
  Search,
  MessageSquare,
  Sparkles,
  Lightbulb,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const workspace = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "AI Chat", url: "/chat", icon: MessageSquare },
  { title: "Productivity Insights", url: "/insights", icon: Lightbulb },
];

const tools = [
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Notes Summarizer", url: "/summarizer", icon: FileText },
  { title: "Productivity Planner", url: "/planner", icon: CalendarRange },
  { title: "Research Assistant", url: "/research", icon: Search },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (path: string) => currentPath === path;

  const renderItem = (item: { title: string; url: string; icon: typeof Sparkles }) => {
    const active = isActive(item.url);
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
          <Link to={item.url} className="group/item relative">
            <span
              className={`absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-primary to-primary-glow transition-all ${
                active ? "opacity-100" : "opacity-0 group-hover/item:opacity-60"
              }`}
            />
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link
          to="/"
          className="flex items-center gap-2 px-2 py-3 transition-base hover:opacity-80"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 animate-pulse rounded-full bg-success ring-2 ring-sidebar" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
              WorkWise AI
            </span>
            <span className="text-[10px] text-muted-foreground">Productivity Workspace</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{workspace.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{tools.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="group-data-[collapsible=icon]:hidden">
          <div className="m-2 rounded-xl border border-sidebar-border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-sidebar-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI assist on
            </div>
            <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
              Outputs may need human review before professional use.
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
