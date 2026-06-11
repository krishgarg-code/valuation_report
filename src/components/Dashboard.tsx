"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import {
  FileText,
  Download,
  RefreshCw,
  Eye,
  AlertTriangle,
  Loader2,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { valuationFormSchema, defaultValuationValues, emptyValuationValues, ValuationFormValues } from "@/lib/form-schema";
import { FormWizard } from "@/components/FormWizard";
import { LivePreview } from "@/components/LivePreview";
import { PdfReport } from "@/components/PdfReport";
import { generateAndDownloadDocx } from "@/lib/docx-builder";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isPdfLoading, setIsPdfLoading] = React.useState(false);
  const [isDocxLoading, setIsDocxLoading] = React.useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Initialize Form
  const form = useForm<ValuationFormValues>({
    resolver: zodResolver(valuationFormSchema),
    defaultValues: emptyValuationValues,
  });

  const currentValues = form.watch();

  // Dark Mode Toggle
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Handle PDF Download
  const handleDownloadPdf = async () => {
    setIsPdfLoading(true);
    try {
      const doc = <PdfReport values={currentValues} />;
      const blob = await pdf(doc).toBlob();
      const ownerName = currentValues.owners?.[0]?.ownerName || "Property";
      saveAs(blob, `Valuation_Report_${ownerName.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Failed to generate PDF. Please verify your inputs.");
    } finally {
      setIsPdfLoading(false);
    }
  };

  // Handle PDF Print
  const handlePrint = async () => {
    setIsPdfLoading(true);
    try {
      const doc = <PdfReport values={currentValues} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        }, 1000);
      };
    } catch (error) {
      console.error("Print error:", error);
      alert("Failed to open print dialog.");
    } finally {
      setIsPdfLoading(false);
    }
  };

  // Handle DOCX Download
  const handleDownloadDocx = () => {
    setIsDocxLoading(true);
    try {
      generateAndDownloadDocx(currentValues);
    } catch (error) {
      console.error("DOCX generation error:", error);
      alert("Failed to generate DOCX report.");
    } finally {
      setIsDocxLoading(false);
    }
  };

  // Handle New Report Reset
  const handleNewReport = () => {
    form.reset(emptyValuationValues);
    setIsResetConfirmOpen(false);
    setCurrentStep(0);
  };

  // Handle Form Submission (Verification Step)
  const onSubmit = (data: ValuationFormValues) => {
    setIsPreviewOpen(true);
  };

  const steps = [
    { title: "Bank & Purpose Info", index: "01" },
    { title: "Owner Information", index: "02" },
    { title: "Location Details", index: "03" },
    { title: "Boundaries & Dimensions", index: "04" },
    { title: "Site Characteristics", index: "05" },
    { title: "Building specifications", index: "06" },
    { title: "Valuation calculator", index: "07" },
    { title: "Document Uploads", index: "08" },
  ];

  return (
    <div className="min-h-screen flex flex-row bg-[#f3efe6] dark:bg-slate-950 text-[#1c281a] transition-colors duration-200">
      
      {/* 1. LEFT SIDEBAR NAVIGATION (Desktop Only) */}
      <aside className="hidden lg:flex w-[290px] border-r border-[#2c3d2a] bg-[#1c281a] text-slate-100 flex-col h-screen sticky top-0 shrink-0 select-none">
        
        {/* Brand Header matching reference design */}
        <div className="p-6 border-b border-[#2c3d2a]/60 shrink-0">
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight text-white leading-tight uppercase font-sans">
              VALUATION <span className="text-[#b8c070]">REPORT</span>
            </h1>
          </div>
        </div>

        {/* Steps List matching reference design */}
        <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {steps.map((step, idx) => {
            const isActive = idx === currentStep;
            return (
              <div key={idx} className="border-b border-[#2c3d2a]/40 pb-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(idx)}
                  className="w-full text-left group flex flex-col focus:outline-none"
                >
                  <span className={`text-[9px] font-black tracking-widest uppercase mb-1 transition-colors ${
                    isActive ? "text-[#b8c070]" : "text-slate-500/80"
                  }`}>
                    STEP {step.index}
                  </span>
                  <span className={`font-serif italic text-base transition-all ${
                    isActive 
                      ? "text-white underline decoration-1 underline-offset-4" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}>
                    {step.title}
                  </span>
                </button>
              </div>
            );
          })}
        </nav>

        {/* Footer info matching design */}
        <div className="p-6 border-t border-[#2c3d2a]/60 shrink-0 space-y-4 bg-[#172115]">
          <button
            type="button"
            onClick={() => form.reset(defaultValuationValues)}
            className="w-full text-left flex items-center gap-2 text-xs text-[#b8c070] hover:text-[#c7cf80] font-black tracking-wider uppercase transition-colors focus:outline-none"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Load Demo Data</span>
          </button>
        </div>
      </aside>

      {/* 2. RIGHT MAIN PANEL */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header Bar matching reference design colors */}
        <header className="bg-[#f6f4ed]/90 backdrop-blur border-b border-[#c8c5bc]/50 px-8 py-4 flex items-center justify-between shrink-0 z-30 select-none">
          
          {/* Active Step Details */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden h-9 w-9 text-[#1c281a] border-[#1c281a] rounded-none bg-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-4.5 w-4.5" />
            </Button>
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#1c281a] font-sans">
                {steps[currentStep].title}
              </h2>
            </div>
          </div>

          {/* Action Controls - Reset and Generate only */}
          <div className="flex items-center gap-5">
            {/* Reset Link Text Button */}
            <button
              type="button"
              className="text-xs font-black tracking-widest uppercase text-[#1c281a]/85 hover:text-[#1c281a] hover:underline focus:outline-none transition-all cursor-pointer"
              onClick={() => setIsResetConfirmOpen(true)}
            >
              Reset Form
            </button>

            {/* Generate Button Group */}
            <button
              type="button"
              className="h-9 bg-[#1c281a] hover:bg-[#2a3c27] text-white text-[10px] font-black tracking-widest uppercase px-5 transition-colors focus:outline-none cursor-pointer border border-[#1c281a]"
              onClick={() => setIsPreviewOpen(true)}
            >
              Generate Report
            </button>
          </div>
        </header>

        {/* Dynamic Mobile Stepper Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-[#1c281a] text-white border-b border-[#2c3d2a] overflow-hidden shrink-0 z-20 flex flex-col"
            >
              <div className="grid grid-cols-2 gap-2 p-4">
                {steps.map((step, idx) => {
                  const isActive = idx === currentStep;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCurrentStep(idx);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-left p-2.5 border transition-all text-xs flex flex-col ${
                        isActive
                          ? "bg-[#b8c070] border-[#b8c070] text-[#1c281a] font-black"
                          : "bg-[#2a3c27]/50 border-[#2c3d2a] text-slate-300"
                      }`}
                    >
                      <span className="text-[8px] opacity-75 font-black tracking-widest uppercase">STEP {step.index}</span>
                      <span className="truncate mt-0.5 font-serif italic">{step.title}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2 p-4 border-t border-[#2c3d2a] bg-[#172115]">
                <button
                  className="flex-1 h-8 text-[10px] font-black tracking-widest uppercase text-[#b8c070] border border-[#b8c070]/40 hover:bg-[#b8c070]/10 transition-colors focus:outline-none flex items-center justify-center gap-1"
                  onClick={() => {
                    form.reset(defaultValuationValues);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <RefreshCw className="h-3 w-3" /> Load Demo
                </button>
                <button
                  className="flex-1 h-8 text-[10px] font-black tracking-widest uppercase text-white border border-white/20 hover:bg-white/10 transition-colors focus:outline-none"
                  onClick={() => {
                    setIsResetConfirmOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Reset Form
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Workspace — warm cream background */}
        <div className="flex-1 overflow-hidden p-6 bg-[#f3efe6] relative">
          <div className="h-full max-w-7xl mx-auto flex flex-col w-full">
            <FormWizard 
              form={form} 
              onSubmit={onSubmit} 
              currentStep={currentStep} 
              setCurrentStep={setCurrentStep} 
            />
          </div>
        </div>

      </div>

      {/* MODAL 1: Scrollable Certificate Preview Dialog */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c281a]/70 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="bg-[#f0ede6] border-2 border-[#1c281a] rounded-none overflow-hidden shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col"
            >
              {/* Header */}
              <div className="bg-[#f0ede6] px-8 py-5 border-b border-[#1c281a]/20 flex items-start justify-between">
                <div>
                  <h3 className="font-black text-2xl tracking-tight text-[#1c281a] uppercase" style={{fontFamily: 'var(--font-oswald), Georgia, sans-serif'}}>
                    Preview
                  </h3>
                </div>
                <button
                  type="button"
                  className="text-[#1c281a]/40 hover:text-[#1c281a] transition-colors p-1 focus:outline-none"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable document */}
              <div className="flex-1 overflow-y-auto bg-[#e6e2da] relative">
                <div className="h-full w-full min-h-[500px]">
                  <LivePreview control={form.control} hideHeader={true} theme="warm" />
                </div>
              </div>

              {/* Footer */}
              <div className="bg-[#f0ede6] px-8 py-4 border-t border-[#1c281a]/20 flex flex-wrap items-center justify-end gap-3">

                <button
                  type="button"
                  className="bg-[#b8c070] hover:bg-[#a8b060] text-[#1c281a] font-black tracking-widest px-6 h-10 uppercase text-[10px] transition-colors focus:outline-none disabled:opacity-50 flex items-center gap-2"
                  onClick={handleDownloadPdf}
                  disabled={isPdfLoading}
                >
                  {isPdfLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  Download PDF
                </button>

                <button
                  type="button"
                  className="bg-[#1c281a] hover:bg-[#2a3c27] text-white font-black tracking-widest px-6 h-10 uppercase text-[10px] transition-colors focus:outline-none disabled:opacity-50 flex items-center gap-2"
                  onClick={handleDownloadDocx}
                  disabled={isDocxLoading}
                >
                  {isDocxLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  Download DOCX
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Reset Form Confirmation Dialog */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c281a]/70 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-[#f0ede6] border-2 border-[#1c281a] rounded-none p-8 shadow-2xl w-full max-w-md"
            >
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-black text-base uppercase tracking-wider text-[#1c281a]">Clear Current Report?</h3>
                  <p className="text-sm text-[#1c281a]/60 mt-2 leading-relaxed">
                    Are you sure you want to start fresh? All typed details and uploaded photos will be permanently cleared.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#1c281a]/10">
                <button
                  className="border border-[#1c281a] bg-transparent hover:bg-[#1c281a]/5 text-[#1c281a] font-black tracking-widest px-5 h-9 uppercase text-[10px] transition-colors focus:outline-none"
                  onClick={() => setIsResetConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-700 hover:bg-red-800 text-white font-black tracking-widest px-5 h-9 uppercase text-[10px] transition-colors focus:outline-none flex items-center gap-2"
                  onClick={handleNewReport}
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Start Fresh
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
