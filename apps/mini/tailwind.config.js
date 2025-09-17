/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.html",
    "./src/**/*.scss",
    "./src/**/*.css",
  ],
  darkMode: 'class', // 支持手动暗色模式切换
  theme: {
    extend: {
      colors: {
        // 基于CSS变量的颜色系统
        primary: {
          DEFAULT: 'var(--coshub-primary)',
          weak: 'var(--coshub-primary-weak)',
          strong: 'var(--coshub-primary-strong)',
          subtle: 'var(--coshub-primary-subtle)',
        },
        text: {
          DEFAULT: 'var(--coshub-text)',
          weak: 'var(--coshub-text-weak)',
          subtle: 'var(--coshub-text-subtle)',
          inverse: 'var(--coshub-text-inverse)',
        },
        surface: {
          DEFAULT: 'var(--coshub-surface)',
          weak: 'var(--coshub-surface-weak)',
          strong: 'var(--coshub-surface-strong)',
        },
        border: {
          DEFAULT: 'var(--coshub-border)',
          weak: 'var(--coshub-border-weak)',
          strong: 'var(--coshub-border-strong)',
        },
        success: 'var(--coshub-success)',
        warning: 'var(--coshub-warning)',
        error: 'var(--coshub-error)',
        info: 'var(--coshub-info)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': 'var(--coshub-font-size-xs)',
        'sm': 'var(--coshub-font-size-sm)',
        'base': 'var(--coshub-font-size-md)',
        'lg': 'var(--coshub-font-size-lg)',
        'xl': 'var(--coshub-font-size-xl)',
        '2xl': 'var(--coshub-font-size-2xl)',
      },
      fontWeight: {
        normal: 'var(--coshub-font-weight-normal)',
        medium: 'var(--coshub-font-weight-medium)',
        semibold: 'var(--coshub-font-weight-semibold)',
        bold: 'var(--coshub-font-weight-bold)',
      },
      spacing: {
        'xs': 'var(--coshub-space-xs)',
        'sm': 'var(--coshub-space-sm)',
        'md': 'var(--coshub-space-md)',
        'lg': 'var(--coshub-space-lg)',
        'xl': 'var(--coshub-space-xl)',
        '2xl': 'var(--coshub-space-2xl)',
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'sm': 'var(--coshub-radius-sm)',
        'md': 'var(--coshub-radius-md)',
        'lg': 'var(--coshub-radius-lg)',
        'xl': 'var(--coshub-radius-xl)',
        'full': 'var(--coshub-radius-full)',
        '4xl': '2rem',
      },
      boxShadow: {
        'sm': 'var(--coshub-shadow-sm)',
        'md': 'var(--coshub-shadow-md)',
        'lg': 'var(--coshub-shadow-lg)',
        'xl': 'var(--coshub-shadow-xl)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'strong': '0 8px 24px rgba(0, 0, 0, 0.2)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': 'var(--coshub-blur)',
      },
      transitionDuration: {
        'fast': 'var(--coshub-transition-fast)',
        'normal': 'var(--coshub-transition-normal)',
        'slow': 'var(--coshub-transition-slow)',
      },
      transitionTimingFunction: {
        'coshub': 'ease-out',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
