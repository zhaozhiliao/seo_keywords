import type { AppConfig, AppLanding as Landing, AppLandingTheme } from "@/content/apps/app-types";

import { DEFAULT_LANDING_THEME } from "./shared";
import { LANDING_THEMES } from "./themes";

/** Marketing landing for an App's home — theme from `landing.theme` in app config. */
export function AppLanding({ app, landing }: { app: AppConfig; landing: Landing }) {
  const theme: AppLandingTheme = landing.theme ?? DEFAULT_LANDING_THEME;
  const Theme = LANDING_THEMES[theme] ?? LANDING_THEMES[DEFAULT_LANDING_THEME];
  return <Theme app={app} landing={landing} />;
}
