import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DocumentsService } from '../../helpers/services/documentsService';
import { RequestStatus, Group, User } from '../../helpers/types/userManagement';
import { RootState } from '../store';
import { openDialog as openNotificationDialog } from './globalNotificationControls';

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

  groupUsers: User[];
  groupUsersLoadingStatus: keyof typeof RequestStatus;
  nextGroupUsersToken: string | null;
  currentGroupUsersSearchPage: number;
  isLastGroupUsersSearchPageLoaded: boolean;
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

  groupUsers: [],
  groupUsersLoadingStatus: RequestStatus.fulfilled,
  nextGroupUsersToken: null,
  currentGroupUsersSearchPage: 1,
  isLastGroupUsersSearchPageLoaded: false,
};

export const fetchGroups = createAsyncThunk(
  'userManagement/fetchGroups',
  async (data: any, thunkAPI) => {
    const { nextToken, limit, page } = data;
    await DocumentsService.getGroups(nextToken, limit).then((response) => {
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
        console.log(response);
        thunkAPI.dispatch(
          openNotificationDialog({
            dialogTitle: 'Error fetching groups',
          })
        );
      }
    });
  }
);

export const deleteGroup = createAsyncThunk(
  'userManagement/deleteGroup',
  async (data: any, thunkAPI) => {
    const { groupName } = data;
    await DocumentsService.deleteGroup(groupName).then((response) => {
      if (response.status === 200) {
        const groups = (thunkAPI.getState() as any)?.userManagementState.groups;
        const filteredGroups = groups.filter(
          (group: Group) => group.name !== groupName
        );
        thunkAPI.dispatch(setGroups({ groups: filteredGroups }));
      } else {
        thunkAPI.dispatch(
          openNotificationDialog({
            dialogTitle: 'Error deleting group',
          })
        );
      }
    });
  }
);

export const addGroup = createAsyncThunk(
  'userManagement/addGroup',
  async (data: any, thunkAPI) => {
    const { group } = data;
    await DocumentsService.addGroup({ group }).then((response) => {
      console.log(response);
      if (response.status === 200) {
        thunkAPI.dispatch(fetchGroups({}));
      } else {
        thunkAPI.dispatch(
          openNotificationDialog({
            dialogTitle: 'Error creating group',
          })
        );
      }
    });
  }
);

export const fetchUsers = createAsyncThunk(
  'userManagement/fetchUsers',
  async (data: any, thunkAPI) => {
    const { nextToken, limit, page } = data;
    await DocumentsService.getUsers(nextToken, limit).then((response) => {
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
    });
  }
);

export const addUserToGroup = createAsyncThunk(
  'userManagement/addUserToGroup',
  async (data: any, thunkAPI) => {
    const { groupName, user } = data;
    await DocumentsService.addUserToGroup(groupName, user).then((response) => {
      if (response.status === 201) {
        thunkAPI.dispatch(fetchUsers({}));
      } else {
        thunkAPI.dispatch(
          openNotificationDialog({
            dialogTitle: 'Error adding user to group',
          })
        );
      }
    });
  }
);

