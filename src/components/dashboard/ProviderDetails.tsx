import { ArrowLeft, MapPin, Phone, Mail, Award, Building2, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface Provider {
  id: string;
  npi: string;
  name: string;
  specialty: string;
  status: "verified" | "processing" | "needs_review";
  confidence: number;
  lastValidated: string;
}

interface ProviderDetailsProps {
  provider: Provider;
  onBack: () => void;
}

const dataPoints = [
  {
    field: "Address",
    value: "123 Medical Plaza, Seattle, WA 98101",
    sources: ["NPI Registry", "Google Maps", "State Board"],
    confidence: 98.5,
    icon: MapPin,
  },
  {
    field: "Phone",
    value: "+1 (206) 555-0123",
    sources: ["NPI Registry", "Practice Website"],
    confidence: 95.2,
    icon: Phone,
  },
  {
    field: "Email",
    value: "contact@example.com",
    sources: ["Practice Website"],
    confidence: 87.0,
    icon: Mail,
  },
  {
    field: "License Number",
    value: "MD12345-WA",
    sources: ["State Medical Board"],
    confidence: 99.1,
    icon: Award,
  },
  {
    field: "Practice Name",
    value: "Seattle Heart Center",
    sources: ["NPI Registry", "Practice Website"],
    confidence: 96.3,
    icon: Building2,
  },
  {
    field: "License Expiry",
    value: "December 31, 2025",
    sources: ["State Medical Board"],
    confidence: 99.8,
    icon: Calendar,
  },
];

export const ProviderDetails = ({ provider, onBack }: ProviderDetailsProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-success";
    if (confidence >= 75) return "text-primary";
    return "text-warning";
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to List
      </Button>

      <Card className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{provider.name}</h2>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="font-mono">NPI: {provider.npi}</span>
              <span>•</span>
              <span>{provider.specialty}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-4xl font-bold mb-1 ${getConfidenceColor(provider.confidence)}`}>
              {provider.confidence.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">Overall Confidence</p>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-foreground">Validated Data Points</h3>
          
          <div className="grid gap-4">
            {dataPoints.map((point) => {
              const Icon = point.icon;
              return (
                <Card key={point.field} className="p-4 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">{point.field}</p>
                        <span className={`text-sm font-semibold ${getConfidenceColor(point.confidence)}`}>
                          {point.confidence.toFixed(1)}%
                        </span>
                      </div>
                      
                      <p className="text-foreground">{point.value}</p>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground">Sources:</span>
                        {point.sources.map((source) => (
                          <Badge key={source} variant="secondary" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                      
                      <Progress value={point.confidence} className="h-1.5" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Last validated: {provider.lastValidated}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">Flag for Review</Button>
            <Button>Approve & Update</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
