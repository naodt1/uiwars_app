import { cn } from "@/lib/utils";
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-bold uppercase tracking-wide transition-all duration-100",
          "border-4 border-neo-ink rounded-none shadow-[4px_4px_0px_0px_#000]",
          "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:shadow-[6px_6px_0px_0px_#000]",
          "disabled:opacity-50 disabled:pointer-events-none",
          {
            'bg-neo-accent text-white hover:brightness-95': variant === 'primary',
            'bg-neo-secondary text-neo-ink hover:brightness-95': variant === 'secondary',
            'bg-white text-neo-ink': variant === 'outline',
            'border-2 border-transparent shadow-none active:shadow-none hover:border-neo-ink hover:shadow-[4px_4px_0px_0px_#000]': variant === 'ghost',
            'h-12 px-6 py-2 text-sm': size === 'default',
            'h-10 px-4 text-xs': size === 'sm',
            'h-14 px-8 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
