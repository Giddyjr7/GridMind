import * as React from "react";
import { cn } from "@/lib/utils";

export interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AuthCard({ children, className, ...props }: AuthCardProps) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-white/[0.08] bg-[#0c1410]/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AuthCardBody({ children, className, ...props }: AuthCardProps) {
  return (
    <div className={cn("p-6 sm:p-8 space-y-5", className)} {...props}>
      {children}
    </div>
  );
}

export function AuthCardFooter({ children, className, ...props }: AuthCardProps) {
  return (
    <div
      className={cn(
        "p-5 sm:p-6 bg-white/[0.02] border-t border-white/[0.06] flex flex-col gap-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
