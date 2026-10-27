import { prisma } from "@/lib/db";
import {
  getHeroSettings,
  getStoreContactSettings,
  getSeoSettings,
  getGeneralSettings,
  getDealOfTheDaySettings,
} from "@/lib/settings";
import SettingsFormClient from "./SettingsFormClient";

export const dynamic = "force-dynamic";

export interface CatalogProductOption {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  series: string | null;
  features: string[];
}

export default async function AdminSettingsPage() {
  const [heroSettings, contactSettings, seoSettings, generalSettings, dealSettings, rawProducts] =
    await Promise.all([
      getHeroSettings(),
      getStoreContactSettings(),
      getSeoSettings(),
      getGeneralSettings(),
      getDealOfTheDaySettings(),
      prisma.product.findMany({
        where: { isDraft: false },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          images: true,
          series: true,
          specs: true,
        },
        orderBy: { name: "asc" },
      }),
    ]);

  const catalogProducts: CatalogProductOption[] = rawProducts.map((p) => {
    let features: string[] = [];
    if (p.specs && typeof p.specs === "object" && !Array.isArray(p.specs)) {
      const specsObj = p.specs as Record<string, unknown>;
      features = Object.entries(specsObj)
        .filter(([, v]) => typeof v === "string" && v.trim().length > 0)
        .slice(0, 4)
        .map(([k, v]) => `${k}: ${String(v)}`);
    }

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      images: p.images,
      series: p.series,
      features,
    };
  });

  return (
    <SettingsFormClient
      initialHero={heroSettings}
      initialContact={contactSettings}
      initialSeo={seoSettings}
      initialGeneral={generalSettings}
      initialDeal={dealSettings}
      catalogProducts={catalogProducts}
    />
  );
}

