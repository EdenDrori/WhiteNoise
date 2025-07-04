/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#333333',
        accent: '#666666',
        'gray-light': '#f5f5f5',
        'gray-dark': '#1a1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      fontSize: {
        'hero': ['4.5rem', { lineHeight: '1.1' }],
        'subhero': ['2rem', { lineHeight: '1.3' }],
      },
      
    },
  },
  plugins: [],
} 