import { marked } from 'marked'
import { sanitizeFilename } from '@/lib/fileUtils'

export function markdownToHtml(markdown: string): string {
  return marked.parse(markdown, { gfm: true }) as string
}

export async function uploadToDrive(
  accessToken: string,
  fileName: string,
  htmlContent: string,
): Promise<{ id: string; webViewLink: string }> {
  const boundary = 'markdown_viewer_boundary_' + Math.random().toString(36).slice(2)
  const sanitized = sanitizeFilename(fileName)
  const metadata = JSON.stringify({
    name: sanitized,
    mimeType: 'application/vnd.google-apps.document',
  })

  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    metadata,
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    '',
    htmlContent,
    `--${boundary}--`,
  ].join('\r\n')

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    },
  )

  const data = await response.json()

  if (!response.ok) {
    const message = data?.error?.message ?? `Drive API error (${response.status})`
    throw new Error(message)
  }

  return { id: data.id, webViewLink: data.webViewLink }
}
