import { useGetDashboardSummary, useListMarketPrices, useGetWeatherAdvisory } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudRain, Leaf, Landmark, AlertTriangle, ShieldCheck, TrendingUp, TrendingDown, Sprout, ArrowRight, Thermometer, Wind, Droplets, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary({
    query: { queryKey: ["/api/dashboard/summary"] }
  });
  const { data: prices } = useListMarketPrices({}, {
    query: { queryKey: ["/api/market-prices"] }
  });
  const { data: weather } = useGetWeatherAdvisory({ city: "New Delhi" }, {
    query: { queryKey: ["/api/weather/advisory", "New Delhi"] }
  });

  const topGainers = prices
    ? [...prices].sort((a, b) => b.changePercent - a.changePercent).slice(0, 4)
    : [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Suprabhat" : hour < 17 ? "Namaskar" : "Shubh Saayin";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            {greeting}, Kisan Ji
          </h1>
          <p className="text-lg text-muted-foreground mt-1">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" size="sm" className="gap-2 font-medium">
            <Link href="/disease-detection">
              <ShieldCheck className="h-4 w-4" /> Scan Crop
            </Link>
          </Button>
          <Button asChild size="sm" className="gap-2 font-medium">
            <Link href="/chatbot">
              <MessageSquare className="h-4 w-4" /> Ask AI
            </Link>
          </Button>
        </div>
      </div>

      {/* Weather Alert Banner */}
      {summary?.weatherAlert && (
        <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-r-xl flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-destructive font-semibold">Mausam Chetawni — apni fasal ki suraksha karein</p>
            <Button asChild variant="link" className="text-destructive p-0 h-auto mt-1 text-sm font-semibold">
              <Link href="/weather">Poori jaankari dekhein <ArrowRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm ring-1 ring-border hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-primary/10 p-2.5 rounded-xl">
                <Landmark className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Active</span>
            </div>
            <div className="text-3xl font-black text-foreground">{isLoading ? "—" : summary?.activeSchemes}</div>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Sarkar Yojanaein</p>
            <p className="text-xs text-muted-foreground">{summary?.totalSchemes} kul yojanaein</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-border hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-emerald-100 p-2.5 rounded-xl">
                <Leaf className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{summary?.cropCount} Fasalein</span>
            </div>
            <div className="text-3xl font-black text-foreground">{isLoading ? "—" : summary?.cropCount}</div>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Mandi me Fasalein</p>
            <p className="text-xs text-muted-foreground">Aaj ki daren</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-border hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-amber-100 p-2.5 rounded-xl">
                <ShieldCheck className="h-5 w-5 text-amber-600" />
              </div>
              <Link href="/disease-detection" className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full hover:bg-amber-100">Scan Karein</Link>
            </div>
            <div className="text-3xl font-black text-foreground">{isLoading ? "—" : summary?.recentDetections}</div>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Rog Detection</p>
            <p className="text-xs text-muted-foreground">Is hafte</p>
          </CardContent>
        </Card>

        {weather ? (
          <Card className="border-none shadow-sm ring-1 ring-border hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-sky-100 p-2.5 rounded-xl">
                  <CloudRain className="h-5 w-5 text-sky-600" />
                </div>
                <Link href="/weather" className="text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full hover:bg-sky-100">Dekhein</Link>
              </div>
              <div className="text-3xl font-black text-foreground">{weather.temperature}°C</div>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Delhi — {weather.condition}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-muted-foreground flex items-center gap-0.5"><Droplets className="h-3 w-3" />{weather.humidity}%</span>
                <span className="text-xs text-muted-foreground flex items-center gap-0.5"><Wind className="h-3 w-3" />{weather.windSpeed} km/h</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none shadow-sm ring-1 ring-border bg-primary text-primary-foreground hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-primary-foreground/20 p-2.5 rounded-xl">
                  <Sprout className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
              <p className="text-sm font-semibold text-primary-foreground/80">Krishi Mitra AI</p>
              <p className="text-lg font-bold mt-1">Madad ke liye taiyaar</p>
              <Button asChild variant="secondary" size="sm" className="mt-3 w-full font-semibold">
                <Link href="/chatbot">Chat Shuru Karein</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Two Column — Market + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Market Prices */}
        <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-border">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <TrendingUp className="h-5 w-5 text-primary" /> Aaj Ki Mandi Darein
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-primary font-semibold h-7 px-2 text-xs">
                <Link href="/market-prices">Sab Dekhein <ArrowRight className="h-3 w-3 ml-1" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {topGainers.length > 0 ? (
              <div className="divide-y divide-border">
                {topGainers.map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{p.cropName}</p>
                      <p className="text-xs text-muted-foreground">{p.market}, {p.state}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">₹{p.modalPrice}<span className="text-xs font-medium text-muted-foreground">/qtl</span></p>
                      <span className={`text-xs font-bold flex items-center justify-end gap-0.5 ${p.changePercent >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {p.changePercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {p.changePercent >= 0 ? "+" : ""}{p.changePercent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                Loading market data...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions + Weather Tips */}
        <div className="space-y-4">
          <Card className="border-none shadow-sm ring-1 ring-border">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold">Jaldi Karyaein</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {[
                { label: "Fasal Rog Scan", desc: "Photo upload karein", href: "/disease-detection", icon: ShieldCheck, color: "text-amber-600 bg-amber-50" },
                { label: "Mausam Jaankari", desc: "Apne sheher ki", href: "/weather", icon: CloudRain, color: "text-sky-600 bg-sky-50" },
                { label: "AI Se Poochein", desc: "Koi bhi sawal", href: "/chatbot", icon: MessageSquare, color: "text-primary bg-primary/10" },
                { label: "Yojanaein Dekhein", desc: "Aavedan karein", href: "/schemes", icon: Landmark, color: "text-purple-600 bg-purple-50" },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group">
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {weather && (
            <Card className="border-none shadow-sm ring-1 ring-border bg-primary/5">
              <CardContent className="p-4">
                <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">Aaj Ka Farming Tip</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{weather.farmingTips?.[0]}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
