/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7fb',
          100: '#c0eaf4',
          200: '#86d8ec',
          300: '#42c2e0',
          400: '#1aadd4',
          500: '#0D98BA',
          600: '#0b83a1',
          700: '#086c85',
          800: '#06576a',
          900: '#03374a',
        },
        gold: {
          400: '#fbbf24',
          500: '#F5A623',
          600: '#d97706',
        },
        coral: '#FF6B6B',
        navy: '#042d3a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #042d3a 0%, #064e65 40%, #086c85 70%, #0D98BA 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(30px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      boxShadow: {
        'card': '0 4px 24px rgba(13, 152, 186, 0.12)',
        'card-hover': '0 8px 40px rgba(13, 152, 186, 0.28)',
        'glow': '0 0 30px rgba(13, 152, 186, 0.45)',
      },
    },
  },
  plugins: [],
}
