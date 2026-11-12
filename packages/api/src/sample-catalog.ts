import type { components } from "./client";

type Schemas = components["schemas"];
export type CatalogLocale = "en" | "fa";
type Text = Record<CatalogLocale, string>;
type Kind = Schemas["ProductKind"];

/** The unit of the sample prices: Toman, chosen by the sample store settings like a real backend would. */
export const SAMPLE_CURRENCY = "IRT";

interface SampleCategory {
  slug: string;
  parent?: string;
  name: Text;
}

interface SampleProduct {
  slug: string;
  category: string;
  kind: Kind;
  name: Text;
  summary: Text;
  description: Text;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  attributes: { name: Text; value: Text }[];
}

const t = (en: string, fa: string): Text => ({ en, fa });

/** Four top-level categories, each with sub-categories (digital goods, books and culture, courses, supermarket). */
export const SAMPLE_CATEGORIES: readonly SampleCategory[] = [
  { slug: "digital-goods", name: t("Digital goods", "کالاهای دیجیتال") },
  {
    slug: "software",
    parent: "digital-goods",
    name: t("Software and licenses", "نرم‌افزار و لایسنس"),
  },
  { slug: "gift-cards", parent: "digital-goods", name: t("Gift cards", "کارت هدیه") },
  {
    slug: "templates",
    parent: "digital-goods",
    name: t("Templates and design files", "قالب و فایل طراحی"),
  },
  { slug: "books-culture", name: t("Books and culture", "کتاب و فرهنگ") },
  { slug: "books", parent: "books-culture", name: t("Books", "کتاب‌ها") },
  { slug: "stationery", parent: "books-culture", name: t("Stationery", "لوازم تحریر") },
  { slug: "online-courses", name: t("Online courses", "دوره‌های آنلاین") },
  { slug: "programming", parent: "online-courses", name: t("Programming", "برنامه‌نویسی") },
  { slug: "languages", parent: "online-courses", name: t("Languages", "زبان") },
  { slug: "design", parent: "online-courses", name: t("Design", "طراحی") },
  { slug: "supermarket", name: t("Supermarket and food", "سوپرمارکت و کالاهای خوراکی") },
  { slug: "snacks", parent: "supermarket", name: t("Nuts and snacks", "آجیل و تنقلات") },
  { slug: "beverages", parent: "supermarket", name: t("Tea and beverages", "چای و نوشیدنی") },
  { slug: "breakfast", parent: "supermarket", name: t("Breakfast", "صبحانه") },
];

const attribute = (name: [string, string], value: [string, string]) => ({
  name: t(...name),
  value: t(...value),
});

