/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx,js,jsx}', './components/**/*.{ts,tsx,js,jsx}', './src/**/*.{ts,tsx,js,jsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        text: '#111111',
        muted: '#666666',
        border: '#E5E5E5',
        primary: '#111111',
      },
      borderRadius: {
        md: '12px',
        lg: '16px',
      },
    },
  },
  plugins: [],
}

