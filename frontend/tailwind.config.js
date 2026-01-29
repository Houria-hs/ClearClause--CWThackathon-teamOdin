/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        scan: {
          '0%': { top: '0%', opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { top: '100%', opacity: 0 },
        }
      },
      animation: {
        scan: 'scan 2s ease-in-out infinite',
      },
      fontFamily: {
        sans: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};




