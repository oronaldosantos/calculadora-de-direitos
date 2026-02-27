/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#5D6EEC',
        midnight: '#1E2243',
        violet: '#4653B1',
        platinum: '#E9E9E9',
        silver: '#AFAFAF',
        raspberry: '#C63968',
        clay: '#DC6242',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        badge: '0 4px 20px rgba(30, 34, 67, 0.15)',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.88)', opacity: '0.8' },
          '70%': { transform: 'scale(1.2)', opacity: '0' },
          '100%': { transform: 'scale(1.2)', opacity: '0' },
        },
        slideUp: {
          from: { transform: 'translateY(16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        pulseRing: 'pulseRing 2s infinite',
        slideUp: 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
