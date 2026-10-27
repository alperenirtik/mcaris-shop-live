import { describe, it, expect } from "vitest";
import {
  isBrandSearchQuery,
  detectSearchIntent,
  getTurkishSearchVariants,
  buildSearchWhereClauses,
} from "../products";

describe("Arama Motoru, Marka Sorgusu ve Niyet Algılama Testleri", () => {
  describe("isBrandSearchQuery", () => {
    it("tanımlı tüm MCARIS marka sorgularını doğru algılamalıdır", () => {
      expect(isBrandSearchQuery("mcaris")).toBe(true);
      expect(isBrandSearchQuery("MCARIS")).toBe(true);
      expect(isBrandSearchQuery("MCaris Medikal")).toBe(true);
      expect(isBrandSearchQuery("shop.mcaris")).toBe(true);
      expect(isBrandSearchQuery("mcaris shop")).toBe(true);
      expect(isBrandSearchQuery("mcaris ürünleri")).toBe(true);
    });

    it("farklı medikal ürün sorgularını marka sorgusu olarak işaretlememelidir", () => {
      expect(isBrandSearchQuery("hasta yatağı")).toBe(false);
      expect(isBrandSearchQuery("hastane karyolası")).toBe(false);
      expect(isBrandSearchQuery("muayene masası")).toBe(false);
      expect(isBrandSearchQuery("havalı yatak")).toBe(false);
    });
  });

  describe("getTurkishSearchVariants & Medikal Eş Anlamlılar", () => {
    it("'hastane' sorgusunda hasta, karyola ve yatak eş anlamlılarını üretmelidir", () => {
      const variants = getTurkishSearchVariants("hastane");
      expect(variants).toContain("hastane");
      expect(variants).toContain("hasta");
      expect(variants).toContain("karyola");
      expect(variants).toContain("yatak");
    });

    it("'yatağı' sorgusunda yatak ve karyola varyantlarını üretmelidir", () => {
      const variants = getTurkishSearchVariants("yatağı");
      expect(variants).toContain("yatağı");
      expect(variants).toContain("yatak");
      expect(variants).toContain("karyola");
    });

    it("'karyolası' sorgusunda karyola ve yatak varyantlarını üretmelidir", () => {
      const variants = getTurkishSearchVariants("karyolası");
      expect(variants).toContain("karyolası");
      expect(variants).toContain("karyola");
      expect(variants).toContain("yatak");
    });

    it("'havalı' sorgusunda antidekübit varyantını üretmelidir", () => {
      const variants = getTurkishSearchVariants("havalı");
      expect(variants).toContain("havalı");
      expect(variants).toContain("antidekübit");
    });
  });

  describe("detectSearchIntent", () => {
    it("marka aramasında MCARIS resmi katalog niyetini döndürmelidir", () => {
      const intent = detectSearchIntent("mcaris");
      expect(intent.isBrand).toBe(true);
      expect(intent.title).toBe("MCARIS Medikal Resmi Ürün Kataloğu");
      expect(intent.quickFilters.length).toBeGreaterThan(0);
      expect(intent.badge).toBe("Resmi Üretici & Satış Mağazası");
    });

    it("'hastane yatağı' aramasında hasta yatakları kategorisini tespit etmelidir", () => {
      const intent = detectSearchIntent("hastane yatağı");
      expect(intent.isBrand).toBe(false);
      expect(intent.matchedCategorySlug).toBe("hasta-yataklari");
      expect(intent.title).toBe("Hasta Yatakları & Elektrikli Karyolalar");
      expect(intent.quickFilters.some((f) => f.label.includes("2 Motorlu"))).toBe(true);
    });

    it("'kiralık hasta yatağı' aramasında kiralama niyetini ve rehber linkini tespit etmelidir", () => {
      const intent = detectSearchIntent("kiralık hasta yatağı");
      expect(intent.matchedCategorySlug).toBe("hasta-yataklari");
      expect(intent.title).toContain("Kiralama");
      expect(intent.quickFilters.some((f) => f.url.includes("kiralama"))).toBe(true);
    });

    it("'havalı yatak' aramasında bası yarası ve havalı yatak niyetini tespit etmelidir", () => {
      const intent = detectSearchIntent("havalı yatak");
      expect(intent.matchedCategorySlug).toBe("hasta-yataklari");
      expect(intent.title).toContain("Havalı");
      expect(intent.quickFilters.some((f) => f.url.includes("havali"))).toBe(true);
    });

    it("'muayene sedyesi' aramasında muayene masaları niyetini tespit etmelidir", () => {
      const intent = detectSearchIntent("muayene sedyesi");
      expect(intent.matchedCategorySlug).toBe("muayene-ve-bakim-masalari");
      expect(intent.title).toBe("Klinik Muayene & Bakım Masaları");
    });

    it("'diyaliz koltuğu' aramasında bakım koltukları niyetini tespit etmelidir", () => {
      const intent = detectSearchIntent("diyaliz koltuğu");
      expect(intent.matchedCategorySlug).toBe("bakim-koltuklari");
      expect(intent.title).toBe("Medikal Bakım & Tedavi Koltukları");
    });
  });

  describe("buildSearchWhereClauses", () => {
    it("saf 'mcaris' aramasında tüm ürünlerin listelenmesi için boş dizi dönmelidir", () => {
      const clauses = buildSearchWhereClauses("mcaris");
      expect(clauses).toEqual([]);
    });

    it("'mcaris hasta yatağı' aramasında mcaris token'ının filtreyi bozmasını engellemelidir", () => {
      const clauses = buildSearchWhereClauses("mcaris hasta yatağı");
      expect(clauses.length).toBe(3);
      // mcaris token condition
      expect(clauses[0]).toEqual({ id: { not: "" } });
      // hasta token condition
      expect(clauses[1]).toHaveProperty("OR");
      // yatağı token condition
      expect(clauses[2]).toHaveProperty("OR");
    });

    it("'hastane yatağı' aramasında 2 token koşulu üretmelidir", () => {
      const clauses = buildSearchWhereClauses("hastane yatağı");
      expect(clauses.length).toBe(2);
      expect(clauses[0]).toHaveProperty("OR");
      expect(clauses[1]).toHaveProperty("OR");
    });
  });
});
