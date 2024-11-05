import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-segoe-ui)", ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        100: "4px",
        200: "8px",
        300: "12px",
        400: "16px",
        500: "20px",
        600: "24px",
        700: "28px",
        800: "32px",
        900: "36px",
        1000: "40px",
      },
      colors: {
        th: {
          primary: {
            DEFAULT: "rgb(var(--primary))",
          },
          gray: {
            50: "rgb(var(--gray-50))",
            100: "rgb(var(--gray-100))",
            300: "rgb(var(--gray-300))",
            500: "rgb(var(--gray-500))",
          },
          blue: {
            50: "rgb(var(--blue-50))",
            DEFAULT: "rgb(var(--blue))",
          },
          green: {
            50: "rgb(var(--green-50))",
            600: "rgb(var(--green-600))",
          },
        },
      },
      keyframes: {
        shake: {
          "10%, 90%": {
            transform: "translate3d(-1px, 0, 0)",
          },
          "20%, 80%": {
            transform: "translate3d(2px, 0, 0)",
          },
          "30%, 50%, 70%": {
            transform: "translate3d(-4px, 0, 0)",
          },
          "40%, 60%": {
            transform: "translate3d(4px, 0, 0)",
          },
        },
      },
      animation: {
        shake: "shake 0.82s cubic-bezier(.36,.07,.19,.97) both",
      },
    },
    borderRadius: {
      none: "0",
      sm: "1px",
      DEFAULT: "3px",
      lg: "10px",
      full: "9999px",
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
