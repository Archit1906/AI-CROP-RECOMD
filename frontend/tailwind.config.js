/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          green: '#1B5E20',
          light: '#4CAF50',
          gold: '#F9A825',
          soil: '#795548',
          sky: '#0288D1',
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
