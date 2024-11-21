// const { nextui } = require("@nextui-org/react");
import { nextui } from "@nextui-org/react"

/** @type {import('tailwindcss').Config} */


export default {
  content: ["./index.html",
"./src/**/*.{js,ts,jsx,tsx}",
"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
],
  theme: {
    extend: {
      colors: {
        maindark: '#3D3B6F',
        golden: '#FFC157'
        
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}

