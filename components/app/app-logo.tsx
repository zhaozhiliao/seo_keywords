import { cn } from "@/lib/utils";
import type { AppConfig } from "@/lib/apps";

const SIZES = {
  sm: { box: "h-5 w-5 rounded-[4px] text-[11px]", img: "h-5 w-5 rounded-[4px]" },
  md: { box: "h-6 w-6 rounded-md text-[13px]", img: "h-6 w-6 rounded-md" },
  lg: { box: "h-9 w-9 rounded-lg text-sm", img: "h-9 w-9 rounded-lg" },
  xl: { box: "h-14 w-14 rounded-xl text-xl shadow-md", img: "h-14 w-14 rounded-xl shadow-md" },
} as const;

/** App icon from config, or a letter mark fallback. */
export function AppLogo({
  app,
  size = "md",
  className,
}: {
  app: AppConfig;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  if (app.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={app.logo}
        alt={app.name}
        className={cn(SIZES[size].img, "object-cover", className)}
      />
    );
  }

  return (
    <span
      className={cn(
        SIZES[size].box,
        "flex shrink-0 items-center justify-center font-bold text-white",
        className
      )}
      style={{ background: app.brandColor ?? "var(--brand)" }}
    >
      {app.name.charAt(0)}
    </span>
  );
}
