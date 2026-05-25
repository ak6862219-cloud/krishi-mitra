import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CloudRain, Leaf, Landmark, ShieldCheck, TrendingUp, TrendingDown,
  Sprout, ArrowRight, Wind, Droplets, MessageSquare, Zap, Star
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const MOCK_WEATHER = {
  temperature: 36, condition: "Garama Dhoop", humidity: 48, windSpeed: 14,
  farmingTips: ["Subah 6-9 baje kaam karein, dopahar mein nahi", "Fasal ko roj paani dein is garmi mein", "Loo se bachane ke liye paudhe dhakein"]
};

const MOCK_PRICES = [
  { id: 1, cropName: "Gehun", market: "Azadpur", state: "Delhi", modalPrice: 2125, changePercent: 3.2 },
  { id: 2, cropName: "Pyaaz", market: "Lasalgaon", state: "Maharashtra", modalPrice: 900, changePercent: 12.3 },
  { id: 3, cropName: "Sarso", market: "Jaipur", state: "Rajasthan", modalPrice: 5400, changePercent: 1.8 },
  { id: 4, cropName: "Dhan", market: "Amritsar", state: "Punjab", modalPrice: 3400, changePercent: 2.1 },
];

const MOCK_SUMMARY = { activeSchemes: 8, totalSchemes: 8, cropCount: 15, recentDetections: 3 };

const STATS = [
  {
    value: MOCK_SUMMARY.activeSchemes, label: "Govt Schemes", sub: "Active yojanaein",
    icon: Landmark, href: "/schemes",
    badge: "Active", badgeClass: "bg-emerald-400/20 text-emerald-300",
    gradient: "from-emerald-600/20 to-emerald-500/5",
    iconBg: "bg-emerald-500/20 text-emerald-400",
  },
  {
    value: MOCK_SUMMARY.cropCount, label: "Mandi Crops", sub: "Aaj ki darein",
    icon: Leaf, href: "/market-prices",
    badge: "Live", badgeClass: "bg-sky-400/20 text-sky-300",
    gradient: "from-sky-600/20 to-sky-500/5",
    iconBg: "bg-sky-500/20 text-sky-400",
  },
  {
    value: MOCK_SUMMARY.recentDetections, label: "Rog Scans", sub: "Is hafte",
    icon: ShieldCheck, href: "/disease-detection",
    badge: "Scan Karein", badgeClass: "bg-amber-400/20 text-amber-300",
    gradient: "from-amber-600/20 to-amber-500/5",
    iconBg: "bg-amber-500/20 text-amber-400",
  },
  {
    value: `${MOCK_WEATHER.temperature}°`, label: "Delhi Weather", sub: MOCK_WEATHER.condition,
    icon: CloudRain, href: "/weather",
    badge: "Live", badgeClass: "bg-blue-400/20 text-blue-300",
    gradient: "from-blue-600/20 to-blue-500/5",
    iconBg: "bg-blue-500/20 text-blue-400",
  },
];

const QUICK_ACTIONS = [
  { label: "Fasal Rog Scan", desc: "Photo upload karein", href: "/disease-detection", icon: ShieldCheck, color: "from-amber-500 to-orange-500" },
  { label: "Mausam Jaankari", desc: "5-din ka forecast", href: "/weather", icon: CloudRain, color: "from-sky-500 to-blue-600" },
  { label: "AI Se Poochein", desc: "Koi bhi sawal", href: "/chatbot", icon: MessageSquare, color: "from-emerald-500 to-teal-600" },
  { label: "Yojanaein Dekhein", desc: "Aavedan karein", href: "/schemes", icon: Landmark, color: "from-purple-500 to-violet-600" },
];

