/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#F5F3FF",   // Soft light lavender background
          DEFAULT: "#6D28D9", // Primary purple
          dark: "#4C1D95",    // Darker purple
          pink: "#FBCFE8",    // Soft pastel pink
          pinkdark: "#DB2777",// Darker pink
          pastel: "#FAF5FF",  // Calming pastel background
          text: "#1E1B4B",    // Deep indigo text
          muted: "#6B7280",   // Gray muted text
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(109, 40, 217, 0.05), 0 2px 8px -1px rgba(109, 40, 217, 0.03)',
        card: '0 10px 30px -5px rgba(109, 40, 217, 0.08), 0 4px 12px -2px rgba(109, 40, 217, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}
