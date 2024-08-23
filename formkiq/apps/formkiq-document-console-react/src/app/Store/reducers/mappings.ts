import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {DocumentsService} from '../../helpers/services/documentsService';
import {RootState} from '../store';
import {openDialog as openNotificationDialog} from './globalNotificationControls';
import {Mapping, RequestStatus} from "../../helpers/types/mappings";

interface MappingsState {
  mappings: Mapping[];
  mappingsLoadingStatus: keyof typeof RequestStatus;
  nextMappingsToken: string | null;
  currentMappingsSearchPage: number;
  isLastMappingsSearchPageLoaded: boolean;
  isLoadingMore: boolean;
}

const defaultState: MappingsState = {
  mappings: [],
  mappingsLoadingStatus: RequestStatus.fulfilled,
  nextMappingsToken: null,
  currentMappingsSearchPage: 1,
  isLastMappingsSearchPageLoaded: false,
  isLoadingMore: false,
};

export const fetchMappings = createAsyncThunk(
  'mappings/fetchMappings',
  async (data: any, thunkAPI) => {
    const {nextToken, limit, page, siteId} = data;
    await DocumentsService.getMappings(siteId, limit, nextToken).then((response) => {
      if (response.status === 200) {
        const data = {
          mappings: response.mappings,
          isLoadingMore: false,
          isLastSearchPageLoaded: false,
          next: response.next,
          page,
        };
        if (page > 1) {
          data.isLoadingMore = true;
        }
        if (response.mappings?.length === 0) {
          data.isLastSearchPageLoaded = true;
        }
        thunkAPI.dispatch(setMappings(data));
      } else {
        thunkAPI.dispatch(
          openNotificationDialog({
            dialogTitle: 'Error fetching mappings',
          })
        );
      }
    });
  }
);

export const mappingsSlice = createSlice({
  name: 'mappings',
  initialState: defaultState,
  reducers: {
    setMappings: (state, action) => {
      const {mappings, isLoadingMore, next} = action.payload;
      const isLastSearchPageLoaded = !next;
      if (mappings) {
        if (isLoadingMore) {
          state.mappings = state.mappings.concat(mappings);
        } else {
          state.mappings = mappings;
        }
        state.nextMappingsToken = next;
        state.isLastMappingsSearchPageLoaded = isLastSearchPageLoaded;
        state.mappingsLoadingStatus = RequestStatus.fulfilled;
      }
    },

    setMappingsLoadingStatusPending: (state) => {
      return {
        ...state,
        mappingsLoadingStatus: RequestStatus.pending,
      };
    },
  },
});

export const {
  setMappings,
  setMappingsLoadingStatusPending,
} = mappingsSlice.actions;

export const MappingsState = (state: RootState) =>
  state.mappingsState;

export default mappingsSlice.reducer;
