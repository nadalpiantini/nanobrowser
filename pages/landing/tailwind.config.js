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
        // Miami 80's Palette
        neon: {
          pink: '#FF10F0',
          cyan: '#00F0FF',
          yellow: '#FFF000',
          purple: '#B026FF',
          orange: '#FF6B35',
        },
        miami: {
          night: '#1e293b', // Same as side panel (slate-800)
          dark: '#1A1F3A',
          grid: '#2A2F4A',
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
          '0%': { textShadow: '0 0 20px #FF10F0, 0 0 30px #FF10F0, 0 0 40px #FF10F0' },
          '100%': { textShadow: '0 0 30px #00F0FF, 0 0 40px #00F0FF, 0 0 50px #00F0FF' },
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
