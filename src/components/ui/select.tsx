import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          className={cn(
            "flex h-10 w-full rounded-none border border-[#c8c5bc] bg-[#ede9df]/40 px-3 py-2 text-sm text-[#1c281a] placeholder:text-slate-400/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c281a]/20 focus-visible:border-[#1c281a] focus-visible:bg-[#ede9df]/80 transition-all disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer pr-10",
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
