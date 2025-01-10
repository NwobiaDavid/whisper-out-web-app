// const { nextui } = require("@nextui-org/react");
import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    // light: {
    //   colors: {
    //     primary: {
    //       DEFAULT: '#3D3B6F',
    //     },
    //   },
    // },
    // dark: {
    //   colors: {
    //     primary: {
    //       DEFAULT: '#FFC157',
    //     },
    //   },
    // },
    extend: {
      colors: {
        maindark: '#3D3B6F',
        golden: '#FFC157',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
