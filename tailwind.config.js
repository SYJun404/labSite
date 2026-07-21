/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        'surface-alt': 'rgb(var(--c-surface-alt) / <alpha-value>)',
        border: 'rgb(var(--c-border) / <alpha-value>)',
        fg: 'rgb(var(--c-fg) / <alpha-value>)',
        'fg-muted': 'rgb(var(--c-fg-muted) / <alpha-value>)',
        'fg-subtle': 'rgb(var(--c-fg-subtle) / <alpha-value>)',
        'fg-faint': 'rgb(var(--c-fg-faint) / <alpha-value>)',
        accent: {
          blue: 'rgb(var(--c-accent-blue) / <alpha-value>)',
          cyan: 'rgb(var(--c-accent-cyan) / <alpha-value>)',
          violet: 'rgb(var(--c-accent-violet) / <alpha-value>)'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      backgroundImage: {
        'grid-fade': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgb(var(--c-accent-blue) / 0.15), transparent)',
        'signal-gradient': 'linear-gradient(135deg, rgb(var(--c-accent-blue)) 0%, rgb(var(--c-accent-violet)) 50%, rgb(var(--c-accent-cyan)) 100%)'
      },
      letterSpacing: {
        tightest: '-0.04em'
      }
    }
  },
  plugins: []
}
