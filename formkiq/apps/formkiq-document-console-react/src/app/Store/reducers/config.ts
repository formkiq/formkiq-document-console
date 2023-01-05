import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { LocalStorage } from '../../helpers/tools/useLocalStorage';

const storage: LocalStorage = LocalStorage.Instance

export interface Config {
  documentApi: string,
  userPoolId: string,
  clientId: string,
  authApi: string,
  userAuthenticationType: string,
  customAuthorizerUrl: string,
  brand: string,
  formkiqVersion: string,
  tagColors: string[],
  isSidebarExpanded: boolean,
  isSharedFoldersExpanded: boolean,
  useIndividualSharing: boolean,
  useNotifications: boolean,
  useFileFilter: boolean,
  useAccountAndSettings: boolean,
  useCollections: boolean,
  useAdvancedSearch: boolean,
  useSoftDelete: boolean,
}

const tagColors = [
  {
    colorUri: 'flamingo',
    tagKeys: []
  },
  {
    colorUri: 'turbo',
    tagKeys: []
  },
  {
    colorUri: 'citrus',
    tagKeys: []
  },
  {
    colorUri: 'buttercup',
    tagKeys: []
  },
  {
    colorUri: 'ochre',
    tagKeys: []
  },
  {
    colorUri: 'mountain-meadow',
    tagKeys: []
  },
  {
    colorUri: 'dodger-blue',
    tagKeys: []
  },
  {
    colorUri: 'cornflower-blue',
    tagKeys: []
  },
  {
    colorUri: 'orchid',
    tagKeys: []
  },
  {
    colorUri: 'french-rose',
    tagKeys: []
  },
] as any[]

export const configInitialState = {
  documentApi: '',
  userPoolId: '',
  clientId: '',
  userAuthenticationType: 'cognito',
  authApi: '',
  customAuthorizerUrl: '',
  brand: 'formkiq',
  formkiqVersion: '',
  tagColors,
  isSidebarExpanded: true,
  isSharedFoldersExpanded: false,
  useIndividualSharing: false,
  useNotifications: false,
  useFileFilter: false,
  useAccountAndSettings: false,
  useCollections: false,
  useAdvancedSearch: false,
  useSoftDelete: true,
} as Config

const getInitialState = () => {
  let value
  if (storage.getConfig()) {
    value = storage.getConfig()
  } else {
    value = configInitialState
  }
  storage.setConfig(value)
  return value
}

export const configSlice = createSlice({
  name: 'config',
  initialState: getInitialState(),
  reducers: {
    setDocumentApi(state, action: PayloadAction<string>) {
      return {
        ...state,
        documentApi: action.payload
      }
    },
    setUserPoolId(state, action: PayloadAction<string>) {
      return {
        ...state,
        userPoolId: action.payload
      }
    },
    setClientId(state, action: PayloadAction<string>) {
      return {
        ...state,
        clientId: action.payload
      }
    },
    setUserAuthenticationType(state, action: PayloadAction<string>) {
      return {
        ...state,
        userAuthenticationType: action.payload 
      }
    },
    setAuthApi(state, action: PayloadAction<string>) {
      return {
        ...state,
        authApi: action.payload
      }
    },
    setCustomAuthorizerUrl(state, action: PayloadAction<string>) {
      return {
        ...state,
        customAuthorizerUrl: action.payload
      }
    },
    setBrand(state, action: PayloadAction<string>) {
      return {
        ...state,
        brand: action.payload
      }
    },
    setFormkiqVersion(state, action: PayloadAction<any>) {
      return {
        ...state,
        fkqVersion: action.payload
      }
    },
    setTagColors(state, action: PayloadAction<any[]>) {
      console.log(action)
      return {
        ...state,
        tagColors: action.payload
      }
    },
    setIsSidebarExpanded(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isSidebarExpanded: action.payload
      }
    },
    setIsSharedFoldersExpanded(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isSharedFoldersExpanded: action.payload
      }
    }
  },
})

export const {
  setDocumentApi,
  setUserPoolId,
  setClientId,
  setUserAuthenticationType,
  setAuthApi,
  setCustomAuthorizerUrl,
  setBrand,
  setFormkiqVersion,
  setTagColors,
  setIsSidebarExpanded,
  setIsSharedFoldersExpanded
} = configSlice.actions

export default configSlice.reducer