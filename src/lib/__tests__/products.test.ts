import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "../db";
import { getFeaturedProducts, getProducts, getProductBySlug, createProduct, cleanProductTitle } from "../products";

async function cleanupQueryTestProducts() {
  try {
    await prisma.product.deleteMany({
      where: {
        OR: [
          { slug: "test-query-product-slug" },
          { name: { contains: "Test Hasta Yatağı Pro", mode: "insensitive" } },
        ],
      },
    });
  } catch {}
}

describe("product queries", () => {
  const TEST_SLUG = "test-query-product-slug";

  beforeAll(async () => {
    await cleanupQueryTestProducts();

    let category = await prisma.category.findFirst();
    if (!category) {
      category = await prisma.category.create({
        data: { name: "Medikal Yataklar", slug: "medikal-yataklar" },
      });
    }

    await createProduct({
      name: "Test Hasta Yatağı Pro",
      slug: TEST_SLUG,
      sku: "TEST-SKU-999",
      price: "24999.00",
      description: "Test ürün açıklaması",
      categoryId: category.id,
      series: "gold",
      stock: 10,
      searchKeywords: "ozel-arama-anahtari felcli-bakim",
    });
  });

  it("getFeaturedProducts returns at most the requested limit", async () => {
    const result = await getFeaturedProducts(2);
    expect(result.length).toBeLessThanOrEqual(2);
  });

  it("getProducts filters by series and paginates", async () => {
    const result = await getProducts({ series:"gold", page: 1, pageSize: 10 });
    expect(result.items.every((p) => p.series ==="gold")).toBe(true);
    expect(result.page).toBe(1);
  });

  it("getProducts filters by query terms across name and category", async () => {
    const result = await getProducts({ query: "hasta yatağı", page: 1, pageSize: 10 });
    expect(result.items.length).toBeGreaterThan(0);
    expect(
      result.items.every(
        (p) =>
          p.name.toLowerCase().includes("hasta") ||
          p.name.toLowerCase().includes("yatak") ||
          p.category?.name.toLowerCase().includes("hasta")
      )
    ).toBe(true);
  });

  it("getProducts returns no items for a query that matches nothing", async () => {
    const result = await getProducts({ query:"zzz-no-such-product-zzz", page: 1, pageSize: 10 });
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
  });

  it("getProducts finds Turkish products even with ASCII search queries like hasta yatagi", async () => {
    const result = await getProducts({ query: "hasta yatagi", page: 1, pageSize: 10 });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.some((p) => p.name.includes("Hasta Yatağı"))).toBe(true);
  });

  it("getProducts finds products with suffix variations like yemek masasi", async () => {
    const result = await getProducts({ query: "yemek masasi", page: 1, pageSize: 10 });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.some((p) => p.name.toLowerCase().includes("yemek"))).toBe(true);
  });

  it("getProducts finds products matching searchKeywords", async () => {
    const result = await getProducts({ query: "ozel-arama-anahtari", page: 1, pageSize: 10 });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.some((p) => p.slug === TEST_SLUG)).toBe(true);
  });

  it("getProducts finds products matching SKU", async () => {
    const result = await getProducts({ query: "TEST-SKU-999", page: 1, pageSize: 10 });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.some((p) => p.sku === "TEST-SKU-999")).toBe(true);
  });

  it("getProductBySlug returns null for unknown slug", async () => {
    const result = await getProductBySlug("does-not-exist");
    expect(result).toBeNull();
  });

  it("getProductBySlug returns the product for a known slug", async () => {
    const result = await getProductBySlug(TEST_SLUG);
    expect(result?.name).toBe("Test Hasta Yatağı Pro");
  });

  it("includes stock on the returned product", async () => {
    const result = await getProductBySlug(TEST_SLUG);
    expect(typeof result?.stock).toBe("number");
  });

  afterAll(async () => {
    await cleanupQueryTestProducts();
    await prisma.$disconnect();
  });

  describe("cleanProductTitle", () => {
    it("strips MCARIS uppercase prefix", () => {
      expect(cleanProductTitle("MCARIS 2 Motorlu Hasta Karyolası")).toBe("2 Motorlu Hasta Karyolası");
    });

    it("strips Mcaris titlecase prefix with hyphen", () => {
      expect(cleanProductTitle("Mcaris - 4 Motorlu Ahşap Karyola")).toBe("4 Motorlu Ahşap Karyola");
    });

    it("strips Turkish dot-i MCARİS prefix", () => {
      expect(cleanProductTitle("MCARİS: Bakım Koltuğu")).toBe("Bakım Koltuğu");
    });

    it("leaves titles without MCARIS unchanged", () => {
      expect(cleanProductTitle("2 Motorlu Hasta Karyolası")).toBe("2 Motorlu Hasta Karyolası");
    });
  });
});
