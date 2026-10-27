import Image from "next/image";

interface PaymentLogo {
  src: string;
  alt: string;
  width: number;
  height: number;
  href?: string;
}

const PAYMENT_LOGOS: PaymentLogo[] = [
  {
    src: "/images/paytr-logo.svg",
    alt: "PayTR Sanal POS",
    href: "https://www.paytr.com",
    width: 94,
    height: 16,
  },
  {
    src: "/images/troy.svg",
    alt: "Troy",
    width: 42,
    height: 20,
  },
  {
    src: "/images/visa.svg",
    alt: "Visa",
    width: 62,
    height: 20,
  },
  {
    src: "/images/mastercard.svg",
    alt: "MasterCard",
    width: 39,
    height: 24,
  },
];

const SIZE_STYLES = {
  sm: {
    wrap: "gap-1.5 sm:gap-2",
    image: "h-4 sm:h-[18px] w-auto object-contain",
  },
  md: {
    wrap: "gap-3 sm:gap-4",
    image: "h-6 sm:h-7 w-auto object-contain",
  },
} as const;

export default function PaymentLogos({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: keyof typeof SIZE_STYLES;
}) {
  const sizeStyles = SIZE_STYLES[size];

  return (
    <div
      className={`flex flex-wrap items-center justify-center ${sizeStyles.wrap} ${className}`}
      aria-label="PayTR Sanal POS, Troy, Visa ve MasterCard ödeme logoları"
    >
      {PAYMENT_LOGOS.map((logo) => {
        const image = (
          <Image
            src={logo.src}
            alt={logo.alt}
            title={logo.alt}
            width={logo.width}
            height={logo.height}
            className={sizeStyles.image}
          />
        );

        if (logo.href) {
          return (
            <a
              key={logo.alt}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={logo.alt}
              title={logo.alt}
              className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 rounded-sm"
            >
              {image}
              <span className="sr-only">{logo.alt}</span>
            </a>
          );
        }

        return (
          <span key={logo.alt} className="inline-flex items-center">
            {image}
          </span>
        );
      })}
    </div>
  );
}
