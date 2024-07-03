import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {DocumentsService} from '../../helpers/services/documentsService';
import {RequestStatus, Group} from '../../helpers/types/userManagement';
import {RootState} from '../store';
import {openDialog as openNotificationDialog} from './globalNotificationControls';

interface userManagementState {
  groups: Group[];
  groupsLoadingStatus: keyof typeof RequestStatus;
  nextGroupsToken: string | null;
  currentGroupsSearchPage: number;
  isLastGroupsSearchPageLoaded: boolean;
  isLoadingMore: boolean;
}

const defaultState: userManagementState = {
  groups: [],
  groupsLoadingStatus: RequestStatus.fulfilled,
  nextGroupsToken: null,
  currentGroupsSearchPage: 1,
  isLastGroupsSearchPageLoaded: false,
  isLoadingMore: false,
};

export const fetchGroups = createAsyncThunk(
  'userManagement/fetchGroups',
  async (data: any, thunkAPI) => {
    const {nextToken, limit, page} = data;
    await DocumentsService.getGroups(nextToken, limit).then(
      (response) => {
        if (response.status === 200) {
          const data = {
            groups: response.groups,
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
          thunkAPI.dispatch(setGroups(data));
        } else {
          console.log(response)
          thunkAPI.dispatch(
            openNotificationDialog({
              dialogTitle: 'Error fetching groups',
            })
          );
        }
      }
    );
  }
);

export const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState: defaultState,
  reducers: {
    setGroups: (state, action) => {
      const {groups, isLoadingMore, next,} = action.payload;
      const isLastSearchPageLoaded = !next;
      if (groups) {
        if (isLoadingMore) {
          state.groups = state.groups.concat(groups);
        } else {
          state.groups = groups;
        }
        state.nextGroupsToken = next;
        state.isLastGroupsSearchPageLoaded = isLastSearchPageLoaded;
        state.groupsLoadingStatus = RequestStatus.fulfilled;
      }
    },

    setGroupsLoadingStatusPending: (state) => {
      return {
        ...state,
        groupsLoadingStatus: RequestStatus.pending,
      };
    }
  },
});

export const {
  setGroups,
  setGroupsLoadingStatusPending,
} = userManagementSlice.actions;

export const UserManagementState = (state: RootState) => state.userManagementState;

export default userManagementSlice.reducer;


