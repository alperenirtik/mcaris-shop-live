import { describe, it, expect } from "vitest";
import { formatProductCode, extractOrGenerateProductCode } from "../productCode";

describe("productCode module", () => {
  describe("formatProductCode", () => {
    it("converts ProBed- prefixed codes to MC-XXXX format", () => {
      expect(formatProductCode("ProBed-5311")).toBe("MC-5311");
      expect(formatProductCode("probed-5308")).toBe("MC-5308");
      expect(formatProductCode("PROBED 6017")).toBe("MC-6017");
      expect(formatProductCode("Pro-Bed-6410")).toBe("MC-6410");
    });

    it("converts pure numbers to MC-XXXX format", () => {
      expect(formatProductCode("5311")).toBe("MC-5311");
      expect(formatProductCode("5308")).toBe("MC-5308");
      expect(formatProductCode("1024")).toBe("MC-1024");
    });

    it("preserves and normalizes MC- hyphenated codes", () => {
      expect(formatProductCode("MC-5311")).toBe("MC-5311");
      expect(formatProductCode("MC-8576")).toBe("MC-8576");
      expect(formatProductCode("mc-1872")).toBe("MC-1872");
      expect(formatProductCode("MC-ECO2200")).toBe("MC-ECO2200");
      expect(formatProductCode("mc-dali")).toBe("MC-DALI");
      expect(formatProductCode("MC-BAZA2000")).toBe("MC-BAZA2000");
    });

    it("converts unhyphenated MC codes to MC- format", () => {
      expect(formatProductCode("MCECO2200")).toBe("MC-ECO2200");
      expect(formatProductCode("MCDALI")).toBe("MC-DALI");
      expect(formatProductCode("MCBAZA2000")).toBe("MC-BAZA2000");
      expect(formatProductCode("MC5311")).toBe("MC-5311");
      expect(formatProductCode("MC8576")).toBe("MC-8576");
    });

    it("preserves and normalizes MC-CRN codes for Carine series", () => {
      expect(formatProductCode("MC-CRN001")).toBe("MC-CRN001");
      expect(formatProductCode("mc-crn005")).toBe("MC-CRN005");
      expect(formatProductCode("MC-CRN-012")).toBe("MC-CRN012");
      expect(formatProductCode("MCCRN016")).toBe("MC-CRN016");
    });

    it("preserves custom alphanumeric SKUs without prepending MC", () => {
      expect(formatProductCode("TEST-SKU-999")).toBe("TEST-SKU-999");
      expect(formatProductCode("CARINE-SERUM-01")).toBe("CARINE-SERUM-01");
    });

    it("replaces internal whitespace with hyphens for marketplace compliance", () => {
      expect(formatProductCode("MC-BIRDIE EVO")).toBe("MC-BIRDIE-EVO");
      expect(formatProductCode("MC BIRDIE EVO")).toBe("MC-BIRDIE-EVO");
    });

    it("ensures minimum 6 alphanumeric characters for İdefix and marketplace barcodes", () => {
      expect(formatProductCode("MC-YME")).toBe("MC-YME1");
      expect(formatProductCode("MCYME")).toBe("MC-YME1");
    });

    it("handles empty or invalid inputs gracefully", () => {
      expect(formatProductCode("")).toBe("");
      expect(formatProductCode("   ")).toBe("");
    });
  });

  describe("extractOrGenerateProductCode", () => {
    it("prioritizes product.sku over everything else", () => {
      const code = extractOrGenerateProductCode({
        sku: "ProBed-5311",
        name: "4 Motorlu Hasta Karyolası",
        specs: { "Ürün Kodu": "MC-9999" },
      });
      expect(code).toBe("MC-5311");
    });

    it("uses specs['Ürün Kodu'] if sku is not present", () => {
      const code = extractOrGenerateProductCode({
        specs: { "Ürün Kodu": "5308" },
      });
      expect(code).toBe("MC-5308");
    });

    it("extracts code from product name if explicit code is in name", () => {
      const code = extractOrGenerateProductCode({
        name: "ProBed-5311 2 Motorlu Hasta Yatağı",
      });
      expect(code).toBe("MC-5311");
    });

    it("returns empty string instead of fake hash when no code is available", () => {
      const code = extractOrGenerateProductCode({
        id: "cmsswndoi000fl147315ahbcw",
        name: "Aura – Ahşap Bakım ve Masaj Masası",
        slug: "aura-ahsap-bakim-ve-masaj-masasi",
      });
      expect(code).toBe("");
    });
  });
});
