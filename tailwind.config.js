/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'funac-orange': '#FF6B35',
        'funac-navy': '#1E3A8A',
        'funac-green': '#10B981',
        'funac-red': '#EF4444',
        'funac-yellow': '#FBBF24',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
