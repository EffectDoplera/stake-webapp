const cfg = require("@mhld/prettier-config");

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  ...cfg,
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
};

module.exports = config;
