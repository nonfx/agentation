# Agentation

Monorepo containing:

1. **npm package** (`package/`) - See `package/CLAUDE.md`
2. **Website/docs** (`package/example/`) - See `package/example/CLAUDE.md`

## What is Agentation?

A floating toolbar for annotating web pages and collecting structured feedback for AI coding agents.

## Development

```bash
pnpm install    # Install all workspace dependencies
pnpm dev        # Run both package watch + website dev server
pnpm build      # Build package only
```

## Fork Structure

This is a fork of [benjitaylor/agentation](https://github.com/benjitaylor/agentation). The upstream directory layout is preserved exactly — **NEVER move or rename upstream files**. The fork only adds Vue-specific code.

```
package/src/
  components/    ← upstream React (UNTOUCHED)
  utils/         ← upstream utils (UNTOUCHED)
  types.ts       ← upstream types (UNTOUCHED)
  index.ts       ← upstream entry (UNTOUCHED)
  vue/           ← fork addition: Vue port
  styles/        ← fork addition: SCSS modules for Vue components
  vue.ts         ← fork addition: Vue entry point
  vue-dts.ts     ← fork addition: Vue type declarations
```

**Rule:** Only add files to `src/vue/` and `src/styles/`. Everything else belongs to upstream.

## Upstream Sync

A GitHub Action (`.github/workflows/sync-upstream.yml`) runs weekly to check for new commits on `benjitaylor/agentation` and opens a PR if updates are found.

**Manual sync:**
```bash
git fetch upstream main && git merge upstream/main
```

Because the fork preserves upstream's layout, merges are conflict-free for all upstream-owned files.

## Important

The npm package is public. Changes to `package/src/` affect all users.
Website changes (`package/example/`) only affect agentation.dev.

## PR/Issue Approach

- Package size is critical - avoid bloat
- UI changes need extra scrutiny
- Plugins/extensions → encourage separate repos
- External binary files → never accept

## Annotations

Whenever the user brings up annotations, fetch all the pending annotations before doing anything else. And infer whether I am referencing any annotations.
