// Schema.org JSON-LD type definitions for the Schema Builder.

export type FieldKind = "text" | "textarea" | "url" | "date" | "faq" | "breadcrumb";

export interface SchemaField {
  key: string;
  label: string;
  kind: FieldKind;
  placeholder?: string;
}

export interface SchemaType {
  id: string;
  label: string;
  schemaType: string;
  fields: SchemaField[];
}

export const SCHEMA_TYPES: SchemaType[] = [
  {
    id: "article",
    label: "文章 Article",
    schemaType: "Article",
    fields: [
      { key: "headline", label: "标题 headline", kind: "text", placeholder: "文章标题" },
      { key: "description", label: "摘要 description", kind: "textarea", placeholder: "一句话摘要" },
      { key: "image", label: "封面图 URL", kind: "url", placeholder: "https://example.com/cover.jpg" },
      { key: "author", label: "作者 author", kind: "text", placeholder: "作者姓名" },
      { key: "datePublished", label: "发布日期", kind: "date" },
      { key: "dateModified", label: "修改日期", kind: "date" },
      { key: "url", label: "页面 URL", kind: "url", placeholder: "https://example.com/post" },
    ],
  },
  {
    id: "faq",
    label: "常见问题 FAQ",
    schemaType: "FAQPage",
    fields: [{ key: "faq", label: "问答列表", kind: "faq" }],
  },
  {
    id: "product",
    label: "产品 Product",
    schemaType: "Product",
    fields: [
      { key: "name", label: "名称 name", kind: "text", placeholder: "产品名称" },
      { key: "description", label: "描述 description", kind: "textarea" },
      { key: "image", label: "产品图 URL", kind: "url" },
      { key: "brand", label: "品牌 brand", kind: "text" },
      { key: "sku", label: "SKU", kind: "text" },
      { key: "price", label: "价格 price", kind: "text", placeholder: "99.00" },
      { key: "priceCurrency", label: "货币 priceCurrency", kind: "text", placeholder: "USD" },
      { key: "url", label: "产品页 URL", kind: "url" },
    ],
  },
  {
    id: "breadcrumb",
    label: "面包屑 Breadcrumb",
    schemaType: "BreadcrumbList",
    fields: [{ key: "breadcrumb", label: "层级列表", kind: "breadcrumb" }],
  },
  {
    id: "organization",
    label: "组织 Organization",
    schemaType: "Organization",
    fields: [
      { key: "name", label: "名称 name", kind: "text" },
      { key: "url", label: "官网 URL", kind: "url" },
      { key: "logo", label: "Logo URL", kind: "url" },
      { key: "description", label: "简介 description", kind: "textarea" },
      { key: "sameAs", label: "社交主页（逗号分隔）", kind: "textarea", placeholder: "https://twitter.com/...,https://...", },
    ],
  },
];

export interface FaqItem {
  q: string;
  a: string;
}
export interface CrumbItem {
  name: string;
  url: string;
}

export interface SchemaFormState {
  [key: string]: string | FaqItem[] | CrumbItem[];
}

/** Build a JSON-LD object from the form state for a given type. */
export function buildJsonLd(type: SchemaType, state: SchemaFormState): Record<string, unknown> {
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type.schemaType,
  };

  if (type.id === "faq") {
    const items = (state.faq as FaqItem[]) ?? [];
    base.mainEntity = items
      .filter((i) => i.q.trim())
      .map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      }));
    return base;
  }

  if (type.id === "breadcrumb") {
    const items = (state.breadcrumb as CrumbItem[]) ?? [];
    base.itemListElement = items
      .filter((i) => i.name.trim())
      .map((i, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: i.name,
        ...(i.url.trim() ? { item: i.url } : {}),
      }));
    return base;
  }

  for (const field of type.fields) {
    const v = state[field.key];
    if (typeof v !== "string" || !v.trim()) continue;

    if (type.id === "article" && field.key === "author") {
      base.author = { "@type": "Person", name: v };
    } else if (type.id === "product" && field.key === "brand") {
      base.brand = { "@type": "Brand", name: v };
    } else if (field.key === "sameAs") {
      base.sameAs = v.split(",").map((s) => s.trim()).filter(Boolean);
    } else if (field.key === "logo") {
      base.logo = { "@type": "ImageObject", url: v };
    } else {
      base[field.key] = v;
    }
  }

  // Product offers
  if (type.id === "product") {
    const price = state.price as string;
    if (price?.trim()) {
      base.offers = {
        "@type": "Offer",
        price: price.trim(),
        priceCurrency: ((state.priceCurrency as string) || "USD").trim(),
        ...(typeof state.url === "string" && state.url.trim() ? { url: state.url.trim() } : {}),
      };
      delete base.price;
      delete base.priceCurrency;
    }
  }

  return base;
}
