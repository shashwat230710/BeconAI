/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'verified-green': '#059669',
        'misleading-amber': '#D97706',
        'false-red': '#DC2626',
        'opinion-purple': '#7C3AED',
        'ai-generated-teal': '#0D9488',
        'neutral-gray': '#6B7280',
        
        'surface-white': '#FFFFFF',
        'surface-light': '#F8FAFC',
        'surface-gray': '#F1F5F9',
        'surface-dark': '#1E293B',
        
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
        'text-tertiary': '#94A3B8',
        'text-inverse': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
