import { render, screen } from"@testing-library/react";
import { describe, it, expect, vi } from"vitest";
import RegisterPage from"../page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("RegisterPage", () => {
  it("renders register form with name, email, phone and password fields", () => {
    render(<RegisterPage />);

    expect(screen.getByRole("heading", { name:"Kayıt Ol" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Ad Soyad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-posta Adresi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefon Numarası/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name:"Kayıt Ol ve Giriş Yap" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name:"Giriş Yap" })).toBeInTheDocument();
  });
});
