import { render, screen } from"@testing-library/react";
import { describe, it, expect, vi } from"vitest";
import LoginPage from"../page";

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => (key ==="redirect" ?"" : null),
  }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("LoginPage", () => {
  it("renders login form with email and password fields", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { name:"Giriş Yap" })).toBeInTheDocument();
    expect(screen.getByLabelText(/E-posta Adresi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Şifre/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name:"Giriş Yap" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name:"Kayıt Ol" })).toBeInTheDocument();
  });
});
