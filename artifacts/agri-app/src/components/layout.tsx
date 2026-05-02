import { Link, useLocation } from "wouter";
import { Sprout, CloudRain, BarChart3, MessageSquare, Landmark, LogOut } from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Sprout },
  { name: "Disease Detection", href: "/disease-detection", icon: Sprout },
  { name: "Weather Advisory", href: "/weather", icon: CloudRain },
  { name: "Market Prices", href: "/market-prices", icon: BarChart3 },
  { name: "AI Assistant", href: "/chatbot", icon: MessageSquare },
  { name: "Govt Schemes", href: "/schemes", icon: Landmark },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar className="hidden md:flex border-r border-sidebar-border h-full bg-sidebar text-sidebar-foreground w-64 flex-col">
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2">
            <Sprout className="h-6 w-6 text-sidebar-primary" />
            <span className="text-xl font-bold tracking-tight text-sidebar-primary">Krishi Mitra</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="flex-1 overflow-y-auto p-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-2">
                {navigation.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild isActive={isActive} className={cn(
                        "w-full justify-start gap-3 rounded-md px-3 py-2 transition-colors",
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}>
                        <Link href={item.href} className="flex items-center w-full gap-3">
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2 text-sm text-sidebar-foreground/60">
            <span>v1.0.0</span>
          </div>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
