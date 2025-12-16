/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#E65100', // Deep orange
        accent: '#FF8A65',
      },
    },
  },
  plugins: [],
}
