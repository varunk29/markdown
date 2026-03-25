import { useState } from 'react'
import { ArrowSquareOut, Copy, Check, WarningCircle, CircleNotch } from '@phosphor-icons/react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import type { GoogleExportStatus } from '@/hooks/useGoogleDriveExport'

interface GoogleDocsExportDialogProps {
  status: GoogleExportStatus
  docUrl: string | null
  errorMessage: string | null
  onClose: () => void
}

export function GoogleDocsExportDialog({
  status,
  docUrl,
  errorMessage,
  onClose,
}: GoogleDocsExportDialogProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (!docUrl) return
    navigator.clipboard.writeText(docUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const titles: Record<GoogleExportStatus, string> = {
    idle: '',
    pending: 'Exporting to Google Docs',
    success: 'Exported to Google Docs',
    error: 'Export failed',
    'no-client-id': 'Google Docs setup required',
  }

  return (
    <Dialog open={status !== 'idle'} onClose={onClose} title={titles[status]}>
      {status === 'pending' && (
        <div className="flex items-center gap-3 py-2 text-text-secondary">
          <CircleNotch size={20} className="animate-spin text-accent" />
          <span className="text-sm">Uploading to Google Drive...</span>
        </div>
      )}

      {status === 'success' && docUrl && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary">Your document has been created in Google Drive.</p>
          <a
            href={docUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-accent hover:underline break-all"
          >
            <ArrowSquareOut size={16} />
            Open in Google Docs
          </a>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy link'}
            </Button>
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <WarningCircle size={20} className="text-danger shrink-0 mt-0.5" />
            <p className="text-sm text-text-secondary">{errorMessage}</p>
          </div>
          <div className="flex justify-end">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}

      {status === 'no-client-id' && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary">
            To enable Google Docs export, you need to configure a Google Cloud OAuth client ID.
          </p>
          <ol className="text-sm text-text-secondary space-y-1.5 list-decimal list-inside">
            <li>Go to Google Cloud Console and create a project</li>
            <li>Enable the <strong className="text-text">Google Drive API</strong></li>
            <li>Create an <strong className="text-text">OAuth 2.0 Client ID</strong> (Web Application)</li>
            <li>Add your app's origin to Authorized JavaScript Origins</li>
            <li>
              Add to <code className="text-xs bg-surface-tertiary px-1 py-0.5 rounded">.env.local</code>:
              <pre className="mt-1 text-xs bg-surface-tertiary rounded p-2 overflow-x-auto">
                VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
              </pre>
            </li>
          </ol>
          <div className="flex justify-end">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  )
}
