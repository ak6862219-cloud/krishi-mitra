import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, TrendingDown, Minus, Filter, BarChart2, ArrowUpRight } from "lucide-react";

const ALL_PRICES = [
  { id: 1, cropName: "Gehun", variety: "Lok-1", market: "Azadpur", state: "Delhi", minPrice: 2050, maxPrice: 2200, modalPrice: 2125, trend: "up", changePercent: 3.2 },
  { id: 2, cropName: "Dhan (Chawal)", variety: "Basmati", market: "Amritsar", state: "Punjab", minPrice: 3200, maxPrice: 3600, modalPrice: 3400, trend: "up", changePercent: 2.1 },
  { id: 3, cropName: "Tamatar", variety: "Deshi", market: "Nasik", state: "Maharashtra", minPrice: 800, maxPrice: 1400, modalPrice: 1100, trend: "down", changePercent: 8.5 },
  { id: 4, cropName: "Pyaaz", variety: "Red", market: "Lasalgaon", state: "Maharashtra", minPrice: 600, maxPrice: 1200, modalPrice: 900, trend: "up", changePercent: 12.3 },
  { id: 5, cropName: "Aalu", variety: "Jyoti", market: "Agra", state: "Uttar Pradesh", minPrice: 700, maxPrice: 1000, modalPrice: 850, trend: "stable", changePercent: 0.5 },
  { id: 6, cropName: "Sarso", variety: "Pili", market: "Jaipur", state: "Rajasthan", minPrice: 5200, maxPrice: 5600, modalPrice: 5400, trend: "up", changePercent: 1.8 },
  { id: 7, cropName: "Makka", variety: "Hybrid", market: "Gulbarga", state: "Karnataka", minPrice: 1700, maxPrice: 1950, modalPrice: 1820, trend: "down", changePercent: 2.4 },
  { id: 8, cropName: "Chana", variety: "Desi", market: "Indore", state: "Madhya Pradesh", minPrice: 4800, maxPrice: 5200, modalPrice: 5000, trend: "stable", changePercent: 0.2 },
  { id: 9, cropName: "Ganna", variety: "Co-238", market: "Muzaffarnagar", state: "Uttar Pradesh", minPrice: 350, maxPrice: 380, modalPrice: 365, trend: "stable", changePercent: 0.0 },
  { id: 10, cropName: "Kapas", variety: "BT", market: "Akola", state: "Maharashtra", minPrice: 6200, maxPrice: 6800, modalPrice: 6500, trend: "up", changePercent: 4.5 },
  { id: 11, cropName: "Moong Dal", variety: "Deshi", market: "Kota", state: "Rajasthan", minPrice: 7200, maxPrice: 7800, modalPrice: 7500, trend: "down", changePercent: 1.5 },
  { id: 12, cropName: "Arhar Dal", variety: "Deshi", market: "Latur", state: "Maharashtra", minPrice: 7000, maxPrice: 7600, modalPrice: 7300, trend: "up", changePercent: 3.0 },
  { id: 13, cropName: "Bajra", variety: "Hybrid", market: "Hisar", state: "Haryana", minPrice: 2100, maxPrice: 2350, modalPrice: 2220, trend: "up", changePercent: 2.7 },
  { id: 14, cropName: "Soyabean", variety: "JS-335", market: "Ujjain", state: "Madhya Pradesh", minPrice: 4400, maxPrice: 4900, modalPrice: 4650, trend: "stable", changePercent: 0.8 },
  { id: 15, cropName: "Sunflower", variety: "Hybrid", market: "Bijapur", state: "Karnataka", minPrice: 5800, maxPrice: 6200, modalPrice: 6000, trend: "down", changePercent: 1.2 },
];

const STATES = ["all", "Maharashtra", "Punjab", "Haryana", "Karnataka", "Uttar Pradesh", "Madhya Pradesh", "Rajasthan", "Delhi"];
const MAX_PRICE = Math.max(...ALL_PRICES.map(p => p.modalPrice));

function TrendBadge({ trend, percent }: { trend: string; percent: number }) {
  if (trend === "up") return (
    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-0.5">
      <TrendingUp className="h-3 w-3" /> +{percent}%
    </span>
  );
  if (trend === "down") return (
    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-red-500 bg-red-50 border border-red-100 rounded-lg px-2 py-0.5">
      <TrendingDown className="h-3 w-3" /> -{percent}%
    </span>
  );
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-muted-foreground bg-muted border border-border rounded-lg px-2 py-0.5">
      <Minus className="h-3 w-3" /> {percent}%
    </span>
  );
}

