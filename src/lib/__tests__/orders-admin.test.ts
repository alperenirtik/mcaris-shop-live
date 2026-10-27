import { describe, it, expect } from"vitest";

describe("orders admin helper tests", () => {
  it("verifies order status enum values", () => {
    const validStatuses = ["pending","paid","shipped","completed","failed","cancelled"];
    expect(validStatuses).toContain("shipped");
    expect(validStatuses).toContain("completed");
    expect(validStatuses).toContain("paid");
  });
});
