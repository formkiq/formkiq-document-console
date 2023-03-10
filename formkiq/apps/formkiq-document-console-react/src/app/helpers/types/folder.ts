import { IDocument } from './document'

export interface IFolder {
    siteId: string
    documentId: string
    insertedDate: string
    lastModifiedDate: string
    indexKey: string
    path: string
    documents: IDocument[]
    folders: IFolder []
    isExpanded: boolean
    tags: object[]
}
