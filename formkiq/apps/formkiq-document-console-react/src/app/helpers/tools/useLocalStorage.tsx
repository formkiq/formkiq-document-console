import { User, Section, SubfolderUri } from "../../Store/reducers/auth"
import { IDocument } from "../types/document"

export enum storageKeys {
    auth = 'AUTH',
    config = 'CONFIG',
    dataCache = 'DATACACHE'
}

// Singleton class
// Created to simplify interraction with local storage
export class LocalStorage
{
    private static _instance: LocalStorage

    private constructor()
    {}
    public static get Instance()
    {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this())
    }
    public saveByKey(value: any, key: storageKeys) {
      localStorage.setItem(key, JSON.stringify(value))
    }
    public initByKey(key: storageKeys): any{
        const val = JSON.parse(localStorage.getItem(key) as string)
        return val
    }
    public getUser(): User | null{
        const data: { user: User } = JSON.parse(localStorage.getItem(storageKeys.auth) as string)
        if (data?.user){
            return data.user
        }
        return null
    }
    public setUser(user: User | null){
        let data: { user: User | null } = JSON.parse(localStorage.getItem(storageKeys.auth) as string)
        if(!data){
            data = {user: null}
        }
        data.user = user
        this.saveByKey(data, storageKeys.auth)
    }
    public getConfig(): any | null{
        const data: { config: any } = JSON.parse(localStorage.getItem(storageKeys.config) as string)
        if (data?.config){
            return data.config
        }
        return null
    }
    public setConfig(config: any | null){
        let data: { config: any | null } = JSON.parse(localStorage.getItem(storageKeys.config) as string)
        if(!data){
            data = {config: null}
        }
        data.config = config
        this.saveByKey(data, storageKeys.config)
    }
    public getDataCache(): any|null{
        const data: {dataCache: any} = JSON.parse(localStorage.getItem(storageKeys.dataCache) as string)
        if (data?.dataCache) {
          return data.dataCache
        }
        return null
    }
    public setDataCache(dataCache: any|null){
      let data: { dataCache: any|null}= JSON.parse(localStorage.getItem(storageKeys.dataCache) as string)
      if(!data) {
        data = {dataCache: null}
      }
      data.dataCache = dataCache
      this.saveByKey(data, storageKeys.dataCache)
    }
    public getSection(): Section | null{
        const data: { section: Section } = JSON.parse(localStorage.getItem(storageKeys.auth) as string)
        if (data?.section){
            return data.section
        }
        return null
    }
    public setSection(section: Section | null){
        let data: { section: Section | null } = JSON.parse(localStorage.getItem(storageKeys.auth) as string)
        if(!data){
            data = {section: null}
        }
        data.section = section
        this.saveByKey(data, storageKeys.auth)
    }
    public getSubfolderUri(): SubfolderUri | null{
        const data: { subfolderUri: SubfolderUri } = JSON.parse(localStorage.getItem(storageKeys.auth) as string)
        if (data?.subfolderUri){
            return data.subfolderUri
        }
        return null
    }
    public setSubfolderUri(subfolderUri: SubfolderUri | null){
        let data: { subfolderUri: SubfolderUri | null } = JSON.parse(localStorage.getItem(storageKeys.auth) as string)
        if(!data){
            data = {subfolderUri: null}
        }
        data.subfolderUri = subfolderUri
        this.saveByKey(data, storageKeys.auth)
    }
    public getCurrentDocument(): IDocument | null{
        const data: { currentDocument: IDocument } = JSON.parse(localStorage.getItem(storageKeys.auth) as string)
        if (data?.currentDocument){
            return data.currentDocument
        }
        return null
    }
    public setCurrentDocument(currentDocument: IDocument | null){
        let data: { currentDocument: IDocument | null } = JSON.parse(localStorage.getItem(storageKeys.auth) as string)
        if(!data){
            data = {currentDocument: null}
        }
        data.currentDocument = currentDocument
        this.saveByKey(data, storageKeys.auth)
    }
}

// example how to get instance
// const myClassInstance = MyClass.Instance