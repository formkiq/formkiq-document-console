import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {DocumentsService} from '../../helpers/services/documentsService';
import {RootState} from '../store';
import {openDialog as openNotificationDialog} from './globalNotificationControls';
import {ApiKey, RequestStatus} from "../../helpers/types/apiKeys";

interface ApiKeysState {
  apiKeys: ApiKey[];
  apiKeysLoadingStatus: keyof typeof RequestStatus;
  nextApiKeysToken: string | null;
  currentApiKeysSearchPage: number;
  isLastApiKeysSearchPageLoaded: boolean;
  isLoadingMore: boolean;
}

const defaultState: ApiKeysState = {
  apiKeys: [],
  apiKeysLoadingStatus: RequestStatus.fulfilled,
  nextApiKeysToken: null,
  currentApiKeysSearchPage: 1,
  isLastApiKeysSearchPageLoaded: false,
  isLoadingMore: false,
};

export const fetchApiKeys = createAsyncThunk(
  'apiKeys/fetchApiKeys',
  async (data: any, thunkAPI) => {
    const {nextToken, limit, page, siteId} = data;
    await DocumentsService.getApiKeys(siteId, limit, nextToken).then((response) => {
      if (response.status === 200) {
        const data = {
          apiKeys: response.apiKeys,
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
        thunkAPI.dispatch(setApiKeys(data));
      } else {
        thunkAPI.dispatch(
          openNotificationDialog({
            dialogTitle: 'Error fetching API keys',
          })
        );
      }
    });
  }
);

export const apiKeysSlice = createSlice({
  name: 'apiKeys',
  initialState: defaultState,
  reducers: {
    setApiKeys: (state, action) => {
      const {apiKeys, isLoadingMore, next} = action.payload;
      const isLastSearchPageLoaded = !next;
      if (apiKeys) {
        if (isLoadingMore) {
          state.apiKeys = state.apiKeys.concat(apiKeys);
        } else {
          state.apiKeys = apiKeys;
        }
        state.nextApiKeysToken = next;
        state.isLastApiKeysSearchPageLoaded = isLastSearchPageLoaded;
        state.apiKeysLoadingStatus = RequestStatus.fulfilled;
      }
    },

    setApiKeysLoadingStatusPending: (state) => {
      return {
        ...state,
        apiKeysLoadingStatus: RequestStatus.pending,
      };
    }
  },
});

export const {
  setApiKeys,
  setApiKeysLoadingStatusPending,
} = apiKeysSlice.actions;

export const ApiKeysState = (state: RootState) =>
  state.apiKeysState;

export default apiKeysSlice.reducer;
