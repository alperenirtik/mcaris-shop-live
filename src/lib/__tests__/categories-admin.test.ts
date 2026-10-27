import { describe, it, expect, vi } from"vitest";
import { slugifyTurkish } from"../categories";

describe("categories helpers", () => {
  it("correctly converts Turkish characters to slug format", () => {
    expect(slugifyTurkish("Hasta Yatakları")).toBe("hasta-yataklari");
    expect(slugifyTurkish("Tekerlekli Sandalyeler & Aksesuarlar")).toBe("tekerlekli-sandalyeler-aksesuarlar");
    expect(slugifyTurkish("Çoklu Çözümler Örneği")).toBe("coklu-cozumler-ornegi");
    expect(slugifyTurkish("   Ağır  Şartlar")).toBe("agir-sartlar");
  });
});
