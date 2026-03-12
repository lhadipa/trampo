import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import WorkerProfile from "./pages/WorkerProfile.tsx";
import CompanyProfile from "./pages/CompanyProfile.tsx";
import Availability from "./pages/Availability.tsx";
import CreateJob from "./pages/CreateJob.tsx";
import UrgentRequest from "./pages/UrgentRequest.tsx";
import Auth from "./pages/Auth.tsx";
import Dashboard from "./pages/Dashboard.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/painel" element={<Dashboard />} />
            <Route path="/trabalhador/:id" element={<WorkerProfile />} />
            <Route path="/empresa/:id" element={<CompanyProfile />} />
            <Route path="/disponibilidade" element={<Availability />} />
            <Route path="/criar-vaga" element={<CreateJob />} />
            <Route path="/urgente" element={<UrgentRequest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
