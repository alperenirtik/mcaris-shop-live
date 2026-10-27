import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PaymentLogos from "../PaymentLogos";

describe("PaymentLogos", () => {
  it("renders PayTR Sanal POS, Troy, Visa and Mastercard as distinct images", () => {
    render(<PaymentLogos />);

    const paytr = screen.getByAltText("PayTR Sanal POS");
    const troy = screen.getByAltText("Troy");
    const visa = screen.getByAltText("Visa");
    const mastercard = screen.getByAltText("MasterCard");

    expect(paytr).toHaveAttribute("src", "/images/paytr-logo.svg");
    expect(troy).toHaveAttribute("src", "/images/troy.svg");
    expect(visa).toHaveAttribute("src", "/images/visa.svg");
    expect(mastercard).toHaveAttribute("src", "/images/mastercard.svg");
    expect(screen.queryByAltText("iyzico ile Öde")).not.toBeInTheDocument();
  });

  it("applies the compact height class in sm size", () => {
    render(<PaymentLogos size="sm" />);
    expect(screen.getByAltText("Visa")).toHaveClass("h-4");
  });

  it("links the PayTR logo to the official PayTR site", () => {
    render(<PaymentLogos />);
    expect(screen.getByRole("link", { name: "PayTR Sanal POS" })).toHaveAttribute(
      "href",
      "https://www.paytr.com",
    );
  });
});
