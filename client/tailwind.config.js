/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Basketball-themed colors
        court: '#e6b65a', // Court color
        team: {
          1: '#c62828', // Team 1 - Red
          2: '#1565c0', // Team 2 - Blue
          3: '#2e7d32', // Team 3 - Green
          4: '#6a1b9a', // Team 4 - Purple
          5: '#ff8f00', // Team 5 - Orange
          6: '#00838f', // Team 6 - Teal
          7: '#558b2f', // Team 7 - Light Green
          8: '#4527a0', // Team 8 - Deep Purple
          9: '#d81b60', // Team 9 - Pink
          10: '#283593', // Team 10 - Indigo
          11: '#00695c', // Team 11 - Dark Teal
          12: '#ef6c00', // Team 12 - Dark Orange
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      animation: {
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
      },
      gridTemplateColumns: {
        'draft-board': 'repeat(auto-fit, minmax(120px, 1fr))',
      },
      gridTemplateRows: {
        'draft-rounds': 'repeat(auto-fit, minmax(40px, 1fr))',
      }
    },
  },
  plugins: [],
}