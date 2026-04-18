import { cn } from "@/lib/utils";
import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'accent' | 'secondary' | 'muted' | 'outline';
  shape?: 'pill' | 'square';
}

export function Badge({ className, variant = 'accent', shape = 'pill', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center border-4 border-neo-ink px-3 py-1 text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#000]",
        {
          'bg-neo-accent text-white': variant === 'accent',
          'bg-neo-secondary text-neo-ink': variant === 'secondary',
          'bg-neo-muted text-neo-ink': variant === 'muted',
          'bg-white text-neo-ink': variant === 'outline',
          'rounded-full': shape === 'pill',
          'rounded-none': shape === 'square',
        },
        className
      )}
      {...props}
    />
  );
}
