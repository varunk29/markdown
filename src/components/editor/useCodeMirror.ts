import { useEffect, useRef } from 'react'
import { EditorState, Compartment } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { createExtensions } from './cmExtensions'
import { lightEditorTheme, darkEditorTheme } from './cmTheme'
import type { ResolvedTheme } from '@/types/editor'

interface UseCodeMirrorOptions {
  containerRef: React.RefObject<HTMLDivElement | null>
  initialContent: string
  onChange: (content: string) => void
  onCursorChange: (pos: { line: number; col: number }) => void
  theme: ResolvedTheme
}

export function useCodeMirror({
  containerRef,
  initialContent,
  onChange,
  onCursorChange,
  theme,
}: UseCodeMirrorOptions) {
  const viewRef = useRef<EditorView | null>(null)
  const themeCompartment = useRef(new Compartment())
  const onChangeRef = useRef(onChange)
  const onCursorChangeRef = useRef(onCursorChange)
  const isExternalUpdate = useRef(false)

  onChangeRef.current = onChange
  onCursorChangeRef.current = onCursorChange

  // Create editor on mount
  useEffect(() => {
    if (!containerRef.current) return

    const themeExt = theme === 'dark' ? darkEditorTheme : lightEditorTheme

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && !isExternalUpdate.current) {
        onChangeRef.current(update.state.doc.toString())
      }
      if (update.selectionSet) {
        const pos = update.state.selection.main.head
        const line = update.state.doc.lineAt(pos)
        onCursorChangeRef.current({
          line: line.number,
          col: pos - line.from + 1,
        })
      }
    })

    const state = EditorState.create({
      doc: initialContent,
      extensions: [
        createExtensions(),
        themeCompartment.current.of(themeExt),
        updateListener,
      ],
    })

    const view = new EditorView({
      state,
      parent: containerRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Switch theme reactively
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const themeExt = theme === 'dark' ? darkEditorTheme : lightEditorTheme
    view.dispatch({
      effects: themeCompartment.current.reconfigure(themeExt),
    })
  }, [theme])

  // Replace content when the document changes externally
  useEffect(() => {
    const view = viewRef.current
    if (!view) return

    const currentContent = view.state.doc.toString()
    if (currentContent !== initialContent) {
      isExternalUpdate.current = true
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: initialContent,
        },
      })
      isExternalUpdate.current = false
    }
  }, [initialContent])

  return viewRef
}
