import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Landmark, Search, Filter, ArrowRight, ExternalLink, PhoneCall, CheckCircle2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const ALL_SCHEMES = [
  {
    id: 1, name: "PM-KISAN Samman Nidhi", category: "Subsidies", ministry: "Krishi Mantralaya, Bharat Sarkar",
    isActive: true, deadline: null,
    description: "Pradhan Mantri Kisan Samman Nidhi yojana ke tahat har kisan ko saal mein ₹6,000 teen kishtein mein seedhe unke bank khate mein diye jaate hain.",
    benefits: "• Saal mein ₹6,000 (₹2,000 teen baar)\n• Seedha bank khate mein\n• Koi beechwaliya nahi",
    eligibility: "• 2 hectare tak zameen wale kisan\n• Bharat ke niwasi\n• Kisi bhi rajya ke kisan",
    applicationProcess: "1. pmkisan.gov.in par jaayein\n2. 'New Farmer Registration' par click karein\n3. Aadhaar, bank account aur zameen ka vivran bharein\n4. Submit karein",
    website: "https://pmkisan.gov.in", helpline: "155261"
  },
  {
    id: 2, name: "Pradhan Mantri Fasal Bima Yojana", category: "Insurance", ministry: "Krishi Mantralaya",
    isActive: true, deadline: "2025-07-31",
    description: "Fasal bima yojana jo prakritik aapda, keeton ya bimari se fasal kharab hone par kisan ko muavza deti hai.",
    benefits: "• Kharif faslon par 2% premium\n• Rabi faslon par 1.5% premium\n• Baagbaani faslon par 5% premium\n• Nuksaan hone par poora muavza",
    eligibility: "• Bhartiya kisan\n• Sarkari/cooperative/bank karz lene wale kisan\n• Khud se bhi le sakte hain",
    applicationProcess: "1. Najdeeki bank ya CSC kendr jaayein\n2. Fasal bima form bharein\n3. Premium jama karein\n4. Nuksaan hone par 72 ghante mein soochit karein",
    website: "https://pmfby.gov.in", helpline: "14447"
  },
  {
    id: 3, name: "Kisan Credit Card (KCC)", category: "Credit", ministry: "Vittiya Seva Vibhag",
    isActive: true, deadline: null,
    description: "Kisan Credit Card se kisan apni zaroorat ke hisaab se karz le sakte hain — khad, beej, pesticide kharidne ke liye.",
    benefits: "• 3 lakh tak 7% byaj par karz\n• Samay par bharne par 3% extra chhoot\n• Fasal bima bhi shamil\n• ATM card bhi milta hai",
    eligibility: "• Koi bhi kisan\n• Machhuare bhi aavedan kar sakte hain\n• Pashu palanhar bhi eligible",
    applicationProcess: "1. Bank mein jaayein ya online aavedan karein\n2. Zameen ke kagaz\n3. Aadhaar card\n4. 2 hafte mein kard milta hai",
    website: "https://www.nabard.org", helpline: "1800-180-1111"
  },
  {
    id: 4, name: "PM Kusum Yojana", category: "Infrastructure", ministry: "Navikaraneeya Urja Mantralaya",
    isActive: true, deadline: null,
    description: "Kisan apne khetein mein solar pump lagaakar sinchai ki suvidha pa sakte hain aur bijli bachaa sakte hain ya bech sakte hain.",
    benefits: "• 90% subsidy par solar pump\n• Barsa bhar sinchai\n• Bijli bechkar extra kamaai\n• Diesel pump ka kharch khatam",
    eligibility: "• Koi bhi kisan\n• Kisan samooh bhi apply kar sakte hain\n• Panchayat bhi eligible",
    applicationProcess: "1. Rajya sarkar ki noda agency se sampark karein\n2. Aavedan form bharein\n3. Bhoomi vivran dein\n4. 10% advance jama karein",
    website: "https://mnre.gov.in", helpline: "1800-180-3333"
  },
  {
    id: 5, name: "Paramparagat Krishi Vikas Yojana", category: "Subsidies", ministry: "Krishi Mantralaya",
    isActive: true, deadline: null,
    description: "Jevik (organic) kheti ko badhawa dene ke liye sarkar kisan samoohon ko madad deti hai.",
    benefits: "• ₹50,000/hectare teen saalon mein\n• Jevik pramaan patr ki sahayata\n• Bazar se seedha jod\n• Training aur shikshan",
    eligibility: "• 50 ya zyada kisan ka samooh\n• 50 acre zameen ek jagah\n• Jevik kheti ke liye taiyaar",
    applicationProcess: "1. 50 kisanon ka samooh banaayein\n2. Najdeeki krishi karyalay mein aavedan karein\n3. Jevik kheti ka prastaav dein\n4. Prashikshan lein",
    website: "https://pgsindia-ncof.gov.in", helpline: "1800-180-1551"
  },
  {
    id: 6, name: "E-NAM (National Agriculture Market)", category: "Technology", ministry: "Krishi Mantralaya",
    isActive: true, deadline: null,
    description: "Online mandi jo kisan ko poore desh mein apni fasal bechne ki suvidha deti hai — beech wale ko khatam karke.",
    benefits: "• Online bhav milte hain\n• Ghar baith ke boli\n• Jaldi bhugtaan\n• Poore desh mein bazar",
    eligibility: "• Koi bhi Bhartiya kisan\n• Mandi mein registration\n• Mobile/computer zaroori",
    applicationProcess: "1. enam.gov.in par jaayein\n2. Registration karein\n3. Fasal ki jaankari dein\n4. Online boli lagaaein",
    website: "https://enam.gov.in", helpline: "1800-270-0224"
  },
  {
    id: 7, name: "Soil Health Card Yojana", category: "Technology", ministry: "Krishi Mantralaya",
    isActive: true, deadline: null,
    description: "Mitti ki jaanch karke kisan ko khaad ki sahi maatra aur prakar bataya jaata hai.",
    benefits: "• Muft mitti jaanch\n• Sahi khaad ka sujhav\n• Fasal ki upaj mein sudhar\n• Paise ki bachat",
    eligibility: "• Koi bhi kisan\n• Khet ki mitti ka namuna dena hoga",
    applicationProcess: "1. Najdeeki Krishi Vigyan Kendra jaayein\n2. Mitti ka namuna dein\n3. 2-4 hafte mein card milega\n4. Card par diye sujhav follow karein",
    website: "https://soilhealth.dac.gov.in", helpline: "1551"
  },
  {
    id: 8, name: "Rashtriya Krishi Vikas Yojana", category: "Infrastructure", ministry: "Krishi Mantralaya",
    isActive: true, deadline: null,
    description: "Krishi se judi infra suvidhaon ko behtar banane ke liye rajya sarkaron ko madad di jaati hai.",
    benefits: "• Godam nirman mein madad\n• Bazar se jodne ki suvidha\n• Sinchai ki vyavastha\n• Yantra kharidne par subsidy",
    eligibility: "• Rajya sarkar ke zariye milta hai\n• Kisan samiti ya FPO\n• Vyaktigat kisan bhi apply kar sakte hain",
    applicationProcess: "1. Rajya krishi vibhag se sampark karein\n2. Pariyojana prastaav banaayein\n3. DPR jama karein\n4. Rajya committee ki swikriti le",
    website: "https://rkvy.nic.in", helpline: "1800-180-1551"
  },
];

