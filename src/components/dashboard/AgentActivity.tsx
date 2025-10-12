import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, CheckCircle2, Loader2 } from "lucide-react";

const agents = [
  {
    name: "Validation Agent",
    status: "active",
    task: "Validating NPI 1234567890",
    progress: 85,
  },
  {
    name: "Enrichment Agent",
    status: "active",
    task: "Scraping license data",
    progress: 62,
  },
  {
    name: "QA Agent",
    status: "completed",
    task: "Reviewed 5 providers",
    progress: 100,
  },
  {
    name: "Management Agent",
    status: "idle",
    task: "Awaiting tasks",
    progress: 0,
  },
];

export const AgentActivity = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Bot className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-foreground">Agent Activity</h3>
      </div>

      <div className="space-y-4">
        {agents.map((agent) => (
          <div key={agent.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm text-foreground">{agent.name}</p>
                  {agent.status === "active" ? (
                    <Loader2 className="w-3 h-3 text-primary animate-spin" />
                  ) : agent.status === "completed" ? (
                    <CheckCircle2 className="w-3 h-3 text-success" />
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">{agent.task}</p>
              </div>
              <Badge
                variant={agent.status === "active" ? "default" : agent.status === "completed" ? "secondary" : "outline"}
                className="text-xs"
              >
                {agent.status}
              </Badge>
            </div>
            
            {agent.status === "active" && (
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary transition-all duration-300"
                  style={{ width: `${agent.progress}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
