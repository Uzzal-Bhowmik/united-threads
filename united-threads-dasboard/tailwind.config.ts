import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primaryBlack: "#232323",
        secondary: "#334A55",
        info: "#F8FAFC",
        success: "#34D399",
        warning: "#F16365",
        primaryWhite: "#F8FAFC",
      },
      fontFamily: {
        roboto: ["var(--font-roboto)"],
        uncut: ["var(--font-uncut-sans)"],
      },
    },
  },
  plugins: [],
  important: true,
};
export default config;
