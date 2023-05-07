import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const progressAction = createAsyncThunk(
  'globalProgressControls/progressAction',
  async (_, thunkAPI) => {
    const { callback } = (thunkAPI.getState() as any).globalProgressControls
      .progressDialog;
    callback();
    thunkAPI.dispatch(closeDialog());
    return '';
  }
);

export const closeDialog = createAsyncThunk(
  'globalProgressControls/closeDialog',
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

export type GlobalProgressSlice = {
  callback?: () => Promise<void>;
  dialogTitle: string;
  isOpen: boolean;
};

const initialState: GlobalProgressSlice = {
  callback: undefined,
  dialogTitle: 'In Progress',
  isOpen: false,
};

export const globalProgressControls = createSlice({
  name: 'globalProgressControls',
  initialState,
  reducers: {
    resetDialog: (state) => {
      const newDialogState = {
        ...state,
        dialogTitle: 'In Progress',
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
    builder.addCase(progressAction.fulfilled, (state, action) => {
      // console.log(action)
    });
  },
});

export const { openDialog, hideDialog, resetDialog } =
  globalProgressControls.actions;

export const GlobalProgressState = (state: RootState) =>
  state.globalProgressControls;

export default globalProgressControls.reducer;
