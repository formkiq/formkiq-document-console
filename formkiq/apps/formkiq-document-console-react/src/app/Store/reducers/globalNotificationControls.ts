import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const notificationAction = createAsyncThunk(
  'globalNotificationControls/notificationAction',
  async (_, thunkAPI) => {
    const { callback } = (thunkAPI.getState() as any).globalNotificationControls
      .notificationDialog;
    callback();
    thunkAPI.dispatch(closeDialog());
    return '';
  }
);

export const closeDialog = createAsyncThunk(
  'globalNotificationControls/closeDialog',
  async (_, thunkAPI) => {
    thunkAPI.dispatch(hideDialog());
    await new Promise((res, rej) => {
      // wait for dialog animation fadeout
      setTimeout(() => {
        thunkAPI.dispatch(resetDialog());
        res('');
      }, 200);
    });
  }
);

export const globalNotificationControls = createSlice({
  name: 'globalNotificationControls',
  initialState: {
    notificationDialog: {
      callback: null,
      dialogTitle: 'Notification',
      isOpened: false,
    },
  },
  reducers: {
    resetDialog: (state) => {
      const newDialogState = {
        ...state.notificationDialog,
        dialogTitle: 'Notification',
        callback: null,
      };
      return {
        ...state,
        notificationDialog: newDialogState,
      };
    },
    hideDialog: (state) => {
      const newDialogState = {
        ...state.notificationDialog,
        isOpened: false,
      };
      return {
        ...state,
        notificationDialog: newDialogState,
      };
    },
    openDialog: (state, action) => {
      const newDialogState = {
        ...state.notificationDialog,
        callback: action.payload?.callback,
        isOpened: true,
      };
      if (action.payload?.dialogTitle) {
        newDialogState.dialogTitle = action.payload.dialogTitle;
      }
      return {
        ...state,
        notificationDialog: newDialogState,
      };
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(notificationAction.fulfilled, (state, action) => {
      // console.log(action)
    });
  },
});

export const { openDialog, hideDialog, resetDialog } =
  globalNotificationControls.actions;

export const GlobalNotificationState = (state: RootState) =>
  state.globalNotificationControls;

export default globalNotificationControls.reducer;
