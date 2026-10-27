import { render, screen } from"@testing-library/react";
import { describe, it, expect } from"vitest";
import AboutPage from"../page";

describe("AboutPage", () => {
  it("renders the page heading", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { name: /hakkımızda/i })).toBeInTheDocument();
  });

  it("renders the company description text", () => {
    render(<AboutPage />);
    expect(screen.getAllByText(/mcaris/i).length).toBeGreaterThan(0);
  });
});
