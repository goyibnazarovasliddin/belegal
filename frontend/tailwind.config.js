/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow':   'spinClockwise 7s linear infinite',
        'fade-in':     'fadeIn 250ms ease-out both',
        'fade-in-up':  'fadeInUp 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-up':    'slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-down':  'slideDown 300ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-left':  'slideInLeft 300ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'pop-in':      'popIn 220ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'shimmer':     'shimmer 1.8s linear infinite',
      },
      keyframes: {
        spinClockwise: {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-6px)', maxHeight: '0' },
          to:   { opacity: '1', transform: 'translateY(0)',    maxHeight: '2000px' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-100%)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        popIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
