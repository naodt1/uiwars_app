import { cn } from "@/lib/utils";
import React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-none border-4 border-neo-ink bg-white px-4 py-2 font-bold text-lg text-neo-ink transition-colors",
          "placeholder:text-neo-ink/40",
          "focus-visible:bg-neo-secondary focus-visible:shadow-[4px_4px_0px_0px_#000] focus-visible:outline-none focus-visible:ring-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
