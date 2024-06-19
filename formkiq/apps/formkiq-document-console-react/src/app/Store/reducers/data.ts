import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface DataCache {
  tagsLastRefreshed: Date;
  allTags: any[];
  tagsSiteId: string;
  attributesLastRefreshed: Date;
  allAttributes: any[];
  attributesSiteId: string;
  formkiqClient: any;
  currentDocumentPath: string;
}

const initialState = {
  tagsLastRefreshed: new Date(),
  allTags: [] as any,
  tagsSiteId: 'default',
  attributesLastRefreshed: new Date(),
  allAttributes: [] as any,
  attributesSiteId: 'default',
  formkiqClient: {},
  currentDocumentPath: '',
} as DataCache;

export const dataCacheSlice = createSlice({
  name: 'dataCache',
  initialState,
  reducers: {
    setAllTags: (state, action: PayloadAction<any>)  => {
      const { tagsLastRefreshed, allTags, tagsSiteId } = action.payload;
      const refreshed = tagsLastRefreshed;
      const newSiteId = tagsSiteId;
      const tags = [...allTags];
      return {
        ...state,
        allTags: tags,
        tagsLastRefreshed: refreshed,
        tagsSiteId: newSiteId,
      };
    },
    setAllAttributes: (state, action: PayloadAction<any>) => {
      const { attributesLastRefreshed, allAttributes, attributesSiteId } =
        action.payload;
      const refreshed = attributesLastRefreshed;
      const newSiteId = attributesSiteId;
      const attributes = [...allAttributes];
      return {
        ...state,
        allAttributes: attributes,
        attributesLastRefreshed: refreshed,
        attributesSiteId: newSiteId,
      };
    },
    setFormkiqClient: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        formkiqClient: action.payload,
      };
    },
    setCurrentDocumentPath: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        currentDocumentPath: action.payload,
      };
    },
  },
});

export const { setAllTags, setAllAttributes, setFormkiqClient, setCurrentDocumentPath } =
  dataCacheSlice.actions;

export const DataCacheState = (state: RootState) => state.dataCacheState;

export default dataCacheSlice.reducer;
