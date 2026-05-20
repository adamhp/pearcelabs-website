/** @type {import("prettier").Config} */
export default {
  bracketSameLine: true,
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/styles/global.css",
  overrides: [
    {
      files: "*.astro",
      options: { parser: "astro" },
    },
  ],
};
