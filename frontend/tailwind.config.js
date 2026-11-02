/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FAFAFA",
        primary: "#2563FF",
        secondary: "#FF4F64",
        textPrimary: "#1A1A1A",
        textSecondary: "#6B7280",
        border: "#E5E7EB",
      },
      fontFamily: {
        // Fonts are set per-project via :root CSS variables in index.css
        heading: ["var(--font-heading, Montserrat)", "sans-serif"],
        body: ["var(--font-body, Inter)", "sans-serif"],
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
