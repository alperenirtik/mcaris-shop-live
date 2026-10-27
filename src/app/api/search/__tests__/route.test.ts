import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";

const { mockFindMany, mockCount } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockCount: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    product: {
      findMany: mockFindMany,
      count: mockCount,
    },
  },
}));

import { GET } from "../route";

describe("GET /api/search", () => {
  beforeEach(() => {
    mockFindMany.mockReset();
    mockCount.mockReset();
  });

  it("returns empty array when query is less than 2 characters", async () => {
    const req = new NextRequest("http://localhost/api/search?q=m");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ products: [], totalCount: 0 });
    expect(mockFindMany).not.toHaveBeenCalled();
  });

  it("searches with tokenized query without using nonexistent isActive field", async () => {
    const mockProducts = [
      {
        id: "prod-1",
        wcId: 101,
        name: "4 Motorlu Hasta Karyolası",
        slug: "4-motorlu-hasta-karyolasi",
        price: new Decimal("45000.00"),
        shortDescription: "Alman motorlu konforlu hasta yatağı",
        description: "Detaylı açıklama",
        categoryId: "cat-1",
        category: { id: "cat-1", name: "Hasta Yatakları", slug: "hasta-yataklari" },
        series: "platinum",
        images: ["/images/bed-1.webp"],
        specs: { "Motor Sayısı": "4" },
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockFindMany.mockResolvedValue(mockProducts);
    mockCount.mockResolvedValue(1);

    const req = new NextRequest("http://localhost/api/search?q=motor");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(mockFindMany).toHaveBeenCalled();

    const callArg = mockFindMany.mock.calls[0][0];
    // Verify isActive is NOT in whereClause
    expect(callArg.where).not.toHaveProperty("isActive");
    expect(callArg.where).toHaveProperty("AND");
    expect(callArg.where.AND[0].OR).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          searchKeywords: expect.objectContaining({ contains: "motor" }),
        }),
        expect.objectContaining({
          sku: expect.objectContaining({ contains: "motor" }),
        }),
      ])
    );

    expect(json.products).toHaveLength(1);
    expect(json.products[0]).toEqual({
      id: "prod-1",
      name: "4 Motorlu Hasta Karyolası",
      slug: "4-motorlu-hasta-karyolasi",
      price: "45000",
      images: ["/images/bed-1.webp"],
      series: "platinum",
      categoryName: "Hasta Yatakları",
      sku: null,
    });
    expect(json.totalCount).toBe(1);
  });

  it("handles multi-word search tokens", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const req = new NextRequest("http://localhost/api/search?q=4%20motor%20dali");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(mockFindMany).toHaveBeenCalled();

    const callArg = mockFindMany.mock.calls[0][0];
    expect(callArg.where.AND).toHaveLength(3);
    expect(json.products).toEqual([]);
    expect(json.totalCount).toBe(0);
  });

  it("returns 500 when database throws an unexpected error", async () => {
    mockFindMany.mockRejectedValue(new Error("DB Connection Error"));

    const req = new NextRequest("http://localhost/api/search?q=motor");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Arama sırasında hata oluştu");
  });
});
