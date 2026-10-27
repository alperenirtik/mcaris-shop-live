import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş Yap — MCARIS Medikal",
  description: "MCARIS hesabınıza giriş yapın.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
