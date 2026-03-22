# Agentation Package

This is the publishable npm package. Changes here affect everyone who installs `agentation`.

## Critical Rules

1. **NEVER run `npm publish`** - Only publish when explicitly instructed
2. **NEVER bump version** in package.json without explicit instruction
3. **NEVER modify exports** in index.ts without discussing breaking changes

## What Gets Published

- `dist/` folder (compiled from `src/`)
- `package.json`, `README.md`, `LICENSE`

## Directory Layout

This is a fork of upstream `benjitaylor/agentation`. The source layout:

- `src/components/` — upstream React components (DO NOT MODIFY)
- `src/utils/` — upstream utilities (DO NOT MODIFY)
- `src/types.ts` — upstream types (DO NOT MODIFY)
- `src/index.ts` — upstream entry point (DO NOT MODIFY)
- `src/vue/` — fork-only Vue port (our code)
- `src/styles/` — fork-only SCSS modules for Vue components (our code)
- `src/vue.ts` — fork-only Vue entry point

**Note:** `src/core/` and `src/react/` no longer exist — those were the old fork directories that have been removed to restore upstream's layout.

## Before Modifying `src/`

- Consider: Is this a breaking change?
- Consider: Does this affect the API surface?
- Consider: Will existing users' code still work?
- Consider: Are you modifying an upstream file? If so, DON'T — only modify files in `src/vue/` or `src/styles/`.

## Main Export

```tsx
import { Agentation } from 'agentation';
```

No external runtime dependencies beyond React (or Vue for the Vue export).

## Programmatic API

The component exposes these callback props (added in 1.2.0):

- `onAnnotationAdd(annotation)` - when annotation created
- `onAnnotationDelete(annotation)` - when annotation deleted
- `onAnnotationUpdate(annotation)` - when annotation edited
- `onAnnotationsClear(annotations[])` - when all cleared
- `onCopy(markdown)` - when copy button clicked
- `copyToClipboard` (boolean, default: true)

**API stability**: These are public contracts. Changing signatures or removing callbacks is a breaking change requiring a major version bump.

**Expansion ideas** (for future consideration):
- `onActivate` / `onDeactivate` - toolbar state changes
- `getAnnotations()` ref method - programmatic access
- `onExport` with format options

## Testing Changes

1. Run `pnpm build` to ensure it compiles
2. Check the example app still works: `pnpm dev`
3. Verify no TypeScript errors in consumers

## Publishing

When instructed to publish a new npm version:

1. Bump version in `package.json`
2. Run `pnpm build`
3. Commit the version bump
4. Run `npm publish --access public` (will prompt for OTP)
5. Push to main
6. Update changelog in `example/src/app/changelog/page.tsx` (add new entry to `releases` array)
7. Commit and push the changelog update

Always analyze what changed since the last version to write accurate changelog entries.
