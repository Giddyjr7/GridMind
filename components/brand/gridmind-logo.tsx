import Image from "next/image";
import { cn } from "@/lib/utils";

interface GridMindLogoProps {
  compact?: boolean;
  inverse?: boolean;
  className?: string;
  markClassName?: string;
}

export function GridMindLogo({
  compact = false,
  inverse = false,
  className,
  markClassName,
}: GridMindLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className={cn("relative block h-9 w-9 shrink-0", markClassName)}>
        <Image
          src="/brand/gridmind-mark.png"
          alt=""
          fill
          sizes="40px"
          className="object-contain"
          priority
        />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className={cn("block text-base font-bold tracking-tight", inverse ? "text-white" : "text-slate-950")}>
            GridMind
          </span>
        </span>
      )}
    </span>
  );
}
