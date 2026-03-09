---
name: agentation-vue
description: Add Agentation visual feedback toolbar to a Vue or Nuxt project
---

# Agentation Vue Setup

Set up the Agentation annotation toolbar in a Vue or Nuxt project.

## Steps

1. **Check if already installed**
   - Look for `agentation` in package.json dependencies
   - If not found, detect the package manager:
     - `bun.lock` or `bun.lockb` -> `bun add agentation`
     - `pnpm-lock.yaml` -> `pnpm add agentation`
     - `yarn.lock` -> `yarn add agentation`
     - Otherwise -> `npm install agentation`

2. **Check if already configured**
   - Search for `<AgentationToolbar` or `import { AgentationToolbar }` in src/ or app/
   - If found, report that Agentation is already set up and exit

3. **Detect framework**
   - **Nuxt**: has `nuxt.config.ts` or `nuxt.config.js`
   - **Vite + Vue**: has `vite.config.ts` or `vite.config.js` with vue plugin

4. **Add the component**

   For Nuxt, add to `app.vue` or `layouts/default.vue`:
   ```vue
   <script setup>
   import { AgentationToolbar } from 'agentation/vue'
   </script>

   <template>
     <!-- existing content -->
     <AgentationToolbar v-if="import.meta.dev" />
   </template>
   ```

   For Vite + Vue, add to `App.vue` (or the root component):
   ```vue
   <script setup>
   import { AgentationToolbar } from 'agentation/vue'
   </script>

   <template>
     <!-- existing content -->
     <AgentationToolbar v-if="import.meta.env.DEV" />
   </template>
   ```

5. **Confirm component setup**
   - Tell the user the Agentation toolbar component is configured

6. **Recommend MCP server setup**
   - Explain that for real-time annotation syncing with AI agents, they should also set up the MCP server
   - Recommend one of the following approaches:
     - **Universal (supports 9+ agents including Claude Code, Cursor, Codex, Windsurf, etc.):**
       See [add-mcp](https://github.com/neondatabase/add-mcp) — run `npx add-mcp` and follow the prompts to add `agentation-mcp` as an MCP server
     - **Claude Code only (interactive wizard):**
       Run `agentation-mcp init` after installing the package
   - Tell user to restart their coding agent after MCP setup to load the server
   - Explain that once configured, annotations will sync to the agent automatically

## Notes

- The `import.meta.dev` (Nuxt) / `import.meta.env.DEV` (Vite) check ensures Agentation only loads in development
- Agentation Vue requires Vue 3.3+
- The MCP server runs on port 4747 by default for the HTTP server
- MCP server exposes tools like `agentation_get_all_pending`, `agentation_resolve`, and `agentation_watch_annotations`
- Run `agentation-mcp doctor` to verify setup after installing
