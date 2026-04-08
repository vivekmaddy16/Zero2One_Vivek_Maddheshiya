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
          50: '#fff8ea',
          100: '#ffefc8',
          200: '#ffe092',
          300: '#ffcb57',
          400: '#ffb625',
          500: '#f59e0b',
          600: '#dd8607',
          700: '#b9680b',
          800: '#955212',
          900: '#784415',
        },
        accent: {
          50: '#eefaf1',
          100: '#d7f3df',
          200: '#b3e8c2',
          300: '#81d59a',
          400: '#4fb86f',
          500: '#2f9b59',
          600: '#257e48',
          700: '#21663d',
          800: '#1e5234',
          900: '#19442c',
        },
        ink: {
          50: '#f8f8fb',
          100: '#eef0f6',
          200: '#dce1ec',
          300: '#bec8da',
          400: '#93a2bc',
          500: '#6f7f9b',
          600: '#55627e',
          700: '#3f4b66',
          800: '#27334a',
          900: '#172033',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Manrope', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
      boxShadow: {
        'soft': '0 18px 42px -32px rgba(120, 87, 29, 0.34), 0 10px 20px -18px rgba(23, 32, 51, 0.12)',
        'soft-lg': '0 30px 72px -42px rgba(120, 87, 29, 0.3), 0 16px 32px -24px rgba(23, 32, 51, 0.12)',
        'soft-xl': '0 42px 96px -46px rgba(120, 87, 29, 0.32), 0 20px 36px -28px rgba(23, 32, 51, 0.14)',
        'primary': '0 18px 40px -18px rgba(245, 158, 11, 0.45)',
        'accent': '0 18px 40px -18px rgba(47, 155, 89, 0.34)',
      },
    },
  },
  plugins: [],
}
