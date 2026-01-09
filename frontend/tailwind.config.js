/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7765DA',
        secondary: '#5767D0',
        accent: '#4F0DCE',
        background: '#F2F2F2',
        textPrimary: '#373737',
        textSecondary: '#6E6E6E',
      },
      fontFamily: {
        sans: ['Exo 2', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

