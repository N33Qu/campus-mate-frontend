/** @type {import('tailwindcss').Config} */



export default {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {

    extend: {
      fontSize: {
        sm: 'calc(var(--scale) * 0.75rem)',
        base: 'calc(var(--scale) * 0.875rem)',
        lg: 'calc(var(--scale) * 1rem)',
        // itd.
      },
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
        button: "#4e4945",
        editButton: "#cdad81",
        editButtonHover: "#9e835e",
        saveButton: "#9e8168",
        saveButtonHover: "#7a6450",
        deleteButton: "#e06666",
        deleteButtonHover: "#ae4141",
        cancelButton: "#c6a361",
        cancelButtonHover: "#876f42",
        buttonHover: "#57534e",
        appBg: '#6a5d54',
        element: '#dcd7d2',
        elementLight: '#f4f2ef',
        elementHover: '#cac5bf',
        textLink: '#888580',
        textLinkHover: '#3a3832',
        headerText: '#4e4945',
        formFocus: '#3a3832',

      },
      fontFamily:{
        sans: ['Roboto', 'sans-serif']
      },

    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

