import { useState } from "react";
import { useListGovernmentSchemes, getListGovernmentSchemesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Landmark, Search, Filter, ArrowRight, ExternalLink, PhoneCall, CheckCircle2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Schemes() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const { data: schemes, isLoading } = useListGovernmentSchemes(
    { search: search || undefined, category: category !== "all" ? category : undefined },
    { query: { queryKey: getListGovernmentSchemesQueryKey({ search: search || undefined, category: category !== "all" ? category : undefined }) } }
  );

  const categories = ["all", "Subsidies", "Insurance", "Credit", "Infrastructure", "Technology"];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-primary">Government Schemes</h1>
        <p className="text-lg text-muted-foreground mt-2">Discover and apply for agricultural grants, subsidies, and support programs.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-muted/30 p-4 rounded-xl ring-1 ring-border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search schemes by name or keyword..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background border-border h-11"
          />
        </div>
        <div className="w-full sm:w-[250px]">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-background border-border h-11">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse border-none ring-1 ring-border">
              <CardHeader className="h-24 bg-muted/50 rounded-t-xl" />
              <CardContent className="h-32 bg-background" />
              <CardFooter className="h-16 bg-muted/20" />
            </Card>
          ))}
        </div>
      ) : schemes && schemes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {schemes.map(scheme => (
            <Card key={scheme.id} className="flex flex-col border-none ring-1 ring-border hover:ring-primary/50 transition-all hover-elevate bg-card overflow-hidden">
              <div className="h-2 bg-secondary w-full" />
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-semibold">{scheme.category}</Badge>
                  {scheme.isActive ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold hover:bg-emerald-500/20 px-2 py-0.5">Active</Badge>
                  ) : (
                    <Badge variant="secondary" className="font-bold">Closed</Badge>
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
                    <AlertCircle className="h-4 w-4" /> Deadline: {new Date(scheme.deadline).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 pb-5 px-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full font-semibold border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground group transition-all">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
                            <AlertCircle className="h-5 w-5 text-primary" /> About the Scheme
                          </h4>
                          <p className="text-foreground/80 leading-relaxed text-sm">{scheme.description}</p>
                        </section>

                        <div className="grid md:grid-cols-2 gap-6">
                          <section className="bg-muted/30 p-4 rounded-xl ring-1 ring-border">
                            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Key Benefits
                            </h4>
                            <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">{scheme.benefits}</p>
                          </section>
                          <section className="bg-muted/30 p-4 rounded-xl ring-1 ring-border">
                            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-secondary" /> Eligibility
                            </h4>
                            <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">{scheme.eligibility}</p>
                          </section>
                        </div>

                        <section>
                          <h4 className="text-lg font-bold text-foreground mb-2">Application Process</h4>
                          <div className="bg-primary/5 p-4 rounded-xl ring-1 ring-primary/20 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                            {scheme.applicationProcess}
                          </div>
                        </section>
                        
                        {(scheme.website || scheme.helpline) && (
                          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                            {scheme.website && (
                              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <a href={scheme.website} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" /> Official Portal
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
          <h3 className="text-xl font-bold text-foreground">No schemes found</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">We couldn't find any schemes matching your criteria. Try adjusting your filters or search terms.</p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => { setSearch(""); setCategory("all"); }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
