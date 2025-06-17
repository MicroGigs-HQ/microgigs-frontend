import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Keep your existing shadcn/ui colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        
        // Add mobile-specific colors that override when needed
        'mobile': {
          'bg': '#000000',
          'surface': '#18181b',
          'surface-hover': '#27272a',
          'border': '#3f3f46',
          'text': '#ffffff',
          'text-secondary': '#a1a1aa',
          'text-muted': '#71717a',
          'primary': '#f97316',
          'primary-hover': '#ea580c',
          'success': '#22c55e',
          'warning': '#f59e0b',
          'error': '#ef4444',
          'info': '#3b82f6'
        },
        
        // Ensure orange colors work properly
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Primary orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407'
        },
        
        // Enhanced zinc colors for better dark mode
        zinc: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b'
        }
      },
      
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // Add mobile-specific radius
        'mobile': '12px',
        'mobile-lg': '16px',
        'mobile-xl': '20px'
      },
      
      // Add mobile-specific spacing
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      
      // Add mobile-specific font sizes
      fontSize: {
        'mobile-xs': ['12px', { lineHeight: '16px' }],
        'mobile-sm': ['14px', { lineHeight: '20px' }],
        'mobile-base': ['16px', { lineHeight: '24px' }],
        'mobile-lg': ['18px', { lineHeight: '28px' }],
        'mobile-xl': ['20px', { lineHeight: '28px' }],
        'mobile-2xl': ['24px', { lineHeight: '32px' }]
      },
      
      // Enhanced animations
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        // Mobile-specific animations
        'slide-up': {
          from: {
            transform: 'translateY(100%)',
            opacity: '0'
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        'slide-down': {
          from: {
            transform: 'translateY(-100%)',
            opacity: '0'
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        'fade-in': {
          from: {
            opacity: '0'
          },
          to: {
            opacity: '1'
          }
        },
        'scale-in': {
          from: {
            transform: 'scale(0.95)',
            opacity: '0'
          },
          to: {
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        'pulse-orange': {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(249, 115, 22, 0.7)'
          },
          '50%': {
            boxShadow: '0 0 0 10px rgba(249, 115, 22, 0)'
          }
        },
        'bounce-gentle': {
          '0%, 100%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          },
          '50%': {
            transform: 'translateY(-2px)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          }
        }
      },
      
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        // Mobile animations
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'pulse-orange': 'pulse-orange 2s infinite',
        'bounce-gentle': 'bounce-gentle 1s infinite'
      },
      
      // Add mobile-specific breakpoints
      screens: {
        'xs': '375px',
        'mobile': {'max': '768px'},
        'tablet': {'min': '769px', 'max': '1024px'},
      },
      
      // Add backdrop blur
      backdropBlur: {
        'xs': '2px',
        'mobile': '8px'
      },
      
      // Enhanced shadows for mobile
      boxShadow: {
        'mobile': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
        'mobile-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'mobile-xl': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    // Add plugin for mobile utilities
    function({ addUtilities }: any) {
      const newUtilities = {
        '.touch-target': {
          minHeight: '44px',
          minWidth: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        '.hide-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none'
        },
        '.hide-scrollbar::-webkit-scrollbar': {
          display: 'none'
        },
        '.mobile-safe-top': {
          paddingTop: 'env(safe-area-inset-top)'
        },
        '.mobile-safe-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)'
        },
        '.mobile-safe-left': {
          paddingLeft: 'env(safe-area-inset-left)'
        },
        '.mobile-safe-right': {
          paddingRight: 'env(safe-area-inset-right)'
        }
      }
      addUtilities(newUtilities)
    }
  ]
};

export default config;