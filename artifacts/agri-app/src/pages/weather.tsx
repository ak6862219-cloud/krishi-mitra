import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudRain, Wind, Droplets, ThermometerSun, Search, AlertTriangle, Sprout, CalendarDays, CheckCircle2 } from "lucide-react";

const CITY_DATA: Record<string, {
  location: string; temperature: number; condition: string; description: string;
  humidity: number; windSpeed: number; advisories: string[]; farmingTips: string[];
  forecast: { date: string; tempMax: number; tempMin: number; condition: string }[];
}> = {
  "delhi": {
    location: "Delhi", temperature: 38, condition: "Garama Dhoop", humidity: 42, windSpeed: 14,
    description: "Aaj dhoop tej rahegi. Fasal ko subah ya shaam ko paani dein.",
    advisories: ["Loo ka khatra — dopahar mein kaam se bachein", "Seedhi dhoop se fasal ko bachaaein", "Paani ki kami na hone dein"],
    farmingTips: ["Gehun ki katai jaldi karein", "Drip irrigation use karein", "Khet mein mulching karein", "Subah 6-9 baje kaam karein"],
    forecast: [
      { date: "Aaj", tempMax: 38, tempMin: 26, condition: "Tej Dhoop" },
      { date: "Kal", tempMax: 36, tempMin: 25, condition: "Aansik Baadal" },
      { date: "Parso", tempMax: 33, tempMin: 24, condition: "Halki Baarish" },
      { date: "3 Din", tempMax: 31, tempMin: 23, condition: "Baarish" },
      { date: "4 Din", tempMax: 34, tempMin: 24, condition: "Aansik Baadal" },
    ]
  },
  "mumbai": {
    location: "Mumbai", temperature: 29, condition: "Umdaa Mausam", humidity: 82, windSpeed: 22,
    description: "Aaj umad ke saath halki baarish ho sakti hai. Khet ki nikasi ka dhyan rakhein.",
    advisories: ["Baarish se fasal ko bachaaein", "Khet mein paani jama na hone dein"],
    farmingTips: ["Chawal ki ropai ke liye acha samay", "Khetон ki mitti jaanch karein", "Keet dawai dalein", "Khet ki bund banaaein"],
    forecast: [
      { date: "Aaj", tempMax: 29, tempMin: 24, condition: "Halki Baarish" },
      { date: "Kal", tempMax: 28, tempMin: 23, condition: "Tez Baarish" },
      { date: "Parso", tempMax: 27, tempMin: 23, condition: "Baarish" },
      { date: "3 Din", tempMax: 28, tempMin: 24, condition: "Halki Baarish" },
      { date: "4 Din", tempMax: 30, tempMin: 25, condition: "Aansik Baadal" },
    ]
  },
  "lucknow": {
    location: "Lucknow", temperature: 36, condition: "Garami ke saath Dhoop", humidity: 55, windSpeed: 12,
    description: "Aaj garami jayada rahegi. Aam aur litchi ke bageeche ka khayal rakhein.",
    advisories: ["Dopahar mein paani dena zaroori", "Loo se bachein"],
    farmingTips: ["Aloo ki khudai abhi shuru karein", "Ganna ko paani dein", "Sabzi ka nirikshan karein", "Keet ka dhyan rakhein"],
    forecast: [
      { date: "Aaj", tempMax: 36, tempMin: 24, condition: "Tej Dhoop" },
      { date: "Kal", tempMax: 35, tempMin: 23, condition: "Dhoop" },
      { date: "Parso", tempMax: 32, tempMin: 22, condition: "Aansik Baadal" },
      { date: "3 Din", tempMax: 30, tempMin: 21, condition: "Halki Baarish" },
      { date: "4 Din", tempMax: 33, tempMin: 22, condition: "Dhoop" },
    ]
  },
  "bangalore": {
    location: "Bengaluru", temperature: 24, condition: "Suhana Mausam", humidity: 68, windSpeed: 10,
    description: "Aaj mausam acha rahega. Rabi fasal ke liye upyukt samay hai.",
    advisories: ["Raat ko thand ho sakti hai — paudhe dhakein"],
    farmingTips: ["Tamatar aur mirchi laga sakte hain", "Drip irrigation lagaaein", "Organic khaad dalein", "Nayi fasal ke liye zameen taiyaar karein"],
    forecast: [
      { date: "Aaj", tempMax: 24, tempMin: 16, condition: "Suhana" },
      { date: "Kal", tempMax: 25, tempMin: 17, condition: "Aansik Baadal" },
      { date: "Parso", tempMax: 23, tempMin: 16, condition: "Halki Baarish" },
      { date: "3 Din", tempMax: 22, tempMin: 15, condition: "Baarish" },
      { date: "4 Din", tempMax: 24, tempMin: 16, condition: "Suhana" },
    ]
  },
  "kolkata": {
    location: "Kolkata", temperature: 32, condition: "Umdaa aur Garami", humidity: 78, windSpeed: 18,
    description: "Umad jayada hai. Chawal ki ropai ke liye mausam thik hai.",
    advisories: ["Tez hawa aa sakti hai — paudhe bandh karein", "Aandhi-baarish ki sambhavna"],
    farmingTips: ["Dhan ki kheti ke liye acha samay", "Paan aur paan ke patte ka dhyan rakhein", "Keet se bachao karein", "Zamin ki namee jaanch karein"],
    forecast: [
      { date: "Aaj", tempMax: 32, tempMin: 25, condition: "Umadaa" },
      { date: "Kal", tempMax: 30, tempMin: 24, condition: "Baarish" },
      { date: "Parso", tempMax: 29, tempMin: 23, condition: "Tez Baarish" },
      { date: "3 Din", tempMax: 31, tempMin: 24, condition: "Aansik Baadal" },
      { date: "4 Din", tempMax: 32, tempMin: 25, condition: "Umadaa" },
    ]
  },
  "pune": {
    location: "Pune", temperature: 27, condition: "Halki Dhoop", humidity: 60, windSpeed: 15,
    description: "Mausam theek hai. Angoor aur anaar ki kheti ke liye acha samay.",
    advisories: ["Hawa tej ho sakti hai shaam ko"],
    farmingTips: ["Angoor ki chhantai karein", "Drip irrigation chalaaein", "Mitti ki jaanch karaaein", "Organic khaad use karein"],
    forecast: [
      { date: "Aaj", tempMax: 27, tempMin: 18, condition: "Halki Dhoop" },
      { date: "Kal", tempMax: 28, tempMin: 19, condition: "Aansik Baadal" },
      { date: "Parso", tempMax: 26, tempMin: 18, condition: "Halki Baarish" },
      { date: "3 Din", tempMax: 25, tempMin: 17, condition: "Baarish" },
      { date: "4 Din", tempMax: 27, tempMin: 18, condition: "Suhana" },
    ]
  },
};

