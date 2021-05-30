
const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    zIndex:{
      '1':1,
      '999':999
    },
    extend: {
      colors:{
        lime:colors.lime,
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
