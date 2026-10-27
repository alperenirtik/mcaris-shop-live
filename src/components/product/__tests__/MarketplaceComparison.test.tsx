import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MarketplaceComparison from "../MarketplaceComparison";

describe("MarketplaceComparison", () => {
  it("renders comparison table with standard text", () => {
    render(<MarketplaceComparison />);

    expect(
      screen.getByText("Genel E-Ticaret Pazaryerleri vs. MCARIS Medikal")
    ).toBeInTheDocument();
    expect(screen.getByText("Teslimat & Kat Taşıması")).toBeInTheDocument();
    expect(screen.getByText("Montaj & Çalıştırma")).toBeInTheDocument();
    expect(screen.getByText("Kumanda & Refakatçi Eğitimi")).toBeInTheDocument();
    expect(screen.getByText("Karyola Uyumu & Aksesuar Desteği")).toBeInTheDocument();
  });

  it("customizes delivery message when districtName is provided", () => {
    render(<MarketplaceComparison districtName="Çankaya" />);

    expect(
      screen.getByText(/Çankaya adresinizde kendi servis filomuzla katınıza kadar çıkarılır/i)
    ).toBeInTheDocument();
  });
});
