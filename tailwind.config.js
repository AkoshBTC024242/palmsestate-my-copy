/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'Georgia', 'serif'], // Luxury serif font
        'montserrat': ['Montserrat', 'system-ui', 'sans-serif'], // Luxury sans font
        'display': ['SF Pro Display', 'system-ui', 'sans-serif'],
        'mono': ['SF Mono', 'monospace'],
      },
      colors: {
        'primary': {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Luxury color palette
        'luxury': {
          'orange': '#C77D1E', // Rich, premium orange (for "Living" accent)
          'gold': '#D4AF37', // Luxury gold
          'cream': '#F5F1E8', // Off-white cream
          'charcoal': '#1A1A1A', // Deep charcoal
          'slate': '#4A5568', // Muted slate
          'beige': '#E8E2D6', // Warm beige
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'fade-in-slow': 'fadeIn 1.2s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-out-right': 'slideOutRight 0.3s ease-in',
        'lift': 'lift 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        lift: {
          '0%': { transform: 'translateY(0)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
          '100%': { transform: 'translateY(-5px)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      // Luxury shadows
      boxShadow: {
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'luxury-lg': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        'luxury-xl': '0 50px 100px -20px rgba(0, 0, 0, 0.35)',
      }
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.container-fluid': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          '@screen sm': {
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          },
          '@screen md': {
            paddingLeft: '2rem',
            paddingRight: '2rem',
          },
          '@screen lg': {
            maxWidth: '90rem', // Increased for luxury spaciousness
          },
        },
        // Luxury utility classes
        '.text-balance': {
          textWrap: 'balance',
        },
        '.luxury-section': {
          '@apply py-20 md:py-32', // Extra spacing for luxury feel
        },
        '.luxury-heading': {
          '@apply font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight',
        },
        '.luxury-subheading': {
          '@apply font-montserrat text-lg md:text-xl font-light leading-relaxed tracking-wide',
        },
      })
    },
  ],
}
