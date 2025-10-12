import { useState, useRef } from "react";
import { Upload, FileText, FileSpreadsheet, X, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { batchProcessor } from "@/lib/batchProcessor";

export const UploadSection = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [batchName, setBatchName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setBatchName(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!batchName.trim()) {
      toast({
        title: "Batch name required",
        description: "Please enter a name for this batch",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProcessedCount(0);
    setTotalCount(0);

    try {
      const result = await batchProcessor.processBatch(
        selectedFile,
        batchName,
        (progress, processed, total) => {
          setProgress(progress);
          setProcessedCount(processed);
          setTotalCount(total);
        }
      );

      if (result.success) {
        toast({
          title: "Batch processing completed",
          description: `Successfully processed ${result.processedCount} providers`,
        });
        setSelectedFile(null);
        setBatchName("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        toast({
          title: "Batch processing failed",
          description: result.errors.join(", "),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setBatchName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Upload Provider Data</h3>
            <p className="text-muted-foreground text-sm">
              Upload CSV files or scanned PDFs to start batch validation
            </p>
          </div>
        </div>

        {!selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                className="gap-2"
                disabled={isProcessing}
              >
                <FileSpreadsheet className="w-4 h-4" />
                Upload CSV
              </Button>
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                variant="outline" 
                className="gap-2"
                disabled={isProcessing}
              >
                <FileText className="w-4 h-4" />
                Upload PDF
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                {selectedFile.name.endsWith('.csv') ? (
                  <FileSpreadsheet className="w-5 h-5 text-primary" />
                ) : (
                  <FileText className="w-5 h-5 text-primary" />
                )}
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                disabled={isProcessing}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Batch Name</label>
                <Input
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  placeholder="Enter batch name..."
                  disabled={isProcessing}
                />
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing...</span>
                    <span>{processedCount} / {totalCount}</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={isProcessing || !batchName.trim()}
                className="w-full gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Start Batch Processing
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="pt-6 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-left">
              <p className="font-medium text-foreground mb-1">Supported Formats</p>
              <p className="text-muted-foreground">CSV, PDF (OCR enabled)</p>
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground mb-1">Batch Size</p>
              <p className="text-muted-foreground">Up to 500 providers per batch</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
