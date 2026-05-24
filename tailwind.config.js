/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0a',
        'bg-secondary': '#111111',
        'accent-primary': '#FF6B00',
        'accent-secondary': '#FF9A3C',
        'accent-glow': '#FF4500',
        'text-primary': '#FFFFFF',
        'text-secondary': '#E0E0E0',
        'text-muted': '#888888',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '40px',
        '2xl': '64px',
        '3xl': '96px',
      },
    },
  },
  plugins: [],
}
