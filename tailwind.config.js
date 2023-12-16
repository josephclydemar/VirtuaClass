/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      textColor: {
        'primary': '#3490dc', // Example custom color
        'secondary': '#ffed4a'
      }
    },
  },
  plugins: [],
}

