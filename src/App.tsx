import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import WorkerProfile from "./pages/WorkerProfile.tsx";
import CompanyProfile from "./pages/CompanyProfile.tsx";
import Availability from "./pages/Availability.tsx";
import CreateJob from "./pages/CreateJob.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/trabalhador/:id" element={<WorkerProfile />} />
          <Route path="/empresa/:id" element={<CompanyProfile />} />
          <Route path="/disponibilidade" element={<Availability />} />
          <Route path="/criar-vaga" element={<CreateJob />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
