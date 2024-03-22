import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DocumentsService } from '../../helpers/services/documentsService';
import { RootState } from '../store';
import { openDialog as openNotificationDialog } from './globalNotificationControls';
import {TagSchema,RequestStatus} from "../../helpers/types/tagSchemas";

interface TagSchemasState {
  tagSchemas: TagSchema[];
  tagSchema:  TagSchema | null;
  loadingStatus: keyof typeof RequestStatus;
  nextToken: string | null;
  currentSearchPage: number;
  isLastSearchPageLoaded: boolean;
  isLoadingMore: boolean;
}

const defaultState: TagSchemasState = {
  tagSchemas: [],
  tagSchema: null,
  loadingStatus: RequestStatus.fulfilled,
  nextToken: null,
  currentSearchPage: 1,
  isLastSearchPageLoaded: false,
  isLoadingMore: false,
};

export const fetchTagSchemas = createAsyncThunk(
  'tagSchemas/fetchTagSchemas',
  async (data: any, thunkAPI) => {
    const { siteId, nextToken, limit, page } = data;
    await DocumentsService.getTagSchemas(siteId, nextToken, limit).then(
      (response) => {
        if (response) {
          console.log(response,'response')
          const data = {
            siteId,
            tagSchemas: response.schemas,
            isLoadingMore: false,
            isLastSearchPageLoaded: false,
            next: response.next,
            page,
          };
          if (page > 1) {
            data.isLoadingMore = true;
          }
          if (response.documents?.length === 0) {
            data.isLastSearchPageLoaded = true;
          }
          thunkAPI.dispatch(setTagSchemas(data));
        }
      }
    );
  }
);

export const deleteTagSchema = createAsyncThunk(
    'tagSchemas/deleteTagSchema',
  async (data: any, thunkAPI) => {
    const { siteId, tagSchemaId, tagSchemas } = data;
    await DocumentsService.deleteTagSchema(tagSchemaId, siteId).then((response) => {
      if (response.status === 200) {
        thunkAPI.dispatch(
          setTagSchemas({
            tagSchemas: tagSchemas.filter(
              (tagSchema: TagSchema) => tagSchema.tagSchemaId !== tagSchemaId
            ),
          })
        );
      } else {
        thunkAPI.dispatch(
          openNotificationDialog({ dialogTitle: response.message })
        );
      }
    });
  }
);

export const fetchTagSchema = createAsyncThunk(
    'tagSchemas/fetchTagSchema',
  async (data: any, thunkAPI) => {
    const { siteId, tagSchemaId,  } = data;
    await DocumentsService.getTagSchema(tagSchemaId, siteId).then(
      (response) => {
        if (response) {
          thunkAPI.dispatch(setTagSchema(response));
        }
      }
    );
  }
);


export const tagSchemasSlice = createSlice({
  name: 'tagSchemas',
  initialState: defaultState,
  reducers: {
    setTagSchemasLoadingStatusPending: (state) => {
      return {
        ...state,
        loadingStatus: RequestStatus.pending,
      };
    },

    setTagSchemas: (state, action) => {
      const { tagSchemas, isLoadingMore, next, page } = action.payload;
      let { isLastSearchPageLoaded = false } = action.payload;
      isLastSearchPageLoaded = !next;
      if (tagSchemas) {
        if (isLoadingMore) {
          state.tagSchemas = state.tagSchemas.concat(tagSchemas);
        } else {
          state.tagSchemas = tagSchemas;
        }
        state.nextToken = next;
        state.isLastSearchPageLoaded = isLastSearchPageLoaded;
      }
      state.loadingStatus = RequestStatus.fulfilled;
      state.tagSchema = null;
    },

    setTagSchema: (state, action) => {
      const { tagSchema } = action.payload;
      state.tagSchema = tagSchema;
      return state;
    },
  },
});

export const {
  setTagSchemas,
  setTagSchemasLoadingStatusPending,
  setTagSchema,
} = tagSchemasSlice.actions;

export const TagSchemasState = (state: RootState) => state.tagSchemasState;

export default tagSchemasSlice.reducer;
