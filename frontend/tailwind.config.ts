import type { Config } from "tailwindcss";

const config: Config = {
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};

export default config;