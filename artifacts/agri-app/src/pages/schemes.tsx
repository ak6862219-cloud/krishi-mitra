import { useState, useMemo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Landmark, Search, Filter, ArrowRight, ExternalLink, PhoneCall, CheckCircle2, AlertCircle, Sprout } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const ALL_SCHEMES = [
  {
    id: 1, name: "PM-KISAN Samman Nidhi", category: "Subsidies", ministry: "Krishi Mantralaya, Bharat Sarkar",
    isActive: true, deadline: null, emoji: "💰",
    description: "Pradhan Mantri Kisan Samman Nidhi yojana ke tahat har kisan ko saal mein ₹6,000 teen kishtein mein seedhe unke bank khate mein diye jaate hain.",
    benefits: "• Saal mein ₹6,000 (₹2,000 teen baar)\n• Seedha bank khate mein\n• Koi beechwaliya nahi",
    eligibility: "• 2 hectare tak zameen wale kisan\n• Bharat ke niwasi\n• Kisi bhi rajya ke kisan",
    applicationProcess: "1. pmkisan.gov.in par jaayein\n2. 'New Farmer Registration' par click karein\n3. Aadhaar, bank account aur zameen ka vivran bharein\n4. Submit karein",
    website: "https://pmkisan.gov.in", helpline: "155261",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: 2, name: "Pradhan Mantri Fasal Bima Yojana", category: "Insurance", ministry: "Krishi Mantralaya",
    isActive: true, deadline: "2025-07-31", emoji: "🛡️",
    description: "Fasal bima yojana jo prakritik aapda, keeton ya bimari se fasal kharab hone par kisan ko muavza deti hai.",
    benefits: "• Kharif faslon par 2% premium\n• Rabi faslon par 1.5% premium\n• Baagbaani faslon par 5% premium\n• Nuksaan hone par poora muavza",
    eligibility: "• Bhartiya kisan\n• Sarkari/cooperative/bank karz lene wale kisan\n• Khud se bhi le sakte hain",
    applicationProcess: "1. Najdeeki bank ya CSC kendr jaayein\n2. Fasal bima form bharein\n3. Premium jama karein\n4. Nuksaan hone par 72 ghante mein soochit karein",
    website: "https://pmfby.gov.in", helpline: "14447",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: 3, name: "Kisan Credit Card (KCC)", category: "Credit", ministry: "Vittiya Seva Vibhag",
    isActive: true, deadline: null, emoji: "💳",
    description: "Kisan Credit Card se kisan apni zaroorat ke hisaab se karz le sakte hain — khad, beej, pesticide kharidne ke liye.",
    benefits: "• 3 lakh tak 7% byaj par karz\n• Samay par bharne par 3% extra chhoot\n• Fasal bima bhi shamil\n• ATM card bhi milta hai",
    eligibility: "• Koi bhi kisan\n• Machhuare bhi aavedan kar sakte hain\n• Pashu palanhar bhi eligible",
    applicationProcess: "1. Bank mein jaayein ya online aavedan karein\n2. Zameen ke kagaz\n3. Aadhaar card\n4. 2 hafte mein kard milta hai",
    website: "https://www.nabard.org", helpline: "1800-180-1111",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: 4, name: "PM Kusum Yojana", category: "Infrastructure", ministry: "Navikaraneeya Urja Mantralaya",
    isActive: true, deadline: null, emoji: "☀️",
    description: "Kisan apne khetein mein solar pump lagaakar sinchai ki suvidha pa sakte hain aur bijli bachaa sakte hain ya bech sakte hain.",
    benefits: "• 90% subsidy par solar pump\n• Barsa bhar sinchai\n• Bijli bechkar extra kamaai\n• Diesel pump ka kharch khatam",
    eligibility: "• Koi bhi kisan\n• Kisan samooh bhi apply kar sakte hain\n• Panchayat bhi eligible",
    applicationProcess: "1. Rajya sarkar ki noda agency se sampark karein\n2. Aavedan form bharein\n3. Bhoomi vivran dein\n4. 10% advance jama karein",
    website: "https://mnre.gov.in", helpline: "1800-180-3333",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    id: 5, name: "Paramparagat Krishi Vikas Yojana", category: "Subsidies", ministry: "Krishi Mantralaya",
    isActive: true, deadline: null, emoji: "🌿",
    description: "Jevik (organic) kheti ko badhawa dene ke liye sarkar kisan samoohon ko madad deti hai.",
    benefits: "• ₹50,000/hectare teen saalon mein\n• Jevik pramaan patr ki sahayata\n• Bazar se seedha jod\n• Training aur shikshan",
    eligibility: "• 50 ya zyada kisan ka samooh\n• 50 acre zameen ek jagah\n• Jevik kheti ke liye taiyaar",
    applicationProcess: "1. 50 kisanon ka samooh banaayein\n2. Najdeeki krishi karyalay mein aavedan karein\n3. Jevik kheti ka prastaav dein\n4. Prashikshan lein",
    website: "https://pgsindia-ncof.gov.in", helpline: "1800-180-1551",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: 6, name: "E-NAM (National Agriculture Market)", category: "Technology", ministry: "Krishi Mantralaya",
    isActive: true, deadline: null, emoji: "💻",
    description: "Online mandi jo kisan ko poore desh mein apni fasal bechne ki suvidha deti hai — beech wale ko khatam karke.",
    benefits: "• Online bhav milte hain\n• Ghar baith ke boli\n• Jaldi bhugtaan\n• Poore desh mein bazar",
    eligibility: "• Koi bhi Bhartiya kisan\n• Mandi mein registration\n• Mobile/computer zaroori",
    applicationProcess: "1. enam.gov.in par jaayein\n2. Registration karein\n3. Fasal ki jaankari dein\n4. Online boli lagaaein",
    website: "https://enam.gov.in", helpline: "1800-270-0224",
    gradient: "from-sky-500 to-cyan-600",
  },
  {
    id: 7, name: "Soil Health Card Yojana", category: "Technology", ministry: "Krishi Mantralaya",
    isActive: true, deadline: null, emoji: "🧪",
    description: "Mitti ki jaanch karke kisan ko khaad ki sahi maatra aur prakar bataya jaata hai.",
    benefits: "• Muft mitti jaanch\n• Sahi khaad ka sujhav\n• Fasal ki upaj mein sudhar\n• Paise ki bachat",
    eligibility: "• Koi bhi kisan\n• Khet ki mitti ka namuna dena hoga",
    applicationProcess: "1. Najdeeki Krishi Vigyan Kendra jaayein\n2. Mitti ka namuna dein\n3. 2-4 hafte mein card milega\n4. Card par diye sujhav follow karein",
    website: "https://soilhealth.dac.gov.in", helpline: "1551",
    gradient: "from-yellow-500 to-amber-600",
  },
  {
    id: 8, name: "Rashtriya Krishi Vikas Yojana", category: "Infrastructure", ministry: "Krishi Mantralaya",
    isActive: true, deadline: null, emoji: "🏗️",
    description: "Krishi se judi infra suvidhaon ko behtar banane ke liye rajya sarkaron ko madad di jaati hai.",
    benefits: "• Godam nirman mein madad\n• Bazar se jodne ki suvidha\n• Sinchai ki vyavastha\n• Yantra kharidne par subsidy",
    eligibility: "• Rajya sarkar ke zariye milta hai\n• Kisan samiti ya FPO\n• Vyaktigat kisan bhi apply kar sakte hain",
    applicationProcess: "1. Rajya krishi vibhag se sampark karein\n2. Pariyojana prastaav banaayein\n3. DPR jama karein\n4. Rajya committee ki swikriti le",
    website: "https://rkvy.nic.in", helpline: "1800-180-1551",
    gradient: "from-rose-500 to-pink-600",
  },
];

