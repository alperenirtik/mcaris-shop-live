import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kayıt Ol — MCARIS Medikal",
  description: "Yeni bir MCARIS hesabı oluşturun.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
