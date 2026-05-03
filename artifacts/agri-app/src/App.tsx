import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";

// Pages
import Dashboard from "@/pages/dashboard";
import DiseaseDetection from "@/pages/disease-detection";
import Weather from "@/pages/weather";
import MarketPrices from "@/pages/market-prices";
import Chatbot from "@/pages/chatbot";
import Schemes from "@/pages/schemes";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const path = queryKey[0] as string;
        const res = await fetch(`${API_BASE}${path}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      }
    }
  }
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/disease-detection" component={DiseaseDetection} />
        <Route path="/weather" component={Weather} />
        <Route path="/market-prices" component={MarketPrices} />
        <Route path="/chatbot" component={Chatbot} />
        <Route path="/schemes" component={Schemes} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