const DEFAULT_CITY = "lucknow";

function getWeatherData(city: string) {
  const key = city.toLowerCase().trim();
  return CITY_DATA[key] ?? {
    ...CITY_DATA[DEFAULT_CITY],
    location: city.charAt(0).toUpperCase() + city.slice(1),
  };
}

export default function Weather() {
  const [searchInput, setSearchInput] = useState("");
  const [city, setCity] = useState("Lucknow");
  const weather = getWeatherData(city);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput.trim());
      setSearchInput("");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary">Mausam Jaankari</h1>
          <p className="text-lg text-muted-foreground mt-2">Aapke sheher ka mausam aur kheti ke suzhav.</p>
        </div>
        <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
          <Input
            placeholder="Sheher khojein... (Delhi, Mumbai...)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="md:w-[260px]"
          />
          <Button type="submit" variant="secondary">
            <Search className="h-4 w-4 mr-2" /> Khojein
          </Button>
        </form>
      </div>

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
                <div className="bg-primary-foreground/20 p-3 rounded-full"><ThermometerSun className="h-6 w-6" /></div>
                <div>
                  <p className="text-sm text-primary-foreground/70 font-medium">Feels Like</p>
                  <p className="text-xl font-bold">{weather.temperature + 2}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary-foreground/20 p-3 rounded-full"><Droplets className="h-6 w-6" /></div>
                <div>
                  <p className="text-sm text-primary-foreground/70 font-medium">Namee</p>
                  <p className="text-xl font-bold">{weather.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary-foreground/20 p-3 rounded-full"><Wind className="h-6 w-6" /></div>
                <div>
                  <p className="text-sm text-primary-foreground/70 font-medium">Hawa</p>
                  <p className="text-xl font-bold">{weather.windSpeed} km/h</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none ring-1 ring-border">
          <CardHeader className="pb-3 border-b border-border bg-muted/20">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Chetavniyaan
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
              <p className="text-sm text-muted-foreground text-center py-4">Koi chetavni nahi.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none ring-1 ring-border md:col-span-2">
          <CardHeader className="pb-3 border-b border-border bg-muted/20">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sprout className="h-5 w-5 text-primary" /> Kheti Suzhav
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid gap-3 sm:grid-cols-2">
            {weather.farmingTips.map((tip, i) => (
              <div key={i} className="flex gap-3 bg-muted/30 p-3 rounded-lg items-start">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-foreground/90">{tip}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-muted-foreground" /> 5 Din Ka Haal
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {weather.forecast.map((day, i) => (
            <Card key={i} className="shadow-sm border-none ring-1 ring-border bg-card text-center transition-all hover:ring-primary/40">
              <CardContent className="p-4 flex flex-col items-center justify-center gap-3">
                <p className="font-semibold text-muted-foreground">{day.date}</p>
                <div className="bg-muted p-3 rounded-full text-primary">
                  {day.condition.toLowerCase().includes("baarish") ? <CloudRain className="h-8 w-8" /> : <ThermometerSun className="h-8 w-8" />}
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
    </div>
  );
}
