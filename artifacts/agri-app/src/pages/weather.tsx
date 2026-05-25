import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudRain, Wind, Droplets, ThermometerSun, Search, AlertTriangle, Sprout, CheckCircle2, Sun, CloudSnow } from "lucide-react";

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
    farmingTips: ["Chawal ki ropai ke liye acha samay", "Mitti jaanch karein", "Keet dawai dalein", "Khet ki bund banaaein"],
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
    farmingTips: ["Dhan ki kheti ke liye acha samay", "Paan ke patte ka dhyan rakhein", "Keet se bachao karein", "Zamin ki namee jaanch karein"],
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

function getWeatherIcon(condition: string, size = "h-8 w-8") {
  const c = condition.toLowerCase();
  if (c.includes("baarish") || c.includes("tez")) return <CloudRain className={size} />;
  if (c.includes("thand") || c.includes("snow")) return <CloudSnow className={size} />;
  if (c.includes("baadal")) return <CloudRain className={size} />;
  return <Sun className={size} />;
}

function getTempColor(temp: number) {
  if (temp >= 38) return "from-red-600 to-orange-500";
  if (temp >= 32) return "from-orange-500 to-amber-400";
  if (temp >= 25) return "from-amber-400 to-yellow-400";
  return "from-sky-500 to-blue-400";
}

function getWeatherData(city: string) {
  const key = city.toLowerCase().trim();
  return CITY_DATA[key] ?? { ...CITY_DATA["lucknow"], location: city.charAt(0).toUpperCase() + city.slice(1) };
}

const POPULAR_CITIES = ["Delhi", "Mumbai", "Lucknow", "Pune", "Bengaluru", "Kolkata"];

export default function Weather() {
  const [searchInput, setSearchInput] = useState("");
  const [city, setCity] = useState("Lucknow");
  const weather = getWeatherData(city);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) { setCity(searchInput.trim()); setSearchInput(""); }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">🌤️ Mausam Jaankari</h1>
          <p className="text-muted-foreground mt-1 font-medium">Aapke sheher ka mausam aur kheti ke suzhav</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Sheher likhein..." value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 bg-card border-border font-medium" />
          </div>
          <Button type="submit" className="font-bold shrink-0">Khojein</Button>
        </form>
      </div>

      {/* Popular Cities */}
      <div className="flex flex-wrap gap-2">
        {POPULAR_CITIES.map(c => (
          <button key={c} onClick={() => setCity(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              city.toLowerCase() === c.toLowerCase()
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card border border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
            }`}>
            {c}
          </button>
        ))}
      </div>

      {/* Main Weather Hero */}
      <div className={`relative overflow-hidden rounded-2xl text-white shadow-xl bg-gradient-to-br ${getTempColor(weather.temperature)}`}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="absolute -right-4 -top-4 opacity-10 animate-float">
          {weather.temperature >= 30 ? <Sun className="h-48 w-48" /> : <CloudRain className="h-48 w-48" />}
        </div>

        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-2">📍 {weather.location}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-8xl font-black tracking-tighter leading-none">{weather.temperature}°</span>
              <span className="text-3xl font-medium text-white/70">C</span>
            </div>
            <p className="text-xl font-bold mt-2">{weather.condition}</p>
            <p className="text-white/75 mt-1 text-sm max-w-sm leading-relaxed">{weather.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            {[
              { icon: ThermometerSun, label: "Feels Like", value: `${weather.temperature + 2}°C` },
              { icon: Droplets, label: "Namee", value: `${weather.humidity}%` },
              { icon: Wind, label: "Hawa", value: `${weather.windSpeed} km/h` },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center bg-white/15 backdrop-blur-sm rounded-2xl p-4">
                <stat.icon className="h-5 w-5 mb-1.5 text-white/80" />
                <p className="text-lg font-black">{stat.value}</p>
                <p className="text-[10px] text-white/65 font-semibold mt-0.5 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advisories + Tips */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Alerts */}
        <Card className="border-none shadow-sm ring-1 ring-border overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 pt-5 pb-3 border-b border-border">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <h3 className="font-bold text-base text-foreground">Chetavniyaan</h3>
            <span className="ml-auto text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
              {weather.advisories.length}
            </span>
          </div>
          <CardContent className="p-4 space-y-2.5">
            {weather.advisories.map((adv, i) => (
              <div key={i} className="flex gap-2.5 items-start bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-sm font-medium text-amber-900">{adv}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Farming Tips */}
        <Card className="md:col-span-2 border-none shadow-sm ring-1 ring-border overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 pt-5 pb-3 border-b border-border">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Sprout className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-bold text-base text-foreground">Kheti Suzhav</h3>
          </div>
          <CardContent className="p-4 grid sm:grid-cols-2 gap-3">
            {weather.farmingTips.map((tip, i) => (
              <div key={i} className="flex gap-3 bg-primary/5 border border-primary/10 rounded-xl px-3 py-3 items-start group hover:bg-primary/10 transition-colors">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-foreground/90 leading-snug">{tip}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 5-Day Forecast */}
      <div>
        <h3 className="text-lg font-extrabold text-foreground mb-3 flex items-center gap-2">
          📅 5 Din Ka Haal
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {weather.forecast.map((day, i) => {
            const isToday = i === 0;
            return (
              <div key={i} className={`relative overflow-hidden rounded-2xl p-4 flex flex-col items-center gap-2.5 transition-all card-hover cursor-default text-center
                ${isToday
                  ? "bg-gradient-to-b from-primary to-primary/80 text-primary-foreground shadow-lg"
                  : "bg-card ring-1 ring-border"}`}>
                {isToday && (
                  <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
                )}
                <p className={`text-[11px] font-extrabold uppercase tracking-wider ${isToday ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {day.date}
                </p>
                <div className={`p-2.5 rounded-xl ${isToday ? "bg-white/20" : "bg-muted"}`}>
                  <div className={isToday ? "text-primary-foreground" : "text-primary"}>
                    {getWeatherIcon(day.condition, "h-6 w-6")}
                  </div>
                </div>
                <div>
                  <p className={`text-xl font-black ${isToday ? "text-primary-foreground" : "text-foreground"}`}>{day.tempMax}°</p>
                  <p className={`text-xs font-bold ${isToday ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{day.tempMin}°</p>
                </div>
                <p className={`text-[10px] font-bold leading-tight ${isToday ? "text-primary-foreground/80" : "text-primary"}`}>
                  {day.condition}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