/** Oldest first; "newest" sorts the other way round. */
export const SAMPLE_PRODUCTS: readonly SampleProduct[] = [
  {
    slug: "photo-editor-license",
    category: "software",
    kind: "digital",
    name: t("Photo editor, 1-year license", "لایسنس یک‌ساله نرم‌افزار ویرایش عکس"),
    summary: t(
      "Activation code by message, ready in a minute.",
      "کد فعال‌سازی با پیام، آماده در یک دقیقه.",
    ),
    description: t(
      "A one-year license for a photo editor on two devices. The activation code arrives right after payment.",
      "لایسنس یک‌ساله نرم‌افزار ویرایش عکس برای دو دستگاه. کد فعال‌سازی بلافاصله بعد از پرداخت ارسال می‌شود.",
    ),
    price: 890000,
    compareAtPrice: 1100000,
    inStock: true,
    attributes: [attribute(["Delivery", "تحویل"], ["Instant", "آنی"])],
  },
  {
    slug: "music-gift-card",
    category: "gift-cards",
    kind: "digital",
    name: t("Music streaming gift card, 3 months", "کارت هدیهٔ موسیقی، ۳ ماهه"),
    summary: t("A code you can send to anyone.", "کدی که می‌توانید برای هر کسی بفرستید."),
    description: t(
      "Three months of ad-free music streaming. Send the code as a gift or use it yourself.",
      "سه ماه پخش موسیقی بدون تبلیغ. کد را هدیه بدهید یا خودتان استفاده کنید.",
    ),
    price: 450000,
    inStock: true,
    attributes: [attribute(["Delivery", "تحویل"], ["Instant", "آنی"])],
  },
  {
    slug: "resume-template-pack",
    category: "templates",
    kind: "digital",
    name: t("Resume template pack", "بستهٔ قالب رزومه"),
    summary: t("Twelve editable layouts.", "دوازده قالب قابل‌ویرایش."),
    description: t(
      "Twelve clean resume layouts in editable files, with a short guide on what to write.",
      "دوازده قالب مرتب رزومه در فایل‌های قابل‌ویرایش، همراه راهنمای کوتاه نوشتن.",
    ),
    price: 120000,
    inStock: true,
    attributes: [attribute(["Files", "فایل‌ها"], ["12", "۱۲"])],
  },
  {
    slug: "bright-nights-novel",
    category: "books",
    kind: "physical",
    name: t("Bright Nights (novel)", "شب‌های روشن (رمان)"),
    summary: t(
      "A quiet novel about a city that never sleeps.",
      "رمانی آرام دربارهٔ شهری که نمی‌خوابد.",
    ),
    description: t(
      "A paperback novel of 320 pages, easy to read in a few evenings.",
      "رمانی ۳۲۰ صفحه‌ای با جلد شومیز که در چند شب خوانده می‌شود.",
    ),
    price: 185000,
    inStock: true,
    attributes: [attribute(["Pages", "تعداد صفحه"], ["320", "۳۲۰"])],
  },
  {
    slug: "photography-guide",
    category: "books",
    kind: "physical",
    name: t("Photography Guide", "راهنمای عکاسی"),
    summary: t("From the first shot to a finished photo.", "از اولین عکس تا تصویر نهایی."),
    description: t(
      "A practical guide with exercises for phone and camera photographers.",
      "راهنمایی کاربردی همراه با تمرین برای عکاسان موبایل و دوربین.",
    ),
    price: 240000,
    compareAtPrice: 290000,
    inStock: true,
    attributes: [attribute(["Pages", "تعداد صفحه"], ["208", "۲۰۸"])],
  },
  {
    slug: "home-cooking",
    category: "books",
    kind: "physical",
    name: t("Home Cooking", "آشپزی خانگی"),
    summary: t("Sixty simple recipes for every day.", "شصت دستور ساده برای هر روز."),
    description: t(
      "Recipes with short ingredient lists and clear steps.",
      "دستورهایی با مواد اولیهٔ کم و مرحله‌های روشن.",
    ),
    price: 210000,
    inStock: false,
    attributes: [attribute(["Pages", "تعداد صفحه"], ["176", "۱۷۶"])],
  },
  {
    slug: "a5-notebook",
    category: "stationery",
    kind: "physical",
    name: t("A5 Notebook", "دفترچهٔ A5"),
    summary: t("Hardcover, 120 dotted pages.", "جلد سخت، ۱۲۰ صفحهٔ نقطه‌ای."),
    description: t(
      "A hardcover A5 notebook with thick paper that does not bleed through.",
      "دفترچهٔ A5 با جلد سخت و کاغذ ضخیم که پشت صفحه نمی‌زند.",
    ),
    price: 95000,
    inStock: true,
    attributes: [attribute(["Size", "اندازه"], ["A5", "A5"])],
  },
  {
    slug: "gel-pen-set",
    category: "stationery",
    kind: "physical",
    name: t("Gel Pen Set", "ست خودکار ژله‌ای"),
    summary: t("Eight colors, 0.5 mm tip.", "هشت رنگ، نوک ۰٫۵ میلی‌متر."),
    description: t(
      "A set of eight smooth gel pens in a small case.",
      "مجموعهٔ هشت‌تایی خودکار ژله‌ای روان در یک جعبهٔ کوچک.",
    ),
    price: 68000,
    compareAtPrice: 85000,
    inStock: true,
    attributes: [attribute(["Pieces", "تعداد"], ["8", "۸"])],
  },
  {
    slug: "python-from-zero",
    category: "programming",
    kind: "course",
    name: t("Python from zero", "پایتون از صفر"),
    summary: t("Forty lessons, with exercises.", "چهل درس همراه با تمرین."),
    description: t(
      "A beginner course that goes from the first line to a small finished project.",
      "دورهٔ مقدماتی که از اولین خط کد تا یک پروژهٔ کوچک کامل پیش می‌رود.",
    ),
    price: 1450000,
    compareAtPrice: 1800000,
    inStock: true,
    attributes: [
      attribute(["Duration", "مدت"], ["18 hours", "۱۸ ساعت"]),
      attribute(["Level", "سطح"], ["Beginner", "مقدماتی"]),
    ],
  },
  {
    slug: "web-basics-html-css",
    category: "programming",
    kind: "course",
    name: t("Web basics: HTML and CSS", "مبانی وب: HTML و CSS"),
    summary: t("Build and publish your first page.", "اولین صفحهٔ وب خود را بسازید و منتشر کنید."),
    description: t(
      "Learn the structure and style of a web page by building three real pages.",
      "ساختار و ظاهر یک صفحهٔ وب را با ساختن سه صفحهٔ واقعی یاد بگیرید.",
    ),
    price: 980000,
    inStock: true,
    attributes: [
      attribute(["Duration", "مدت"], ["12 hours", "۱۲ ساعت"]),
      attribute(["Level", "سطح"], ["Beginner", "مقدماتی"]),
    ],
  },
  {
    slug: "english-conversation",
    category: "languages",
    kind: "course",
    name: t("English conversation", "مکالمهٔ انگلیسی"),
    summary: t("Speak from the first week.", "از هفتهٔ اول صحبت کنید."),
    description: t(
      "Short daily lessons that build speaking confidence with real situations.",
      "درس‌های کوتاه روزانه که با موقعیت‌های واقعی اعتمادبه‌نفس صحبت کردن می‌سازد.",
    ),
    price: 1200000,
    inStock: true,
    attributes: [
      attribute(["Duration", "مدت"], ["24 hours", "۲۴ ساعت"]),
      attribute(["Level", "سطح"], ["Elementary", "ابتدایی"]),
    ],
  },
  {
    slug: "ui-design-basics",
    category: "design",
    kind: "course",
    name: t("UI design basics", "مبانی طراحی رابط کاربری"),
    summary: t("Layout, color and type for apps.", "چیدمان، رنگ و تایپوگرافی برای اپلیکیشن."),
    description: t(
      "Design clear screens for phones and the web, step by step, with a final project.",
      "طراحی صفحه‌های روشن برای موبایل و وب، مرحله به مرحله و با یک پروژهٔ پایانی.",
    ),
    price: 1100000,
    inStock: true,
    attributes: [
      attribute(["Duration", "مدت"], ["15 hours", "۱۵ ساعت"]),
      attribute(["Level", "سطح"], ["Beginner", "مقدماتی"]),
    ],
  },
  {
    slug: "roasted-pistachios",
    category: "snacks",
    kind: "physical",
    name: t("Roasted pistachios, 500 g", "پستهٔ برشته، ۵۰۰ گرم"),
    summary: t("Lightly salted, vacuum packed.", "نمک‌ملایم، بسته‌بندی وکیوم."),
    description: t(
      "Fresh roasted pistachios in a resealable vacuum pack.",
      "پستهٔ تازه برشته در بستهٔ وکیوم قابل‌بستن.",
    ),
    price: 520000,
    inStock: true,
    attributes: [attribute(["Weight", "وزن"], ["500 g", "۵۰۰ گرم"])],
  },
  {
    slug: "green-tea-100",
    category: "beverages",
    kind: "physical",
    name: t("Green tea, 100 bags", "چای سبز، ۱۰۰ عددی"),
    summary: t("Light and fresh, individually wrapped.", "سبک و خوش‌عطر، بسته‌بندی تکی."),
    description: t(
      "A hundred individually wrapped green tea bags.",
      "صد عدد چای کیسه‌ای سبز با بسته‌بندی تکی.",
    ),
    price: 240000,
    compareAtPrice: 280000,
    inStock: true,
    attributes: [attribute(["Count", "تعداد"], ["100", "۱۰۰"])],
  },
  {
    slug: "natural-honey-1kg",
    category: "breakfast",
    kind: "physical",
    name: t("Natural honey, 1 kg", "عسل طبیعی، ۱ کیلوگرم"),
    summary: t("From a local beekeeper.", "از زنبوردار محلی."),
    description: t(
      "Raw honey from a local beekeeper, in a glass jar.",
      "عسل خام از یک زنبوردار محلی، در شیشهٔ دربسته.",
    ),
    price: 680000,
    inStock: true,
    attributes: [attribute(["Weight", "وزن"], ["1 kg", "۱ کیلوگرم"])],
  },
];

