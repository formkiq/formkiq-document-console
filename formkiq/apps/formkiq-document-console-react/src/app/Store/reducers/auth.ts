import { createSlice } from '@reduxjs/toolkit'
import { LocalStorage } from '../../helpers/tools/useLocalStorage';

const storage: LocalStorage = LocalStorage.Instance

export type User = {
  email: string
  idToken: string
  accessToken: string
  refreshToken: string
  sites: []
  defaultSiteId: string
  currentSiteId: string
};

export type Section = {
  name: string
};

export type SubfolderUri = {
  name: string
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storage.getUser(),
    section: storage.getSection(),
    subfolderUri: storage.getSubfolderUri()
  },
  reducers: {
    login: (state, action) => {
      return {
        ...state,
        user: action.payload
      }
    },
    logout: state => {
      return {
        ...state,
        user: null
      }
    },
  },
})

export const { logout, login } = authSlice.actions

export default authSlice.reducer