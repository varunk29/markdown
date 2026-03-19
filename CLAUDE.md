# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with hot reload
npm run build     # TypeScript type-check + production build
npm run preview   # Preview the production build locally
```

No test runner is configured.

## Architecture

**Markview** is a client-side SPA: a markdown editor + live preview with all data stored in IndexedDB (`markview-db`). There is no backend.

### State Management

Three Zustand stores drive the app:
- `fileStore` (`src/stores/fileStore.ts`) — document CRUD, file list
- `editorStore` (`src/stores/editorStore.ts`) — active document, content, dirty flag, cursor position
- `uiStore` (`src/stores/uiStore.ts`) — view mode (split/tabs), theme, sidebar open, split ratio (persisted)

`useFileOperations.ts` is the high-level hook that coordinates between these stores and the DB layer.

### Data Flow

```
IndexedDB ↔ db.ts ↔ fileStore / editorStore / uiStore ↔ Components
```

`src/lib/db.ts` wraps the `idb` library. All document reads/writes go through it.

### Editor

CodeMirror 6 with markdown language support lives in `src/components/editor/`. The setup is split across:
- `useCodeMirror.ts` — creates/updates the EditorView
- `cmExtensions.ts` — assembles extension list (autocomplete, search, keymaps, etc.)
- `cmTheme.ts` — editor theme (one-dark for dark mode)

Auto-save fires after a debounced delay (150–300ms based on content size), plus manual save on `Cmd/Ctrl+S`.

### Preview

`src/components/preview/MarkdownPreview.tsx` uses `react-markdown` with:
- `remark-gfm` — GitHub Flavored Markdown
- `rehype-highlight` — syntax highlighting via highlight.js
- `rehype-slug` — heading anchors
- `rehype-raw` — pass-through HTML
- Mermaid diagrams rendered in `MermaidBlock.tsx`

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) runs `npm run build` and deploys `dist/` to GitHub Pages. The app is served at base path `/markdown/` (set in `vite.config.ts`).
