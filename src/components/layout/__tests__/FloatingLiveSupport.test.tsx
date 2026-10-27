import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import FloatingLiveSupport from "../FloatingLiveSupport";

const mockUsePathname = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

describe("FloatingLiveSupport", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockUsePathname.mockReturnValue("/");
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the floating trigger button with exact WhatsApp styling and 'WhatsApp Danışma' text", () => {
    render(<FloatingLiveSupport />);
    const button = screen.getByRole("button", { name: "Canlı Danışma ve Destek Hattı" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-[#25D366]");
    expect(screen.getByText("WhatsApp Danışma")).toBeInTheDocument();
  });

  it("automatically opens the popover modal after 2000ms", () => {
    render(<FloatingLiveSupport />);
    expect(screen.queryByText("Size Nasıl Yardımcı Olabiliriz?")).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText("Size Nasıl Yardımcı Olabiliriz?")).toBeInTheDocument();
    expect(screen.getByText("Canlı Danışma Hattı • Çevrim İçi")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp ile Danış")).toBeInTheDocument();
  });

  it("closes the popover modal and marks dismissed in sessionStorage when the close button is clicked", () => {
    render(<FloatingLiveSupport />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText("Size Nasıl Yardımcı Olabiliriz?")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "Destek penceresini kapat" });
    fireEvent.click(closeBtn);

    expect(screen.queryByText("Size Nasıl Yardımcı Olabiliriz?")).not.toBeInTheDocument();
    expect(sessionStorage.getItem("mcaris_live_support_dismissed")).toBe("true");
  });

  it("does not auto-open if previously dismissed in session", () => {
    sessionStorage.setItem("mcaris_live_support_dismissed", "true");
    render(<FloatingLiveSupport />);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.queryByText("Size Nasıl Yardımcı Olabiliriz?")).not.toBeInTheDocument();
  });

  it("toggles the popover modal when the trigger button is clicked", () => {
    render(<FloatingLiveSupport />);
    const triggerBtn = screen.getByRole("button", { name: "Canlı Danışma ve Destek Hattı" });

    // Open manually
    fireEvent.click(triggerBtn);
    expect(screen.getByText("Size Nasıl Yardımcı Olabiliriz?")).toBeInTheDocument();

    // Close manually
    fireEvent.click(triggerBtn);
    expect(screen.queryByText("Size Nasıl Yardımcı Olabiliriz?")).not.toBeInTheDocument();
  });

  it("applies responsive hiding on mobile product pages to prevent sticky action bar collision", () => {
    mockUsePathname.mockReturnValue("/urun/2-motorlu-hasta-karyolasi");
    const { container } = render(<FloatingLiveSupport />);
    const wrapper = container.querySelector(".fixed");
    expect(wrapper).toHaveClass("hidden");
    expect(wrapper).toHaveClass("lg:block");
  });

  it("renders null on admin and driver routes", () => {
    mockUsePathname.mockReturnValue("/admin/siparisler");
    const { container } = render(<FloatingLiveSupport />);
    expect(container.firstChild).toBeNull();
  });
});
