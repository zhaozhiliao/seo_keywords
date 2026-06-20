import type { ComponentType } from "react";
import type { AppLandingTheme } from "@/content/apps/app-types";

import { SplitLanding } from "./split";
import { StackedLanding } from "./stacked";
import type { LandingThemeProps } from "../shared";

export const LANDING_THEMES: Record<AppLandingTheme, ComponentType<LandingThemeProps>> = {
  stacked: StackedLanding,
  split: SplitLanding,
};
