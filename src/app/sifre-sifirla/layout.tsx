import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Şifre Sıfırla — MCARIS Medikal",
  description: "MCARIS hesap şifrenizi güncelleyin.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
