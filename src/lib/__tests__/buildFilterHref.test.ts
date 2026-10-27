import { describe, it, expect } from"vitest";
import { buildFilterHref } from"../buildFilterHref";

describe("buildFilterHref", () => {
  it("applies a patch to an empty current state", () => {
    expect(buildFilterHref("/urunler", {}, { sayfa:"2" })).toBe("/urunler?sayfa=2");
  });

  it("preserves existing filters when changing the page", () => {
    const current = { seri:"gold", kategori:"yataklar" };
    expect(buildFilterHref("/urunler", current, { sayfa:"3" })).toBe("/urunler?seri=gold&kategori=yataklar&sayfa=3"
    );
  });

  it("combines series and category filters instead of overwriting", () => {
    const current = { seri:"gold" };
    expect(buildFilterHref("/urunler", current, { kategori:"yataklar" })).toBe("/urunler?seri=gold&kategori=yataklar"
    );
  });

  it("removes a key when the patch value is undefined", () => {
    const current = { seri:"gold", kategori:"yataklar" };
    expect(buildFilterHref("/urunler", current, { seri: undefined })).toBe("/urunler?kategori=yataklar"
    );
  });

  it("returns the bare base path when there are no params left", () => {
    const current = { seri:"gold" };
    expect(buildFilterHref("/urunler", current, { seri: undefined })).toBe("/urunler");
  });

  it("resets the page when a filter changes but keeps other filters", () => {
    const current = { seri:"gold", sayfa:"4" };
    expect(buildFilterHref("/urunler", current, { kategori:"yataklar", sayfa: undefined })).toBe("/urunler?seri=gold&kategori=yataklar"
    );
  });
});
