/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/*.handlebars"
  ],
  theme: {
    extend: {
      fontFamily: {
        'babas': ['"Bebas Neue"', 'cursive'],
        'graduate': ['"Graduate"', 'cursive'],
        'righteous': ['"Righteous"', 'serif'],
      },
    },
    container: {
      center: true,
      padding: "1rem"
    },
    screens: {
      'phone': {'min': '320px', 'max': '767px'},
      // => @media (min-width: 320px) { ... }

      'tablet': {'min': '768px', 'max': '1023px'},
      // => @media (min-width: 768px) { ... }

      'laptop': {'min': '1280px', 'max': '1535px'},
      // => @media (min-width: 1280px) { ... }
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
}