import { Router, type IRouter } from "express";
import { GetWeatherAdvisoryQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

const CITY_WEATHER: Record<string, object> = {
  "new delhi": {
    temperature: 38.2,
    humidity: 42,
    windSpeed: 14.5,
    condition: "Hot & Hazy",
    description: "Hot summer day with hazy skies. High temperatures expected throughout the day.",
    advisories: [
      "Avoid field work between 11 AM – 4 PM due to extreme heat",
      "Irrigate crops in early morning or evening to reduce evaporation losses",
      "Check for heat stress signs in wheat — wilting, leaf rolling",
    ],
    farmingTips: [
      "Apply mulching around vegetable crops to retain soil moisture",
      "Harvest matured wheat crop before afternoon heat to reduce grain damage",
      "Keep livestock in shade and ensure adequate water supply",
    ],
  },
  mumbai: {
    temperature: 31.5,
    humidity: 82,
    windSpeed: 18.2,
    condition: "Humid & Partly Cloudy",
    description: "High humidity with overcast skies. Pre-monsoon showers possible in the evening.",
    advisories: [
      "High humidity increases risk of fungal diseases — inspect crops daily",
      "Spray preventive fungicide on paddy and vegetable crops",
      "Clear blocked drainage channels before monsoon arrival",
    ],
    farmingTips: [
      "Prepare nursery beds for kharif paddy sowing",
      "Apply lime to acidic soils before monsoon plowing",
      "Harvest mature mango crop immediately to prevent rotting",
    ],
  },
  bangalore: {
    temperature: 26.8,
    humidity: 68,
    windSpeed: 10.1,
    condition: "Pleasant & Partly Cloudy",
    description: "Mild and pleasant weather. Ideal conditions for most farming activities.",
    advisories: [
      "Ideal weather for transplanting vegetable seedlings",
      "Good conditions for pesticide application — calm winds, mild temp",
      "Monitor for aphids and whitefly on tomato and chilli crops",
    ],
    farmingTips: [
      "Perfect time for soil preparation and organic manure application",
      "Sow finger millet (ragi) seeds for coming season",
      "Prune and train grape vines for better yield",
    ],
  },
  chennai: {
    temperature: 34.6,
    humidity: 75,
    windSpeed: 16.3,
    condition: "Hot & Humid",
    description: "Hot and humid conditions typical of coastal Tamil Nadu. Sea breeze in the afternoon.",
    advisories: [
      "High humidity — watch for paddy blast and brown spot diseases",
      "Coconut palms: inspect for rhinoceros beetle damage",
      "Irrigate early morning to reduce heat stress on crops",
    ],
    farmingTips: [
      "Apply potash fertilizer to paddy crop at panicle initiation stage",
      "Harvest groundnut crop if pods are mature to avoid aflatoxin risk",
      "Spray neem oil solution as preventive pest management",
    ],
  },
  kolkata: {
    temperature: 33.1,
    humidity: 78,
    windSpeed: 12.4,
    condition: "Warm & Cloudy",
    description: "Warm and cloudy day. Thunderstorm possible in the afternoon.",
    advisories: [
      "Afternoon thunderstorm likely — complete all spray operations by noon",
      "Check jute crop for stem rot disease in waterlogged areas",
      "Drain excess water from paddy fields after heavy rain",
    ],
    farmingTips: [
      "Apply top dressing of urea to jute crop at 30 days after sowing",
      "Prepare seed beds for aman paddy transplanting",
      "Harvest mustard crop if 75% siliques have turned yellow",
    ],
  },
  lucknow: {
    temperature: 36.4,
    humidity: 38,
    windSpeed: 11.7,
    condition: "Hot & Dry",
    description: "Hot and dry summer conditions. Loo winds expected in the afternoon.",
    advisories: [
      "Loo winds (hot dry winds) — protect young plants with shade nets",
      "Increase irrigation frequency for sugarcane and vegetable crops",
      "Avoid pesticide spray during afternoon — chemical efficacy reduced in heat",
    ],
    farmingTips: [
      "Apply irrigation to sugarcane at 5–7 day intervals in this heat",
      "Harvest onion crop and cure in shade before storage",
      "Sow summer moong bean for additional income before kharif season",
    ],
  },
  hyderabad: {
    temperature: 35.9,
    humidity: 48,
    windSpeed: 13.8,
    condition: "Hot & Sunny",
    description: "Hot summer day with clear skies. Ideal for harvest operations.",
    advisories: [
      "Good drying weather — harvest and dry turmeric and chilli crops",
      "Monitor cotton crop for sucking pest activity (thrips, mites)",
      "Irrigate groundnut at peg formation and pod development stages",
    ],
    farmingTips: [
      "Apply gypsum (calcium sulphate) to groundnut crop at flowering",
      "Interculture operation in cotton to control weeds",
      "Spray micronutrient mixture on chilli to prevent blossom drop",
    ],
  },
};

const DEFAULT_FORECAST = [
  { date: "Tomorrow", tempMin: 22, tempMax: 32, condition: "Partly Cloudy", precipitation: 15 },
  { date: "Day 3", tempMin: 21, tempMax: 31, condition: "Sunny", precipitation: 5 },
  { date: "Day 4", tempMin: 20, tempMax: 29, condition: "Light Rain", precipitation: 65 },
  { date: "Day 5", tempMin: 19, tempMax: 28, condition: "Cloudy", precipitation: 40 },
  { date: "Day 6", tempMin: 23, tempMax: 33, condition: "Sunny", precipitation: 8 },
];

router.get("/weather/advisory", async (req, res): Promise<void> => {
  const params = GetWeatherAdvisoryQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const city = params.data.city ?? "New Delhi";
  const key = city.toLowerCase().trim();
  const cityData = CITY_WEATHER[key] ?? CITY_WEATHER["new delhi"];

  res.json({
    location: city,
    ...cityData,
    forecast: DEFAULT_FORECAST,
  });
});

export default router;
