import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoLoaderProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export default function LogoLoader({
  fullScreen = true,
  size = "md",
  text,
  className,
}: LogoLoaderProps) {
  const iconSizeClasses = {
    sm: "w-10 h-10 rounded-xl",
    md: "w-14 h-14 rounded-2xl",
    lg: "w-20 h-20 rounded-3xl",
  };

  const homeIconClasses = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-10 h-10",
  };

  const textClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white select-none",
        fullScreen
          ? "min-h-screen w-full fixed inset-0 z-50"
          : "w-full py-12 min-h-[220px]",
        className
      )}
      aria-label="Loading DhakaStay..."
      role="status"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated Brand Icon */}
        <div className="relative flex items-center justify-center">
          {/* Subtle Ambient Glow */}
          <div
            className={cn(
              "absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse pointer-events-none",
              size === "lg" ? "scale-150" : "scale-125"
            )}
          />

          {/* Logo Badge */}
          <div
            className={cn(
              "relative bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 ring-4 ring-emerald-500/20 transition-all duration-300 animate-pulse",
              iconSizeClasses[size]
            )}
          >
            <Home className={cn("text-white shrink-0", homeIconClasses[size])} />
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "font-bold tracking-tight text-slate-900 dark:text-white",
              textClasses[size]
            )}
          >
            Dhaka<span className="text-emerald-600 dark:text-emerald-400">Stay</span>
          </div>

          {text && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium animate-pulse">
              {text}
            </p>
          )}

          {/* Modern Indeterminate Progress Bar */}
          <div className="w-24 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-emerald-500 rounded-full w-1/2 animate-[pulse_1.2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}
