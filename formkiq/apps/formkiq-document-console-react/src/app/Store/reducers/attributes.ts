import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {DocumentsService} from '../../helpers/services/documentsService';
import {RequestStatus, DocumentAttribute} from '../../helpers/types/attributes';
import {RootState} from '../store';
import {openDialog as openNotificationDialog} from './globalNotificationControls';

interface AttributesState {
  documentAttributes: DocumentAttribute[];
  documentAttribute: DocumentAttribute | null;
  documentAttributesLoadingStatus: keyof typeof RequestStatus;
  documentAttributesNextToken: string | null;
  documentAttributesCurrentSearchPage: number;
  documentAttributesIsLastSearchPageLoaded: boolean;
  documentAttributesIsLoadingMore: boolean;
}

const defaultState: AttributesState = {
  documentAttributes: [],
  documentAttribute: null,
  documentAttributesLoadingStatus: RequestStatus.fulfilled,
  documentAttributesNextToken: null,
  documentAttributesCurrentSearchPage: 1,
  documentAttributesIsLastSearchPageLoaded: false,
  documentAttributesIsLoadingMore: false,
};

export const deleteAttribute = createAsyncThunk(
  'attributes/deleteAttribute',
  async (data: any, thunkAPI) => {
    const {siteId, key} = data;
    await DocumentsService.deleteAttribute(siteId, key).then(
      (response) => {
        if (response.status !== 200) {
          thunkAPI.dispatch(
            openNotificationDialog({dialogTitle: response.message})
          );
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

export const attributesSlice = createSlice({
    name: 'attributes',
    initialState: defaultState,
    reducers: {
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
  setDocumentAttributes,
  setDocumentAttributesLoadingStatusPending,
  setDocumentAttribute,
} = attributesSlice.actions;

export const AttributesState = (state: RootState) => state.attributesState;

export default attributesSlice.reducer;
