import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { UploadSection } from "@/components/dashboard/UploadSection";
import { ProviderList } from "@/components/dashboard/ProviderList";
import { AgentActivity } from "@/components/dashboard/AgentActivity";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "providers" | "review">("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {activeTab === "dashboard" && (
          <>
            <StatsCards />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <UploadSection />
              </div>
              <div>
                <AgentActivity />
              </div>
            </div>
          </>
        )}
        
        {activeTab === "providers" && (
          <ProviderList />
        )}
        
        {activeTab === "review" && (
          <ProviderList reviewOnly />
        )}
      </main>
    </div>
  );
};

export default Index;
