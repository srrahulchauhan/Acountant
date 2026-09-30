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
          yellow: '#F59E0B',
          yellowLight: '#FEF3C7',
          yellowHover: '#D97706',
          navy: '#0F172A',
          navyCard: '#1E293B',
          navyLight: '#334155',
          pink: '#EC4899',
          pinkLight: '#FDF2F8',
          sky: '#0284C7',
          skyLight: '#F0F9FF',
          red: '#EF4444',
          redLight: '#FEF2F2',
          green: '#10B981',
          greenLight: '#ECFDF5',
          surface: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
        dark: {
          bg: '#080C15',
          card: '#101726',
          cardHover: '#162034',
          border: 'rgba(255, 255, 255, 0.08)',
          subtle: 'rgba(255, 255, 255, 0.04)',
        }
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 4px 10px -2px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 10px 20px -5px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glow-yellow': '0 0 30px -4px rgba(245, 158, 11, 0.4)',
        'glow-sky': '0 0 30px -4px rgba(2, 132, 199, 0.4)',
        'glow-pink': '0 0 30px -4px rgba(236, 72, 153, 0.4)',
        'glow-green': '0 0 30px -4px rgba(16, 185, 129, 0.4)',
        'glow-purple': '0 0 30px -4px rgba(168, 85, 247, 0.4)',
        'glow-red': '0 0 30px -4px rgba(239, 68, 68, 0.4)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
