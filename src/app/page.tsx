"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { ImageUploader } from "@/components/pill-patrol/image-uploader";
import { VerificationSteps } from "@/components/pill-patrol/verification-steps";
import { ReportDisplay } from "@/components/pill-patrol/report-display";
import { getVerificationReportAction } from "./actions";

type VerificationState = "idle" | "verifying" | "complete" | "error";

export default function Home() {
  const [verificationState, setVerificationState] =
    useState<VerificationState>("idle");
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (
    packagingImage: File,
    pillImage: File
  ) => {
    setVerificationState("verifying");
    setError(null);
    setReport(null);

    // In a real application, you would upload images and get URLs.
    // For this demo, we proceed directly to calling the AI action.
    
    // Mock data for the AI flow
    const mockInput = {
      ocrText: "Paracetamol 500mg, Batch: XYZ123, Exp: 12/2025. Manufactured by PharmaCo.",
      barcodeData: "GTIN: 01234567890123, SN: 9876543210",
      imageAnalysisResults: "Packaging color saturation is 5% lower than reference. Font kerning on the batch number shows minor deviation. Pill image analysis indicates the color is within tolerance, but the logo imprint is slightly off-center.",
      databaseMatches: "Batch number XYZ123 is valid and registered to PharmaCo, but it was marked as 'recalled' 2 months ago due to packaging defects. No other red flags in the database.",
    };

    try {
      const result = await getVerificationReportAction(mockInput);
      setReport(result.report);
      setVerificationState("complete");
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      setVerificationState("error");
    }
  };

  const handleReset = () => {
    setVerificationState("idle");
    setReport(null);
    setError(null);
  };

  const renderContent = () => {
    switch (verificationState) {
      case "idle":
        return <ImageUploader onVerify={handleVerify} />;
      case "verifying":
        return <VerificationSteps />;
      case "complete":
        return <ReportDisplay report={report!} onReset={handleReset} />;
      case "error":
        return <ReportDisplay error={error} onReset={handleReset} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        MedGuard &copy; {new Date().getFullYear()}. Your trusted partner in medicine verification.
      </footer>
    </div>
  );
}
