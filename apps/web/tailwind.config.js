/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "coshub-primary": "#FF6B9D",
        "coshub-secondary": "#9D5CFF",
        "coshub-accent": "#FFE66D",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
