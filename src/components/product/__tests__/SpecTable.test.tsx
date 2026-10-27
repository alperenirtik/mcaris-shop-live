import { render, screen } from"@testing-library/react";
import { describe, it, expect } from"vitest";
import SpecTable from"../SpecTable";

describe("SpecTable", () => {
  it("renders one row per spec entry", () => {
    render(<SpecTable specs={{"Ağırlık":"12 kg","Garanti":"2 Yıl" }} />);
    expect(screen.getByText("Ağırlık")).toBeInTheDocument();
    expect(screen.getByText("12 kg")).toBeInTheDocument();
    expect(screen.getByText("Garanti")).toBeInTheDocument();
    expect(screen.getByText("2 Yıl")).toBeInTheDocument();
  });

  it("renders nothing when specs is empty", () => {
    const { container } = render(<SpecTable specs={{}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("filters out sku and Ürün Kodu so they do not duplicate in table", () => {
    render(
      <SpecTable
        specs={{
          "Garanti": "2 Yıl",
          "sku": "MC1851",
          "Ürün Kodu": "MC1851",
          "seoTitle": "Custom SEO",
        }}
      />
    );
    expect(screen.getByText("Garanti")).toBeInTheDocument();
    expect(screen.getByText("2 Yıl")).toBeInTheDocument();
    expect(screen.queryByText("sku")).not.toBeInTheDocument();
    expect(screen.queryByText("Ürün Kodu")).not.toBeInTheDocument();
    expect(screen.queryByText("Custom SEO")).not.toBeInTheDocument();
  });
});
