import { create } from 'zustand'
import type { CursorPosition } from '@/types/editor'

interface EditorState {
  activeDocumentId: string | null
  content: string
  isDirty: boolean
  lastSavedContent: string
  cursorPosition: CursorPosition

  setContent: (content: string) => void
  setActiveDocument: (id: string | null, content: string) => void
  markSaved: () => void
  setCursorPosition: (pos: CursorPosition) => void
  clearEditor: () => void
}

export const useEditorStore = create<EditorState>()((set) => ({
  activeDocumentId: null,
  content: '',
  isDirty: false,
  lastSavedContent: '',
  cursorPosition: { line: 1, col: 1 },

  setContent: (content) =>
    set((s) => ({
      content,
      isDirty: content !== s.lastSavedContent,
    })),

  setActiveDocument: (id, content) =>
    set({
      activeDocumentId: id,
      content,
      lastSavedContent: content,
      isDirty: false,
      cursorPosition: { line: 1, col: 1 },
    }),

  markSaved: () =>
    set((s) => ({
      isDirty: false,
      lastSavedContent: s.content,
    })),

  setCursorPosition: (cursorPosition) => set({ cursorPosition }),

  clearEditor: () =>
    set({
      activeDocumentId: null,
      content: '',
      isDirty: false,
      lastSavedContent: '',
      cursorPosition: { line: 1, col: 1 },
    }),
}))
