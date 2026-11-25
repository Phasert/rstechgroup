// eslint-config-next 16 ships native flat configs; FlatCompat no longer works with it.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "node_modules/**", "functions/**", "next-env.d.ts"]),
]);
