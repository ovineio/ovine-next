module.exports = {
  printWidth: 80,
  singleQuote: true,
  trailingComma: "all",
  proseWrap: "never",
  tabWidth: 2,
  overrides: [{ files: ".prettierrc", options: { parser: "json" } }],
  plugins: [
    require.resolve("prettier-plugin-packagejson"),
    require.resolve("./scripts/prettier-plugin"),
  ],
};
