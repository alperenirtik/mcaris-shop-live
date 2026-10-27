import type { Metadata } from"next";
import FavoritesClient from"./FavoritesClient";

export const metadata: Metadata = {
  title: "Favorilerim — MCARIS Medikal Ekipman & Hasta Çözümleri",
  description: "Favorilerinize eklediğiniz hasta yatakları, tekerlekli sandalyeler ve medikal ürünleri görüntüleyin.",
  alternates: {
    canonical: "/favoriler",
  },
  robots: {
    index: false,
    follow: false,
  },
};


export default function FavoritesPage() {
  return <FavoritesClient />;
}
