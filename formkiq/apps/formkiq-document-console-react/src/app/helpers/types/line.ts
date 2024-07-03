import { IDocument } from "./document"
import { IFolder } from "./folder"

export interface ILine {
    lineType: string
    folder: string
    documentId: string
    documentInstance: IDocument | null
    folderInstance: IFolder | null
    groupName?: string
}
