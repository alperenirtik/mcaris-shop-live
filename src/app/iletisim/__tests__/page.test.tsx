import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ContactPage from "../page";
import { BUSINESS_ADDRESS, BUSINESS_EMAIL, GOOGLE_MAPS_DIRECTIONS_URL } from "@/lib/constants";

describe("ContactPage", () => {
  it("renders the page heading", () => {
    render(<ContactPage />);
    expect(screen.getByRole("heading", { name: /İletişim/i })).toBeInTheDocument();
  });

  it("renders the address and email", () => {
    render(<ContactPage />);
    expect(screen.getByText(BUSINESS_ADDRESS)).toBeInTheDocument();
    expect(screen.getByText(BUSINESS_EMAIL)).toBeInTheDocument();
  });

  it("renders a map embed iframe", () => {
    render(<ContactPage />);
    expect(screen.getByTitle(/harita/i)).toBeInTheDocument();
  });

  it("renders the accurate Google Maps directions link", () => {
    render(<ContactPage />);
    const link = screen.getByRole("link", { name: /Haritada Yol Tarifi Al/i });
    expect(link).toHaveAttribute("href", GOOGLE_MAPS_DIRECTIONS_URL);
  });
});
