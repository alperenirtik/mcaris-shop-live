import { describe, it, expect, afterAll } from"vitest";
import { prisma } from"../db";

describe("prisma seed data", () => {
  it("has categories seeded properly in the database", async () => {
    const categories = await prisma.category.findMany();
    expect(categories.length).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
