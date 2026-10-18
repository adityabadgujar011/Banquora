/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxe: {
          gold: '#C59A27',
          goldDark: '#A37D1A',
          goldLight: '#FDF8EB',
          obsidian: '#0F172A',
          charcoal: '#1E293B',
          muted: '#64748B',
          canvas: '#FAFAFC',
          card: '#FFFFFF',
          emerald: '#047857',
          emeraldLight: '#ECFDF5',
          border: 'rgba(226, 232, 240, 0.8)'
        },
        primary: {
          DEFAULT: '#C59A27',
          50: '#FDF8EB',
          100: '#FBF0D3',
          200: '#F6E0A4',
          300: '#EFCF75',
          400: '#E5BE4B',
          500: '#C59A27', // Luxury Champagne Gold
          600: '#A67F1A',
          700: '#846214',
          800: '#644811',
          900: '#422F0D',
        },
        darkgreen: {
          DEFAULT: '#047857',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857', // Trust Emerald
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        gold: {
          DEFAULT: '#C59A27',
          50: '#FDF8EB',
          100: '#FBF0D3',
          200: '#F6E0A4',
          300: '#EFCF75',
          400: '#E5BE4B',
          500: '#C59A27', // Regal Brushed Gold
          600: '#A67F1A',
          700: '#846214',
          800: '#644811',
          900: '#422F0D',
        },
        cream: {
          DEFAULT: '#FAFAFC', // Modern Luminous Canvas
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#FAFAFC',
          300: '#F1F5F9',
          400: '#E2E8F0',
        },
        royalText: {
          DEFAULT: '#0F172A', // Modern Deep Obsidian
          muted: '#475569',
          light: '#64748B',
          dark: '#020617'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxe': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        'luxe-lg': '0 20px 40px -8px rgba(15, 23, 42, 0.08), 0 8px 16px -4px rgba(15, 23, 42, 0.03)',
        'luxe-gold': '0 0 25px rgba(197, 154, 39, 0.18)',
        'royal': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        'royal-lg': '0 20px 40px -8px rgba(15, 23, 42, 0.08), 0 8px 16px -4px rgba(15, 23, 42, 0.03)',
        'royal-gold': '0 0 25px rgba(197, 154, 39, 0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'float-gentle': 'floatGentle 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      }
    },
  },
  plugins: [],
}
