import { render, screen } from"@testing-library/react";
import { describe, it, expect } from"vitest";
import Pagination from"../Pagination";

describe("Pagination", () => {
  it("renders a link for each page and disables current page as a non-link", () => {
    render(<Pagination currentPage={2} totalPages={3} basePath="/urunler" />);
    expect(screen.getByText("1").closest("a")).toHaveAttribute("href","/urunler?sayfa=1");
    expect(screen.getByText("3").closest("a")).toHaveAttribute("href","/urunler?sayfa=3");
    expect(screen.getByText("2").tagName).not.toBe("A");
  });

  it("renders nothing when there is only one page", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} basePath="/urunler" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("preserves active filters when linking to other pages", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={2}
        basePath="/urunler"
        currentParams={{ seri:"gold", kategori:"yataklar" }}
      />
    );
    expect(screen.getByText("2").closest("a")).toHaveAttribute("href","/urunler?seri=gold&kategori=yataklar&sayfa=2"
    );
  });
});
