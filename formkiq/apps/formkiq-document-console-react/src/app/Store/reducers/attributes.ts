import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {DocumentsService} from '../../helpers/services/documentsService';
import {RequestStatus, Attribute, DocumentAttribute} from '../../helpers/types/attributes';
import {RootState} from '../store';
import {openDialog as openNotificationDialog} from './globalNotificationControls';

interface AttributesState {
  allAttributes: Attribute[];
  documentAttributes: DocumentAttribute[];
  attribute: Attribute | null;
  documentAttribute: DocumentAttribute | null;
  allAttributesLoadingStatus: keyof typeof RequestStatus;
  documentAttributesLoadingStatus: keyof typeof RequestStatus;
  allAttributesNextToken: string | null;
  documentAttributesNextToken: string | null;
  allAttributesCurrentSearchPage: number;
  documentAttributesCurrentSearchPage: number;
  allAttributesIsLastSearchPageLoaded: boolean;
  documentAttributesIsLastSearchPageLoaded: boolean;
  allAttributesIsLoadingMore: boolean;
  documentAttributesIsLoadingMore: boolean;
}

const defaultState: AttributesState = {
  allAttributes: [],
  documentAttributes: [],
  attribute: null,
  documentAttribute: null,
  allAttributesLoadingStatus: RequestStatus.fulfilled,
  documentAttributesLoadingStatus: RequestStatus.fulfilled,
  allAttributesNextToken: null,
  documentAttributesNextToken: null,
  allAttributesCurrentSearchPage: 1,
  documentAttributesCurrentSearchPage: 1,
  allAttributesIsLastSearchPageLoaded: false,
  documentAttributesIsLastSearchPageLoaded: false,
  allAttributesIsLoadingMore: false,
  documentAttributesIsLoadingMore: false,
};

export const fetchAllAttributes = createAsyncThunk(
  'attributes/fetchAllAttributes',
  async (data: any, thunkAPI) => {
    const {siteId, nextToken, limit, page} = data;
    await DocumentsService.getAttributes(siteId, nextToken, limit).then(
      (response) => {
        if (response) {
          const data = {
            siteId,
            allAttributes: response.attributes,
            isLoadingMore: false,
            isLastSearchPageLoaded: false,
            next: response.next,
            page,
          };
          if (page > 1) {
            data.isLoadingMore = true;
          }
          if (response.attributes?.length === 0) {
            data.isLastSearchPageLoaded = true;
          }
          thunkAPI.dispatch(setAllAttributes(data));
        }
      }
    );
  }
);

export const deleteAttribute = createAsyncThunk(
  'attributes/deleteAttribute',
  async (data: any, thunkAPI) => {
    const {siteId, key, attributes} = data;
    await DocumentsService.deleteAttribute(siteId, key).then(
      (response) => {
        if (response.status === 200) {
          thunkAPI.dispatch(
            setAllAttributes({
              allAttributes: attributes.filter(
                (attribute: Attribute) => attribute.key !== key
              ),
            })
          );
        } else {
          thunkAPI.dispatch(
            openNotificationDialog({dialogTitle: response.message})
          );
        }
      }
    );
  }
);


export const fetchAttribute = createAsyncThunk(
  'attributes/fetchAttribure',
  async (data: any, thunkAPI) => {
    const {siteId, key} = data;
    await DocumentsService.getAttribute(siteId, key).then(
      (response) => {
        if (response) {
          thunkAPI.dispatch(setAttribute(response));
        }
      }
    );
  }
);

export const fetchDocumentAttributes = createAsyncThunk(
  'attributes/fetchDocumentAttributes',
  async (data: any, thunkAPI) => {
    const {siteId, documentId, nextToken, limit, page} = data;
    await DocumentsService.getDocumentAttributes(siteId, nextToken, limit, documentId).then(
      (response) => {
        if (response) {
          const data = {
            siteId,
            documentAttributes: response.attributes,
            isLoadingMore: false,
            isLastSearchPageLoaded: false,
            next: response.next,
            page,
          };
          if (page > 1) {
            data.isLoadingMore = true;
          }
          if (response.attributes?.length === 0) {
            data.isLastSearchPageLoaded = true;
          }
          thunkAPI.dispatch(setDocumentAttributes(data));
        }
      }
    );
  }
);

