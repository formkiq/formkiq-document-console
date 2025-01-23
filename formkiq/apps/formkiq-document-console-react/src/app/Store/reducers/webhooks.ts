import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {DocumentsService} from '../../helpers/services/documentsService';
import {RootState} from '../store';
import {openDialog as openNotificationDialog} from './globalNotificationControls';
import {Webhook, RequestStatus} from "../../helpers/types/webhooks";

interface WebhooksState {
  webhooks: Webhook[];
  webhooksLoadingStatus: keyof typeof RequestStatus;
  nextWebhooksToken: string | null;
  currentWebhooksSearchPage: number;
  isLastWebhooksSearchPageLoaded: boolean;
  isLoadingMore: boolean;
}

const defaultState: WebhooksState = {
  webhooks: [],
  webhooksLoadingStatus: RequestStatus.fulfilled,
  nextWebhooksToken: null,
  currentWebhooksSearchPage: 1,
  isLastWebhooksSearchPageLoaded: false,
  isLoadingMore: false,
};

export const fetchWebhooks = createAsyncThunk(
  'webhooks/fetchWebhooks',
  async (data: any, thunkAPI) => {
    const {nextToken, limit, page, siteId} = data;
    await DocumentsService.getWebhooks(siteId, limit, nextToken).then((response) => {
      if (response.status === 200) {
        const data = {
          webhooks: response.webhooks,
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
        thunkAPI.dispatch(setWebhooks(data));
      } else {
        thunkAPI.dispatch(
          openNotificationDialog({
            dialogTitle: 'Error fetching webhooks',
          })
        );
      }
    });
  }
);

export const webhooksSlice = createSlice({
  name: 'webhooks',
  initialState: defaultState,
  reducers: {
    setWebhooks: (state, action) => {
      const {webhooks, isLoadingMore, next} = action.payload;
      const isLastSearchPageLoaded = !next;
      if (webhooks) {
        if (isLoadingMore) {
          state.webhooks = state.webhooks.concat(webhooks);
        } else {
          state.webhooks = webhooks;
        }
        state.nextWebhooksToken = next;
        state.isLastWebhooksSearchPageLoaded = isLastSearchPageLoaded;
        state.webhooksLoadingStatus = RequestStatus.fulfilled;
      }
    },

    setWebhooksLoadingStatusPending: (state) => {
      return {
        ...state,
        webhooksLoadingStatus: RequestStatus.pending,
      };
    }
  },
});

export const {
  setWebhooks,
  setWebhooksLoadingStatusPending,
} = webhooksSlice.actions;

export const WebhooksState = (state: RootState) =>
  state.webhooksState;

export default webhooksSlice.reducer;
