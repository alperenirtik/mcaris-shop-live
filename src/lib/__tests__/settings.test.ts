import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  DEFAULT_DEAL_OF_THE_DAY,
  DEFAULT_HERO_SETTINGS,
  getDealOfTheDaySettings,
  getHeroSettings,
} from "@/lib/settings";
import { prisma } from "@/lib/db";

vi.mock("@/lib/db", () => ({
  prisma: {
    storeSetting: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

describe("Settings & DealOfTheDay Specifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have correct default DealOfTheDay settings", () => {
    expect(DEFAULT_DEAL_OF_THE_DAY.isActive).toBe(true);
    expect(DEFAULT_DEAL_OF_THE_DAY.title).toContain("Burmeier Dali");
    expect(DEFAULT_DEAL_OF_THE_DAY.dealPrice).toBe(89500);
    expect(DEFAULT_DEAL_OF_THE_DAY.originalPrice).toBe(98000);
    expect(DEFAULT_DEAL_OF_THE_DAY.countdownHours).toBe(24);
  });

  it("should have 4 showcase items in DEFAULT_HERO_SETTINGS", () => {
    expect(DEFAULT_HERO_SETTINGS.showcaseItems).toHaveLength(4);
    expect(DEFAULT_HERO_SETTINGS.showcaseItems[0].tabLabel).toBe("4 Motorlu");
  });

  it("should return default deal settings when database is empty", async () => {
    vi.mocked(prisma.storeSetting.findUnique).mockResolvedValue(null);
    const settings = await getDealOfTheDaySettings();
    expect(settings).toEqual(DEFAULT_DEAL_OF_THE_DAY);
  });

  it("should return parsed database deal settings when available", async () => {
    const customDeal = {
      ...DEFAULT_DEAL_OF_THE_DAY,
      title: "Özel Fırsat Modeli",
      dealPrice: 75000,
    };
    vi.mocked(prisma.storeSetting.findUnique).mockResolvedValue({
      id: "1",
      key: "deal_of_the_day",
      value: JSON.stringify(customDeal),
      updatedAt: new Date(),
    });

    const settings = await getDealOfTheDaySettings();
    expect(settings.title).toBe("Özel Fırsat Modeli");
    expect(settings.dealPrice).toBe(75000);
  });

  it("should safely return default hero settings when database is empty", async () => {
    vi.mocked(prisma.storeSetting.findUnique).mockResolvedValue(null);
    const settings = await getHeroSettings();
    expect(settings.mainTitle).toBe(DEFAULT_HERO_SETTINGS.mainTitle);
    expect(settings.showcaseItems).toHaveLength(4);
  });
});
