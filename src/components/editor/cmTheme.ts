import { EditorView } from '@codemirror/view'

export const lightEditorTheme = EditorView.theme({
  '&': {
    backgroundColor: 'var(--surface)',
    color: 'var(--text)',
  },
  '.cm-content': {
    caretColor: 'var(--accent)',
    fontFamily: 'var(--font-mono)',
    padding: '16px 0',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: 'var(--accent)',
    borderLeftWidth: '2px',
  },
  '.cm-selectionBackground': {
    backgroundColor: 'var(--accent-muted) !important',
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: 'var(--accent-muted) !important',
  },
  '.cm-activeLine': {
    backgroundColor: 'var(--surface-secondary)',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--surface)',
    color: 'var(--text-muted)',
    border: 'none',
    paddingLeft: '8px',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'var(--surface-secondary)',
    color: 'var(--text-secondary)',
  },
  '.cm-foldGutter': {
    color: 'var(--text-muted)',
  },
  '.cm-searchMatch': {
    backgroundColor: 'var(--warning)',
    borderRadius: '2px',
  },
  '.cm-selectionMatch': {
    backgroundColor: 'var(--accent-muted)',
  },
  '.cm-panels': {
    backgroundColor: 'var(--surface-secondary)',
    color: 'var(--text)',
    borderColor: 'var(--border)',
  },
  '.cm-panels button': {
    color: 'var(--text)',
  },
  '.cm-tooltip': {
    backgroundColor: 'var(--surface-elevated)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
  },
  '.cm-tooltip-autocomplete': {
    '& > ul > li[aria-selected]': {
      backgroundColor: 'var(--accent-muted)',
      color: 'var(--text)',
    },
  },
})

export const darkEditorTheme = EditorView.theme({
  '&': {
    backgroundColor: 'var(--surface)',
    color: 'var(--text)',
  },
  '.cm-content': {
    caretColor: 'var(--accent)',
    fontFamily: 'var(--font-mono)',
    padding: '16px 0',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: 'var(--accent)',
    borderLeftWidth: '2px',
  },
  '.cm-selectionBackground': {
    backgroundColor: 'var(--accent-muted) !important',
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: 'var(--accent-muted) !important',
  },
  '.cm-activeLine': {
    backgroundColor: 'var(--surface-secondary)',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--surface)',
    color: 'var(--text-muted)',
    border: 'none',
    paddingLeft: '8px',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'var(--surface-secondary)',
    color: 'var(--text-secondary)',
  },
  '.cm-foldGutter': {
    color: 'var(--text-muted)',
  },
  '.cm-searchMatch': {
    backgroundColor: 'var(--warning)',
    borderRadius: '2px',
  },
  '.cm-selectionMatch': {
    backgroundColor: 'var(--accent-muted)',
  },
  '.cm-panels': {
    backgroundColor: 'var(--surface-secondary)',
    color: 'var(--text)',
    borderColor: 'var(--border)',
  },
  '.cm-panels button': {
    color: 'var(--text)',
  },
  '.cm-tooltip': {
    backgroundColor: 'var(--surface-elevated)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
  },
  '.cm-tooltip-autocomplete': {
    '& > ul > li[aria-selected]': {
      backgroundColor: 'var(--accent-muted)',
      color: 'var(--text)',
    },
  },
}, { dark: true })
