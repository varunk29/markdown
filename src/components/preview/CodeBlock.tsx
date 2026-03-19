import { memo, useState, useCallback } from 'react'
import { Copy, Check } from '@phosphor-icons/react'

interface CodeBlockProps {
  language: string
  code: string
}

export const CodeBlock = memo(function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className="relative group">
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 text-xs text-text-muted">
        <span className="font-mono uppercase tracking-wide">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-text cursor-pointer"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check size={14} weight="bold" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="!mt-0 !pt-10">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
})
