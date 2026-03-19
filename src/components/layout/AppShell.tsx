import { useUIStore } from '@/stores/uiStore'
import { useEditorStore } from '@/stores/editorStore'
import { useDebounce } from '@/hooks/useDebounce'
import { Sidebar } from './Sidebar'
import { Toolbar } from './Toolbar'
import { StatusBar } from './StatusBar'
import { SplitPane } from './SplitPane'
import { MarkdownEditor } from '@/components/editor/MarkdownEditor'
import { MarkdownPreview } from '@/components/preview/MarkdownPreview'
import { EmptyState } from '@/components/ui/EmptyState'
import { useFileOperations } from '@/hooks/useFileOperations'
import { Button } from '@/components/ui/Button'
import { Article, Plus } from '@phosphor-icons/react'

export function AppShell() {
  const viewMode = useUIStore((s) => s.viewMode)
  const activeTab = useUIStore((s) => s.activeTab)
  const activeDocumentId = useEditorStore((s) => s.activeDocumentId)
  const content = useEditorStore((s) => s.content)
  const { createNewDocument } = useFileOperations()

  const debounceDelay = content.length > 50000 ? 300 : 150
  const debouncedContent = useDebounce(content, debounceDelay)

  return (
    <div className="flex h-full w-full">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <Toolbar />

        <div className="flex-1 min-h-0">
          {!activeDocumentId ? (
            <EmptyState
              icon={<Article size={56} weight="thin" />}
              title="No document selected"
              description="Create a new document, import a file, or select one from the sidebar."
              action={
                <Button variant="primary" onClick={() => createNewDocument()}>
                  <Plus size={16} weight="bold" />
                  New Document
                </Button>
              }
            />
          ) : viewMode === 'split' ? (
            <SplitPane
              left={<MarkdownEditor />}
              right={<MarkdownPreview content={debouncedContent} />}
            />
          ) : activeTab === 'edit' ? (
            <MarkdownEditor />
          ) : (
            <MarkdownPreview content={debouncedContent} />
          )}
        </div>

        <StatusBar />
      </div>
    </div>
  )
}
