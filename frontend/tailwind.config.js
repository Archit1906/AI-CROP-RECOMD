/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          green: '#22C55E', // updated brand green
          light: '#4CAF50',
          gold: '#FBBF24', // updated brand gold
          soil: '#795548',
          sky: '#0288D1',
        },
        dashboard: {
          deep: '#0A0F0A',
          sidebar: '#0F1A0F',
          card: '#162116',
          cardHover: '#1E2E1E',
          border: '#2D4A2D',
        }
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