const CATEGORIES = ["all", "Subsidies", "Insurance", "Credit", "Infrastructure", "Technology"];

const CAT_COLORS: Record<string, string> = {
  Subsidies: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Insurance: "bg-blue-100 text-blue-700 border-blue-200",
  Credit: "bg-violet-100 text-violet-700 border-violet-200",
  Infrastructure: "bg-amber-100 text-amber-700 border-amber-200",
  Technology: "bg-sky-100 text-sky-700 border-sky-200",
};

export default function Schemes() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => ALL_SCHEMES.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || s.category === category;
    return matchSearch && matchCat;
  }), [search, category]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 shadow-lg"
        style={{ background: "linear-gradient(130deg, hsl(140,45%,22%) 0%, hsl(140,50%,16%) 100%)" }}>
        <div className="absolute -right-6 -top-6 opacity-10 animate-float">
          <Sprout className="h-40 w-40 text-white" />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold tracking-widest text-white/40 uppercase mb-2">Bharat Sarkar</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">🏛️ Sarkari Yojanaayein</h1>
          <p className="text-white/60 mt-1 font-medium text-sm">Kheti se judi {ALL_SCHEMES.length} sarkari yojanaayein, anudan aur sahayata</p>
          <div className="flex gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-400">{ALL_SCHEMES.filter(s => s.isActive).length}</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-wide">Active</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-black text-secondary">₹6000+</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-wide">Max Laabh</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-black text-sky-400">5</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-wide">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-card p-4 rounded-2xl ring-1 ring-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Yojana ya category khojein..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/30 border-transparent font-medium" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="bg-muted/30 border-transparent w-full sm:w-[200px] font-medium">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Sabhi Prakar" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat === "all" ? "Sabhi Prakar" : cat}</SelectItem>)}
          </SelectContent>
        </Select>
        {(search || category !== "all") && (
          <button onClick={() => { setSearch(""); setCategory("all"); }}
            className="px-4 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            Reset
          </button>
        )}
      </div>

      {/* Scheme Cards */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(scheme => (
            <Card key={scheme.id} className="flex flex-col border-none ring-1 ring-border shadow-sm card-hover overflow-hidden group">
              {/* Gradient top strip */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${scheme.gradient}`} />

              <CardContent className="pt-5 pb-3 px-5 flex-1">
                {/* Top row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl bg-gradient-to-br ${scheme.gradient} text-white shadow-sm shrink-0`}>
                      {scheme.emoji}
                    </div>
                    <Badge className={`text-[10px] font-bold border ${CAT_COLORS[scheme.category] ?? "bg-muted text-foreground border-border"}`}>
                      {scheme.category}
                    </Badge>
                  </div>
                  {scheme.isActive ? (
                    <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Bandh</span>
                  )}
                </div>

                <h3 className="font-extrabold text-foreground leading-tight mb-1.5">{scheme.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                  <Landmark className="h-3 w-3 shrink-0" />
                  <span className="truncate">{scheme.ministry}</span>
                </p>
                <p className="text-sm text-foreground/75 leading-relaxed line-clamp-2">{scheme.description}</p>

                {scheme.deadline && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-xl">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    Akhiri Tarikh: {new Date(scheme.deadline).toLocaleDateString("hi-IN")}
                  </div>
                )}
              </CardContent>

              <CardFooter className="px-5 pb-5 pt-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r ${scheme.gradient} text-white hover:opacity-90 transition-all shadow-sm group`}>
                      Puri Jaankari
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl p-0 overflow-hidden border-none ring-1 ring-border">
                    <div className={`p-6 text-white bg-gradient-to-br ${scheme.gradient}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-3xl">{scheme.emoji}</span>
                        <Badge className="bg-white/20 text-white border-none font-bold">{scheme.category}</Badge>
                        {scheme.isActive && <Badge className="bg-white/30 text-white border-none font-bold">✓ Active</Badge>}
                      </div>
                      <DialogTitle className="text-2xl font-extrabold leading-tight">{scheme.name}</DialogTitle>
                      <DialogDescription className="text-white/75 mt-2 text-sm font-medium flex items-center gap-2">
                        <Landmark className="h-3.5 w-3.5" /> {scheme.ministry}
                      </DialogDescription>
                    </div>
                    <ScrollArea className="max-h-[60vh] p-6 bg-background">
                      <div className="space-y-5">
                        <section>
                          <h4 className="font-extrabold text-foreground mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-primary" /> Yojana Ke Baare Mein
                          </h4>
                          <p className="text-foreground/75 leading-relaxed text-sm">{scheme.description}</p>
                        </section>
                        <div className="grid md:grid-cols-2 gap-4">
                          <section className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                            <h4 className="font-extrabold text-emerald-800 mb-2 flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4" /> Mukhya Laabh
                            </h4>
                            <p className="text-emerald-900 text-sm leading-relaxed whitespace-pre-wrap">{scheme.benefits}</p>
                          </section>
                          <section className="bg-primary/5 border border-primary/10 p-4 rounded-xl">
                            <h4 className="font-extrabold text-primary mb-2 flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4" /> Yogyata
                            </h4>
                            <p className="text-foreground/75 text-sm leading-relaxed whitespace-pre-wrap">{scheme.eligibility}</p>
                          </section>
                        </div>
                        <section>
                          <h4 className="font-extrabold text-foreground mb-2 text-sm">📝 Aavedan Kaise Karein</h4>
                          <div className="bg-muted/40 border border-border p-4 rounded-xl text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                            {scheme.applicationProcess}
                          </div>
                        </section>
                        {(scheme.website || scheme.helpline) && (
                          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                            {scheme.website && (
                              <Button asChild className={`bg-gradient-to-r ${scheme.gradient} text-white border-none hover:opacity-90`}>
                                <a href={scheme.website} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" /> Sarkari Portal
                                </a>
                              </Button>
                            )}
                            {scheme.helpline && (
                              <Button variant="outline" asChild>
                                <a href={`tel:${scheme.helpline}`}>
                                  <PhoneCall className="h-4 w-4 mr-2 text-primary" /> Helpline: {scheme.helpline}
                                </a>
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-2xl ring-1 ring-border">
          <div className="text-5xl mb-4">🏛️</div>
          <h3 className="text-lg font-bold text-foreground">Koi yojana nahi mili</h3>
          <p className="text-muted-foreground text-sm mt-1">Doosre shabd try karein ya filter saaf karein</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setCategory("all"); }}>
            Sab Dekhein
          </Button>
        </div>
      )}
    </div>
  );
}
