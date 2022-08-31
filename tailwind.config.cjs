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
      'sm': '320px',
      // => @media (min-width: 320px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
  },
  plugins: [],
}
}