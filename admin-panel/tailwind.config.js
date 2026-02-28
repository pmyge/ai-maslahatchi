/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#1a1a2e",
        darkCard: "#16213e",
        accent: "#0ea5e9",
      }
    },
  },
  plugins: [],
}
