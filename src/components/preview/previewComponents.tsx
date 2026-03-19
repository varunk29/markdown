import { isValidElement, type ReactNode } from 'react'
import type { Components } from 'react-markdown'
import { CodeBlock } from './CodeBlock'
import { MermaidBlock } from './MermaidBlock'

function extractCodeInfo(children: ReactNode): { language: string; code: string } | null {
  // react-markdown renders <pre><code className="language-xxx">...</code></pre>
  // We need to extract language and text from the <code> child
  if (!isValidElement(children)) return null

  const props = children.props as { className?: string; children?: ReactNode }
  const className = props.className || ''
  const match = /language-(\w+)/.exec(className)
  if (!match?.[1]) return null

  return {
    language: match[1],
    code: String(props.children || '').replace(/\n$/, ''),
  }
}

export const previewComponents: Components = {
  pre({ children }) {
    const info = extractCodeInfo(children)

    if (!info) {
      return <pre>{children}</pre>
    }

    if (info.language === 'mermaid') {
      return <MermaidBlock chart={info.code} />
    }

    return <CodeBlock language={info.language} code={info.code} />
  },

  a({ href, children, ...props }) {
    const isExternal = href?.startsWith('http')
    return (
      <a
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
      </a>
    )
  },

  table({ children, ...props }) {
    return (
      <div className="overflow-x-auto my-4">
        <table {...props}>{children}</table>
      </div>
    )
  },

  img({ src, alt, ...props }) {
    return (
      <img
        src={src}
        alt={alt || ''}
        loading="lazy"
        className="rounded-lg max-w-full"
        {...props}
      />
    )
  },
}
