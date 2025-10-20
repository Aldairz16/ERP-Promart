/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#FF6F00',
          light: '#FFB74D',
          dark: '#E65100',
        },
        gray: {
          dark: '#2E2E2E',
          light: '#F5F5F5',
          medium: '#757575',
        },
        success: '#2E7D32',
        alert: '#E53935',
        background: '#F5F5F5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}