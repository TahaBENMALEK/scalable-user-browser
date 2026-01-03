/**
 * Tailwind CSS Configuration
 * Custom theme with mandatory color palette
 * Extends default Tailwind with project-specific design tokens
 */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mandatory color palette
        flamingo: '#f76531',
        tundora: '#4b4a4a',
        'cape-palliser': '#a26049',
        'red-damask': '#d1633c',
        'roman-coffee': '#825e51',
        'brown-rust': '#ba6242',
        scorpion: '#5d5c5c',
        'flame-pea': '#e66536',
        
        // Semantic color assignments
        primary: {
          DEFAULT: '#f76531',
          hover: '#e66536',
          active: '#d1633c',
        },
        text: {
          primary: '#4b4a4a',
          secondary: '#5d5c5c',
          muted: '#825e51',
        },
        border: '#a26049',
        accent: '#ba6242',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
      },
      maxWidth: {
        'container': '1200px',
      },
      height: {
        'header': '4rem',
      },
    },
  },
  plugins: [],
};