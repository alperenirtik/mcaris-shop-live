import { describe, it, expect } from"vitest";
import {
  hashPassword,
  verifyPassword,
  createAuthToken,
  verifyAuthToken,
} from"../auth";

describe("auth helpers", () => {
  it("hashes and verifies password correctly", async () => {
    const password ="mySecurePassword123";
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(await verifyPassword(password, hash)).toBe(true);
    expect(await verifyPassword("wrongPassword", hash)).toBe(false);
  });

  it("creates and verifies JWT tokens", () => {
    const payload = {
      id:"usr-123",
      email:"test@mcaris.com.tr",
      name:"Test User",
      role:"USER" as const,
    };

    const token = createAuthToken(payload);
    expect(typeof token).toBe("string");

    const verified = verifyAuthToken(token);
    expect(verified).toEqual(payload);
  });

  it("returns null for invalid JWT tokens", () => {
    const verified = verifyAuthToken("invalid-token-string");
    expect(verified).toBeNull();
  });
});
