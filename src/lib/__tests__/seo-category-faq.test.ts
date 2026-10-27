import { describe, it, expect } from "vitest";
import { extractFaqsFromHtml, getFAQSchema } from "../seo";

describe("Category Dynamic FAQPage SEO Schema", () => {
  const sampleSeoContentWithFaqs = `
    <h2>2 Motorlu Hasta Karyolası Modelleri</h2>
    <p>Karyolalarımız CE sertifikalıdır.</p>
    <h2>Sıkça Sorulan Sorular</h2>
    <div class="faq-accordion">
      <details>
        <summary><strong>2 motorlu hasta karyolasını kimler tercih etmelidir?</strong></summary>
        <p>Kendi başına doğrulabilen ve ameliyat sonrası nekahet dönemindeki hastalar için en ekonomik modeldir.</p>
      </details>
      <details>
        <summary><strong>Teslimat ve montaj için ek ücret öder miyim?</strong></summary>
        <p>Hayır. Ankara genelinde aynı gün adrese teslimat, kata taşıma ve oda montajı ücretsizdir.</p>
      </details>
      <details>
        <summary><strong>Ankara içi teslimat ve kurulum ne kadar sürer?</strong></summary>
        <p>Ankara genelinde aynı gün adrese teslimat ve uzman teknisyenlerimizce odaya montaj yapılır.</p>
      </details>
    </div>
  `;

  it("extracts questions and clean answers from HTML details/summary elements", () => {
    const faqs = extractFaqsFromHtml(sampleSeoContentWithFaqs);

    expect(faqs).toHaveLength(3);
    expect(faqs[0].question).toBe("2 motorlu hasta karyolasını kimler tercih etmelidir?");
    expect(faqs[0].answer).toContain("Kendi başına doğrulabilen");
    expect(faqs[1].question).toBe("Teslimat ve montaj için ek ücret öder miyim?");
    expect(faqs[1].answer).toContain("oda montajı ücretsizdir");
    expect(faqs[2].question).toBe("Ankara içi teslimat ve kurulum ne kadar sürer?");
    expect(faqs[2].answer).toContain("aynı gün adrese teslimat");
  });

  it("returns an empty array when HTML has no details/summary elements", () => {
    const plainHtml = "<h1>Kategori Başlığı</h1><p>Sıradan açıklama metni.</p>";
    expect(extractFaqsFromHtml(plainHtml)).toEqual([]);
    expect(extractFaqsFromHtml("")).toEqual([]);
  });

  it("generates a valid Schema.org FAQPage schema from extracted category FAQs", () => {
    const faqs = extractFaqsFromHtml(sampleSeoContentWithFaqs);
    const schema = getFAQSchema(faqs);

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(3);

    const firstEntity = schema.mainEntity[0];
    expect(firstEntity["@type"]).toBe("Question");
    expect(firstEntity.name).toBe("2 motorlu hasta karyolasını kimler tercih etmelidir?");
    expect(firstEntity.acceptedAnswer["@type"]).toBe("Answer");
    expect(firstEntity.acceptedAnswer.text).toContain("Kendi başına doğrulabilen");
  });
});
