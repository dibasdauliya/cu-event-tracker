import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'bg-img': "url('/img/bg.jpg')"
      }
    }
  },
  plugins: []
} satisfies Config
