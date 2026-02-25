import nextConfig from "eslint-config-next";
import tseslint from "typescript-eslint";

const eslintConfig = [
  ...nextConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default eslintConfig;
