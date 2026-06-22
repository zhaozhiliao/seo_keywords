import { loader } from "fumadocs-core/source";
import { echokitDocs, watermindDocs } from "@/.source/server";

/** Per-App docs loaders (Fumadocs page tree). Add one entry per `defineDocs` export. */
const APP_DOCS = {
  echokit: loader({
    baseUrl: "/docs",
    source: echokitDocs.toFumadocsSource(),
  }),
  watermind: loader({
    baseUrl: "/docs",
    source: watermindDocs.toFumadocsSource(),
  }),
} as const;

export type AppDocsSource = (typeof APP_DOCS)[keyof typeof APP_DOCS];

export function getAppDocsSource(app: string): AppDocsSource | undefined {
  return APP_DOCS[app as keyof typeof APP_DOCS];
}

export function appHasDocs(app: string): boolean {
  const src = getAppDocsSource(app);
  return src ? src.getPages().length > 0 : false;
}
