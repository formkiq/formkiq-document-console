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

export type GlobalNotificationSlice = {
  callback?: () => Promise<void>;
  dialogTitle: string;
  isOpen: boolean;
};

const initialState: GlobalNotificationSlice = {
  callback: undefined,
  dialogTitle: 'Notification',
  isOpen: false,
};

export const globalNotificationControls = createSlice({
  name: 'globalNotificationControls',
  initialState,
  reducers: {
    resetDialog: (state) => {
      const newDialogState = {
        ...state,
        dialogTitle: 'Notification',
        callback: undefined,
      };
      return newDialogState;
    },
    hideDialog: (state) => {
      const newDialogState = {
        ...state,
        isOpen: false,
      };
      return newDialogState;
    },
    openDialog: (state, action) => {
      const newDialogState = {
        ...state,
        callback: action.payload?.callback,
        isOpen: true,
      };
      if (action.payload?.dialogTitle) {
        newDialogState.dialogTitle = action.payload.dialogTitle;
      }
      return newDialogState;
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
