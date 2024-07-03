import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {DocumentsService} from '../../helpers/services/documentsService';
import {RequestStatus, Group, User} from '../../helpers/types/userManagement';
import {RootState} from '../store';
import {openDialog as openNotificationDialog} from './globalNotificationControls';

interface userManagementState {
  groups: Group[];
  groupsLoadingStatus: keyof typeof RequestStatus;
  nextGroupsToken: string | null;
  currentGroupsSearchPage: number;
  isLastGroupsSearchPageLoaded: boolean;
  isLoadingMore: boolean;
  users: User[];
  usersLoadingStatus: keyof typeof RequestStatus;
  nextUsersToken: string | null;
  currentUsersSearchPage: number;
  isLastUsersSearchPageLoaded: boolean;
}

const defaultState: userManagementState = {
  groups: [],
  groupsLoadingStatus: RequestStatus.fulfilled,
  nextGroupsToken: null,
  currentGroupsSearchPage: 1,
  isLastGroupsSearchPageLoaded: false,
  isLoadingMore: false,
  users: [],
  usersLoadingStatus: RequestStatus.fulfilled,
  nextUsersToken: null,
  currentUsersSearchPage: 1,
  isLastUsersSearchPageLoaded: false,
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

export const deleteGroup = createAsyncThunk(
  'userManagement/deleteGroup',
  async (data: any, thunkAPI) => {
    const {groupName} = data;
    await DocumentsService.deleteGroup(groupName).then(
      (response) => {
        if (response.status === 200) {
          const groups = (thunkAPI.getState() as any)?.userManagementState.groups
          const filteredGroups = groups.filter((group: Group) => group.name !== groupName);
          thunkAPI.dispatch(setGroups({groups: filteredGroups}));
        } else {
          thunkAPI.dispatch(
            openNotificationDialog({
              dialogTitle: 'Error deleting group',
            })
          );
        }
      }
    );
  }
);

export const addGroup = createAsyncThunk(
  'userManagement/addGroup',
  async (data: any, thunkAPI) => {
    const {group} = data;
    await DocumentsService.addGroup({group}).then(
      (response) => {
        console.log(response)
        if (response.status === 200) {
          thunkAPI.dispatch(fetchGroups({}));
        } else {
          thunkAPI.dispatch(
            openNotificationDialog({
              dialogTitle: 'Error creating group',
            })
          );
        }
      }
    );
  }
);

export const fetchUsers = createAsyncThunk(
  'userManagement/fetchUsers',
  async (data: any, thunkAPI) => {
    const {nextToken, limit, page} = data;
    await DocumentsService.getUsers(nextToken, limit).then(
      (response) => {
        if (response.status === 200) {
          const data = {
            users: response.users,
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
          thunkAPI.dispatch(setUsers(data));
        } else {
          thunkAPI.dispatch(
            openNotificationDialog({
              dialogTitle: 'Error fetching users',
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
    },

    setUsers: (state, action) => {
      const {users, isLoadingMore, next,} = action.payload;
      const isLastSearchPageLoaded = !next;
      if (users) {
        if (isLoadingMore) {
          state.users = state.users.concat(users);
        } else {
          state.users = users;
        }
        state.nextUsersToken = next;
        state.isLastUsersSearchPageLoaded = isLastSearchPageLoaded;
        state.usersLoadingStatus = RequestStatus.fulfilled;
      }
    },

    setUsersLoadingStatusPending: (state) => {
      return {
        ...state,
        usersLoadingStatus: RequestStatus.pending,
      };
    }
  },
});

export const {
  setGroups,
  setGroupsLoadingStatusPending,
  setUsers,
  setUsersLoadingStatusPending,
} = userManagementSlice.actions;

export const UserManagementState = (state: RootState) => state.userManagementState;

export default userManagementSlice.reducer;


