import { useState } from "react";
import { useGetWeatherAdvisory, getGetWeatherAdvisoryQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudRain, Wind, Droplets, ThermometerSun, Search, AlertTriangle, Sprout, CalendarDays } from "lucide-react";

export default function Weather() {
  const [searchInput, setSearchInput] = useState("");
  const [city, setCity] = useState<string | undefined>("Pune");

  const { data: weather, isLoading, isError } = useGetWeatherAdvisory(
    { city },
    { query: { enabled: !!city, queryKey: getGetWeatherAdvisoryQueryKey({ city }) } }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput.trim());
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary">Weather Advisory</h1>
          <p className="text-lg text-muted-foreground mt-2">Live weather data and farming tips for your location.</p>
        </div>
        <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
          <Input 
            placeholder="Search city..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="md:w-[250px]"
          />
          <Button type="submit" variant="secondary">
            <Search className="h-4 w-4 mr-2" /> Search
          </Button>
        </form>
      </div>

      {isLoading && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-3 h-64 animate-pulse bg-muted border-none" />
          <Card className="h-48 animate-pulse bg-muted border-none" />
          <Card className="h-48 animate-pulse bg-muted border-none" />
          <Card className="h-48 animate-pulse bg-muted border-none" />
        </div>
      )}

      {isError && (
        <div className="bg-destructive/10 text-destructive p-6 rounded-lg flex items-center justify-center gap-3">
          <AlertTriangle className="h-6 w-6" />
          <span className="font-semibold text-lg">Failed to fetch weather data for {city}.</span>
        </div>
      )}

      {weather && !isLoading && (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-3 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <CloudRain className="h-48 w-48" />
              </div>
              <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h2 className="text-3xl font-bold">{weather.location}</h2>
                  <p className="text-primary-foreground/80 mt-1 text-lg">{weather.condition}</p>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-7xl font-black tracking-tighter">{weather.temperature}°</span>
                    <span className="text-2xl font-medium text-primary-foreground/80">C</span>
                  </div>
                  <p className="text-primary-foreground/90 mt-2 max-w-md text-lg">{weather.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto bg-black/10 p-6 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-foreground/20 p-3 rounded-full">
                      <ThermometerSun className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-primary-foreground/70 font-medium">Feels Like</p>
                      <p className="text-xl font-bold">{weather.temperature + 2}°C</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-foreground/20 p-3 rounded-full">
                      <Droplets className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-primary-foreground/70 font-medium">Humidity</p>
                      <p className="text-xl font-bold">{weather.humidity}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-foreground/20 p-3 rounded-full">
                      <Wind className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-primary-foreground/70 font-medium">Wind</p>
                      <p className="text-xl font-bold">{weather.windSpeed} km/h</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-none ring-1 ring-border">
              <CardHeader className="pb-3 border-b border-border bg-muted/20">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-500" /> Advisories
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {weather.advisories.length > 0 ? (
                  <ul className="space-y-3">
                    {weather.advisories.map((adv, i) => (
                      <li key={i} className="flex gap-3 text-sm text-foreground/80 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No active weather advisories.</p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm border-none ring-1 ring-border md:col-span-2">
              <CardHeader className="pb-3 border-b border-border bg-muted/20">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sprout className="h-5 w-5 text-primary" /> Farming Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 grid gap-3 sm:grid-cols-2">
                {weather.farmingTips.map((tip, i) => (
                  <div key={i} className="flex gap-3 bg-muted/30 p-3 rounded-lg items-start">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground/90">{tip}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-muted-foreground" /> 5-Day Forecast
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {weather.forecast.map((day, i) => (
                <Card key={i} className="shadow-sm border-none ring-1 ring-border bg-card text-center hover-elevate transition-all">
                  <CardContent className="p-4 flex flex-col items-center justify-center gap-3">
                    <p className="font-semibold text-muted-foreground">
                      {day.date}
                    </p>
                    <div className="bg-muted p-3 rounded-full text-primary">
                      {day.condition.toLowerCase().includes("rain") ? <CloudRain className="h-8 w-8" /> : <ThermometerSun className="h-8 w-8" />}
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">{day.tempMax}°</p>
                      <p className="text-sm font-medium text-muted-foreground">{day.tempMin}°</p>
                    </div>
                    <p className="text-xs font-medium text-primary line-clamp-1">{day.condition}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  )
}
