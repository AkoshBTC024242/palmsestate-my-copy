/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#E65100',
        'primary-dark': '#D84315',
        accent: '#FFF3E0',
      },
    },
  },
  plugins: [],
}
