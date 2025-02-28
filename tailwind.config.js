/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        customDark: {
          50: '#D1D9DB',
          100: '#A6B1B6',
          200: '#7C8B92',
          300: '#4F6B71',
          400: '#2B4D57',
          500: '#204656',
          600: '#1C3B4D',
          700: '#0C1424',
          800: '#1C3444',
          900: '#122030',
          950: '#1C2C40',
        },
        customGreen: {
          50: '#A1B79E',
          100: '#88A68D',
          200: '#6E8C6D',
          300: '#4E724C',
          400: '#2F5933',
          500: '#48583C',
          600: '#3A4B31',
          700: '#2D3A28',
          800: '#1E281E',
          900: '#0F1815',
          950: '#040404',
        },
        customGray: {
          50: '#B6B6B6',
          100: '#9E9E9E',
          200: '#868686',
          300: '#6E6E6E',
          400: '#565656',
          500: '#54545C',
          600: '#424242',
          700: '#323232',
          800: '#222222',
          900: '#121212',
          950: '#040404',
        },
      },
      backgroundImage: {
        'gradient-dark-green': 'linear-gradient(135deg, #204656, #48583C)',  // Gradiente entre tonos oscuros y verdes
        'gradient-blue-gray': 'linear-gradient(135deg, #1C3444, #54545C)', // Gradiente de tonos azules y grises
        'gradient-dark-gray': 'linear-gradient(135deg, #1C2C40, #0F1815)', // Gradiente de tonos oscuros y grises
      }
    }
  },
  plugins: [],
}
