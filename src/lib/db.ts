import { openDB, type IDBPDatabase } from 'idb'
import type { MarkdownDocument, FileMetadata } from '@/types/document'

const DB_NAME = 'markdown-viewer-db'
const DB_VERSION = 1
const STORE_NAME = 'documents'

let dbPromise: Promise<IDBPDatabase> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('name', 'name', { unique: false })
          store.createIndex('updatedAt', 'updatedAt', { unique: false })
        }
      },
    })
  }
  return dbPromise
}

export async function getAllDocumentsMeta(): Promise<FileMetadata[]> {
  const db = await getDB()
  const docs: MarkdownDocument[] = await db.getAll(STORE_NAME)
  return docs
    .map(({ id, name, createdAt, updatedAt, size }) => ({
      id,
      name,
      createdAt,
      updatedAt,
      size,
    }))
    .sort((a, b) => b.updatedAt - a.updatedAt)
}

export async function getDocument(id: string): Promise<MarkdownDocument | undefined> {
  const db = await getDB()
  return db.get(STORE_NAME, id)
}

export async function saveDocument(doc: MarkdownDocument): Promise<void> {
  const db = await getDB()
  await db.put(STORE_NAME, doc)
}

export async function deleteDocument(id: string): Promise<void> {
  const db = await getDB()
  await db.delete(STORE_NAME, id)
}
