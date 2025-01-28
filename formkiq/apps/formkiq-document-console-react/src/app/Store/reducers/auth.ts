import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { LocalStorage } from '../../helpers/tools/useLocalStorage';
import { RootState } from '../store';

const storage: LocalStorage = LocalStorage.Instance;

export type User = {
  email: string;
  idToken: string;
  accessToken: string;
  refreshToken: string;
  sites: [];
  defaultSiteId: string;
  currentSiteId: string;
  isAdmin: boolean;
};

export type Section = {
  name: string;
};

export type SubfolderUri = {
  name: string;
};

type AuthSlice = {
  user: User | null;
  section: Section | null;
  subfolderUri: SubfolderUri | null;
};
const initialState: AuthSlice = {
  user: storage.getUser(),
  section: storage.getSection() as Section,
  subfolderUri: storage.getSubfolderUri() as SubfolderUri,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      return {
        ...state,
        user: action.payload,
      };
    },
    logout: (state) => {
      return {
        ...state,
        user: null,
      };
    },
  },
});

export const { logout, login } = authSlice.actions;

export const AuthState = (state: RootState) => state.authState;

/**
 * A utility hook to be used in components that only be viewed if the user is authenticated.
 * If there is a chance that the page can be viewed before sign-in, do not use this.
 *
 * @returns Auth values with asserted non-null user
 */
export const useAuthenticatedState = () => {
  const auth = useSelector(AuthState);

  const user = auth.user;

  if (!user) {
    throw new Error('Unauthenticated');
  }

  return { ...auth, user };
};

export default authSlice.reducer;
