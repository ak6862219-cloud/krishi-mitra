import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, TrendingDown, Minus, Filter } from "lucide-react";

const ALL_PRICES = [
  { id: 1, cropName: "Gehun", variety: "Lok-1", market: "Azadpur", state: "Delhi", minPrice: 2050, maxPrice: 2200, modalPrice: 2125, unit: "quintal", trend: "up", changePercent: 3.2 },
  { id: 2, cropName: "Dhan (Chawal)", variety: "Basmati", market: "Amritsar", state: "Punjab", minPrice: 3200, maxPrice: 3600, modalPrice: 3400, unit: "quintal", trend: "up", changePercent: 2.1 },
  { id: 3, cropName: "Tamatar", variety: "Deshi", market: "Nasik", state: "Maharashtra", minPrice: 800, maxPrice: 1400, modalPrice: 1100, unit: "quintal", trend: "down", changePercent: 8.5 },
  { id: 4, cropName: "Pyaaz", variety: "Red", market: "Lasalgaon", state: "Maharashtra", minPrice: 600, maxPrice: 1200, modalPrice: 900, unit: "quintal", trend: "up", changePercent: 12.3 },
  { id: 5, cropName: "Aalu", variety: "Jyoti", market: "Agra", state: "Uttar Pradesh", minPrice: 700, maxPrice: 1000, modalPrice: 850, unit: "quintal", trend: "stable", changePercent: 0.5 },
  { id: 6, cropName: "Sarso", variety: "Pili", market: "Jaipur", state: "Rajasthan", minPrice: 5200, maxPrice: 5600, modalPrice: 5400, unit: "quintal", trend: "up", changePercent: 1.8 },
  { id: 7, cropName: "Makka", variety: "Hybrid", market: "Gulbarga", state: "Karnataka", minPrice: 1700, maxPrice: 1950, modalPrice: 1820, unit: "quintal", trend: "down", changePercent: 2.4 },
  { id: 8, cropName: "Chana", variety: "Desi", market: "Indore", state: "Madhya Pradesh", minPrice: 4800, maxPrice: 5200, modalPrice: 5000, unit: "quintal", trend: "stable", changePercent: 0.2 },
  { id: 9, cropName: "Ganna", variety: "Co-238", market: "Muzaffarnagar", state: "Uttar Pradesh", minPrice: 350, maxPrice: 380, modalPrice: 365, unit: "quintal", trend: "stable", changePercent: 0.0 },
  { id: 10, cropName: "Kapas", variety: "BT", market: "Akola", state: "Maharashtra", minPrice: 6200, maxPrice: 6800, modalPrice: 6500, unit: "quintal", trend: "up", changePercent: 4.5 },
  { id: 11, cropName: "Moong Dal", variety: "Deshi", market: "Kota", state: "Rajasthan", minPrice: 7200, maxPrice: 7800, modalPrice: 7500, unit: "quintal", trend: "down", changePercent: 1.5 },
  { id: 12, cropName: "Arhar Dal", variety: "Deshi", market: "Latur", state: "Maharashtra", minPrice: 7000, maxPrice: 7600, modalPrice: 7300, unit: "quintal", trend: "up", changePercent: 3.0 },
  { id: 13, cropName: "Bajra", variety: "Hybrid", market: "Hisar", state: "Haryana", minPrice: 2100, maxPrice: 2350, modalPrice: 2220, unit: "quintal", trend: "up", changePercent: 2.7 },
  { id: 14, cropName: "Soyabean", variety: "JS-335", market: "Ujjain", state: "Madhya Pradesh", minPrice: 4400, maxPrice: 4900, modalPrice: 4650, unit: "quintal", trend: "stable", changePercent: 0.8 },
  { id: 15, cropName: "Sunflower", variety: "Hybrid", market: "Bijapur", state: "Karnataka", minPrice: 5800, maxPrice: 6200, modalPrice: 6000, unit: "quintal", trend: "down", changePercent: 1.2 },
];

const TrendBadge = ({ trend, percent }: { trend: string; percent: number }) => {
  if (trend === "up") return <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none rounded-sm px-1.5"><TrendingUp className="h-3 w-3 mr-1" /> +{percent}%</Badge>;
  if (trend === "down") return <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30 border-none rounded-sm px-1.5"><TrendingDown className="h-3 w-3 mr-1" /> -{percent}%</Badge>;
  return <Badge variant="outline" className="text-muted-foreground border-border rounded-sm px-1.5"><Minus className="h-3 w-3 mr-1" /> {percent}%</Badge>;
};

