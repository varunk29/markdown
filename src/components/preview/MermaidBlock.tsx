import { memo, useEffect, useRef, useState, useId } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useUIStore } from '@/stores/uiStore'

interface MermaidBlockProps {
  chart: string
}

let mermaidModule: typeof import('mermaid') | null = null
let mermaidLoadPromise: Promise<typeof import('mermaid')> | null = null

async function loadMermaid() {
  if (mermaidModule) return mermaidModule
  if (!mermaidLoadPromise) {
    mermaidLoadPromise = import('mermaid')
  }
  mermaidModule = await mermaidLoadPromise
  return mermaidModule
}

export const MermaidBlock = memo(function MermaidBlock({ chart }: MermaidBlockProps) {
  const [ref, isIntersecting] = useIntersectionObserver()
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const hasRendered = useRef(false)
  const resolvedTheme = useUIStore((s) => s.resolvedTheme)
  const uniqueId = useId().replace(/:/g, '-')

  useEffect(() => {
    if (!isIntersecting && !hasRendered.current) return

    let cancelled = false

    async function render() {
      try {
        const mod = await loadMermaid()
        mod.default.initialize({
          startOnLoad: false,
          theme: resolvedTheme === 'dark' ? 'dark' : 'default',
          securityLevel: 'loose',
        })

        const { svg: rendered } = await mod.default.render(
          `mermaid-${uniqueId}-${Date.now()}`,
          chart,
        )

        if (!cancelled) {
          setSvg(rendered)
          setError(null)
          hasRendered.current = true
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram')
          setSvg(null)
        }
      }
    }

    render()
    return () => { cancelled = true }
  }, [chart, isIntersecting, resolvedTheme, uniqueId])

  if (error) {
    return (
      <div ref={ref} className="border border-danger/30 rounded-lg p-4 bg-danger/5 my-4">
        <p className="text-sm text-danger font-medium mb-2">Mermaid diagram error</p>
        <pre className="text-xs text-text-muted overflow-auto font-mono">{chart}</pre>
      </div>
    )
  }

  if (!svg) {
    return (
      <div ref={ref} className="flex items-center justify-center py-12 my-4 rounded-lg bg-surface-secondary border border-border">
        <div className="flex items-center gap-3 text-text-muted">
          <div className="w-5 h-5 border-2 border-text-muted/30 border-t-accent rounded-full animate-spin" />
          <span className="text-sm">Rendering diagram...</span>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="mermaid-container my-4 p-4 rounded-lg bg-surface-secondary border border-border flex justify-center overflow-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
})
