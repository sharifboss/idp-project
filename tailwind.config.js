/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F9FAFB',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mylight: {
          "primary": "#3B82F6",
          "secondary": "#F59E0B",
          "accent": "#10B981",
          "neutral": "#6B7280",
          "base-100": "#F9FAFB", // Your background color
          "base-content": "#000000", // Force black text
        },
      },
    ],
  },
}