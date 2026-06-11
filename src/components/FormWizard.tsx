import * as React from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "./ui/button";
import { ValuationFormValues } from "@/lib/form-schema";
import {
  Step1BankDetails,
  Step2OwnerDetails,
  Step3PropertyDetails,
  Step4SiteDetails,
  Step5SiteCharacteristics,
  Step6BuildingDetails,
  Step7ValuationEngine,
  Step8FileUploads,
} from "./FormSteps";

interface FormWizardProps {
  form: UseFormReturn<ValuationFormValues>;
  onSubmit: (data: ValuationFormValues) => void;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export function FormWizard({ form, onSubmit, currentStep, setCurrentStep }: FormWizardProps) {
  const steps = [
    { title: "Bank", component: <Step1BankDetails /> },
    { title: "Owners", component: <Step2OwnerDetails /> },
    { title: "Property", component: <Step3PropertyDetails /> },
    { title: "Site", component: <Step4SiteDetails /> },
    { title: "Local", component: <Step5SiteCharacteristics /> },
    { title: "Structure", component: <Step6BuildingDetails /> },
    { title: "Valuation", component: <Step7ValuationEngine /> },
    { title: "Uploads", component: <Step8FileUploads /> },
  ];

  const totalSteps = steps.length;

  const nextStep = async () => {
    // Validate fields inside current step before proceeding
    let triggerFields: any[] = [];
    if (currentStep === 0) {
      triggerFields = ["branchName", "inspectionDate", "valuationDate"];
    } else if (currentStep === 1) {
      triggerFields = ["owners"];
    } else if (currentStep === 2) {
      triggerFields = ["plotNumber", "village", "taluka", "district", "postalAddress"];
    } else if (currentStep === 3) {
      triggerFields = ["plotArea", "coveredArea", "numberOfFloors"];
    } else if (currentStep === 6) {
      triggerFields = ["marketRate", "guidelineRate", "constructionRate"];
    }

    const isStepValid = triggerFields.length > 0 ? await form.trigger(triggerFields) : true;
    if (isStepValid) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-full font-sans text-[#1c281a]">
        {/* Form Container (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="bg-[#fcfbfa] border-2 border-[#1c281a] p-8 md:p-12 rounded-none shadow-sm space-y-8">
            
            {/* Giant Blocky Step Heading matching reference design */}
            <div className="pb-5 border-b border-[#1c281a]/12">
              <h1
                className="text-5xl md:text-6xl font-black tracking-tight text-[#1c281a] uppercase leading-none"
                style={{ fontFamily: "var(--font-oswald), 'Arial Black', sans-serif" }}
              >
                STEP {String(currentStep + 1).padStart(2, "0")}
              </h1>
            </div>

            {/* Step form contents */}
            <div>
              {steps[currentStep].component}
            </div>
          </div>
        </div>

        {/* Navigation Actions Footer */}
        <div className="flex items-center justify-between border-t border-[#c8c5bc]/40 pt-4 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 h-10 px-6 font-black tracking-widest uppercase text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Button>

          {currentStep < totalSteps - 1 ? (
            <Button
              type="button"
              variant="default"
              onClick={nextStep}
              className="flex items-center gap-1.5 h-10 px-7 font-black tracking-widest uppercase text-xs bg-[#1c281a] hover:bg-[#2a3c27] text-white"
            >
              Next Step <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="default"
              className="flex items-center gap-1.5 h-10 px-7 font-black tracking-widest uppercase text-xs bg-[#1c281a] hover:bg-[#2a3c27] text-white"
            >
              Verify &amp; Complete <Check className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
