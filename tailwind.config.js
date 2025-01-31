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
          'xxs': '0px',
          'xs': '500px',
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
        changePasswordButton: "#3947b8",
        changePasswordButtonHover: "#2a3585",
        addButton: "#1649ae",
        addButtonHover: "#08368c",
        editButton: "#0bae0b",
        editButtonHover: "#39a100",
        saveButton: "#9e8168",
        saveButtonHover: "#7a6450",
        deleteButton: "#c80a0a",
        deleteButtonHover: "#950707",
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

