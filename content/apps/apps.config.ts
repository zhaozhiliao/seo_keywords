/**
 * App registry — aggregates per-App configs from `content/apps/<slug>/app.config.ts`.
 *
 * Add an App:
 * 1. Create `content/apps/<slug>/app.config.ts` (export `<slug>: AppConfig`)
 * 2. Import and append here
 * 3. Add docs/changelog content + `defineDocs` loader (see CLAUDE.md)
 *
 * Landing themes (`landing.theme`): `stacked` (vertical) | `split` (grid hero).
 */
export type {
  AppConfig,
  AppFooterConfig,
  AppFooterColumn,
  AppFooterLink,
  AppLanding,
  AppLandingTheme,
} from "./app-types";

import type { AppConfig } from "./app-types";
import { echokit } from "./echokit/app.config";
import { watermind } from "./watermind/app.config";

export const apps: AppConfig[] = [echokit, watermind];
