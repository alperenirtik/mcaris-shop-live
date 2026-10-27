import { render, screen } from"@testing-library/react";
import { describe, it, expect } from"vitest";
import ProductCard from"../ProductCard";
import type { ProductWithCategory } from"@/lib/types";

const product: ProductWithCategory = {
  id:"1",
  wcId: 1001,
  name:"Elektrikli Hasta Yatağı Pro",
  slug:"elektrikli-hasta-yatagi-pro",
  price:"24999.00",
  shortDescription: null,
  description:"desc",
  categoryId:"cat-1",
  category: { id:"cat-1", name:"Hasta Yatakları", slug:"hasta-yataklari" },
  series:"platinum",
  images: ["/placeholder-product.png"],
  specs: {},
  stock: 10,
};

describe("ProductCard", () => {
  it("renders the product name, formatted price, and series badge", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText("Elektrikli Hasta Yatağı Pro")).toBeInTheDocument();
    expect(screen.getByText("24.999,00 ₺")).toBeInTheDocument();
    expect(screen.getByText("PLATINUM")).toBeInTheDocument();
  });

  it("fits the image in the frame with object-contain so beds are not cropped", () => {
    render(<ProductCard product={product} />);
    const image = screen.getByRole("img", { name: /elektrikli hasta yatağı pro/i });
    expect(image).toHaveClass("object-contain");
    expect(image).not.toHaveClass("object-cover");
  });

  it("links to the product detail page", () => {
    render(<ProductCard product={product} />);
    const links = screen.getAllByRole("link", { name: /elektrikli hasta yatağı pro/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0]).toHaveAttribute("href", "/urun/elektrikli-hasta-yatagi-pro");
  });

  it("renders 'Stok Sor' badge when product is out of stock", () => {
    render(<ProductCard product={{ ...product, stock: 0 }} />);
    expect(screen.getByText("Stok Sor")).toBeInTheDocument();
  });
});
