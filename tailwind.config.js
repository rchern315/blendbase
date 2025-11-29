/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#12bca2',        // Teal (navbar)
        'primary-600': '#0e9682',    // Darker teal
        'secondary': '#6d15df',      // Purple
        'secondary-600': '#5711b3',  // Darker purple
        'pink': '#ff4f87',           // Wild Watermelon (cards)
        'pink-600': '#ff3670',       // Darker pink
        'yellow': '#f0a035',         // Fuel Yellow
      },
      fontFamily: {
        sans: ['Work Sans', 'sans-serif'],      // Body font
        heading: ['Jost', 'sans-serif'],        // Headlines
      },
      boxShadow: {
        'card': '0 0 88px 0 rgba(0, 0, 0, 0.16)',
        'card-hover': '0 20px 60px 0 rgba(0, 0, 0, 0.25)',
        'thumb': '0px 0px 130px 0 rgba(0, 0, 0, 0.38)',
        'button-hover': '0 10px 34px 0 rgba(255, 79, 135, 0.32)',
      },
    },
  },
  plugins: [],
}