import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

/**
 * ESLint flat config for the Next.js + TypeScript application.
 *
 * `pnpm lint` runs THIS — real ESLint, not an alias for `tsc`. Type checking is a
 * separate concern handled by `pnpm typecheck`.
 *
 * Next.js 15.1 still ships eslint-config-next in eslintrc ("legacy") format, so
 * FlatCompat is used to consume it from a flat config. Next.js's own react, react-hooks
 * and jsx-a11y rules come from that preset; the typescript-eslint layer and the
 * project-specific rules below are added on top.
 *
 * Type-aware linting is deliberately NOT enabled: it requires a full program build
 * and is too slow for an every-change lint run. `pnpm typecheck` covers type errors.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "dist-test/**",
      "next-env.d.ts",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.extends("next/core-web-vitals"),

  {
    rules: {
      // Unused code must be removed, not silenced (docs/CODE-STYLE.md §7).
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // `any` is not permitted in committed code (docs/CODE-STYLE.md §1).
      "@typescript-eslint/no-explicit-any": "error",
      "prefer-const": "error",
      eqeqeq: ["error", "smart"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
);