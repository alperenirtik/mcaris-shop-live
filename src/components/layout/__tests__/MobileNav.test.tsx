import { render, screen, fireEvent } from"@testing-library/react";
import { describe, it, expect } from"vitest";
import MobileNav from"../MobileNav";

const categories = [
  { id:"1", slug:"hasta-yataklari", name:"Hasta Yatakları" },
  { id:"2", slug:"tekerlekli-sandalyeler", name:"Tekerlekli Sandalyeler" },
];

describe("MobileNav", () => {
  it("renders a closed drawer with a toggle button", () => {
    render(<MobileNav categories={categories} />);
    expect(screen.getByRole("button", { name: /menü/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name:"Ana Sayfa" })).not.toBeInTheDocument();
  });

  it("opens the drawer and shows all navigation links on toggle click", () => {
    render(<MobileNav categories={categories} />);
    fireEvent.click(screen.getByRole("button", { name: /menü/i }));

    expect(screen.getByRole("link", { name: /ana sayfa/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /tüm ürünler/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /platinum/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /gold/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /silver/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /hasta yatakları/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /tekerlekli sandalyeler/i })).toBeInTheDocument();
  });

  it("closes the drawer when the toggle button is clicked again", () => {
    render(<MobileNav categories={categories} />);
    const toggle = screen.getByRole("button", { name: /menü/i });
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    expect(screen.queryByRole("link", { name: "Ana Sayfa" })).not.toBeInTheDocument();
  });

  it("does not render admin panel links when user is null or regular user", () => {
    render(
      <MobileNav
        categories={categories}
        user={{ id: "u1", email: "test@user.com", role: "USER", name: "Test" }}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /menü/i }));
    expect(screen.queryByText("Yönetici Paneli")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /özet panel/i })).not.toBeInTheDocument();
  });

  it("renders admin panel links when user has ADMIN role", () => {
    render(
      <MobileNav
        categories={categories}
        user={{ id: "a1", email: "admin@mcaris.com", role: "ADMIN", name: "Admin" }}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /menü/i }));
    expect(screen.getByText("Yönetici Paneli")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /özet panel/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /siparişler/i })).toBeInTheDocument();
  });
});
