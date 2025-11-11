import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivoire: {
          orange: "#F77F00",
          white: "#FFFFFF",
          green: "#00843D"
        }
      }
    }
  },
  plugins: []
};

export default config;
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F77F00',
          light: '#FFA94D',
          dark: '#C56000',
        },
        secondary: {
          DEFAULT: '#0B6623',
          light: '#22A04D',
          dark: '#074517',
        },
        accent: '#FFFFFF',
        ivory: '#F4F4F4',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        lift: '0 10px 30px -15px rgba(15, 118, 110, 0.3)',
      },
    },
  },
  plugins: [forms],
}

export default config
