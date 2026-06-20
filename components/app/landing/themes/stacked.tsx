import { Container } from "@/components/ui/container";

import {
  LandingFeatures,
  LandingHeroCtas,
  LandingPricing,
  LandingScreenshotBleed,
  resolveLandingData,
  type LandingThemeProps,
} from "../shared";

/** Classic vertical landing — hero, full-bleed screenshot, features, pricing. */
export function StackedLanding({ app, landing }: LandingThemeProps) {
  const cta = resolveLandingData(app, landing);

  return (
    <Container width="content" className="py-12 sm:py-16">
      <section>
        <h1 className="display-headline text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          {landing.headline ?? app.name}
        </h1>
        {landing.subhead && (
          <p className="mt-3 max-w-xl text-pretty text-base text-fg-muted">{landing.subhead}</p>
        )}
        <div className="mt-6">
          <LandingHeroCtas {...cta} />
        </div>
      </section>

      <LandingScreenshotBleed app={app} landing={landing} />

      {landing.features?.length ? (
        <div className="mt-16">
          <LandingFeatures landing={landing} layout="list" />
        </div>
      ) : null}

      {landing.plans?.length ? (
        <div className="mt-16">
          <LandingPricing landing={landing} />
        </div>
      ) : null}
    </Container>
  );
}
