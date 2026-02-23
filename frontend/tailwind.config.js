/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      animation: {
        'blob': 'blob 8s infinite ease-in-out',
        'fade-up': 'fade-up .5s ease both',
        'slide-in': 'slide-in .4s ease both',
        'shimmer': 'shimmer 1.5s infinite linear',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
      },
      keyframes: {
        blob: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(30px,-50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px,20px) scale(0.9)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          from: { backgroundPosition: '-400px 0' },
          to: { backgroundPosition: '400px 0' },
        },
        'gradient-shift': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(.9)', boxShadow: '0 0 0 0 rgba(99,102,241,.4)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 16px rgba(99,102,241,0)' },
          '100%': { transform: 'scale(.9)', boxShadow: '0 0 0 0 rgba(99,102,241,0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(99,102,241,.25)',
        'glow-sm': '0 0 20px rgba(99,102,241,.15)',
        'inner-sm': 'inset 0 1px 2px rgba(0,0,0,.05)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
