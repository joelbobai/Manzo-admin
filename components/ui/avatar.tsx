import Image from "next/image";

import { cn } from "@/lib/utils";

type AvatarProps = {
  src?: string;
  alt: string;
  name: string;
  className?: string;
};

export function Avatar({ src, alt, name, className }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={40}
          height={40}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span>{initials || alt[0]?.toUpperCase() || "?"}</span>
      )}
    </div>
  );
}