export default function MarketPrices() {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");

  const states = ["all", "Maharashtra", "Punjab", "Haryana", "Karnataka", "Uttar Pradesh", "Madhya Pradesh", "Rajasthan", "Delhi"];

  const filtered = useMemo(() => {
    return ALL_PRICES.filter(p => {
      const matchSearch = !search || p.cropName.toLowerCase().includes(search.toLowerCase()) || p.variety.toLowerCase().includes(search.toLowerCase());
      const matchState = stateFilter === "all" || p.state === stateFilter;
      return matchSearch && matchState;
    });
  }, [search, stateFilter]);

  const topGainers = [...ALL_PRICES].filter(p => p.trend === "up").sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
  const topLosers = [...ALL_PRICES].filter(p => p.trend === "down").sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
  const avgChange = (ALL_PRICES.reduce((s, p) => s + (p.trend === "up" ? p.changePercent : p.trend === "down" ? -p.changePercent : 0), 0) / ALL_PRICES.length).toFixed(1);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-primary">Mandi Bhav</h1>
        <p className="text-lg text-muted-foreground mt-2">Desh bhar ki mandiyein ke taaza fasal bhaav.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-primary text-primary-foreground border-none shadow-md">
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <p className="text-primary-foreground/80 font-medium text-sm uppercase tracking-wider mb-2">Mandi Overview</p>
            <div className="text-3xl font-bold mb-1">{ALL_PRICES.length} Fasalein</div>
            <p className="text-primary-foreground/90 font-medium">Avg: +{avgChange}%</p>
            <p className="text-xs text-primary-foreground/60 mt-4">Aaj ka bhav — {new Date().toLocaleDateString("hi-IN")}</p>
          </CardContent>
        </Card>

        <div className="md:col-span-3 grid sm:grid-cols-2 gap-6">
          <Card className="shadow-sm ring-1 ring-border border-none">
            <CardHeader className="pb-2 border-b border-border bg-muted/20">
              <CardTitle className="text-base flex items-center text-primary">
                <TrendingUp className="mr-2 h-4 w-4" /> Top Gainers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {topGainers.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-semibold text-foreground">{item.cropName}</p>
                      <p className="text-xs text-muted-foreground">{item.state}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">₹{item.modalPrice}</p>
                      <TrendBadge trend={item.trend} percent={item.changePercent} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm ring-1 ring-border border-none">
            <CardHeader className="pb-2 border-b border-border bg-muted/20">
              <CardTitle className="text-base flex items-center text-destructive">
                <TrendingDown className="mr-2 h-4 w-4" /> Top Losers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {topLosers.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-semibold text-foreground">{item.cropName}</p>
                      <p className="text-xs text-muted-foreground">{item.state}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">₹{item.modalPrice}</p>
                      <TrendBadge trend={item.trend} percent={item.changePercent} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end bg-muted/30 p-4 rounded-xl ring-1 ring-border">
        <div className="flex-1 w-full space-y-2">
          <label className="text-sm font-medium text-foreground">Fasal Khojein</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Gehun, Tamatar, Pyaaz..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-background border-border" />
          </div>
        </div>
        <div className="flex-1 w-full space-y-2 sm:max-w-[250px]">
          <label className="text-sm font-medium text-foreground">Rajya se chhanein</label>
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="bg-background border-border">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Sabhi Rajya" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {states.map(state => (
                <SelectItem key={state} value={state}>{state === "all" ? "Sabhi Rajya" : state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="shadow-sm border-none ring-1 ring-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[200px] font-semibold text-foreground/80">Fasal</TableHead>
                <TableHead className="font-semibold text-foreground/80">Mandi / Rajya</TableHead>
                <TableHead className="text-right font-semibold text-foreground/80">Min Bhav</TableHead>
                <TableHead className="text-right font-semibold text-foreground/80">Max Bhav</TableHead>
                <TableHead className="text-right font-bold text-foreground">Modal Bhav</TableHead>
                <TableHead className="text-right font-semibold text-foreground/80 w-[100px]">Badlav</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? filtered.map((price) => (
                <TableRow key={price.id} className="group cursor-pointer">
                  <TableCell className="font-medium text-foreground">
                    <div className="flex flex-col">
                      <span>{price.cropName}</span>
                      <span className="text-xs text-muted-foreground font-normal">{price.variety}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{price.market}</span>
                      <span className="text-xs text-muted-foreground">{price.state}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground font-medium">₹{price.minPrice}</TableCell>
                  <TableCell className="text-right text-muted-foreground font-medium">₹{price.maxPrice}</TableCell>
                  <TableCell className="text-right font-bold text-foreground text-base">₹{price.modalPrice}<span className="text-xs text-muted-foreground font-normal">/{price.unit}</span></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <TrendBadge trend={price.trend} percent={price.changePercent} />
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">Koi fasal nahi mili. Doosra naam try karein.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
