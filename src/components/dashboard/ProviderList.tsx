import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Eye, AlertCircle, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProviderDetails } from "./ProviderDetails";
import { localStorageService, Provider } from "@/lib/localStorage";

interface ProviderListProps {
  reviewOnly?: boolean;
}

export const ProviderList = ({ reviewOnly = false }: ProviderListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = () => {
    setIsLoading(true);
    const allProviders = localStorageService.getProviders();
    setProviders(allProviders);
    setIsLoading(false);
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.npi.includes(searchQuery) ||
      provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = reviewOnly ? provider.status === "needs_review" : true;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: Provider["status"]) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="gap-1 bg-success/10 text-success hover:bg-success/20">
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </Badge>
        );
      case "processing":
        return (
          <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/20">
            <Clock className="w-3 h-3" />
            Processing
          </Badge>
        );
      case "needs_review":
        return (
          <Badge className="gap-1 bg-warning/10 text-warning hover:bg-warning/20">
            <AlertCircle className="w-3 h-3" />
            Needs Review
          </Badge>
        );
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-success";
    if (confidence >= 75) return "text-primary";
    return "text-warning";
  };

  if (selectedProvider) {
    return (
      <ProviderDetails
        provider={selectedProvider}
        onBack={() => setSelectedProvider(null)}
      />
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {reviewOnly ? "Review Queue" : "All Providers"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading ? "Loading..." : `${filteredProviders.length} provider${filteredProviders.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadProviders}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, NPI, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NPI</TableHead>
              <TableHead>Provider Name</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Last Validated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProviders.map((provider) => (
              <TableRow key={provider.id} className="hover:bg-muted/50">
                <TableCell className="font-mono text-sm">{provider.npi}</TableCell>
                <TableCell className="font-medium">{provider.name}</TableCell>
                <TableCell>{provider.specialty}</TableCell>
                <TableCell>{getStatusBadge(provider.status)}</TableCell>
                <TableCell>
                  <span className={`font-semibold ${getConfidenceColor(provider.confidence)}`}>
                    {provider.confidence.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{provider.lastValidated}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProvider(provider)}
                    className="gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
