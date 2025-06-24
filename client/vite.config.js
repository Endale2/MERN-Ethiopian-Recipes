import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        'playfair-display': ['"Playfair Display"', 'serif'], // Ensure this is imported in your global CSS
      },
      keyframes: {
        'fade-in-down': {
          'from': { opacity: '0', transform: 'translateY(-20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          'from': { opacity: '0', transform: 'translateX(20px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-down': { // For mobile menu/dropdown
          'from': { opacity: '0', transform: 'scaleY(0)' },
          'to': { opacity: '1', transform: 'scaleY(1)' },
        },
        'flicker': { // Subtle flicker for the logo
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.98' }, // A very slight change for subtle flicker
        },
        'hover-underline': { // For dynamic underline
            'from': { width: '0%' },
            'to': { width: '100%' },
        },
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.8s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.6s ease-out forwards',
        'slide-down': 'slide-down 0.3s ease-out forwards', // Quick and smooth
        'flicker': 'flicker 4s infinite alternate', // Slow, repeating flicker
        'hover-underline': 'hover-underline 0.3s ease-out forwards',
      },
      boxShadow: { // Custom shadow for a softer, elevated look
        'custom-soft': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [react()],
})
