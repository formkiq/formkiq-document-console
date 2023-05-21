import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

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
});

export const { openDialog, hideDialog, resetDialog } =
  globalConfirmControls.actions;

export const GlobalConfirmState = (state: RootState) =>
  state.globalConfirmControls;

export default globalConfirmControls.reducer;
