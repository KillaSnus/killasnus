import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        background: '#09090b',
        foreground: '#f4f4f5',
        card: {
          DEFAULT: '#111114',
          foreground: '#f4f4f5',
        },
        popover: {
          DEFAULT: '#111114',
          foreground: '#f4f4f5',
        },
        primary: {
          DEFAULT: '#d4af37', // metallic gold
          foreground: '#09090b',
          light: '#f3e5ab',
          dark: '#9a7b20',
        },
        secondary: {
          DEFAULT: '#1f1f23',
          foreground: '#f4f4f5',
        },
        muted: {
          DEFAULT: '#1f1f23',
          foreground: '#a1a1aa',
        },
        accent: {
          DEFAULT: '#27272a',
          foreground: '#f4f4f5',
        },
        border: '#27272a',
        gold: {
          50: '#fdfbf0',
          100: '#faf5dc',
          200: '#f3e8b3',
          300: '#ebd682',
          400: '#e2bf4f',
          500: '#d4af37',
          600: '#b89028',
          700: '#946e20',
          800: '#7a571f',
          900: '#67471e',
          950: '#3c260d',
        },
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #fce08e 0%, #d4af37 50%, #9a7b20 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #d4af37 0%, #fef3c7 50%, #d4af37 100%)',
        'dark-card': 'linear-gradient(180deg, rgba(26,26,30,0.8) 0%, rgba(14,14,17,0.95) 100%)',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
};

export default config;

