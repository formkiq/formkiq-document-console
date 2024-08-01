import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {DocumentsService} from '../../helpers/services/documentsService';
import {RootState} from '../store';
import {openDialog as openNotificationDialog} from './globalNotificationControls';
import {UserActivity, RequestStatus} from "../../helpers/types/userActivities";

interface userActivitiesState {
  userActivities: UserActivity[];
  userActivitiesLoadingStatus: keyof typeof RequestStatus;
  nextUserActivitiesToken: string | null;
  currentUserActivitiesSearchPage: number;
  isLastUserActivitiesSearchPageLoaded: boolean;
  isLoadingMore: boolean;

}

const defaultState: userActivitiesState = {
  userActivities: [],
  userActivitiesLoadingStatus: RequestStatus.fulfilled,
  nextUserActivitiesToken: null,
  currentUserActivitiesSearchPage: 1,
  isLastUserActivitiesSearchPageLoaded: false,
  isLoadingMore: false,
};

export const fetchUserActivities = createAsyncThunk(
  'userActivities/fetchUserActivities',
  async (data: any, thunkAPI) => {
    const {nextToken, limit, page, siteId, userId} = data;
    await DocumentsService.getUserActivities(siteId, userId, limit, nextToken).then((response) => {
      if (response.status === 200) {
        const data = {
          userActivities: response.userActivities,
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
        thunkAPI.dispatch(setUserActivities(data));
      } else {
        thunkAPI.dispatch(
          openNotificationDialog({
            dialogTitle: 'Error fetching user activities',
          })
        );
      }
    });
  }
);


export const userActivitiesSlice = createSlice({
  name: 'userActivities',
  initialState: defaultState,
  reducers: {
    setUserActivities: (state, action) => {
      const {userActivities, isLoadingMore, next} = action.payload;
      const isLastSearchPageLoaded = !next;
      if (userActivities) {
        if (isLoadingMore) {
          state.userActivities = state.userActivities.concat(userActivities);
        } else {
          state.userActivities = userActivities;
        }
        state.nextUserActivitiesToken = next;
        state.isLastUserActivitiesSearchPageLoaded = isLastSearchPageLoaded;
        state.userActivitiesLoadingStatus = RequestStatus.fulfilled;
      }
    },

    setUserActivitiesLoadingStatusPending: (state) => {
      return {
        ...state,
        userActivitiesLoadingStatus: RequestStatus.pending,
      };
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
  setUserActivities,
  setUserActivitiesLoadingStatusPending,
} = userActivitiesSlice.actions;

export const UserActivitiesState = (state: RootState) =>
  state.userActivitiesState;

export default userActivitiesSlice.reducer;
