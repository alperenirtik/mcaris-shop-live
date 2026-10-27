import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Şifremi Unuttum — MCARIS Medikal",
  description: "MCARIS hesap şifrenizi sıfırlayın.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
