import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DocumentsService } from '../../helpers/services/documentsService';
import { RootState } from '../store';
import { openDialog as openNotificationDialog } from './globalNotificationControls';
import { Mapping, RequestStatus } from '../../helpers/types/mappings';

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
    const { nextToken, limit, page, siteId } = data;
    await DocumentsService.getMappings(siteId, limit, nextToken).then(
      (response) => {
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
          let dialogTitle = 'Error fetching mappings';
          if (response.errors) {
            dialogTitle = response.errors[0].error;
          }
          thunkAPI.dispatch(openNotificationDialog({ dialogTitle }));
        }
      }
    );
  }
);

export const addMapping = createAsyncThunk(
  'mappings/addMapping',
  async (data: any, thunkAPI) => {
    const { siteId, mapping } = data;
    await DocumentsService.addMapping(siteId, mapping).then((response) => {
      if (response.status === 201) {
        thunkAPI.dispatch(fetchMappings({ siteId, limit: 20, page: 1 }));
      } else {
        let dialogTitle = 'Error adding mapping';
        if (response.errors) {
          dialogTitle = response.errors
            .map((item:any) => `${item.key}: ${item.error}`)
            .join('\n');
        }
        throw new Error(dialogTitle);
      }
    });
  }
);

export const deleteMapping = createAsyncThunk(
  'mappings/deleteMapping',
  async (data: any, thunkAPI) => {
    const { siteId, mappingId } = data;
    await DocumentsService.deleteMapping(siteId, mappingId).then((response) => {
      if (response.status === 200) {
        const mappingsState = (thunkAPI.getState() as any)?.mappingsState;
        const filteredMappings = mappingsState.mappings.filter(
          (mapping: Mapping) => mapping.mappingId !== mappingId
        );
        thunkAPI.dispatch(setMappings({ mappings: filteredMappings }));
      } else {
        let dialogTitle = 'Error deleting mapping';
        if (response.errors) {
          dialogTitle = response.errors[0].error;
        }
        thunkAPI.dispatch(openNotificationDialog({ dialogTitle }));
      }
    });
  }
);

export const updateMapping = createAsyncThunk(
  'mappings/updateMapping',
  async (data: any, thunkAPI) => {
    const { siteId, mappingId, mapping } = data;
    await DocumentsService.setMapping(siteId, mappingId, mapping).then(
      (response) => {
        if (response.status === 200) {
          thunkAPI.dispatch(fetchMappings({ siteId, limit: 20, page: 1 }));
        } else {
          let dialogTitle = 'Error updating mapping';
          if (response.errors) {
            dialogTitle = response.errors[0].error;
          }
          thunkAPI.dispatch(openNotificationDialog({ dialogTitle }));
        }
      }
    );
  }
);

export const mappingsSlice = createSlice({
  name: 'mappings',
  initialState: defaultState,
  reducers: {
    setMappings: (state, action) => {
      const { mappings, isLoadingMore, next } = action.payload;
      const isLastSearchPageLoaded = !next;
      if (mappings) {
        if (isLoadingMore) {
          state.mappings = state.mappings.concat(mappings);
        } else {
          state.mappings = mappings;
        }
        if (next) {
          state.nextMappingsToken = next;
        }
        if (isLastSearchPageLoaded !== undefined) {
          state.isLastMappingsSearchPageLoaded = isLastSearchPageLoaded;
        }
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

export const { setMappings, setMappingsLoadingStatusPending } =
  mappingsSlice.actions;

export const MappingsState = (state: RootState) => state.mappingsState;

export default mappingsSlice.reducer;
