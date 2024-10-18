/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1B62C5',
        'primary-dark': '#012b7A',
        'primary-darker': '#01328E',
        'primary-light': '#0241b6',
        'primary-lighter': '#024FDE',
        'off-white': '#FAFAFA',
      },
      fontFamily: {
        'pangaia': ['PP Pangaia', 'sans-serif'],
        'neue-montreal': ['PP Neue Montreal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}