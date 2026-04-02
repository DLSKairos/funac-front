/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'scroll-x': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'scroll-x': 'scroll-x 30s linear infinite',
      },
      colors: {
        'funac-orange': '#C05425',
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
