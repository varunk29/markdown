import { create } from 'zustand'
import type { FileMetadata, MarkdownDocument } from '@/types/document'
import * as db from '@/lib/db'

interface FileState {
  files: FileMetadata[]
  isLoading: boolean

  loadFileList: () => Promise<void>
  createFile: (name: string, content: string) => Promise<string>
  updateFile: (id: string, name: string, content: string) => Promise<void>
  deleteFile: (id: string) => Promise<void>
  renameFile: (id: string, newName: string) => Promise<void>
}

export const useFileStore = create<FileState>()((set, get) => ({
  files: [],
  isLoading: false,

  loadFileList: async () => {
    set({ isLoading: true })
    const files = await db.getAllDocumentsMeta()
    set({ files, isLoading: false })
  },

  createFile: async (name, content) => {
    const id = crypto.randomUUID()
    const now = Date.now()
    const doc: MarkdownDocument = {
      id,
      name,
      content,
      createdAt: now,
      updatedAt: now,
      size: new TextEncoder().encode(content).length,
    }
    await db.saveDocument(doc)
    await get().loadFileList()
    return id
  },

  updateFile: async (id, name, content) => {
    const existing = await db.getDocument(id)
    if (!existing) return
    const doc: MarkdownDocument = {
      ...existing,
      name,
      content,
      updatedAt: Date.now(),
      size: new TextEncoder().encode(content).length,
    }
    await db.saveDocument(doc)
    await get().loadFileList()
  },

  deleteFile: async (id) => {
    await db.deleteDocument(id)
    await get().loadFileList()
  },

  renameFile: async (id, newName) => {
    const existing = await db.getDocument(id)
    if (!existing) return
    await db.saveDocument({ ...existing, name: newName, updatedAt: Date.now() })
    await get().loadFileList()
  },
}))
