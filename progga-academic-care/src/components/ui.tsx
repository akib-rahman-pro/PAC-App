import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden", className)}>
    {children}
  </div>
);

export const Badge = ({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default' | 'outline' | 'secondary' | 'destructive', className?: string }) => {
  const variants = {
    default: "bg-stone-900 text-white",
    outline: "border border-stone-200 text-stone-900",
    secondary: "bg-stone-100 text-stone-900",
    destructive: "bg-red-100 text-red-900"
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
};
