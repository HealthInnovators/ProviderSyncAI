import { Activity, Database, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  activeTab: "dashboard" | "providers" | "review";
  setActiveTab: (tab: "dashboard" | "providers" | "review") => void;
}

export const DashboardHeader = ({ activeTab, setActiveTab }: DashboardHeaderProps) => {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">ProviderSync AI</h1>
              <p className="text-sm text-muted-foreground">Intelligent Healthcare Directory Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              System Active
            </div>
          </div>
        </div>
        
        <nav className="flex gap-2">
          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            onClick={() => setActiveTab("dashboard")}
            className="gap-2"
          >
            <Activity className="w-4 h-4" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === "providers" ? "default" : "ghost"}
            onClick={() => setActiveTab("providers")}
            className="gap-2"
          >
            <Database className="w-4 h-4" />
            All Providers
          </Button>
          <Button
            variant={activeTab === "review" ? "default" : "ghost"}
            onClick={() => setActiveTab("review")}
            className="gap-2"
          >
            <FileCheck className="w-4 h-4" />
            Review Queue
          </Button>
        </nav>
      </div>
    </header>
  );
};
