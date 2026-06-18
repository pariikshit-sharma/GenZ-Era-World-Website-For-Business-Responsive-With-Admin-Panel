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
        // GenZera brand palette from reference images
        brand: {
          black: '#050508',
          darkest: '#0a0a12',
          dark: '#10101e',
          card: '#13131f',
          border: '#1e1e30',
          purple: '#7c3aed',
          'purple-bright': '#9d4edd',
          'purple-glow': '#b44ef0',
          'purple-light': '#c77dff',
          'purple-neon': '#d100ff',
          white: '#ffffff',
          gray: '#9ca3af',
          'gray-dark': '#4b5563',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'glow-purple': 'radial-gradient(ellipse at center, rgba(124,58,237,0.3) 0%, transparent 70%)',
        'glow-hero': 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.2) 0%, transparent 70%)',
        'card-gradient': 'linear-gradient(135deg, #13131f 0%, #1a1a2e 100%)',
        'lightning': "url('/images/lightning-bg.svg')",
      },
      animation: {
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease-in-out',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'lightning-flash': 'lightningFlash 4s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124,58,237,0.4), 0 0 60px rgba(124,58,237,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(157,78,221,0.8), 0 0 80px rgba(157,78,221,0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-1px, 1px)' },
          '80%': { transform: 'translate(1px, -1px)' },
          '100%': { transform: 'translate(0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        lightningFlash: {
          '0%, 90%, 100%': { opacity: '0' },
          '92%, 96%': { opacity: '1' },
          '94%, 98%': { opacity: '0.5' },
        },
      },
      boxShadow: {
        'purple-sm': '0 0 10px rgba(124,58,237,0.5)',
        'purple-md': '0 0 20px rgba(124,58,237,0.5), 0 0 40px rgba(124,58,237,0.2)',
        'purple-lg': '0 0 40px rgba(157,78,221,0.6), 0 0 80px rgba(157,78,221,0.3)',
        'purple-xl': '0 0 60px rgba(157,78,221,0.8), 0 0 120px rgba(157,78,221,0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(124,58,237,0.3)',
      },
    },
  },
  plugins: [],
}
