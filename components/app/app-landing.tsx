import { Download, Check, ImageIcon, icons, type LucideIcon } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AppConfig, AppLanding as Landing } from "@/content/apps/apps.config";

/** Resolve a lucide.dev kebab-case icon name (e.g. `bell-ring`) to its component. */
function landingIcon(name?: string): LucideIcon {
  if (!name) return Check;
  const key = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  return icons[key as keyof typeof icons] ?? Check;
}

/** Marketing landing for an App's home, à la minshot/1Capture. All copy and
    media come from `landing` in apps.config; screenshot falls back to a
    placeholder until a real asset is provided. */
export function AppLanding({ app, landing }: { app: AppConfig; landing: Landing }) {
  const dl = landing.downloadCta?.href ?? app.external?.download ?? "#";
  const downloadLabel = landing.downloadCta?.label ?? "下载 App";

  return (
    <Container width="content" className="py-12 sm:py-16">
      {/* Hero */}
      <section>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{landing.headline ?? app.name}</h1>
        {landing.subhead && <p className="mt-3 max-w-xl text-base text-fg-muted">{landing.subhead}</p>}
        <div className="mt-6">
          <Button render={<a href={dl} target="_blank" rel="noreferrer" />} className="gap-2 rounded-full px-5">
            <Download size={16} /> {downloadLabel}
          </Button>
        </div>
      </section>

      {/* Screenshot */}
      <section className="-mx-6 mt-12">
        {landing.screenshot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={landing.screenshot} alt={`${app.name} 截图`} className="w-full" />
        ) : (
          <div className="flex aspect-[16/10] w-full items-center justify-center border-y border-dashed border-border-strong bg-bg-card text-fg-subtle">
            <span className="flex items-center gap-2 text-sm">
              <ImageIcon size={16} /> 产品截图占位
            </span>
          </div>
        )}
      </section>

      {/* Features */}
      {landing.features?.length ? (
        <section className="mt-16">
          {landing.featuresTitle && (
            <h2 className="mb-6 text-xl font-semibold tracking-tight">{landing.featuresTitle}</h2>
          )}
          <ul className="space-y-4">
            {landing.features.map((f) => {
              const Icon = landingIcon(f.icon);
              return (
                <li key={f.title} className="flex gap-3">
                  <Icon size={18} className="mt-0.5 shrink-0 text-brand" />
                  <p className="text-fg">
                    <span className="font-medium">{f.title}</span>
                    <span className="text-fg-muted"> &nbsp;—&nbsp; {f.desc}</span>
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {/* Pricing */}
      {landing.plans?.length ? (
        <section className="mt-16">
          {landing.pricingTitle && (
            <h2 className="text-xl font-semibold tracking-tight">{landing.pricingTitle}</h2>
          )}
          {landing.pricingSubtitle && <p className="mt-2 text-fg-muted">{landing.pricingSubtitle}</p>}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {landing.plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "flex flex-col rounded-xl border bg-bg-card p-6 shadow-sm",
                  plan.featured ? "border-brand" : "border-border"
                )}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold">{plan.name}</span>
                  <span className="text-fg-muted">{plan.price}</span>
                  {plan.note && <span className="text-sm text-fg-subtle">· {plan.note}</span>}
                </div>
                <ul className="mt-4 flex-1 space-y-2">
                  {plan.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-fg-muted">
                      <Check size={15} className="mt-0.5 shrink-0 text-brand" />
                      {item}
                    </li>
                  ))}
                </ul>
                {plan.cta && (
                  <Button
                    variant={plan.featured ? "default" : "outline"}
                    className="mt-6 w-full"
                    render={<a href={plan.cta.href} target="_blank" rel="noreferrer" />}
                  >
                    {plan.cta.label}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
