import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "destructive" | "outline";
};

const variantClasses = {
  default: "bg-slate-900 text-white",
  success: "bg-emerald-100 text-emerald-700",
  destructive: "bg-red-100 text-red-600",
  outline: "border border-slate-200 text-slate-600",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-[1.75rem] items-center rounded-full px-3 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