export default function Schemes() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = ["all", "Subsidies", "Insurance", "Credit", "Infrastructure", "Technology"];

  const filtered = useMemo(() => {
    return ALL_SCHEMES.filter(s => {
      const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || s.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-primary">Sarkari Yojanaayein</h1>
        <p className="text-lg text-muted-foreground mt-2">Kheti se judi sarkari yojanaayein, anudan aur sahayata ki jaankari.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-muted/30 p-4 rounded-xl ring-1 ring-border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Yojana khojein..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-background border-border h-11" />
        </div>
        <div className="w-full sm:w-[250px]">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-background border-border h-11">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Sabhi Prakar" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat === "all" ? "Sabhi Prakar" : cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(scheme => (
            <Card key={scheme.id} className="flex flex-col border-none ring-1 ring-border hover:ring-primary/50 transition-all bg-card overflow-hidden">
              <div className="h-2 bg-secondary w-full" />
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-semibold">{scheme.category}</Badge>
                  {scheme.isActive ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold hover:bg-emerald-500/20 px-2 py-0.5">Active</Badge>
                  ) : (
                    <Badge variant="secondary" className="font-bold">Bandh</Badge>
                  )}
                </div>
                <CardTitle className="text-xl leading-tight text-foreground line-clamp-2">{scheme.name}</CardTitle>
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mt-2">
                  <Landmark className="h-3.5 w-3.5" />
                  <span className="truncate">{scheme.ministry}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <p className="text-sm text-foreground/80 line-clamp-3 leading-relaxed">{scheme.description}</p>
                {scheme.deadline && (
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                    <AlertCircle className="h-4 w-4" /> Akhiri Tarikh: {new Date(scheme.deadline).toLocaleDateString("hi-IN")}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 pb-5 px-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full font-semibold border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground group transition-all">
                      Puri Jaankari <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl p-0 overflow-hidden border-none ring-1 ring-border">
                    <div className="bg-primary p-6 text-primary-foreground">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-white/20 text-white hover:bg-white/30 border-none">{scheme.category}</Badge>
                        {scheme.isActive && <Badge className="bg-emerald-500 text-white border-none">Active</Badge>}
                      </div>
                      <DialogTitle className="text-2xl font-bold leading-tight">{scheme.name}</DialogTitle>
                      <DialogDescription className="text-primary-foreground/80 mt-2 text-base font-medium flex items-center gap-2">
                        <Landmark className="h-4 w-4" /> {scheme.ministry}
                      </DialogDescription>
                    </div>
                    <ScrollArea className="max-h-[60vh] p-6 bg-background">
                      <div className="space-y-6">
                        <section>
                          <h4 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-primary" /> Yojana Ke Baare Mein
                          </h4>
                          <p className="text-foreground/80 leading-relaxed text-sm">{scheme.description}</p>
                        </section>
                        <div className="grid md:grid-cols-2 gap-6">
                          <section className="bg-muted/30 p-4 rounded-xl ring-1 ring-border">
                            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Mukhya Laabh
                            </h4>
                            <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">{scheme.benefits}</p>
                          </section>
                          <section className="bg-muted/30 p-4 rounded-xl ring-1 ring-border">
                            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-secondary" /> Yogyata
                            </h4>
                            <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">{scheme.eligibility}</p>
                          </section>
                        </div>
                        <section>
                          <h4 className="text-lg font-bold text-foreground mb-2">Aavedan Kaise Karein</h4>
                          <div className="bg-primary/5 p-4 rounded-xl ring-1 ring-primary/20 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                            {scheme.applicationProcess}
                          </div>
                        </section>
                        {(scheme.website || scheme.helpline) && (
                          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                            {scheme.website && (
                              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <a href={scheme.website} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" /> Sarkari Portal
                                </a>
                              </Button>
                            )}
                            {scheme.helpline && (
                              <Button variant="outline" asChild className="border-border text-foreground hover:bg-muted">
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
        <div className="text-center py-16 px-4 bg-muted/20 rounded-xl ring-1 ring-border">
          <Landmark className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-foreground">Koi yojana nahi mili</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">Doosre shabd try karein ya filter saaf karein.</p>
          <Button variant="outline" className="mt-6" onClick={() => { setSearch(""); setCategory("all"); }}>Filter Saaf Karein</Button>
        </div>
      )}
    </div>
  );
}
