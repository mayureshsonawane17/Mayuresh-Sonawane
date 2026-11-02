/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F5F5F0',
          pure: '#FFFFFF',
          tint: '#ECECE6',
          border: 'rgba(0, 0, 0, 0.09)',
          crosshair: 'rgba(0, 0, 0, 0.25)',
          ink: '#08080A',
          secondary: '#5E5E66',
          muted: '#8C8C94',
        },
        charcoal: {
          DEFAULT: '#0E0E10',
          surface: '#151518',
          elevated: '#1E1E23',
          border: 'rgba(255, 255, 255, 0.12)',
          crosshair: 'rgba(255, 255, 255, 0.3)',
          text: '#F5F5F7',
          secondary: '#9A9AA6',
          muted: '#636370',
        },
        volt: {
          DEFAULT: '#D2FD52',
          deep: '#B0D936',
          glow: 'rgba(210, 253, 82, 0.35)',
          muted: 'rgba(210, 253, 82, 0.12)',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        editorial: ['"Playfair Display"', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      letterSpacing: {
        tightest: '-0.05em',
        widestMono: '0.15em',
      },
    },
  },
  plugins: [],
}

