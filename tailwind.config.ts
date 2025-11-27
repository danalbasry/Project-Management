import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        'cosmic-bg': '#f5f5f7',
        'cosmic-card': '#ffffff',
        'cosmic-input': '#ffffff',
        'cosmic-border': '#e5e7eb',
        'cosmic-primary': '#6c5ce7',
        'cosmic-primary-light': '#8b7bff',
        'cosmic-secondary': '#5f3dc4',
        'cosmic-accent': '#7950f2',
        'cosmic-text': '#1f2937',
        'cosmic-text-muted': '#6b7280',
        // Dark mode colors (prefixed with dark-)
        'cosmic-dark-bg': '#0f0d1d',
        'cosmic-dark-card': '#1a1625',
        'cosmic-dark-input': '#252136',
        'cosmic-dark-border': '#3d3654',
        'cosmic-dark-text': '#f3f4f6',
        'cosmic-dark-text-muted': '#9ca3af',
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
