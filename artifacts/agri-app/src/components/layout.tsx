import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Microscope, CloudSun, TrendingUp,
  Bot, ScrollText, Sprout, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, label: "Home" },
  { name: "Disease Detection", href: "/disease-detection", icon: Microscope, label: "Rog Pahchaan" },
  { name: "Weather Advisory", href: "/weather", icon: CloudSun, label: "Mausam" },
  { name: "Market Prices", href: "/market-prices", icon: TrendingUp, label: "Mandi Bhav" },
  { name: "AI Assistant", href: "/chatbot", icon: Bot, label: "AI Chatbot" },
  { name: "Govt Schemes", href: "/schemes", icon: ScrollText, label: "Yojanaein" },
];

function SidebarNav({ onClose }: { onClose?: () => void }) {
  const [location] = useLocation();
  return (
    <nav className="flex flex-col gap-1 px-3">
      {navigation.map((item, i) => {
        const isActive = location === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-secondary/90 to-secondary text-secondary-foreground shadow-md nav-active-glow"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
            )}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-secondary-foreground/60 rounded-r-full" />
            )}
            <span className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
              isActive
                ? "bg-white/20 text-secondary-foreground"
                : "bg-sidebar-foreground/10 text-sidebar-foreground/60 group-hover:bg-sidebar-foreground/15 group-hover:text-sidebar-foreground"
            )}>
              <item.icon className="h-4 w-4" />
            </span>
            <span className="flex-1 truncate">{item.name}</span>
            {isActive && (
              <span className="text-[10px] font-bold opacity-60 bg-white/20 px-1.5 py-0.5 rounded-md">
                {item.label}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 h-full shrink-0 relative overflow-hidden"
        style={{ background: "linear-gradient(175deg, hsl(140,38%,14%) 0%, hsl(140,42%,10%) 60%, hsl(140,35%,8%) 100%)" }}>

        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(35,95%,56%) 0%, transparent 70%)" }} />
        <div className="absolute bottom-20 -left-8 w-32 h-32 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, hsl(140,60%,50%) 0%, transparent 70%)" }} />

        {/* Brand */}
        <div className="relative px-5 pt-6 pb-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg animate-pulse-glow"
              style={{ background: "linear-gradient(135deg, hsl(35,95%,56%) 0%, hsl(25,90%,50%) 100%)" }}>
              <Sprout className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-white leading-none">Krishi Mitra</h1>
              <p className="text-[10px] text-white/40 font-medium mt-0.5 tracking-widest uppercase">Smart Farming</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4">
          <p className="px-6 mb-2 text-[10px] font-bold tracking-widest text-white/25 uppercase">Menu</p>
          <SidebarNav />
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/8">
          <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/50 font-medium">Sab theek chal raha hai</span>
            <span className="ml-auto text-[10px] text-white/25">v1.0.0</span>
          </div>
        </div>
      </aside>

      {/* ── Mobile Overlay Sidebar ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 flex flex-col overflow-hidden shadow-2xl"
            style={{ background: "linear-gradient(175deg, hsl(140,38%,14%) 0%, hsl(140,42%,10%) 60%, hsl(140,35%,8%) 100%)" }}>
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: "linear-gradient(135deg, hsl(35,95%,56%) 0%, hsl(25,90%,50%) 100%)" }}>
                  <Sprout className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-extrabold text-white">Krishi Mitra</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-white/50 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              <SidebarNav onClose={() => setMobileOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm shrink-0">
          <button onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: "linear-gradient(135deg, hsl(140,45%,28%) 0%, hsl(35,95%,56%) 100%)" }}>
              <Sprout className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-extrabold text-primary">Krishi Mitra</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl p-4 md:p-8 pb-24 md:pb-8">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex bg-card/95 backdrop-blur-md border-t border-border shadow-2xl">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-all",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                <div className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-xl transition-all",
                  isActive ? "bg-primary/15 scale-110" : ""
                )}>
                  <item.icon className={cn("h-4 w-4", isActive && "stroke-[2.5px]")} />
                </div>
                <span className={cn("text-[9px] font-bold truncate max-w-[48px] text-center", isActive ? "text-primary" : "text-muted-foreground/60")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
