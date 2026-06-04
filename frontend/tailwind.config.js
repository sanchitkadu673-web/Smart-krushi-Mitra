/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E7D32',
          light: '#A5D6A7',
          dark: '#1B5E20'
        },
        secondary: '#FFFFFF',
        accent: '#A5D6A7',
        background: '#F8FAF8',
        textMain: '#1B1B1B'
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
