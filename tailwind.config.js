/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8EE',
        blush: '#FFB7C5',
        peach: '#FFD6BA',
        lavender: '#DCC6FF',
        skyblue: '#BFE9FF',
        butter: '#FFE89A',
        rosegold: '#F7C7A3',
        warmbrown: '#5C4033',
      },
      fontFamily: {
        handwritten: ['Caveat', 'cursive'],
        script: ['Dancing Script', 'cursive'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 2s infinite',
        'drift': 'drift 15s linear infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'bloom': 'bloom 2s ease-out forwards',
        'handwrite': 'handwrite 3s ease-out forwards',
        'shake': 'shake 0.5s ease-in-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'page-flip': 'page-flip 1.5s ease-in-out forwards',
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(3deg)' },
        },
        drift: {
          '0%': { transform: 'translateX(-100px) translateY(-100px) rotate(0deg)', opacity: 0 },
          '10%': { opacity: 1 },
          '90%': { opacity: 1 },
          '100%': { transform: 'translateX(100vw) translateY(100vh) rotate(720deg)', opacity: 0 },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
        },
        bloom: {
          '0%': { transform: 'scale(0) rotate(-45deg)', opacity: 0 },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: 1 },
        },
        handwrite: {
          '0%': { width: '0%', opacity: 0 },
          '100%': { width: '100%', opacity: 1 },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 183, 197, 0.5), 0 0 40px rgba(255, 183, 197, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 183, 197, 0.8), 0 0 80px rgba(255, 183, 197, 0.5)' },
        },
        'page-flip': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(-180deg)' },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: 0, transform: 'scale(0.5)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
