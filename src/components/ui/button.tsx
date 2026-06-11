import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "premium";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-none text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c281a]/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
          {
            "bg-[#1c281a] text-white hover:bg-[#2a3c27]":
              variant === "default",
            "bg-red-600 text-white hover:bg-red-700 dark:bg-red-900 dark:text-red-50 dark:hover:bg-red-800":
              variant === "destructive",
            "border border-[#1c281a] bg-transparent text-[#1c281a] hover:bg-slate-100/50":
              variant === "outline",
            "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700":
              variant === "secondary",
            "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50":
              variant === "ghost",
            "text-slate-950 underline-offset-4 hover:underline dark:text-slate-50":
              variant === "link",
            "bg-[#1c281a] text-white hover:bg-[#2a3c27] border-none":
              variant === "premium",
          },
          {
            "h-10 px-4 py-2": size === "default",
            "h-9 px-3": size === "sm",
            "h-11 px-8": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
