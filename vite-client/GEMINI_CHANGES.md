# Gemini Changes

This file documents the changes made by Gemini to migrate the codebase from Next.js to Vite + React with TanStack Router.

## `src/shared/hooks/useSearchParam.tsx`

- Replaced `next/navigation` imports (`useSearchParams`) with `@tanstack/react-router` hooks (`useRouter`).
- Removed invalid imports for `useRouter` and `usePathname` from a non-existent module `@/i18n/navigation`.
- Rewrote the hook's logic to use TanStack Router's `navigate` function for updating search parameters, while preserving the hook's original public API.

## `src/shared/components/CadsquadLogo.tsx`

- Replaced `next/image` with a standard `<img>` tag.
- Replaced invalid `Link` import with `Link` from `@tanstack/react-router` and changed `href` to `to`.
- Updated image paths to point to `src/assets`.
- Removed `useTheme` hook and hardcoded the theme to `default`.

## `src/lib/query-string.ts`

- Removed unused `ReadonlyURLSearchParams` type import from `next/navigation`.
- Updated `parseSearchParams` function to remove the `ReadonlyURLSearchParams` type from the signature.

## `package.json`

- Removed `eslint-config-next` from `devDependencies`.
