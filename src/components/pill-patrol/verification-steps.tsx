"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader, XCircle, CircleDot } from 'lucide-react';

const steps = [
  "Uploading Images",
  "Scanning Barcode & OCR",
  "Analyzing Image Properties",
  "Verifying Against Database",
  "Generating Final Report"
];

const stepDurations = [500, 1500, 2000, 1500, 1000];

export function VerificationSteps() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const totalSteps = steps.length;
    let stepIndex = 0;

    const runNextStep = () => {
      if (stepIndex < totalSteps -1) {
        const timeout = setTimeout(() => {
          stepIndex++;
          setCurrentStep(stepIndex);
          runNextStep();
        }, stepDurations[stepIndex]);
        return () => clearTimeout(timeout);
      }
    };
    
    runNextStep();
    
    // In a real app with real progress, you'd update this based on events from the backend.
  }, []);

  return (
    <Card className="shadow-lg animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Verification in Progress...</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <Loader className="w-16 h-16 text-primary animate-spin mb-6" />
          <ul className="space-y-4 w-full max-w-sm">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const isPending = index > currentStep;

              return (
                <li key={step} className="flex items-center gap-4">
                  <div>
                    {isCompleted && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                    {isCurrent && <Loader className="w-6 h-6 text-primary animate-spin" />}
                    {isPending && <CircleDot className="w-6 h-6 text-muted-foreground" />}
                  </div>
                  <span className={`text-lg ${isCurrent ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                    {step}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="text-muted-foreground mt-8 text-sm">Please wait, this may take a moment.</p>
        </div>
      </CardContent>
    </Card>
  );
}
