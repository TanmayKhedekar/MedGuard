"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck, ShieldAlert, Download, RotateCcw, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ReportDisplayProps {
  report?: string | null;
  error?: string | null;
  onReset: () => void;
}

export function ReportDisplay({ report, error, onReset }: ReportDisplayProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (error) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Verification Failed</CardTitle>
          <CardDescription>An error occurred during the verification process.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={onReset} className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!report) {
    return null; // Or a loading state if needed
  }

  const isSuspicious = report.toLowerCase().includes('suspicious') || report.toLowerCase().includes('discrepancies') || report.toLowerCase().includes('recalled');
  
  const handleDownload = () => {
    if(!isClient) return;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MedGuard-Verification-Report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="shadow-lg animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-2xl">Verification Report</CardTitle>
                <CardDescription>
                    This is an AI-generated summary of the verification checks.
                </CardDescription>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-md ${isSuspicious ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-600'}`}>
                {isSuspicious ? <ShieldAlert className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
                <span className="font-bold text-lg">{isSuspicious ? "Suspicious" : "Verified"}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 p-4 rounded-lg h-80 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                {report}
            </pre>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button variant="outline" onClick={handleDownload} disabled={!isClient}>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
        <Button onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Start New Verification
        </Button>
      </CardFooter>
    </Card>
  );
}
