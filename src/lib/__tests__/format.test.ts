import { describe, it, expect } from"vitest";
import { formatPrice } from"../format";

describe("formatPrice", () => {
  it("formats a decimal string as Turkish currency", () => {
    expect(formatPrice("24999.00")).toBe("24.999,00 ₺");
  });

  it("formats a number", () => {
    expect(formatPrice(5499)).toBe("5.499,00 ₺");
  });
});
