import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        obsidian: '#02070d',
        pulse: '#13d9c4',
        signal: '#0a8cff',
        ember: '#ff3b30',
      },
      boxShadow: {
        glass: '0 20px 80px rgba(0, 20, 40, 0.45)',
        trace: '0 0 36px rgba(19, 217, 196, 0.22)',
      },
      backgroundImage: {
        'radial-grid':
          'radial-gradient(circle at 50% 0%, rgba(19,217,196,.16), transparent 34%), linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
} satisfies Config;
