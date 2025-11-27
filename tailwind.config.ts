import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cosmic-dark': '#0f0d1d',
        'cosmic-card': '#f8f9fa',
        'cosmic-input': '#ffffff',
        'cosmic-border': '#e9ecef',
        'cosmic-primary': '#6c5ce7',
        'cosmic-primary-light': '#8b7bff',
        'cosmic-secondary': '#5f3dc4',
        'cosmic-accent': '#7950f2',
        'cosmic-text': '#212529',
        'cosmic-text-muted': '#6c757d',
      },
      animation: {
        'card-appear': 'card-appear 0.3s ease-out',
      },
      keyframes: {
        'card-appear': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
