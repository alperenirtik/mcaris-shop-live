import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ProductGallery from "../ProductGallery";

const mockImages = [
  "/images/product-1.webp",
  "/images/product-2.webp",
  "/images/product-3.webp",
];

describe("ProductGallery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("renders main image with semantic schema metadata", () => {
    render(
      <ProductGallery
        images={mockImages}
        alt="Platinum 4 Motorlu Hasta Yatağı"
        categoryName="Hasta Yatakları"
      />
    );

    const figure = screen.getByRole("figure");
    expect(figure).toHaveAttribute("itemProp", "image");
    expect(figure).toHaveAttribute("itemScope");
    expect(figure).toHaveAttribute("itemType", "https://schema.org/ImageObject");

    const mainImg = screen.getByRole("img", {
      name: /platinum 4 motorlu hasta yatağı.*orijinal görseli/i,
    });
    expect(mainImg).toBeInTheDocument();
    expect(mainImg).toHaveClass("object-contain");
    expect(mainImg).not.toHaveClass("object-cover");
  });

  it("renders thumbnail strip and allows selecting an image", async () => {
    const user = userEvent.setup();
    render(
      <ProductGallery
        images={mockImages}
        alt="Platinum 4 Motorlu Hasta Yatağı"
      />
    );

    const thumbs = screen.getAllByRole("button", { name: /küçük önizleme/i });
    expect(thumbs).toHaveLength(3);

    // Click 2nd thumbnail
    await user.click(thumbs[1]);

    const counterBadge = screen.getByText("2 / 3");
    expect(counterBadge).toBeInTheDocument();
  });

  it("opens lightbox when main image is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ProductGallery
        images={mockImages}
        alt="Platinum 4 Motorlu Hasta Yatağı"
      />
    );

    const mainFigure = screen.getByRole("figure");
    await user.click(mainFigure);

    // Lightbox modal should be rendered
    const closeBtn = screen.getByRole("button", { name: /kapat/i });
    expect(closeBtn).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("navigates images using next/prev buttons in main gallery and in lightbox", async () => {
    const user = userEvent.setup();
    render(
      <ProductGallery
        images={mockImages}
        alt="Platinum 4 Motorlu Hasta Yatağı"
      />
    );

    // Open lightbox
    const mainFigure = screen.getByRole("figure");
    await user.click(mainFigure);

    const dialog = screen.getByRole("dialog");
    const nextButtons = screen.getAllByRole("button", { name: /sonraki görsel/i });
    // Click next button in lightbox
    await user.click(nextButtons[nextButtons.length - 1]);

    // Now active index should be 2 (1/3 -> 2/3)
    expect(screen.getAllByText("2 / 3").length).toBeGreaterThan(0);

    const prevButtons = screen.getAllByRole("button", { name: /önceki görsel/i });
    await user.click(prevButtons[prevButtons.length - 1]);

    expect(screen.getAllByText("1 / 3").length).toBeGreaterThan(0);
  });

  it("closes lightbox with close button and Escape key", async () => {
    const user = userEvent.setup();
    render(
      <ProductGallery
        images={mockImages}
        alt="Platinum 4 Motorlu Hasta Yatağı"
      />
    );

    // Open lightbox
    await user.click(screen.getByRole("figure"));
    expect(screen.getByRole("button", { name: /kapat/i })).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("button", { name: /kapat/i })).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("handles zoom in, zoom out, and reset in lightbox", async () => {
    const user = userEvent.setup();
    render(
      <ProductGallery
        images={mockImages}
        alt="Platinum 4 Motorlu Hasta Yatağı"
      />
    );

    await user.click(screen.getByRole("figure"));

    const zoomInBtn = screen.getByRole("button", { name: /yakınlaştır/i });
    const zoomOutBtn = screen.getByRole("button", { name: /uzaklaştır/i });

    expect(zoomInBtn).toBeInTheDocument();
    expect(zoomOutBtn).toBeInTheDocument();

    // Zoom in to 150%
    await user.click(zoomInBtn);
    expect(screen.getByText("150%")).toBeInTheDocument();

    // Reset button appears when zoomed in
    const resetBtn = screen.getByRole("button", { name: /sıfırla/i });
    expect(resetBtn).toBeInTheDocument();

    // Reset zoom back to 100%
    await user.click(resetBtn);
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /sıfırla/i })).not.toBeInTheDocument();
  });

  it("zooms in and out using mouse wheel in lightbox", async () => {
    const user = userEvent.setup();
    render(
      <ProductGallery
        images={mockImages}
        alt="Platinum 4 Motorlu Hasta Yatağı"
      />
    );

    await user.click(screen.getByRole("figure"));

    const stage = screen.getByRole("main");
    expect(stage).toBeInTheDocument();

    // Wheel up to zoom in
    fireEvent.wheel(stage, { deltaY: -100 });
    expect(screen.getByText("125%")).toBeInTheDocument();

    // Wheel down to zoom out
    fireEvent.wheel(stage, { deltaY: 100 });
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("closes lightbox when outer stage backdrop is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ProductGallery
        images={mockImages}
        alt="Platinum 4 Motorlu Hasta Yatağı"
      />
    );

    // Open lightbox
    await user.click(screen.getByRole("figure"));
    const stage = screen.getByRole("main");
    expect(stage).toBeInTheDocument();

    // Click outer stage (backdrop)
    fireEvent.click(stage, { clientX: 20, clientY: 20 });

    // Lightbox should now be closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("does not close lightbox when image is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ProductGallery
        images={mockImages}
        alt="Platinum 4 Motorlu Hasta Yatağı"
      />
    );

    // Open lightbox
    await user.click(screen.getByRole("figure"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Click directly on the image inside lightbox
    const modalImage = screen.getByRole("img", {
      name: /platinum 4 motorlu hasta yatağı - tam ekran görünüm/i,
    });
    fireEvent.click(modalImage);

    // Lightbox should remain open
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not close lightbox when dragging occurs", async () => {
    const user = userEvent.setup();
    render(
      <ProductGallery
        images={mockImages}
        alt="Platinum 4 Motorlu Hasta Yatağı"
      />
    );

    await user.click(screen.getByRole("figure"));
    const stage = screen.getByRole("main");
    expect(stage).toBeInTheDocument();

    // Start mouse down at (100, 100)
    fireEvent.mouseDown(stage, { clientX: 100, clientY: 100, button: 0 });
    // Move pointer significantly to (160, 100) -> 60px drag
    fireEvent.mouseMove(stage, { clientX: 160, clientY: 100 });
    // Release pointer
    fireEvent.mouseUp(stage);
    // Click fired immediately after drag release
    fireEvent.click(stage, { clientX: 160, clientY: 100 });

    // Lightbox should still be open
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
