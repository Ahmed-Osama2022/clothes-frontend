/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        ink: {
          50: '#f6f6f7',
          100: '#e3e4e5',
          200: '#c7c9cb',
          300: '#a4a7aa',
          400: '#818589',
          500: '#676b70',
          600: '#52565b',
          700: '#44474c',
          800: '#2b2d31',
          900: '#1c1d20',
          950: '#121214',
        },
        snow: {
          50: '#ffffff',
          100: '#f8f9fa',
          200: '#e9eaed',
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
    },
  },
  plugins: [],
}