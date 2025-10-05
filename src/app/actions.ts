"use server";

import { generateVerificationReport, type GenerateVerificationReportInput, type GenerateVerificationReportOutput } from "@/ai/flows/generate-verification-report";

export async function getVerificationReportAction(input: GenerateVerificationReportInput): Promise<GenerateVerificationReportOutput> {
  // Add a small delay to simulate network latency and processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    const result = await generateVerificationReport(input);
    return result;
  } catch (error) {
    console.error("Error generating verification report:", error);
    throw new Error("Failed to generate verification report. The AI service may be temporarily unavailable.");
  }
}
