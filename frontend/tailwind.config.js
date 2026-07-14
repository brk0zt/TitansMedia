/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        titans: {
          bg: '#09090B',
          card: '#18181B',
          accent: '#E11D48',
          'accent-hover': '#BE123C',
          border: 'rgba(255,255,255,0.06)',
          muted: '#A1A1AA',
          surface: '#27272A',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(225, 29, 72, 0.15)',
        glow: '0 0 30px rgba(225, 29, 72, 0.2)',
        'glow-lg': '0 0 50px rgba(225, 29, 72, 0.25)',
        'soft-sm': '0 4px 20px rgba(0,0,0,0.3)',
        soft: '0 8px 40px rgba(0,0,0,0.35)',
        'soft-lg': '0 12px 60px rgba(0,0,0,0.4)',
      },
      transitionDuration: {
        '250': '250ms',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(225, 29, 72, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(225, 29, 72, 0.3)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