export const deleteDocumentAttribute = createAsyncThunk(
    'attributes/deleteDocumentAttribute',
    async (data: any, thunkAPI) => {
        const {siteId, key, documentId, documentAttributes} = data;
        await DocumentsService.deleteDocumentAttribute(siteId, documentId, key).then(
            (response) => {
                if (response.status === 200) {
                    thunkAPI.dispatch(
                        setDocumentAttributes({
                            documentAttributes: documentAttributes.filter(
                                (documentAttribute: DocumentAttribute) => documentAttribute.key !== key
                            ),
                        })
                    );
                } else {
                    thunkAPI.dispatch(
                        openNotificationDialog({dialogTitle: response.message})
                    );
                }
            }
        );
    }
);

export const fetchDocumentAttribute = createAsyncThunk(
    'attributes/fetchDocumentAttribute',
    async (data: any, thunkAPI) => {
        const {siteId, documentId, key} = data;
        await DocumentsService.getDocumentAttribute(siteId, documentId, key).then(
            (response) => {
                if (response) {
                    thunkAPI.dispatch(setDocumentAttribute(response));
                }
            }
        );
    }
);

export const attributesSlice = createSlice({
    name: 'attributes',
    initialState: defaultState,
    reducers: {

      setAllAttributesLoadingStatusPending: (state) => {
        return {
          ...state,
          allAttributesLoadingStatus: RequestStatus.pending,
        };
      },

      setAllAttributes: (state, action) => {
        const {
          allAttributes,
          isLoadingMore,
          isLastSearchPageLoaded,
          next,
          page,
        } = action.payload;
        if (allAttributes) {
          if (isLoadingMore) {
            state.allAttributes = state.allAttributes.concat(allAttributes);
          } else {
            state.allAttributes = allAttributes;
          }
          state.allAttributesNextToken = next;
          state.allAttributesIsLastSearchPageLoaded = isLastSearchPageLoaded;
          state.allAttributesCurrentSearchPage = page;
          state.allAttributesIsLoadingMore = isLoadingMore;
        }
        state.allAttributesLoadingStatus = RequestStatus.fulfilled;
        state.attribute = null;
      },

      setAttribute: (state, action) => {
        const {attribute} = action.payload;
        state.attribute = attribute;
        return state;
      },

      setDocumentAttributesLoadingStatusPending: (state) => {
        return {
          ...state,
          documentAttributesLoadingStatus: RequestStatus.pending,
        };
      },

      setDocumentAttributes: (state, action) => {
        const {
          documentAttributes,
          isLoadingMore,
          isLastSearchPageLoaded,
          next,
          page,
        } = action.payload;
        if (documentAttributes) {
          if (isLoadingMore) {
            state.documentAttributes = state.documentAttributes.concat(
              documentAttributes
            );
          } else {
            state.documentAttributes = documentAttributes;
          }
          state.documentAttributesNextToken = next;
          state.documentAttributesIsLastSearchPageLoaded =
            isLastSearchPageLoaded;
          state.documentAttributesCurrentSearchPage = page;
          state.documentAttributesIsLoadingMore = isLoadingMore;
        }
        state.documentAttributesLoadingStatus = RequestStatus.fulfilled;
        state.documentAttribute = null;
      },

      setDocumentAttribute: (state, action) => {
        const {documentAttribute} = action.payload;
        state.documentAttribute = documentAttribute;
        return state;
      },

    }
  }
);

export const {
  setAllAttributes,
  setAllAttributesLoadingStatusPending,
  setAttribute,
  setDocumentAttributes,
  setDocumentAttributesLoadingStatusPending,
  setDocumentAttribute,
} = attributesSlice.actions;

export const AttributesState = (state: RootState) => state.attributesState;

export default attributesSlice.reducer;
