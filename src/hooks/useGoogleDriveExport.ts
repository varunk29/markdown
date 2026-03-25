import { useState, useRef } from 'react'
import { markdownToHtml, uploadToDrive } from '@/lib/googleDriveApi'

export type GoogleExportStatus = 'idle' | 'pending' | 'success' | 'error' | 'no-client-id'

interface GoogleDriveExportState {
  status: GoogleExportStatus
  docUrl: string | null
  errorMessage: string | null
}

export function useGoogleDriveExport() {
  const [state, setState] = useState<GoogleDriveExportState>({
    status: 'idle',
    docUrl: null,
    errorMessage: null,
  })

  const tokenRef = useRef<string | null>(null)
  const tokenExpiryRef = useRef<number>(0)

  function reset() {
    setState({ status: 'idle', docUrl: null, errorMessage: null })
  }

  async function getAccessToken(): Promise<string> {
    if (tokenRef.current && Date.now() < tokenExpiryRef.current) {
      return tokenRef.current
    }

    // Wait for GIS script to load (it's loaded async in index.html)
    let waited = 0
    while (typeof google === 'undefined' || !google.accounts?.oauth2) {
      if (waited > 3000) throw new Error('Google Sign-In failed to load. Check your network connection.')
      await new Promise((r) => setTimeout(r, 100))
      waited += 100
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string

    return new Promise((resolve, reject) => {
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: (resp) => {
          if (resp.error) {
            reject(new Error(`Authorization failed: ${resp.error}`))
            return
          }
          tokenRef.current = resp.access_token
          tokenExpiryRef.current = Date.now() + (resp.expires_in - 60) * 1000
          resolve(resp.access_token)
        },
        error_callback: (err) => {
          if (err.type === 'popup_closed') {
            reject(new Error('Authorization cancelled.'))
          } else if (err.type === 'popup_blocked') {
            reject(new Error('Popup was blocked. Please allow popups for this site and try again.'))
          } else {
            reject(new Error(`Authorization error: ${err.type}`))
          }
        },
      })
      tokenClient.requestAccessToken({ prompt: '' })
    })
  }

  async function exportToGoogleDocs(fileName: string, content: string) {
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      setState({ status: 'no-client-id', docUrl: null, errorMessage: null })
      return
    }

    setState({ status: 'pending', docUrl: null, errorMessage: null })

    try {
      const token = await getAccessToken()
      const html = markdownToHtml(content)
      const result = await uploadToDrive(token, fileName, html)
      const url = result.webViewLink ?? `https://docs.google.com/document/d/${result.id}/edit`
      setState({ status: 'success', docUrl: url, errorMessage: null })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setState({ status: 'error', docUrl: null, errorMessage: message })
    }
  }

  return { ...state, exportToGoogleDocs, reset }
}
