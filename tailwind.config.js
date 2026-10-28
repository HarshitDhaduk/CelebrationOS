/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf4f5',
          100: '#fce7ea',
          200: '#f9d2d8',
          300: '#f4adb8',
          400: '#eb7b8f',
          500: '#de4b68',
          600: '#c82e50',
          700: '#a7213e',
          800: '#8c1e36',
          900: '#771d32',
          950: '#420b17',
        },
        festive: {
          gold: '#f59e0b',
          amber: '#d97706',
          purple: '#8b5cf6',
          indigo: '#6366f1',
          rose: '#f43f5e',
          emerald: '#10b981',
          teal: '#14b8a6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
