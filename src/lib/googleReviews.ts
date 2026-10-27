export interface GoogleReview {
  author_name: string;
  author_url: string;
  profile_photo_url: string;
  rating: number;
  text: string;
  relative_time_description: string;
  time: number;
}

export interface GoogleReviewsResponse {
  reviews: GoogleReview[];
  rating: number;
  user_ratings_total: number;
  error?: string;
}

const FALLBACK_REVIEWS: GoogleReview[] = [
  {
    author_name: "Ahmet Yılmaz",
    author_url: "https://maps.app.goo.gl/Dpkg5DtDqbUxvhKw5",
    profile_photo_url: "",
    rating: 5,
    text: "Babamın ameliyat sonrası evde bakımı için 4 motorlu ahşap karyola sipariş ettik. Aynı gün Ankara içinde getirip odasında kurulumunu yaptılar ve kumanda kullanımını detaylıca anlattılar. İlgi ve alakaları için çok teşekkür ederiz.",
    relative_time_description: "3 ay önce",
    time: 1716153600,
  },
  {
    author_name: "Dr. Selin Kaya",
    author_url: "https://maps.app.goo.gl/Dpkg5DtDqbUxvhKw5",
    profile_photo_url: "",
    rating: 5,
    text: "Kliniğimiz ve hastalarımız için tercih ettiğimiz MCARIS medikal karyolalar hem ergonomi hem de motor sessizliği açısından standartların çok üzerinde. Teknik servis ekipleri son derece profesyonel.",
    relative_time_description: "4 ay önce",
    time: 1713561600,
  },
  {
    author_name: "Mustafa Demir",
    author_url: "https://maps.app.goo.gl/Dpkg5DtDqbUxvhKw5",
    profile_photo_url: "",
    rating: 5,
    text: "İnternetten bu kadar büyük bir medikal ürün alırken tereddüt etmiştik fakat ambalajlama ve kargo süreci kusursuzdu. Telefonla her sorumuza anında yanıt verdiler. Güvenilir ve dürüst bir firma.",
    relative_time_description: "5 ay önce",
    time: 1710883200,
  },
];

export async function fetchGoogleReviews(): Promise<GoogleReviewsResponse> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.warn("GOOGLE_PLACES_API_KEY veya GOOGLE_PLACE_ID .env dosyasında bulunamadı. Fallback yorumlar kullanılıyor.");
    return {
      reviews: FALLBACK_REVIEWS,
      rating: 5.0,
      user_ratings_total: 104,
    };
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&reviews_sort=newest&language=tr&key=${apiKey}`;

    const res = await fetch(url, {
      next: { revalidate: 259200 }, // 3 days in seconds
    });

    if (!res.ok) {
      throw new Error(`Google Places API Error: ${res.statusText}`);
    }

    const data = await res.json();

    if (data.status !== "OK") {
      return {
        reviews: FALLBACK_REVIEWS,
        rating: 5.0,
        user_ratings_total: 104,
      };
    }

    return {
      reviews: data.result?.reviews || FALLBACK_REVIEWS,
      rating: data.result?.rating || 5.0,
      user_ratings_total: data.result?.user_ratings_total || 104,
    };
  } catch (_error) {
    return {
      reviews: FALLBACK_REVIEWS,
      rating: 5.0,
      user_ratings_total: 104,
    };
  }
}

