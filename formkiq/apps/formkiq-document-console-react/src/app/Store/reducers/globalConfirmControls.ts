import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const confirmAction = createAsyncThunk("globalConfirmControls/confirmAction", async (_, thunkAPI) => {
  const { callback } = (thunkAPI.getState() as any)?.globalConfirmControls?.confirmDialog
  callback()
  thunkAPI.dispatch(closeDialog())
  return ''
})

export const closeDialog = createAsyncThunk("globalConfirmControls/closeDialog", async (_, thunkAPI) => {
  thunkAPI.dispatch(hideDialog())
  await new Promise( (res, rej) => { // wait for dialog animation fadeout
    setTimeout( () => {
      thunkAPI.dispatch(resetDialog())
      res('')
    }, 200)
  })
})

export const globalConfirmControls = createSlice({
  name: 'globalConfirmControls',
  initialState: {
    confirmDialog: {
      callback: null,
      dialogTitle: 'Are you sure?',
      isOpened: false
    }
  },
  reducers: {
    resetDialog: (state) => {
      const newDialogState = {
        ...state.confirmDialog,
        dialogTitle: 'Are you sure?',
        callback: null,
      }
      return {
        ...state,
        confirmDialog: newDialogState
      }
    },
    hideDialog: (state) => {
      const newDialogState = {
        ...state.confirmDialog,
        isOpened: false,
      }
      return {
        ...state,
        confirmDialog: newDialogState
      }
    },
    openDialog: (state, action) => {
      const newDialogState = {
        ...state.confirmDialog,
        callback: action.payload?.callback,
        isOpened: true
      }
      if(action.payload?.dialogTitle) {
        newDialogState.dialogTitle = action.payload.dialogTitle
      }
      return {
        ...state,
        confirmDialog: newDialogState
      }
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(confirmAction.fulfilled, (state, action) => {
      // console.log(action)
    })
  },
})

export const { openDialog, hideDialog, resetDialog } = globalConfirmControls.actions

export default globalConfirmControls.reducer