const bySlug = new Map(SAMPLE_CATEGORIES.map((category) => [category.slug, category]));

/** The category and its ancestors, from the top-level category down. */
function pathTo(slug: string): SampleCategory[] {
  const path: SampleCategory[] = [];
  for (let current = bySlug.get(slug); current; current = bySlug.get(current.parent ?? "")) {
    path.unshift(current);
  }
  return path;
}

/** A category plus every category below it. */
function subtree(slug: string): Set<string> {
  const slugs = new Set<string>([slug]);
  for (const category of SAMPLE_CATEGORIES) {
    if (category.parent && slugs.has(category.parent)) slugs.add(category.slug);
  }
  return slugs;
}

export function toCategory(category: SampleCategory, locale: CatalogLocale): Schemas["Category"] {
  const inside = subtree(category.slug);
  return {
    slug: category.slug,
    name: category.name[locale],
    ...(category.parent ? { parentSlug: category.parent } : {}),
    productCount: SAMPLE_PRODUCTS.filter((product) => inside.has(product.category)).length,
  };
}

export function toSummary(
  product: SampleProduct,
  locale: CatalogLocale,
): Schemas["ProductSummary"] {
  return {
    id: `p-${String(SAMPLE_PRODUCTS.indexOf(product) + 1).padStart(3, "0")}`,
    slug: product.slug,
    name: product.name[locale],
    summary: product.summary[locale],
    price: product.price,
    ...(product.compareAtPrice ? { compareAtPrice: product.compareAtPrice } : {}),
    kind: product.kind,
    categorySlug: product.category,
    inStock: product.inStock,
  };
}

