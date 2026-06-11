"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const Dashboard = dynamic(() => import("@/components/Dashboard"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-2" />
      <span className="text-sm font-medium">Loading valuation workspace...</span>
    </div>
  ),
});

export default function Page() {
  return <Dashboard />;
}
