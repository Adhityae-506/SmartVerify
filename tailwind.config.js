/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f3ff',
          100: '#dde3f7',
          200: '#b8c4ef',
          300: '#8a9de3',
          400: '#5c75d4',
          500: '#3a54c4',
          600: '#1a237e',
          700: '#161d6b',
          800: '#121858',
          900: '#0e1245',
        },
        teal: {
          50: '#e6faf8',
          500: '#0d9488',
          600: '#0b7f74',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
