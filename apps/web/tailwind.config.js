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
          DEFAULT: '#34d399',
          hover: '#2ac187',
          glow: 'rgba(52, 211, 153, 0.2)'
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'scanner-laser': 'laser 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        laser: {
          '0%, 100%': { transform: 'translateY(-10px)', opacity: 0 },
          '10%': { opacity: 1 },
          '50%': { transform: 'translateY(160px)' },
          '90%': { opacity: 1 },
        }
      }
    },
  },
  plugins: [],
}
