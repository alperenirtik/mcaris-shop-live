import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "#152A4A",
        "primary-foreground": "#ffffff",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Existing brand & medical tokens
        brand: {
          DEFAULT: "#26425E",
          dark: "#162b40",
          light: "#eef3f8",
        },
        platinum: "#2C3E6B",
        gold: "#C8A951",
        silver: "#8E99A4",
        danger: "#E53935",
        warning: "#FF9800",
        success: "#4CAF50",
        "bg-light": "#F7F8FA",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        jakarta: ["var(--font-plus-jakarta)", "sans-serif"],
        inter: ["var(--font-plus-jakarta)", "var(--font-inter)", "sans-serif"],
        poppins: ["var(--font-plus-jakarta)", "sans-serif"],
        headline: ["var(--font-plus-jakarta)", "sans-serif"],
        body: ["var(--font-plus-jakarta)", "var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        "container-max": "1300px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "card-hover": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "2xs": "0 1px 1px 0 rgb(0 0 0 / 0.03)",
      },
    },
  },
  plugins: [],
};

export default config;
