export interface MarkdownDocument {
  id: string
  name: string
  content: string
  createdAt: number
  updatedAt: number
  size: number
}

export type FileMetadata = Omit<MarkdownDocument, 'content'>
