import { useState } from "react";
import { useListMarketPrices, getListMarketPricesQueryKey, useGetMarketPriceSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, TrendingDown, Minus, Filter } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function MarketPrices() {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");

  const { data: summary, isLoading: isLoadingSummary } = useGetMarketPriceSummary({
    query: { queryKey: ["/api/market-prices/summary"] }
  });

  const { data: prices, isLoading: isLoadingPrices } = useListMarketPrices(
    { crop: search || undefined, state: stateFilter !== "all" ? stateFilter : undefined },
    { query: { queryKey: getListMarketPricesQueryKey({ crop: search || undefined, state: stateFilter !== "all" ? stateFilter : undefined }) } }
  );

  const states = ["all", "Maharashtra", "Punjab", "Haryana", "Karnataka", "Uttar Pradesh", "Madhya Pradesh", "Gujarat"];

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-destructive" />; // Prices up = bad for consumer, but maybe good for farmer. Let's make it primary.
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-primary" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const TrendBadge = ({ trend, percent }: { trend: string, percent: number }) => {
    if (trend === 'up') return <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none rounded-sm px-1.5"><TrendingUp className="h-3 w-3 mr-1" /> +{percent}%</Badge>;
    if (trend === 'down') return <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30 border-none rounded-sm px-1.5"><TrendingDown className="h-3 w-3 mr-1" /> -{percent}%</Badge>;
    return <Badge variant="outline" className="text-muted-foreground border-border rounded-sm px-1.5"><Minus className="h-3 w-3 mr-1" /> {percent}%</Badge>;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-primary">Market Prices</h1>
        <p className="text-lg text-muted-foreground mt-2">Live Mandi prices across different states.</p>
      </div>

      {!isLoadingSummary && summary && (
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-primary text-primary-foreground border-none shadow-md">
            <CardContent className="p-6 flex flex-col justify-center h-full">
              <p className="text-primary-foreground/80 font-medium text-sm uppercase tracking-wider mb-2">Market Overview</p>
              <div className="text-3xl font-bold mb-1">{summary.totalCrops} Crops</div>
              <p className="text-primary-foreground/90 font-medium flex items-center gap-2">
                Avg Change: {summary.avgPriceChange > 0 ? "+" : ""}{summary.avgPriceChange}%
              </p>
              <p className="text-xs text-primary-foreground/60 mt-4">Updated {format(parseISO(summary.lastUpdated), "MMM d, h:mm a")}</p>
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
                  {summary.topGainers.map(item => (
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
                  {summary.topLosers.map(item => (
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
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-end bg-muted/30 p-4 rounded-xl ring-1 ring-border">
        <div className="flex-1 w-full space-y-2">
          <label className="text-sm font-medium text-foreground">Search Crop</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="e.g. Wheat, Tomato..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background border-border"
            />
          </div>
        </div>
        <div className="flex-1 w-full space-y-2 sm:max-w-[250px]">
          <label className="text-sm font-medium text-foreground">Filter by State</label>
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="bg-background border-border">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="All States" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {states.map(state => (
                <SelectItem key={state} value={state}>
                  {state === "all" ? "All States" : state}
                </SelectItem>
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
                <TableHead className="w-[200px] font-semibold text-foreground/80">Crop</TableHead>
                <TableHead className="font-semibold text-foreground/80">Market/State</TableHead>
                <TableHead className="text-right font-semibold text-foreground/80">Min Price</TableHead>
                <TableHead className="text-right font-semibold text-foreground/80">Max Price</TableHead>
                <TableHead className="text-right font-bold text-foreground">Modal Price</TableHead>
                <TableHead className="text-right font-semibold text-foreground/80 w-[100px]">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingPrices ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 bg-muted animate-pulse rounded w-24"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted animate-pulse rounded w-32"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted animate-pulse rounded w-16 ml-auto"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted animate-pulse rounded w-16 ml-auto"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted animate-pulse rounded w-20 ml-auto"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted animate-pulse rounded w-12 ml-auto"></div></TableCell>
                  </TableRow>
                ))
              ) : prices && prices.length > 0 ? (
                prices.map((price) => (
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No market prices found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
