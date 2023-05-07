import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface DataCache {
  formkiqClient: any;
  currentDocumentPath: string;
}

const initialState = {
  formkiqClient: {},
  currentDocumentPath: '',
} as DataCache;

export const dataCacheSlice = createSlice({
  name: 'dataCache',
  initialState,
  reducers: {
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

export const {setFormkiqClient, setCurrentDocumentPath} = dataCacheSlice.actions;

export const DataCacheState = (state: RootState) => state.dataCacheState;

export default dataCacheSlice.reducer;
