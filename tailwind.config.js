/** @type {import('tailwindcss').Config} */



export default {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
          'sm': '860px',
          'md': '1024px',
          'lg': '1280px',
          'xl': '1876px',
      },
      colors: {
        purple: '#67527A',
        pink: '#8D7F9F',
        snow: '#F7F0F0',
        el_color : "black"

      },
      fontFamily:{
        sans: ['Roboto', 'sans-serif']
      },
      gridTemplateColumns: {
        '70/30': '70% 28%',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

