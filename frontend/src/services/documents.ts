import { documentEndpoints, http } from './http'

export interface DocumentItem {
  id: string
  userId: string
  sessionId: string | null
  session?: {
    title: string
  } | null
  fileName: string
  originalName: string
  filePath: string
  mimeType: string
  size: number
}

export async function fetchDocuments() {
  const response = await http.get<DocumentItem[]>(documentEndpoints.list)
  return response.data
}

export async function uploadDocument(file: File, sessionId?: string) {
  const formData = new FormData()
  if (sessionId) {
    formData.append('sessionId', sessionId)
  }
  formData.append('file', file)
  
  const response = await http.post<DocumentItem>(documentEndpoints.upload, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function downloadDocument(id: string, originalName: string) {
  const response = await http.get(documentEndpoints.download(id), {
    responseType: 'blob',
  })
  
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', originalName)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export async function deleteDocument(id: string) {
  const response = await http.delete(documentEndpoints.delete(id))
  return response.data
}

export async function deleteAllDocuments() {
  const response = await http.delete(documentEndpoints.list)
  return response.data
}

export function getPreviewUrl(id: string) {
  const baseUrl = http.defaults.baseURL ?? 'http://localhost:8080'
  return `${baseUrl}${documentEndpoints.preview(id)}`
}
