/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          orange: '#FF9900',
          yellow: '#F0C14B',
          dark: '#131921',
        }
      }
    },
  },
  plugins: [],
}