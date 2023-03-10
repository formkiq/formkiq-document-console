import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface DataCache {
  tagsLastRefreshed: Date,
  allTags: any[],
  tagsSiteId: string,
  formkiqClient: any
}

const initialState = {
  tagsLastRefreshed: new Date(),
  allTags: ([] as any),
  tagsSiteId: 'default',
  formkiqClient: {}
} as DataCache

export const dataCacheSlice = createSlice({
  name: 'dataCache',
  initialState,
  reducers: {
    setAllTags(state, action: any) {
      const { 
        tagsLastRefreshed,
        allTags,
        tagsSiteId
      } = action.payload     
      const refreshed = tagsLastRefreshed
      const newSiteId = tagsSiteId
      const tags = [...allTags]
      return {
        ...state,
        allTags: tags,
        tagsLastRefreshed: refreshed,
        tagsSiteId: newSiteId
      }
    },
    setFormkiqClient(state, action: PayloadAction<any>){
      return {
        ...state,
        formkiqClient: action.payload
      }
    },
  },
})

export const {
  setAllTags,
  setFormkiqClient
} = dataCacheSlice.actions

export default dataCacheSlice.reducer