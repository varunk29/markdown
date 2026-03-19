import { memo, useMemo, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeRaw from 'rehype-raw'
import { previewComponents } from './previewComponents'
import { useUIStore } from '@/stores/uiStore'

// Import both themes — we toggle them via link element disabled property
import lightThemeUrl from 'highlight.js/styles/github.css?url'
import darkThemeUrl from 'highlight.js/styles/github-dark.css?url'

function useHighlightTheme() {
  const resolvedTheme = useUIStore((s) => s.resolvedTheme)

  useEffect(() => {
    const id = 'hljs-theme'
    let link = document.getElementById(id) as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
    link.href = resolvedTheme === 'dark' ? darkThemeUrl : lightThemeUrl
  }, [resolvedTheme])
}

interface MarkdownPreviewProps {
  content: string
}

export const MarkdownPreview = memo(function MarkdownPreview({ content }: MarkdownPreviewProps) {
  useHighlightTheme()

  const remarkPlugins = useMemo(() => [remarkGfm], [])
  const rehypePlugins = useMemo(() => [rehypeHighlight, rehypeSlug, rehypeRaw], [])

  return (
    <div className="h-full overflow-auto bg-surface">
      <div className="markdown-body max-w-4xl mx-auto px-8 py-8">
        <ReactMarkdown
          remarkPlugins={remarkPlugins}
          rehypePlugins={rehypePlugins}
          components={previewComponents}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
})
