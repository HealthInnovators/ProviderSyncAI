import { useState, useEffect } from "react";
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { localStorageService } from "@/lib/localStorage";

export const StatsCards = () => {
  const [stats, setStats] = useState({
    verifiedProviders: 0,
    processingProviders: 0,
    needsReviewProviders: 0,
    avgConfidence: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const allStats = localStorageService.getStats();
    const providers = localStorageService.getProviders();
    
    // Calculate average confidence
    const avgConfidence = providers.length > 0 
      ? providers.reduce((sum, p) => sum + p.confidence, 0) / providers.length 
      : 0;

    setStats({
      verifiedProviders: allStats.verifiedProviders,
      processingProviders: allStats.processingProviders,
      needsReviewProviders: allStats.needsReviewProviders,
      avgConfidence: Math.round(avgConfidence * 10) / 10,
    });
  };

  const statsData = [
    {
      label: "Verified Providers",
      value: stats.verifiedProviders.toString(),
      change: "Ready for use",
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "In Progress",
      value: stats.processingProviders.toString(),
      change: "Processing",
      icon: Clock,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Needs Review",
      value: stats.needsReviewProviders.toString(),
      change: "Requires attention",
      icon: AlertCircle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Avg Confidence",
      value: `${stats.avgConfidence}%`,
      change: "Overall accuracy",
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
