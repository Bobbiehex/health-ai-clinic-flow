
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PatientManagement from "./pages/PatientManagement";
import Appointments from "./pages/Appointments";
import Resources from "./pages/Resources";
import Analytics from "./pages/Analytics";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/" element={isAuthenticated ? <Dashboard /> : <Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<PatientManagement />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
