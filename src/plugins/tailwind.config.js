import { nextui } from '@nextui-org/react';
import { nextUiConfig } from './nextui.config.ts';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['index.html', './src/**/*.{ts,tsx}', './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4fce3f',
        "primary-bg" : 'rgba(56,248,28,0.25)',
        case: '#f4f4f4',
      },
      backgroundImage: {
        menu: "url('/img/bg_menu.png')",
      },
    },
  },
  safelist: [
    {
      pattern: /gap-(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24)/,
    },
  ],
  darkMode: 'class',
  plugins: [nextui(nextUiConfig)],
};
