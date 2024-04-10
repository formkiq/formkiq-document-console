import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DocumentsService } from '../../helpers/services/documentsService';
import { RequestStatus, Queue } from '../../helpers/types/queues';
import { RootState } from '../store';
import { openDialog as openNotificationDialog } from './globalNotificationControls';

interface QueuesState {
  queues: Queue[];
  queue: Queue;
  loadingStatus: keyof typeof RequestStatus;
  nextToken: string | null;
  currentSearchPage: number;
  isLastSearchPageLoaded: boolean;
  isLoadingMore: boolean;
}

const defaultState: QueuesState = {
  queues: [],
  queue: {
    queueId: '',
    name: '',
  },
  loadingStatus: RequestStatus.fulfilled,
  nextToken: null,
  currentSearchPage: 1,
  isLastSearchPageLoaded: false,
  isLoadingMore: false,
};

export const fetchQueues = createAsyncThunk(
  'queues/fetchQueues',
  async (data: any, thunkAPI) => {
    const { siteId, nextToken, limit, page } = data;
    await DocumentsService.getQueues(siteId, nextToken, limit).then(
      (response) => {
        if (response) {
          const data = {
            siteId,
            queues: response.queues,
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
          thunkAPI.dispatch(setQueues(data));
        }
      }
    );
  }
);

export const deleteQueue = createAsyncThunk(
  'queues/deleteQueue',
  async (data: any, thunkAPI) => {
    const { siteId, queueId, queues } = data;
    await DocumentsService.deleteQueue(queueId, siteId).then((response) => {
      if (response.status === 200) {
        thunkAPI.dispatch(
          setQueues({
            tagSchemas: queues.filter(
              (queue: Queue) => queue.queueId !== queueId
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

export const queuesSlice = createSlice({
  name: 'queues',
  initialState: defaultState,
  reducers: {
    setQueuesLoadingStatusPending: (state) => {
      return {
        ...state,
        loadingStatus: RequestStatus.pending,
      };
    },

    setQueues: (state, action) => {
      const { queues, isLoadingMore, next, page } = action.payload;
      let { isLastSearchPageLoaded = false } = action.payload;
      isLastSearchPageLoaded = !next;
      if (queues) {
        if (isLoadingMore) {
          state.queues = state.queues.concat(queues);
        } else {
          state.queues = queues;
        }
        state.nextToken = next;
        state.isLastSearchPageLoaded = isLastSearchPageLoaded;
      }
      state.loadingStatus = RequestStatus.fulfilled;
    },
  },
});

export const {
  setQueues,
  setQueuesLoadingStatusPending,
} = queuesSlice.actions;

export const QueuesState = (state: RootState) => state.queuesState;

export default queuesSlice.reducer;


