import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-none border border-[#c8c5bc] bg-[#ede9df]/40 px-3 py-2 text-sm text-[#1c281a] placeholder:text-slate-400/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c281a]/20 focus-visible:border-[#1c281a] focus-visible:bg-[#ede9df]/80 transition-all disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
