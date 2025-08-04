/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ff',
          100: '#fceeff',
          200: '#f9dcff',
          300: '#f5c2ff',
          400: '#ee98ff',
          500: '#e466ff',
          600: '#d444f1',
          700: '#b831d4',
          800: '#9627ab',
          900: '#7b2388',
          950: '#520f5c',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}