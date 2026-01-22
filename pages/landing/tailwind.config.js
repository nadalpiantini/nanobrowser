/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Freejack Logo Palette (80's Miami spray paint)
        neon: {
          cyan: '#2DD4BF', // Primary - turquoise from logo
          teal: '#14B8A6', // Deeper variant
          magenta: '#E91E8C', // Secondary - magenta from logo
          pink: '#FF3CAC', // Vibrant highlight
          crimson: '#C41E3A', // Emphasis - crimson from logo
        },
        miami: {
          dark: '#050508', // Mac Tahoe deep black
          card: '#0C0C12', // Card surface
          elevated: '#141420', // Elevated elements
        },
      },
      fontFamily: {
        display: ['SF Pro Display', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'monospace'],
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite alternate',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 20px #2DD4BF, 0 0 30px #2DD4BF, 0 0 40px #2DD4BF' },
          '50%': { textShadow: '0 0 30px #E91E8C, 0 0 40px #E91E8C, 0 0 50px #E91E8C' },
          '100%': { textShadow: '0 0 20px #C41E3A, 0 0 30px #C41E3A, 0 0 40px #C41E3A' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};
