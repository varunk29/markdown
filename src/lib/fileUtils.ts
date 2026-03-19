export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

export function downloadAsMarkdown(name: string, content: string): void {
  const sanitized = sanitizeFilename(name)
  const filename = sanitized.endsWith('.md') ? sanitized : `${sanitized}.md`
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*\x00-\x1f]/g, '').trim() || 'untitled'
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getWordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

export function getReadTime(wordCount: number): string {
  const minutes = Math.ceil(wordCount / 200)
  return minutes <= 1 ? '1 min read' : `${minutes} min read`
}
