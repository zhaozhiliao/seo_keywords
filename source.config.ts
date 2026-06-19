import { defineDocs, defineCollections, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";

/* Shared frontmatter for blog-style entries (personal + app). */
const blogSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string().or(z.date()).optional(),
  tags: z.array(z.string()).optional(),
});

/* App docs frontmatter — keep `order` for sidebar sorting. */
const appDocSchema = frontmatterSchema.extend({
  order: z.number().optional(),
});

/* App changelog entry — one MDX file per version. */
const changelogSchema = z.object({
  version: z.string(),
  date: z.string().or(z.date()),
  title: z.string(),
  description: z.string().optional(),
});

/* ── Personal docs (with page tree via meta.json) ── */
export const docs = defineDocs({
  dir: "content/docs",
});

/* ── Personal blog ── */
export const blog = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: blogSchema,
});

/* ── App content — docs + changelog are parallel sections per App, filtered by
   app slug in lib/content.ts. Relative paths look like
   `app1/docs/getting-started.mdx` and `app1/changelog/v1.8.0.mdx`. ── */
export const appDocs = defineCollections({
  type: "doc",
  dir: "content/apps",
  files: ["*/docs/**/*.mdx"],
  schema: appDocSchema,
});

export const appChangelog = defineCollections({
  type: "doc",
  dir: "content/apps",
  files: ["*/changelog/*.mdx"],
  schema: changelogSchema,
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: { light: "github-light", dark: "github-dark" },
    },
  },
});
