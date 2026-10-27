import { render, screen, fireEvent } from"@testing-library/react";
import { describe, it, expect, vi, beforeEach } from"vitest";
import HeaderClient from"../HeaderClient";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe("Header", () => {
  beforeEach(() => {
    pushMock.mockReset();
  });

  it("renders the MCARIS logo image and search input", () => {
    render(<HeaderClient user={null} cartItemCount={0} />);
    expect(screen.getByAltText("MCARIS")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ara/i)).toBeInTheDocument();
  });

  it("renders WhatsApp support and favorites links", () => {
    render(<HeaderClient user={null} cartItemCount={0} />);
    expect(screen.getByText("WhatsApp Danışma Hattı")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Favorilerim" })[0]).toHaveAttribute("href", "/favoriler");
  });

  it("navigates to the product listing with the query on submit", () => {
    render(<HeaderClient user={null} cartItemCount={0} />);
    fireEvent.change(screen.getByPlaceholderText(/ara/i), { target: { value:"yatak" } });
    fireEvent.click(screen.getByRole("button", { name: /ara/i }));
    expect(pushMock).toHaveBeenCalledWith("/urunler?q=yatak");
  });

  it("navigates to the plain listing when the query is empty", () => {
    render(<HeaderClient user={null} cartItemCount={0} />);
    fireEvent.click(screen.getByRole("button", { name: /ara/i }));
    expect(pushMock).toHaveBeenCalledWith("/urunler");
  });

  it("renders logged-in user pill button with avatar initial and first name", () => {
    const mockUser = {
      id: "1",
      name: "Çağrı",
      email: "cagri@mcaris.com",
      role: "USER" as const,
    };
    render(<HeaderClient user={mockUser} cartItemCount={0} />);
    const accountLink = screen.getAllByRole("link", { name: /çağrı/i })[0];
    expect(accountLink).toBeInTheDocument();
    expect(accountLink).toHaveAttribute("href", "/hesabim");
    expect(screen.getAllByText("Ç")).toHaveLength(2);
    expect(screen.getByText("Çağrı")).toBeInTheDocument();
  });
});
