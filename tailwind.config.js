/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        encode: ['Encode Sans Expanded', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 12px 12px 4px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
