import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {IDocument} from "../../helpers/types/document";

export interface DataCache {
  formkiqClient: any;
  currentDocumentPath: string;
  currentDocument: IDocument|null;
}

const initialState = {
  formkiqClient: {},
  currentDocumentPath: '',
  currentDocument: null
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
    setCurrentDocument: (state, action: PayloadAction<IDocument|null>) => {
      return {
        ...state,
        currentDocument: action.payload,
      };
    }
  },
});

export const { setFormkiqClient, setCurrentDocumentPath, setCurrentDocument } =
  dataCacheSlice.actions;

export const DataCacheState = (state: RootState) => state.dataCacheState;

export default dataCacheSlice.reducer;
