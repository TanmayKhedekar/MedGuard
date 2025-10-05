'use server';

/**
 * @fileOverview This file defines the generateVerificationReport flow, which generates a comprehensive report summarizing the authenticity check for a medicine.
 *
 * @fileOverview
 * - generateVerificationReport - A function that handles the generation of a medicine verification report.
 * - GenerateVerificationReportInput - The input type for the generateVerificationReport function.
 * - GenerateVerificationReportOutput - The return type for the generateVerificationReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVerificationReportInputSchema = z.object({
  ocrText: z.string().describe('The text extracted from the medicine packaging using OCR.'),
  barcodeData: z.string().describe('The data extracted from the barcode or QR code on the packaging.'),
  imageAnalysisResults: z
    .string()
    .describe('The results of the image analysis comparing the uploaded images with a reference database.'),
  databaseMatches: z.string().describe('Information about matches found in the database of genuine medicines.'),
});
export type GenerateVerificationReportInput = z.infer<typeof GenerateVerificationReportInputSchema>;

const GenerateVerificationReportOutputSchema = z.object({
  report: z.string().describe('A comprehensive report summarizing the authenticity check for the medicine.'),
});
export type GenerateVerificationReportOutput = z.infer<typeof GenerateVerificationReportOutputSchema>;

export async function generateVerificationReport(
  input: GenerateVerificationReportInput
): Promise<GenerateVerificationReportOutput> {
  return generateVerificationReportFlow(input);
}

const generateVerificationReportPrompt = ai.definePrompt({
  name: 'generateVerificationReportPrompt',
  input: {schema: GenerateVerificationReportInputSchema},
  output: {schema: GenerateVerificationReportOutputSchema},
  prompt: `You are an expert in medicine verification and authenticity.
  Based on the following information, generate a comprehensive verification report summarizing the authenticity check for the medicine.

  OCR Text: {{{ocrText}}}
  Barcode Data: {{{barcodeData}}}
  Image Analysis Results: {{{imageAnalysisResults}}}
  Database Matches: {{{databaseMatches}}}

  Write a detailed report, including all the details, and all potential discrepancies and their severity. Conclude with an overall assessment of the medicine's authenticity.
  Be very thorough.
  `,
});

const generateVerificationReportFlow = ai.defineFlow(
  {
    name: 'generateVerificationReportFlow',
    inputSchema: GenerateVerificationReportInputSchema,
    outputSchema: GenerateVerificationReportOutputSchema,
  },
  async input => {
    const {output} = await generateVerificationReportPrompt(input);
    return output!;
  }
);
