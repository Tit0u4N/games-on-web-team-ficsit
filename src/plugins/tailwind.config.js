import { nextui } from '@nextui-org/react';
import { nextUiConfig } from './nextui.config.ts';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['index.html', './src/**/*.{ts,tsx}', './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4fce3f',
        case: '#f4f4f4',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui(nextUiConfig)],
};
