/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        matrix: {
          blue: '#00a8ff',
          dark: '#0a0a0a',
          darker: '#000000',
          light: '#1a1a1a',
          gray: '#333333'
        }
      },
      animation: {
        'matrix-rain': 'matrix-rain 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fade-in 0.5s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out'
      },
      keyframes: {
        'matrix-rain': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px #00a8ff, 0 0 10px #00a8ff, 0 0 15px #00a8ff' },
          '100%': { boxShadow: '0 0 10px #00a8ff, 0 0 20px #00a8ff, 0 0 30px #00a8ff' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
