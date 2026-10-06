/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F8F4E8',
        ink: '#09090B',
        acid: '#D2E823',
      },
      fontFamily: {
        display: ['"Dela Gothic One"', 'cursive'],
        body: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px 0px var(--tw-shadow-color, #09090B)',
        'brutal-md': '4px 4px 0px 0px var(--tw-shadow-color, #09090B)',
        'brutal-lg': '8px 8px 0px 0px var(--tw-shadow-color, #09090B)',
      },
      borderWidth: {
        'DEFAULT': '2px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
      },
      backgroundImage: {
        'dot-pattern': 'radial-gradient(var(--tw-gradient-stops) 1px, transparent 1px)',
      }
    }
  },
  plugins: [],
}
