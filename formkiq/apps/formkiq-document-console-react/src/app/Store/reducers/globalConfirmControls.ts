import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const confirmAction = createAsyncThunk(
  'globalConfirmControls/confirmAction',
  async (_, thunkAPI) => {
    const { callback } = (thunkAPI.getState() as any).globalConfirmControls
      .confirmDialog;
    callback();
    thunkAPI.dispatch(closeDialog());
    return '';
  }
);

export const closeDialog = createAsyncThunk(
  'globalConfirmControls/closeDialog',
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

export type GlobalConfirmSlice = {
  callback?: () => Promise<void>;
  dialogTitle: string;
  isOpen: boolean;
};

const initialState: GlobalConfirmSlice = {
  callback: undefined,
  dialogTitle: 'Are you sure?',
  isOpen: false,
};

export const globalConfirmControls = createSlice({
  name: 'globalConfirmControls',
  initialState,
  reducers: {
    resetDialog: (state) => {
      const newDialogState = {
        ...state,
        dialogTitle: 'Are you sure?',
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
    builder.addCase(confirmAction.fulfilled, (state, action) => {
      // console.log(action)
    });
  },
});

export const { openDialog, hideDialog, resetDialog } =
  globalConfirmControls.actions;

export const GlobalConfirmState = (state: RootState) =>
  state.globalConfirmControls;

export default globalConfirmControls.reducer;
