import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ["var(--font-fredoka)"],
        kanit: ["var(--font-kanit)"],
      },
    },
  },
  plugins: [],
}

export default config
