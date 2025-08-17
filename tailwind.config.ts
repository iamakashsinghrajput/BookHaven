import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#2563EB', // A vibrant cyan/blue similar to the image
        'brand-yellow': '#FDE047', // A bright yellow
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        rampart: ['Rampart One', 'cursive'],
      },
    },
  },
  plugins: [],
};
export default config;