export const fetchGroupUsers = createAsyncThunk(
  'userManagement/fetchGroupUsers',
  async (data: any, thunkAPI) => {
    const { groupName, nextToken, limit, page } = data;
    await DocumentsService.getGroupUsers(groupName, limit, nextToken).then(
      (response) => {
        if (response.status === 200) {
          const data = {
            groupUsers: response.users,
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
          thunkAPI.dispatch(setGroupUsers(data));
        } else {
          thunkAPI.dispatch(
            openNotificationDialog({
              dialogTitle: 'Error fetching group users',
            })
          );
        }
      }
    );
  }
);

export const deleteUserFromGroup = createAsyncThunk(
  'userManagement/deleteUserFromGroup',
  async (data: any, thunkAPI) => {
    const { groupName, username } = data;
    await DocumentsService.deleteUserFromGroup(groupName, username).then(
      (response) => {
        if (response.status === 200) {
          thunkAPI.dispatch(fetchGroupUsers({ groupName }));
        } else {
          thunkAPI.dispatch(
            openNotificationDialog({
              dialogTitle: 'Error deleting user from group',
            })
          );
        }
      }
    );
  }
);

export const disableUser = createAsyncThunk(
  'userManagement/disableUser',
  async (data: any, thunkAPI) => {
    const { username } = data;
    await DocumentsService.setUserOperation(username, 'DISABLE').then(
      (response) => {
        if (response.status === 200) {
          thunkAPI.dispatch(fetchUsers({}));
        } else {
          thunkAPI.dispatch(
            openNotificationDialog({
              dialogTitle: 'Error disabling user',
            })
          );
        }
      }
    );
  }
);

export const enableUser = createAsyncThunk(
  'userManagement/enableUser',
  async (data: any, thunkAPI) => {
    const { username } = data;
    await DocumentsService.setUserOperation(username, 'ENABLE').then(
      (response) => {
        if (response.status === 200) {
          thunkAPI.dispatch(fetchUsers({}));
        } else {
          thunkAPI.dispatch(
            openNotificationDialog({
              dialogTitle: 'Error enabling user',
            })
          );
        }
      }
    );
  }
);

export const resetUserPassword = createAsyncThunk(
  'userManagement/resetUserPassword',
  async (data: any, thunkAPI) => {
    const { username } = data;
    await DocumentsService.setUserOperation(username, 'RESET_PASSWORD').then(
      (response) => {
        if (response.status !== 200) {
          thunkAPI.dispatch(
            openNotificationDialog({
              dialogTitle: 'Error resetting user password',
            })
          );
        }
      }
    );
  }
);

export const deleteUser = createAsyncThunk(
  'userManagement/deleteUser',
  async (data: any, thunkAPI) => {
    const { username } = data;
    await DocumentsService.deleteUser(username).then((response) => {
      if (response.status === 200) {
        thunkAPI.dispatch(fetchUsers({}));
      } else {
        thunkAPI.dispatch(
          openNotificationDialog({
            dialogTitle: 'Error deleting user',
          })
        );
      }
    });
  }
);

export const addUser = createAsyncThunk(
  'userManagement/addUser',
  async (data: any, thunkAPI) => {
    const { email } = data;
    await DocumentsService.addUser({ user: { username: email } }).then(
      (response) => {
        if (response.status === 201) {
          thunkAPI.dispatch(fetchUsers({}));
        } else {
          thunkAPI.dispatch(
            openNotificationDialog({
              dialogTitle: response.errors[0].errors,
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
      const { groups, isLoadingMore, next } = action.payload;
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
      const { users, isLoadingMore, next } = action.payload;
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
    },

    setGroupUsers: (state, action) => {
      const { groupUsers, isLoadingMore, next } = action.payload;
      const isLastSearchPageLoaded = !next;
      if (groupUsers) {
        if (isLoadingMore) {
          state.groupUsers = state.groupUsers.concat(groupUsers);
        } else {
          state.groupUsers = groupUsers;
        }
        state.nextGroupUsersToken = next;
        state.isLastGroupUsersSearchPageLoaded = isLastSearchPageLoaded;
        state.groupUsersLoadingStatus = RequestStatus.fulfilled;
      }
    },

    setGroupUsersLoadingStatusPending: (state) => {
      return {
        ...state,
        groupUsersLoadingStatus: RequestStatus.pending,
      };
    },
  },
});

export const {
  setGroups,
  setGroupsLoadingStatusPending,
  setUsers,
  setUsersLoadingStatusPending,
  setGroupUsers,
  setGroupUsersLoadingStatusPending,
} = userManagementSlice.actions;

export const UserManagementState = (state: RootState) =>
  state.userManagementState;

export default userManagementSlice.reducer;
