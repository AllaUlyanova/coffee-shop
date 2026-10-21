/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        cream: 'var(--cream)',
        espresso: 'var(--espresso)',
        caramel: 'var(--caramel)',
        milk: 'var(--milk)',
        accent: 'var(--accent)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        mute: 'var(--mute)',
        line: 'var(--line)',
      },
      fontFamily: {
        display: ['"Literata Variable"', 'Georgia', 'serif'],
        sans: ['"Manrope Variable"', 'system-ui', 'sans-serif'],
        hand: ['"Caveat Variable"', 'cursive'],
      },
      borderRadius: { card: '20px', soft: '16px', big: '24px' },
    },
  },
  plugins: [],
}