export function toProduct(product: SampleProduct, locale: CatalogLocale): Schemas["Product"] {
  const { id, slug, name, summary, price, compareAtPrice, kind, inStock } = toSummary(
    product,
    locale,
  );
  const path = pathTo(product.category).map((category) => ({
    slug: category.slug,
    name: category.name[locale],
  }));
  return {
    id,
    slug,
    name,
    ...(summary ? { summary } : {}),
    description: product.description[locale],
    price,
    ...(compareAtPrice ? { compareAtPrice } : {}),
    kind,
    images: [],
    category: path[path.length - 1] ?? { slug: product.category, name: product.category },
    categoryPath: path,
    attributes: product.attributes.map((item) => ({
      name: item.name[locale],
      value: item.value[locale],
    })),
    inStock,
  };
}

export type ProductSort = "newest" | "price_asc" | "price_desc";

export interface ProductQuery {
  locale: CatalogLocale;
  category?: string;
  q?: string;
  sort: ProductSort;
  page: number;
  pageSize: number;
}

/** Filters by category (and everything below it) and text, sorts, and returns one page. */
export function queryProducts(query: ProductQuery): Schemas["ProductPage"] {
  const text = query.q?.trim().toLowerCase();
  const inside = query.category ? subtree(query.category) : undefined;
  const matching = SAMPLE_PRODUCTS.filter(
    (product) =>
      (!inside || (bySlug.has(query.category ?? "") && inside.has(product.category))) &&
      (!text ||
        product.name[query.locale].toLowerCase().includes(text) ||
        product.summary[query.locale].toLowerCase().includes(text)),
  );
  const sorted =
    query.sort === "newest"
      ? [...matching].reverse()
      : [...matching].sort((a, b) =>
          query.sort === "price_asc" ? a.price - b.price : b.price - a.price,
        );
  const start = (query.page - 1) * query.pageSize;
  return {
    items: sorted.slice(start, start + query.pageSize).map((p) => toSummary(p, query.locale)),
    page: query.page,
    pageSize: query.pageSize,
    total: sorted.length,
    totalPages: Math.ceil(sorted.length / query.pageSize),
  };
}

export const findSampleProduct = (slug: string): SampleProduct | undefined =>
  SAMPLE_PRODUCTS.find((product) => product.slug === slug);
