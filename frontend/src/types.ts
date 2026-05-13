export interface Source {
  id: string
  modda: string
  bob: string
  bolim: string
  text: string
  document: string
}

export interface Contact {
  name: string
  phone: string
  type: 'phone'
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  contacts?: Contact[]
}

export interface Modda {
  id: string
  number: string
  text: string
  bob: string | null
  bolim: string | null
}

export interface Bob {
  name: string
  bolim: string | null
  moddalar: Modda[]
}

export interface LegalDocument {
  name: string
  bobs: Bob[]
}

export interface DocumentsResponse {
  documents: LegalDocument[]
}
