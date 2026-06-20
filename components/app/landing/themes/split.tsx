import { AppLogo } from "@/components/app/app-logo";
import { GridDevOverlay } from "@/components/app/grid-dev-overlay";
import { Container } from "@/components/ui/container";

import {
  LandingFeatures,
  LandingHeroCtas,
  LandingPricing,
  LandingScreenshotCard,
  resolveLandingData,
  type LandingThemeProps,
} from "../shared";

/** Modular grid landing — hero + screenshot side-by-side on large screens. */
export function SplitLanding({ app, landing }: LandingThemeProps) {
  const cta = resolveLandingData(app, landing);

  return (
    <Container width="page" className="py-12 sm:py-16">
      <div className="grid-page-shell">
        <div className="grid-page">
          <div className="grid-band">
            <div className="landing-col-hero">
              <AppLogo app={app} size="xl" className="mb-6" />
              <h1 className="display-headline text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {landing.headline ?? app.name}
              </h1>
              {landing.subhead && (
                <p className="mt-4 max-w-xl text-pretty text-base text-fg-muted sm:text-lg">{landing.subhead}</p>
              )}
              <div className="mt-8">
                <LandingHeroCtas {...cta} />
              </div>
            </div>

            <div className="landing-col-media mt-10 lg:mt-0">
              <LandingScreenshotCard app={app} landing={landing} />
            </div>
          </div>

          {landing.features?.length ? (
            <div className="grid-band pt-8">
              <div className="landing-col-full">
                <LandingFeatures landing={landing} layout="grid" />
              </div>
            </div>
          ) : null}

          {landing.plans?.length ? (
            <div className="grid-band pt-8">
              <div className="landing-col-full">
                <LandingPricing landing={landing} />
              </div>
            </div>
          ) : null}
        </div>
        <GridDevOverlay />
      </div>
    </Container>
  );
}