export default function Dashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 5 ? "Shubh Ratri" : hour < 12 ? "Suprabhat" : hour < 17 ? "Namaskar" : "Shubh Saayin";
  const emoji = hour < 5 ? "🌙" : hour < 12 ? "🌅" : hour < 17 ? "☀️" : "🌆";
  const dateStr = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl"
        style={{ background: "linear-gradient(130deg, hsl(140,45%,22%) 0%, hsl(140,50%,18%) 50%, hsl(35,80%,35%) 100%)" }}>
        <div className="absolute inset-0 animate-gradient-x opacity-30"
          style={{ background: "linear-gradient(90deg, hsl(140,50%,30%), hsl(35,90%,50%), hsl(140,50%,25%), hsl(35,80%,45%))", backgroundSize: "300% 300%" }} />
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        {/* Floating icons */}
        <div className="absolute right-6 top-4 opacity-10 animate-float">
          <Sprout className="h-28 w-28 text-white" />
        </div>
        <div className="absolute right-24 bottom-2 opacity-8 animate-float" style={{ animationDelay: "1.5s" }}>
          <Leaf className="h-12 w-12 text-white" />
        </div>

        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold tracking-widest text-white/50 uppercase">Krishi Mitra Dashboard</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              {emoji} {greeting}, Kisan Ji!
            </h1>
            <p className="text-white/60 font-medium text-sm">{dateStr}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
              <Droplets className="h-3.5 w-3.5" /> {MOCK_WEATHER.humidity}% Namee
              <span className="opacity-30">•</span>
              <Wind className="h-3.5 w-3.5" /> {MOCK_WEATHER.windSpeed} km/h Hawa
              <span className="opacity-30">•</span>
              <span>Delhi, {MOCK_WEATHER.temperature}°C</span>
            </div>
          </div>

          <div className="flex gap-3 shrink-0">
            <Button asChild variant="outline" size="sm"
              className="gap-2 font-bold border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm">
              <Link href="/disease-detection">
                <ShieldCheck className="h-4 w-4" /> Scan Crop
              </Link>
            </Button>
            <Button asChild size="sm"
              className="gap-2 font-bold shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(35,95%,56%) 0%, hsl(25,90%,50%) 100%)", color: "white" }}>
              <Link href="/chatbot">
                <Zap className="h-4 w-4" /> Ask AI
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 stagger-children">
        {STATS.map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <div className={`relative overflow-hidden rounded-2xl p-5 card-hover cursor-pointer bg-card border border-border bg-gradient-to-br ${stat.gradient}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg} shrink-0`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stat.badgeClass}`}>
                  {stat.badge}
                </span>
              </div>
              <div className="animate-count">
                <div className="text-3xl font-black text-foreground tracking-tight">{stat.value}</div>
                <p className="text-sm font-bold text-foreground/80 mt-1">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
              </div>
              <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground/30" />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Market + Actions Row ── */}
      <div className="grid gap-5 lg:grid-cols-3">

        {/* Market Prices */}
        <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-border overflow-hidden">
          <CardHeader className="pb-0 pt-5 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2.5 text-base font-bold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                Aaj Ki Mandi Darein
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-primary font-bold h-8 px-3 text-xs gap-1 hover:bg-primary/10">
                <Link href="/market-prices">Sab Dekhein <ArrowRight className="h-3 w-3" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <div className="divide-y divide-border">
              {MOCK_PRICES.map((p, i) => {
                const maxPrice = 6000;
                const barWidth = Math.min((p.modalPrice / maxPrice) * 100, 100);
                return (
                  <div key={p.id} className="group px-5 py-3.5 hover:bg-muted/30 transition-all duration-200"
                    style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/8 text-primary font-black text-xs">
                          {p.cropName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm">{p.cropName}</p>
                          <p className="text-xs text-muted-foreground">{p.market}, {p.state}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-foreground text-base">₹{p.modalPrice.toLocaleString()}</p>
                        <span className="text-xs font-bold flex items-center justify-end gap-0.5 text-emerald-600">
                          <TrendingUp className="h-3 w-3" /> +{p.changePercent}%
                        </span>
                      </div>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700 group-hover:opacity-80"
                        style={{ width: `${barWidth}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions + Tip */}
        <div className="flex flex-col gap-4">
          <Card className="border-none shadow-sm ring-1 ring-border flex-1">
            <CardHeader className="pb-3 pt-5 px-5 border-b border-border">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Zap className="h-4 w-4 text-secondary" /> Jaldi Karyaein
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-1.5">
              {QUICK_ACTIONS.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 cursor-pointer transition-all duration-200 hover:translate-x-0.5">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-sm shrink-0`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground leading-none">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Farming Tip */}
          <div className="relative overflow-hidden rounded-2xl p-4 shadow-sm"
            style={{ background: "linear-gradient(135deg, hsl(140,45%,26%) 0%, hsl(140,50%,20%) 100%)" }}>
            <div className="absolute top-0 right-0 opacity-10">
              <Sprout className="h-20 w-20 text-white m-2" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-2">
                <Star className="h-3.5 w-3.5 text-secondary fill-secondary" />
                <p className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest">Aaj Ka Tip</p>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed">{MOCK_WEATHER.farmingTips[0]}</p>
              <Link href="/weather">
                <p className="text-xs text-white/40 mt-2 flex items-center gap-1 hover:text-white/70 transition-colors">
                  Mausam Dekhein <ArrowRight className="h-3 w-3" />
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
