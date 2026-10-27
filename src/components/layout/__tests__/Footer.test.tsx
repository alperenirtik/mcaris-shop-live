import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "../Footer";
import { BUSINESS_EMAIL, INSTAGRAM_URL, FACEBOOK_URL } from "@/lib/constants";

describe("Footer", () => {
  it("renders the logo image", () => {
    render(<Footer />);
    expect(screen.getByAltText("MCARIS")).toBeInTheDocument();
  });

  it("renders the contact block with email", () => {
    render(<Footer />);
    expect(screen.getByText(BUSINESS_EMAIL)).toBeInTheDocument();
  });

  it("renders corporate links pointing to the about and contact pages", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /hakkımızda/i })).toHaveAttribute(
      "href",
      "/hakkimizda",
    );
    expect(screen.getByRole("link", { name: /İletişim/i })).toHaveAttribute(
      "href",
      "/iletisim",
    );
  });

  it("renders external Hasta Yatakları link in footer", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /^Hasta Yatakları$/i });
    expect(link).toHaveAttribute("href", "https://www.medikalhastayatak.com/");
    expect(link).toHaveAttribute("title", "Hasta Yatakları");
  });

  it("renders social media links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /instagram/i })).toHaveAttribute(
      "href",
      INSTAGRAM_URL,
    );
    expect(screen.getByRole("link", { name: /facebook/i })).toHaveAttribute(
      "href",
      FACEBOOK_URL,
    );
  });

  it("renders a copyright line", () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026/i)).toBeInTheDocument();
  });

  it("renders separate PayTR, Troy, Visa and Mastercard payment logos", () => {
    render(<Footer />);
    expect(screen.getByAltText("PayTR Sanal POS")).toBeInTheDocument();
    expect(screen.getByAltText("Troy")).toBeInTheDocument();
    expect(screen.getByAltText("Visa")).toBeInTheDocument();
    expect(screen.getByAltText("MasterCard")).toBeInTheDocument();
    expect(screen.queryByAltText("iyzico ile Öde")).not.toBeInTheDocument();
  });

  it("discloses PayTR as the payment service provider with a link", () => {
    render(<Footer />);
    expect(
      screen.getByText(/ödeme hizmetleri/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /PayTR Ödeme ve Elektronik Para Kuruluşu A\.Ş\./i,
      }),
    ).toHaveAttribute("href", "https://www.paytr.com");
  });

  it("renders both all-districts general link and district-specific landing page links", () => {
    render(<Footer />);
    const generalLink = screen.getByRole("link", { name: /Tüm Ankara İlçelerine/ });
    expect(generalLink).toHaveAttribute("href", "/ankara-hasta-yatagi");

    const districtLink = screen.getByRole("link", { name: /Çankaya Hasta Yatağı/i });
    expect(districtLink).toHaveAttribute("href", "/ankara-hasta-yatagi/cankaya");
  });
});
