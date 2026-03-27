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
        wit: {
          red: '#c00000',
          dark: '#0a0a0a',
          darker: '#050505',
          card: '#111111',
          border: '#222222',
          text: '#ffffff',
          muted: '#888888',
        }
      },
      backgroundImage: {
        'wit-gradient': 'linear-gradient(135deg, #c00000 0%, #800000 100%)',
        'card-gradient': 'linear-gradient(135deg, #111111 0%, #0a0a0a 100%)',
      }
    },
  },
  plugins: [],
}
