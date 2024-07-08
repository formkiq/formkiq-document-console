import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocalStorage } from '../../helpers/tools/useLocalStorage';
import { RootState } from '../store';

const storage: LocalStorage = LocalStorage.Instance;

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
  tagsLastRefreshed: new Date(new Date().getTime() - (60 * 1000)), // 60 seconds earlier to ensure tags are refreshed after first log in
  allTags: [] as any,
  tagsSiteId: 'default',
  attributesLastRefreshed: new Date(new Date().getTime() - (60 * 1000)),
  allAttributes: [] as any,
  attributesSiteId: 'default',
  formkiqClient: {},
  currentDocumentPath: '',
} as DataCache;

const getInitialState = (): DataCache => {
  let value;
  if (storage.getDataCache()) {
      value = storage.getDataCache();
  } else {
    value = initialState;
  }
  storage.setDataCache(value);
  return value;
};

export const dataCacheSlice = createSlice({
  name: 'dataCache',
  initialState: getInitialState(),
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
