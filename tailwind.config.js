/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // cover all app files
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // if you use app router
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#15803d", // Green 700
          light: "#16a34a",   // Green 600
          min: "#dcfce7",     // Green 100
        },
      },
    },
  },
  plugins: [require("daisyui")],
};
