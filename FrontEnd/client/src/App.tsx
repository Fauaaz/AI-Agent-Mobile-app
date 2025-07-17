import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Upload from "@/pages/upload";
import StudyGuides from "@/pages/study-guides";
import MockTests from "@/pages/mock-tests";
import Chat from "@/pages/chat";
import Reminders from "@/pages/reminders";
import Library from "@/pages/library";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/sidebar";

function Router() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/upload" component={Upload} />
          <Route path="/study-guides" component={StudyGuides} />
          <Route path="/mock-tests" component={MockTests} />
          <Route path="/chat" component={Chat} />
          <Route path="/reminders" component={Reminders} />
          <Route path="/library" component={Library} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
