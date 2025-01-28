import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DocumentsService } from '../../helpers/services/documentsService';
import {
  Classification,
  RequestStatus,
  Schema,
} from '../../helpers/types/schemas';
import { RootState } from '../store';
import { openDialog as openNotificationDialog } from './globalNotificationControls';

interface SchemasState {
  siteSchema: Schema | null;
  classificationSchema: Schema | null;
  classifications: Classification[];
  loadingStatus: keyof typeof RequestStatus;
  nextToken: string | null;
  currentSearchPage: number;
  isLastSearchPageLoaded: boolean;
  isLoadingMore: boolean;
}

const defaultState: SchemasState = {
  siteSchema: null,
  classificationSchema: null,
  classifications: [],
  loadingStatus: RequestStatus.fulfilled,
  nextToken: null,
  currentSearchPage: 1,
  isLastSearchPageLoaded: false,
  isLoadingMore: false,
};

export const fetchClassifications = createAsyncThunk(
  'schemas/fetchClassifications',
  async (data: any, thunkAPI) => {
    const { siteId, nextToken, limit, page } = data;
    await DocumentsService.getSiteClassifications(
      siteId,
      limit,
      nextToken
    ).then((response) => {
      if (response) {
        const data = {
          siteId,
          classifications: response.classifications,
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
        thunkAPI.dispatch(setClassifications(data));
      }
    });
  }
);

export const deleteClassification = createAsyncThunk(
  'schemas/deleteClassification',
  async (data: any, thunkAPI) => {
    const { siteId, classificationId } = data;
    await DocumentsService.deleteClassification(siteId, classificationId).then(
      (response) => {
        if (response.status === 200) {
          thunkAPI.dispatch(
            fetchClassifications({ siteId, limit: 20, page: 1 })
          );
        } else {
          thunkAPI.dispatch(
            openNotificationDialog({ dialogTitle: response.message })
          );
        }
      }
    );
  }
);

export const fetchSiteSchema = createAsyncThunk(
  'schemas/fetchSiteSchema',
  async (data: any, thunkAPI) => {
    const { siteId } = data;
    await DocumentsService.getSiteSchema(siteId).then((response) => {
      if (response.status === 200) {
        thunkAPI.dispatch(
          setSiteSchema({
            name: response.name,
            attributes: response.attributes,
          })
        );
      } else {
        thunkAPI.dispatch(setSiteSchema(null));
      }
    });
  }
);

export const fetchClassificationSchema = createAsyncThunk(
  'schemas/fetchClassificationSchema',
  async (data: any, thunkAPI) => {
    const { siteId, classificationId } = data;
    await DocumentsService.getClassification(siteId, classificationId).then(
      (response) => {
        if (response.status === 200) {
          thunkAPI.dispatch(setClassificationSchema(response.classification));
        }
      }
    );
  }
);

export const schemasSlice = createSlice({
  name: 'schemas',
  initialState: defaultState,
  reducers: {
    setClassifications: (state, action) => {
      const { classifications, isLoadingMore, next, page } = action.payload;
      let { isLastSearchPageLoaded = false } = action.payload;
      isLastSearchPageLoaded = !next;
      if (classifications) {
        if (isLoadingMore) {
          state.classifications = state.classifications.concat(classifications);
        } else {
          state.classifications = classifications;
        }
        state.nextToken = next;
        state.isLastSearchPageLoaded = isLastSearchPageLoaded;
        state.currentSearchPage = page;
      }
      state.loadingStatus = RequestStatus.fulfilled;
      state.classificationSchema = null;
    },

    setClassificationsLoadingStatusPending: (state) => {
      return {
        ...state,
        loadingStatus: RequestStatus.pending,
      };
    },

    setClassificationSchema: (state, action) => {
      state.classificationSchema = action.payload;
      return state;
    },

    setSiteSchema: (state, action) => {
      state.siteSchema = action.payload;
      return state;
    },
  },
});

export const {
  setClassifications,
  setClassificationsLoadingStatusPending,
  setClassificationSchema,
  setSiteSchema,
} = schemasSlice.actions;

export const SchemasState = (state: RootState) => state.schemasState;

export default schemasSlice.reducer;
