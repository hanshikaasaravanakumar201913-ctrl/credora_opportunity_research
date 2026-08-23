/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // LIGHT MODE (Warm Heritage Cream + Lighter Warm Parchment [No pure white] + Rich Dark Forest Green + Deep Charcoal)
        light: {
          bg: '#E8DAC2',           // Warm heritage cream background
          secondary: '#D8C7AC',    // Deeper warm cream secondary
          surface: '#F2E8D7',      // Soft parchment surface
          card: '#F7EFE1',         // Lighter than cream, warm soft parchment (NOT pure white)
          primary: '#0D2B1D',      // Deep Forest Green
          secondaryGreen: '#164630',
          accent: '#A47432',       // Warm Amber Gold
          text: '#0A110D',         // Deep High-Contrast Charcoal Black
          muted: '#2C3E33',        // High-Contrast Readable Muted Text
          border: '#BAA88B',       // Crisp Warm Framing Border
          subtle: '#4A5F52'
        },
        // DARK MODE (Deep Forest Charcoal + Vibrant Forest Green + Off-White Sage)
        dark: {
          bg: '#0F1511',           // Deep charcoal forest background
          secondary: '#141D17',    // Elevated secondary background
          surface: '#1A251E',      // Surface layer
          card: '#202D25',         // Editorial Card
          elevated: '#28392F',     // Raised card
          primary: '#E2EDE2',      // Off-white primary text
          secondaryText: '#AFC4B2',// Soft sage secondary text
          forest: '#4EA36C',       // Rich Vibrant Forest Green Accent
          accent: '#D4B370',       // Warm Amber Gold
          text: '#E2EDE2',
          muted: '#9FB3A2',
          border: '#334438',       // Clean Muted Border
          subtle: '#6A806F'
        },
        // Universal Semantic Brand Tokens
        brand: {
          forest: '#0D2B1D',
          forestLight: '#4EA36C',
          gold: '#A47432',
          goldLight: '#D4B370',
          charcoal: '#0A110D',
          cream: '#E8DAC2',
          parchment: '#F7EFE1'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Merriweather', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'subtle-light': '0 2px 8px -2px rgba(13, 43, 29, 0.08), 0 1px 4px -1px rgba(13, 43, 29, 0.05)',
        'card-light': '0 4px 16px -4px rgba(13, 43, 29, 0.10), 0 2px 6px -2px rgba(13, 43, 29, 0.06)',
        'subtle-dark': '0 2px 10px -2px rgba(0, 0, 0, 0.40)',
        'card-dark': '0 4px 20px -4px rgba(0, 0, 0, 0.50)',
      }
    },
  },
  plugins: [],
}
