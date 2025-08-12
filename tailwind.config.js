/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#5B2A86",
          indigo: "#2D1B69",
          gold: "#F1C376"
        }
      }
    }
  },
  plugins: [],
};