/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef2f7",
          100: "#d7e1ee",
          200: "#b0c3dd",
          300: "#7f9bc4",
          400: "#4f70a0",
          500: "#2f4d78",
          600: "#1E3A5F",
          700: "#182f4d",
          800: "#14213D",
          900: "#0c1526",
        },
        teal: {
          50: "#eafbf8",
          100: "#c9f4ec",
          200: "#94e8d9",
          300: "#5cd8c3",
          400: "#2DD4BF",
          500: "#1cb8a4",
          600: "#159485",
          700: "#12766c",
        },
        coral: {
          50: "#fff1ec",
          100: "#ffdccf",
          400: "#FF8A6A",
          500: "#FF6B4A",
          600: "#e6502f",
        },
        ink: "#1A202C",
        canvas: "#F5F7FA",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,33,61,0.06), 0 4px 12px rgba(20,33,61,0.06)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
}


