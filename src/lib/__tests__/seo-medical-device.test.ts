import { describe, it, expect } from "vitest";
import { getProductSchema, getMedicalDeviceSchema } from "../seo";

describe("MedicalDevice & Product JSON-LD SEO Schemas", () => {
  const mockProduct = {
    name: "MC-2000 2 Motorlu Hasta Karyolası (ABS Korkuluklu)",
    slug: "mc-2000-2-motorlu-hasta-karyolasi",
    description: "2 motorlu elektrikli hasta karyolası. 4 parçalı şilte ve alez dahil.",
    images: ["/images/products/mc-2000.webp"],
    price: "19500.00",
    sku: "MC-2000",
    categoryName: "2 Motorlu Hasta Yatakları",
    specs: {
      "Motor Sayısı": "2",
      "Taşıma Kapasitesi": "240 kg",
      "Motor Gücü": "Medikal Lineer Aktüatör",
      "Korkuluk Tipi": "Amortisörlü ABS",
    },
  };

  it("getProductSchema contains MedicalDevice additionalType and safety considerations", () => {
    const schema = getProductSchema(mockProduct);

    expect(schema["@type"]).toBe("Product");
    expect(schema.additionalType).toBe("https://schema.org/MedicalDevice");
    expect(schema.name).toBe(mockProduct.name);
    expect(schema.sku).toBe("MC-2000");
    expect(schema.mpn).toBe("MC-2000");
    expect(schema.safetyConsideration).toContain("Amortisörlü");
    expect(schema.purpose).toContain("bası yarası");
    expect(schema.recognizingAuthority).toBeDefined();
    expect(schema.hasWarranty).toBeDefined();
    expect(schema.offers).toBeDefined();
  });

  it("getMedicalDeviceSchema generates valid MedicalDevice structured data", () => {
    const schema = getMedicalDeviceSchema(mockProduct);

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("MedicalDevice");
    expect(schema["@id"]).toContain("#medical-device");
    expect(schema.name).toBe(mockProduct.name);
    expect(schema.code).toBe("MC-2000");
    expect(schema.manufacturer).toEqual({
      "@type": "Organization",
      name: "MCARIS Medikal",
      url: expect.any(String),
    });
    expect(schema.safetyConsideration).toContain("amortisörlü");
    expect(schema.purpose).toContain("anatomik");
    expect(schema.purpose).toContain("bası yarası");
    expect(schema.isRelatedTo).toEqual({
      "@type": "Product",
      "@id": expect.stringContaining("#product"),
    });

    // Check additional properties
    const props = schema.additionalProperty as Array<{ name: string; value: string }>;
    expect(props).toBeDefined();
    expect(props.some((p) => p.name === "Kalite Tescili" && p.value.includes("CE"))).toBe(true);
    expect(props.some((p) => p.name === "Güvenli Çalışma Yükü" && p.value === "240 kg")).toBe(true);
    expect(props.some((p) => p.name === "Motor İtiş Gücü" && p.value === "Medikal Lineer Aktüatör")).toBe(true);
    expect(props.some((p) => p.name === "Garanti Süresi")).toBe(true);
    expect(props.some((p) => p.name === "Paket Donanımı")).toBe(true);
  });
});
