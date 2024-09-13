/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1565C0',
        'primary-dark': '#0D47A1',
        'primary-light': '#64B5F6',
        'accent': '#FFC107',
        'off-white': '#F5F5F5',
        'dark-gray': '#333333',
        'light-gray': '#BDBDBD',
      },
      fontFamily: {
        'pangaia': ['PP Pangaia', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