export default function MarketPrices() {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");

  const filtered = useMemo(() => ALL_PRICES.filter(p => {
    const matchSearch = !search || p.cropName.toLowerCase().includes(search.toLowerCase()) || p.variety.toLowerCase().includes(search.toLowerCase());
    const matchState = stateFilter === "all" || p.state === stateFilter;
    return matchSearch && matchState;
  }), [search, stateFilter]);

  const topGainers = [...ALL_PRICES].filter(p => p.trend === "up").sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
  const topLosers = [...ALL_PRICES].filter(p => p.trend === "down").sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
  const avgChange = (ALL_PRICES.reduce((s, p) => s + (p.trend === "up" ? p.changePercent : p.trend === "down" ? -p.changePercent : 0), 0) / ALL_PRICES.length).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">📈 Mandi Bhav</h1>
        <p className="text-muted-foreground mt-1 font-medium">Desh bhar ki mandiyein ke taaza fasal bhaav</p>
      </div>

      {/* Summary + Gainers + Losers */}
      <div className="grid gap-4 md:grid-cols-5">

        {/* Overview hero */}
        <div className="md:col-span-1 relative overflow-hidden rounded-2xl p-5 flex flex-col justify-between shadow-lg"
          style={{ background: "linear-gradient(135deg, hsl(140,45%,24%) 0%, hsl(140,50%,18%) 100%)" }}>
          <div className="absolute -top-4 -right-4 opacity-10">
            <BarChart2 className="h-32 w-32 text-white" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-extrabold tracking-widest text-white/50 uppercase mb-3">Overview</p>
            <div className="text-4xl font-black text-white leading-none">{ALL_PRICES.length}</div>
            <p className="text-sm font-bold text-white/70 mt-1">Fasalein</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                <span className="text-lg font-black text-emerald-400">+{avgChange}%</span>
              </div>
              <p className="text-[10px] text-white/40 font-bold mt-0.5">Avg Badlav Aaj</p>
            </div>
          </div>
        </div>

        {/* Top Gainers */}
        <Card className="md:col-span-2 border-none shadow-sm ring-1 ring-border overflow-hidden">
          <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-border">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Top Gainers</h3>
          </div>
          <div className="divide-y divide-border">
            {topGainers.map((item, i) => (
              <div key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-[10px] font-black text-emerald-600">{i + 1}</span>
                  <div>
                    <p className="text-sm font-bold text-foreground">{item.cropName}</p>
                    <p className="text-xs text-muted-foreground">{item.state}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-foreground">₹{item.modalPrice.toLocaleString()}</p>
                  <TrendBadge trend={item.trend} percent={item.changePercent} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Losers */}
        <Card className="md:col-span-2 border-none shadow-sm ring-1 ring-border overflow-hidden">
          <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-border">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100">
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Top Losers</h3>
          </div>
          <div className="divide-y divide-border">
            {topLosers.map((item, i) => (
              <div key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-50 text-[10px] font-black text-red-500">{i + 1}</span>
                  <div>
                    <p className="text-sm font-bold text-foreground">{item.cropName}</p>
                    <p className="text-xs text-muted-foreground">{item.state}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-foreground">₹{item.modalPrice.toLocaleString()}</p>
                  <TrendBadge trend={item.trend} percent={item.changePercent} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-card p-4 rounded-2xl ring-1 ring-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Gehun, Tamatar, Pyaaz..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/30 border-transparent focus:border-primary/30 font-medium" />
        </div>
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="bg-muted/30 border-transparent w-full sm:w-[220px] font-medium">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Sabhi Rajya" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {STATES.map(s => <SelectItem key={s} value={s}>{s === "all" ? "Sabhi Rajya" : s}</SelectItem>)}
          </SelectContent>
        </Select>
        {(search || stateFilter !== "all") && (
          <button onClick={() => { setSearch(""); setStateFilter("all"); }}
            className="px-4 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            Reset
          </button>
        )}
      </div>

      {/* Price Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((price) => {
            const barPct = Math.min((price.modalPrice / MAX_PRICE) * 100, 100);
            const initials = price.cropName.slice(0, 2).toUpperCase();
            return (
              <Card key={price.id} className="border-none ring-1 ring-border shadow-sm card-hover overflow-hidden group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-black shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{price.cropName}</p>
                        <p className="text-xs text-muted-foreground">{price.variety} · {price.state}</p>
                      </div>
                    </div>
                    <TrendBadge trend={price.trend} percent={price.changePercent} />
                  </div>

                  <div className="mb-3">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-2xl font-black text-foreground">₹{price.modalPrice.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground font-medium">/quintal</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${
                        price.trend === "up" ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                          : price.trend === "down" ? "bg-gradient-to-r from-red-500 to-red-400"
                          : "bg-gradient-to-r from-primary to-secondary"
                      }`} style={{ width: `${barPct}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>📍 {price.market}</span>
                    <span className="flex gap-2">
                      <span>Min ₹{price.minPrice.toLocaleString()}</span>
                      <span>·</span>
                      <span>Max ₹{price.maxPrice.toLocaleString()}</span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-2xl ring-1 ring-border">
          <div className="text-5xl mb-4">🌾</div>
          <h3 className="text-lg font-bold text-foreground">Koi fasal nahi mili</h3>
          <p className="text-muted-foreground text-sm mt-1">Doosra naam try karein ya filter saaf karein</p>
          <button onClick={() => { setSearch(""); setStateFilter("all"); }}
            className="mt-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">
            Sab Dekhein
          </button>
        </div>
      )}
    </div>
  );
}
