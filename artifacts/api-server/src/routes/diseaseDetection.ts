import { Router, type IRouter } from "express";
import { AnalyzeCropDiseaseBody } from "@workspace/api-zod";

const router: IRouter = Router();

const MOCK_DISEASES = [
  {
    diseaseName: "Late Blight (Phytophthora infestans)",
    confidence: 0.91,
    severity: "High",
    description:
      "Late blight is a serious fungal disease that causes dark, water-soaked lesions on leaves and stems. It spreads rapidly in cool, wet weather and can destroy an entire crop within days if untreated.",
    symptoms: [
      "Dark brown to black water-soaked lesions on leaves",
      "White fuzzy mold on underside of leaves in humid conditions",
      "Stems turn dark brown and collapse",
      "Infected tubers show reddish-brown rot inside",
    ],
    treatment: [
      "Apply copper-based fungicide (Copper Oxychloride 50 WP) at 3g/litre immediately",
      "Remove and destroy all infected plant parts — do not compost",
      "Spray Mancozeb 75 WP at 2.5g/litre every 7 days for 3 weeks",
      "Improve field drainage to reduce moisture around roots",
    ],
    prevention: [
      "Use certified disease-free seeds and resistant varieties (e.g., Kufri Jyoti for potato)",
      "Avoid overhead irrigation — use drip or furrow irrigation",
      "Maintain proper plant spacing for good air circulation",
      "Apply preventive fungicide spray before monsoon season",
    ],
    affectedCrop: "Potato / Tomato",
  },
  {
    diseaseName: "Powdery Mildew (Erysiphe cichoracearum)",
    confidence: 0.87,
    severity: "Medium",
    description:
      "Powdery mildew appears as white or grey powdery spots on leaf surfaces. It thrives in warm dry days with cool nights and reduces photosynthesis, weakening the plant.",
    symptoms: [
      "White powdery coating on upper surface of leaves",
      "Yellowing and curling of affected leaves",
      "Stunted plant growth and reduced yield",
      "Premature leaf drop in severe cases",
    ],
    treatment: [
      "Spray Sulphur 80 WP (3g/litre) or Karathane at first sign of infection",
      "Apply Propiconazole 25 EC (1ml/litre) for systemic control",
      "Remove heavily infected leaves and burn them",
      "Repeat spray after 10–14 days if infection persists",
    ],
    prevention: [
      "Avoid excessive nitrogen fertilization which promotes soft, susceptible growth",
      "Plant resistant varieties suited to your region",
      "Ensure adequate spacing between plants for air circulation",
      "Avoid wetting foliage during evening irrigation",
    ],
    affectedCrop: "Wheat / Cucurbits / Grapes",
  },
  {
    diseaseName: "Bacterial Leaf Blight (Xanthomonas oryzae)",
    confidence: 0.83,
    severity: "High",
    description:
      "Bacterial leaf blight is one of the most destructive rice diseases in India. It causes yellowing and wilting of leaves (kresek stage) and can cause 20–70% yield loss in severe outbreaks.",
    symptoms: [
      "Water-soaked to yellowish stripes on leaf margins",
      "Lesions turn white to yellow and eventually straw-colored",
      "Wilting and drying of entire seedlings (kresek) in young plants",
      "Milky or opaque exudate droplets visible in morning dew",
    ],
    treatment: [
      "Drain the field and avoid flood irrigation during outbreak",
      "Spray Streptocycline (100 ppm) + Copper Oxychloride (0.3%) mixture",
      "Apply Copper Hydroxide 77 WP at 2g/litre as protective spray",
      "Avoid applying excessive nitrogen fertilizer during infection",
    ],
    prevention: [
      "Use resistant varieties like IR-64, Pusa Basmati-1 or state-recommended varieties",
      "Treat seeds with Streptocycline 0.01% before sowing",
      "Avoid transplanting in flooded conditions",
      "Maintain balanced fertilization — avoid excess urea",
    ],
    affectedCrop: "Rice (Paddy)",
  },
  {
    diseaseName: "Healthy Plant — No Disease Detected",
    confidence: 0.94,
    severity: "None",
    description:
      "The crop appears healthy with no visible signs of disease, pest damage, or nutrient deficiency. The leaf color, texture, and structure look normal.",
    symptoms: ["No disease symptoms detected", "Leaves appear green and healthy", "Normal plant structure observed"],
    treatment: [
      "No treatment required at this time",
      "Continue regular monitoring every 7–10 days",
      "Maintain current irrigation and fertilization schedule",
    ],
    prevention: [
      "Keep monitoring regularly — catch problems early",
      "Maintain balanced fertilization with NPK as per soil test",
      "Keep field clean of weeds and crop debris",
      "Rotate crops each season to prevent soil-borne diseases",
    ],
    affectedCrop: "Healthy Crop",
  },
];

router.post("/disease-detection/analyze", async (req, res): Promise<void> => {
  const cropType: string | undefined = req.body?.cropType || undefined;

  await new Promise((r) => setTimeout(r, 1800));

  const pick = MOCK_DISEASES[Math.floor(Math.random() * MOCK_DISEASES.length)];

  res.json({
    ...pick,
    affectedCrop: cropType || pick.affectedCrop,
  });
});

export default router;
