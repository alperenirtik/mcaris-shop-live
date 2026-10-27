import { describe, it, expect } from"vitest";
import { calculateShipping, FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING_COST } from"../shipping";

describe("calculateShipping", () => {
  it("always returns 0 TL free shipping", () => {
    expect(calculateShipping(0)).toBe(0);
    expect(calculateShipping(100)).toBe(0);
    expect(calculateShipping(10000)).toBe(0);
  });
});
