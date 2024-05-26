import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { LocalStorage } from '../../helpers/tools/useLocalStorage';
import { IDocument } from '../../helpers/types/document';
import { RootState } from '../store';

const storage: LocalStorage = LocalStorage.Instance;

export interface Config {
  documentApi: string;
  userPoolId: string;
  clientId: string;
  authApi: string;
  useAuthApiForSignIn: boolean;
  userAuthenticationType: string;
  cognitoSingleSignOnUrl: string;
  customAuthorizerUrl: string;
  brand: string;
  formkiqVersion: FormkiqVersion;
  tagColors: TagColor[];
  isSidebarExpanded: boolean;
  currentActionEvent: string;
  isWorkspacesExpanded: boolean;
  useIndividualSharing: boolean;
  useNotifications: boolean;
  useFileFilter: boolean;
  useAccountAndSettings: boolean;
  useCollections: boolean;
  useAdvancedSearch: boolean;
  useSoftDelete: boolean;
  pendingArchive: IDocument[];
}

export type TagColor = {
  colorUri: string;
  tagKeys: any[];
};

export type FormkiqVersion = {
  type: string;
  version: string;
  modules: any[];
};

const tagColors: TagColor[] = [
  {
    colorUri: 'flamingo',
    tagKeys: [],
  },
  {
    colorUri: 'turbo',
    tagKeys: [],
  },
  {
    colorUri: 'citrus',
    tagKeys: [],
  },
  {
    colorUri: 'buttercup',
    tagKeys: [],
  },
  {
    colorUri: 'ochre',
    tagKeys: [],
  },
  {
    colorUri: 'mountain-meadow',
    tagKeys: [],
  },
  {
    colorUri: 'dodger-blue',
    tagKeys: [],
  },
  {
    colorUri: 'cornflower-blue',
    tagKeys: [],
  },
  {
    colorUri: 'orchid',
    tagKeys: [],
  },
  {
    colorUri: 'french-rose',
    tagKeys: [],
  },
];

export const configInitialState = {
  documentApi: '',
  userPoolId: '',
  clientId: '',
  userAuthenticationType: 'cognito',
  authApi: '',
  useAuthApiForSignIn: false,
  customAuthorizerUrl: '',
  cognitoSingleSignOnUrl: '',
  brand: 'formkiq',
  formkiqVersion: { type: '', version: '', modules: [] as any[] },
  tagColors,
  isSidebarExpanded: true,
  currentActionEvent: '',
  isWorkspacesExpanded: false,
  useIndividualSharing: false,
  useNotifications: false,
  useFileFilter: false,
  useAccountAndSettings: false,
  useCollections: false,
  useAdvancedSearch: false,
  useSoftDelete: true,
  showIntegrations: true,
  pendingArchive: [] as IDocument[],
} as Config;

const getInitialState = (): Config => {
  let value;
  if (storage.getConfig()) {
    value = storage.getConfig() as Config;
    if (value.pendingArchive === undefined) {
      value.pendingArchive = [];
    }
  } else {
    value = configInitialState;
  }
  storage.setConfig(value);
  return value;
};

export const configSlice = createSlice({
  name: 'config',
  initialState: getInitialState(),
  reducers: {
    setDocumentApi(state, action: PayloadAction<string>) {
      return {
        ...state,
        documentApi: action.payload,
      };
    },
    setUserPoolId(state, action: PayloadAction<string>) {
      return {
        ...state,
        userPoolId: action.payload,
      };
    },
    setClientId(state, action: PayloadAction<string>) {
      return {
        ...state,
        clientId: action.payload,
      };
    },
    setCognitoSingleSignOnUrl(state, action: PayloadAction<string>) {
      return {
        ...state,
        cognitoSingleSignOnUrl: action.payload,
      };
    },
    setUserAuthenticationType(state, action: PayloadAction<string>) {
      return {
        ...state,
        userAuthenticationType: action.payload,
      };
    },
    setAuthApi(state, action: PayloadAction<string>) {
      return {
        ...state,
        authApi: action.payload,
      };
    },
    setUseAuthApiForSignIn(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        useAuthApiForSignIn: action.payload,
      };
    },
    setCustomAuthorizerUrl(state, action: PayloadAction<string>) {
      return {
        ...state,
        customAuthorizerUrl: action.payload,
      };
    },
    setBrand(state, action: PayloadAction<string>) {
      return {
        ...state,
        brand: action.payload,
      };
    },
    setFormkiqVersion(state, action: PayloadAction<any>) {
      return {
        ...state,
        fkqVersion: action.payload,
      };
    },
    setTagColors(state, action: PayloadAction<TagColor[]>) {
      // console.log(action)
      return {
        ...state,
        tagColors: action.payload,
      };
    },
    setIsSidebarExpanded(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isSidebarExpanded: action.payload,
      };
    },
    setCurrentActionEvent(state, action: PayloadAction<string>) {
      return {
        ...state,
        currentActionEvent: action.payload,
      };
    },
    setIsWorkspacesExpanded(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isWorkspacesExpanded: action.payload,
      };
    },
    setPendingArchive(state, action: PayloadAction<IDocument[]>) {
      return {
        ...state,
        pendingArchive: action.payload,
      };
    },
  },
});

export const {
  setDocumentApi,
  setUserPoolId,
  setClientId,
  setCognitoSingleSignOnUrl,
  setUserAuthenticationType,
  setAuthApi,
  setUseAuthApiForSignIn,
  setCustomAuthorizerUrl,
  setBrand,
  setFormkiqVersion,
  setTagColors,
  setIsSidebarExpanded,
  setCurrentActionEvent,
  setPendingArchive,
  setIsWorkspacesExpanded,
} = configSlice.actions;

export const ConfigState = (state: RootState) => state.configState;
export default configSlice.reducer;
