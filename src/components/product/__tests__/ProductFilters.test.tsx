import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProductFilters from "../ProductFilters";

const categories = [{ id: "c1", name: "Yataklar", slug: "yataklar" }];

describe("ProductFilters", () => {
  it("renders category filters with correct href", () => {
    render(
      <ProductFilters
        categories={categories}
        activeCategory={undefined}
        currentParams={{}}
      />
    );
    expect(screen.getAllByText("Yataklar")[0].closest("a")).toHaveAttribute("href", "/kategori/yataklar");
  });

  it("toggles off the active category filter when clicked again", () => {
    render(
      <ProductFilters
        categories={categories}
        activeCategory="yataklar"
        currentParams={{ kategori: "yataklar" }}
      />
    );
    expect(screen.getAllByText("Yataklar")[0].closest("a")).toHaveAttribute("href", "/urunler");
  });

  it("shows a clear-all link only when a filter is active", () => {
    const { rerender } = render(<ProductFilters categories={categories} />);
    expect(screen.queryByText(/tümü/i)).not.toBeInTheDocument();

    rerender(<ProductFilters categories={categories} activeCategory="yataklar" currentParams={{ kategori: "yataklar" }} />);
    const clearLink = screen.getAllByText(/temizle/i)[0];
    expect(clearLink.closest("a")).toHaveAttribute("href", "/urunler");
  });

  it("links directly to canonical /seri/platinum instead of redirecting via query parameter", () => {
    const dynamicFilters = [
      {
        key: "seri",
        title: "Ürün Serisi",
        options: [{ value: "platinum", label: "Platinum Seri", count: 5 }],
      },
    ];

    render(
      <ProductFilters
        categories={categories}
        dynamicFilters={dynamicFilters}
        basePath="/urunler"
      />
    );

    const seriesLink = screen.getByText("Platinum Seri").closest("a");
    expect(seriesLink).toHaveAttribute("href", "/seri/platinum");
  });

  it("links directly to motor attribute filter within category context", () => {
    const dynamicFilters = [
      {
        key: "motor",
        title: "Motor Sayısı",
        options: [{ value: "4", label: "4 Motorlu", count: 8 }],
      },
    ];

    render(
      <ProductFilters
        categories={categories}
        dynamicFilters={dynamicFilters}
        basePath="/kategori/yataklar"
      />
    );

    const motorLink = screen.getByText("4 Motorlu").closest("a");
    expect(motorLink).toHaveAttribute("href", "/kategori/yataklar?motor=4");
  });

  it("links to dedicated subcategory URLs within hasta-yataklari family", () => {
    const dynamicFilters = [
      {
        key: "motor",
        title: "Motor Sayısı",
        options: [
          { value: "2", label: "2 Motorlu", count: 6 },
          { value: "3", label: "3 Motorlu", count: 2 },
          { value: "4", label: "4 Motorlu", count: 6 },
        ],
      },
    ];

    render(
      <ProductFilters
        categories={categories}
        dynamicFilters={dynamicFilters}
        activeMotor="3"
        basePath="/kategori/3-motorlu-hasta-yataklari"
      />
    );

    const motor4Link = screen.getAllByText("4 Motorlu")[0].closest("a");
    expect(motor4Link).toHaveAttribute("href", "/kategori/4-motorlu-hasta-yataklari");

    const motor2Link = screen.getAllByText("2 Motorlu")[0].closest("a");
    expect(motor2Link).toHaveAttribute("href", "/kategori/2-motorlu-hasta-yataklari");

    const resetLink = screen.getAllByText("Sıfırla")[0].closest("a");
    expect(resetLink).toHaveAttribute("href", "/kategori/hasta-yataklari");
  });
});
