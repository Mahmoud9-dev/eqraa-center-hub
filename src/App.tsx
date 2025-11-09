import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Quran from "./pages/Quran";
import Tajweed from "./pages/Tajweed";
import Educational from "./pages/Educational";
import Meetings from "./pages/Meetings";
import Suggestions from "./pages/Suggestions";
import Attendance from "./pages/Attendance";
import Exams from "./pages/Exams";
import Sharia from "./pages/Sharia";
import Schedule from "./pages/Schedule";
import Library from "./pages/Library";
import Announcements from "./pages/Announcements";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/tajweed" element={<Tajweed />} />
          <Route path="/educational" element={<Educational />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/sharia" element={<Sharia />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/library" element={<Library />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
