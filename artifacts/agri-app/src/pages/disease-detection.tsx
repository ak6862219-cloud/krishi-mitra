import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, Activity, CheckCircle2, AlertCircle, ShieldAlert, Loader2, ImagePlus, RefreshCw } from "lucide-react";

interface AnalysisResult {
  diseaseName: string;
  confidence: number;
  severity: string;
  description: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  affectedCrop: string;
}

export default function DiseaseDetection() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageSelected, setImageSelected] = useState(false);
  const [cropType, setCropType] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Kripya ek image file upload karein.");
      return;
    }

    setError(null);
    setResult(null);
    setImageSelected(true);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Kripya ek image file upload karein.");
      return;
    }
    setError(null);
    setResult(null);
    setImageSelected(true);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!imageSelected) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch(apiUrl("/api/disease-detection/analyze"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cropType: cropType || undefined }),
      });

      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      setResult(data);
    } catch {
      setError("Analysis fail hui. Dobara try karein.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setImageSelected(false);
    setResult(null);
    setError(null);
    setCropType("");
  };

  const severityColor = (s: string) => {
    if (s === "High") return "bg-red-500 text-white";
    if (s === "Medium") return "bg-amber-500 text-white";
    if (s === "Low") return "bg-yellow-400 text-white";
    return "bg-emerald-500 text-white";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-primary">Fasal Rog Pahchaan</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Apni fasal ki photo upload karein — AI turant bimari ki jaankari, ilaaj aur bachav ke upaay batayega.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Upload Panel */}
        <Card className="shadow-sm border-none ring-1 ring-border">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2">
              <ImagePlus className="h-5 w-5 text-primary" /> Photo Upload Karein
            </CardTitle>
            <CardDescription>Prabhavit patti ya tane ki saaf tasveer lein.</CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="cropType" className="font-semibold">Fasal ka Naam (Vaikalpik)</Label>
              <Input
                id="cropType"
                placeholder="Gehun, Dhan, Tamatar, Aalu..."
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Fasal Ki Tasveer</Label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => !imageSelected && document.getElementById("picture-upload")?.click()}
                className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-colors ${
                  imageSelected
                    ? "border-primary/40 cursor-default"
                    : "border-border hover:border-primary/50 hover:bg-muted/30 cursor-pointer"
                }`}
                style={{ minHeight: "200px" }}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Fasal preview"
                      className="w-full h-full object-cover"
                      style={{ maxHeight: "240px" }}
                    />
                    <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-2">
                      <CheckCircle2 className="h-8 w-8 text-white" />
                      <p className="text-white text-sm font-semibold">Image ready hai</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); document.getElementById("picture-upload")?.click(); }}
                        className="text-white/80 text-xs underline hover:text-white"
                      >
                        Badlein
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      <UploadCloud className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-semibold text-foreground">Click karein ya yahan drop karein</p>
                    <p className="text-sm text-muted-foreground mt-1">PNG, JPG, JPEG (max 10MB)</p>
                  </div>
                )}
                <input
                  id="picture-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                className="flex-1 h-12 text-base font-bold"
                disabled={!imageSelected || isAnalyzing}
                onClick={handleAnalyze}
              >
                {isAnalyzing ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Jaanch ho rahi hai...</>
                ) : (
                  <><Activity className="mr-2 h-5 w-5" /> Rog Jaanch Karein</>
                )}
              </Button>
              {(imageSelected || result) && (
                <Button variant="outline" size="icon" className="h-12 w-12 shrink-0" onClick={handleReset} title="Reset">
                  <RefreshCw className="h-5 w-5" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className={`shadow-sm border-none ring-1 transition-all ${
          result
            ? result.severity === "High"
              ? "ring-red-200 bg-red-50/30"
              : result.severity === "None"
              ? "ring-emerald-200 bg-emerald-50/30"
              : "ring-amber-200 bg-amber-50/20"
            : "ring-border"
        }`}>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" /> Jaanch Parinaam
            </CardTitle>
            <CardDescription>AI ki salah yahan dikhegi.</CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            {!result && !isAnalyzing && (
              <div className="flex flex-col items-center justify-center text-center py-16 text-muted-foreground">
                <div className="bg-muted/50 p-5 rounded-full mb-4">
                  <ShieldAlert className="h-10 w-10 opacity-30" />
                </div>
                <p className="font-medium">Photo upload karein aur jaanch shuru karein</p>
                <p className="text-sm mt-1 opacity-70">Rog ka naam, lakshan, ilaaj aur bachav ke upaay milenge</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center text-center py-16">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Activity className="absolute inset-0 m-auto h-6 w-6 text-primary" />
                </div>
                <p className="font-semibold mt-5 text-foreground">AI jaanch kar raha hai...</p>
                <p className="text-sm text-muted-foreground mt-1">Thodi der mein result aayega</p>
              </div>
            )}

            {result && (
              <div className="space-y-5 animate-in slide-in-from-bottom-4 duration-500">
                {/* Disease name + severity */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-foreground leading-tight">{result.diseaseName}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Prabhavit fasal: <span className="font-semibold text-foreground">{result.affectedCrop}</span></p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 ${severityColor(result.severity)}`}>
                    {result.severity === "None" ? "Swasth" : result.severity === "High" ? "Gambhir" : result.severity === "Medium" ? "Madhyam" : "Halka"}
                  </span>
                </div>

                {/* Confidence bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground font-medium">
                    <span>AI Vishwaas</span>
                    <span className="font-bold text-foreground">{Math.round(result.confidence * 100)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="bg-muted/40 rounded-xl p-4">
                  <p className="text-sm text-foreground/80 leading-relaxed">{result.description}</p>
                </div>

                {/* Symptoms + Prevention */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-background rounded-xl p-4 ring-1 ring-border">
                    <h4 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-amber-500" /> Lakshan
                    </h4>
                    <ul className="space-y-2">
                      {result.symptoms.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                          <span className="text-amber-500 font-black mt-0.5">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-background rounded-xl p-4 ring-1 ring-border">
                    <h4 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-primary" /> Bachav
                    </h4>
                    <ul className="space-y-2">
                      {result.prevention.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                          <span className="text-primary font-black mt-0.5">•</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Treatment steps */}
                <div className="bg-primary/8 rounded-xl p-4 ring-1 ring-primary/20">
                  <h4 className="font-bold text-sm text-primary mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Recommended Ilaaj
                  </h4>
                  <ol className="space-y-3">
                    {result.treatment.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-foreground/85">
                        <span className="flex-shrink-0 flex items-center justify-center bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="leading-snug pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
