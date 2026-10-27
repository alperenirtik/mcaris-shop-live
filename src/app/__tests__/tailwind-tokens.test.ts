import { describe, it, expect } from"vitest";
import config from"../../../tailwind.config";

describe("tailwind design tokens", () => {
  it("exposes every design-system color token", () => {
    const colors = (config.theme?.extend?.colors ?? {}) as Record<string, string>;
    expect(colors.primary).toBe("#152A4A");
    expect(colors.platinum).toBe("#2C3E6B");
    expect(colors.gold).toBe("#C8A951");
    expect(colors.silver).toBe("#8E99A4");
  });
});
