/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        myanmar: ['Padauk', 'Noto Sans Myanmar', 'Myanmar3', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        n: {
          bg: '#FFFFFF',
          sidebar: '#FAFAFA',
          text: '#1A1A1A',
          'text-2': '#737373',
          border: '#E5E7EB',
          hover: '#F3F4F6',
          active: '#E5E7EB',
          accent: '#000000',
          'accent-bg': '#F3F4F6',
        },
      },
      borderRadius: {
        DEFAULT: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
      },
      boxShadow: {
        DEFAULT: 'none',
        sm: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
        '2xl': 'none',
      },
      animation: {
        'page-in': 'tpsPageIn 160ms var(--ease-out) both',
        'card-in': 'tpsCardIn 200ms var(--ease-out) both',
        'fade-in': 'tpsFadeIn 120ms ease both',
        'slide-up': 'tpsSlideUp 200ms var(--ease-out) both',
      },
      keyframes: {
        tpsPageIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        tpsCardIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        tpsFadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        tpsSlideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
