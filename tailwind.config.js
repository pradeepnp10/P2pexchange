// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all JS, JSX, TS, and TSX files in the src folder
    "./src/styles/*.css"          // Includes CSS files in the styles folder within src
  ],
  theme: {
    extend: {
      fontFamily: {
        'nexa': ['Nexa', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
