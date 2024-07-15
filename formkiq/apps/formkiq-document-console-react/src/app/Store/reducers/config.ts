import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {LocalStorage} from '../../helpers/tools/useLocalStorage';
import {IDocument} from '../../helpers/types/document';
import {RootState} from '../store';

export const setFormkiqVersion = createAsyncThunk(
  'config/setFormkiqVersion',
  async (data: FormkiqVersion, thunkAPI) => {
    return data;
  }
)
export const setDocumentApi = createAsyncThunk(
  'config/setDocumentApi',
  async (data: string, thunkAPI) => {
    return data;
  }
)
export const setAuthApi = createAsyncThunk(
  'config/setAuthApi',
  async (data: string, thunkAPI) => {
    return data;
  }
)
export const setUserPoolId = createAsyncThunk(
  'config/setUserPoolId',
  async (data: string, thunkAPI) => {
    return data;
  }
)
export const setClientId = createAsyncThunk(
  'config/setClientId',
  async (data: string, thunkAPI) => {
    return data;
  }
)
export const setCognitoSingleSignOnUrl = createAsyncThunk(
  'config/setCognitoSingleSignOnUrl',
  async (data: string, thunkAPI) => {
    return data;
  }
)
export const setCustomAuthorizerUrl = createAsyncThunk(
  'config/setCustomAuthorizerUrl',
  async (data: string, thunkAPI) => {
    return data;
  }
)
export const setUserAuthenticationType = createAsyncThunk(
  'config/setUserAuthenticationType',
  async (data: string, thunkAPI) => {
    return data;
  }
)
export const setUseAuthApiForSignIn = createAsyncThunk(
  'config/setUseAuthApiForSignIn',
  async (data: boolean, thunkAPI) => {
    return data;
  }
)

export const setBrand = createAsyncThunk(
  'config/setBrand',
  async (data: string, thunkAPI) => {
    return data;
  }
)
export const setTagColors = createAsyncThunk(
  'config/setTagColors',
  async (data: TagColor[], thunkAPI) => {
    return data;
  }
)
export const setIsSidebarExpanded = createAsyncThunk(
  'config/setIsSidebarExpanded',
  async (data: boolean, thunkAPI) => {
    return data;
  }
)
export const setCurrentActionEvent = createAsyncThunk(
  'config/setCurrentActionEvent',
  async (data: string, thunkAPI) => {
    return data;
  }
)
export const setIsWorkspacesExpanded = createAsyncThunk(
  'config/setIsWorkspacesExpanded',
  async (data: boolean, thunkAPI) => {
    return data;
  }
)
export const setPendingArchive = createAsyncThunk(
  'config/setPendingArchive',
  async (data: IDocument[], thunkAPI) => {
    return data;
  }
)

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
  formkiqVersion: {type: '', version: '', modules: [] as any[]},
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setFormkiqVersion.fulfilled, (state: any, action) => {
      state.formkiqVersion = action.payload;
    });
    builder.addCase(setDocumentApi.fulfilled, (state: any, action) => {
      state.documentApi = action.payload;
    });
    builder.addCase(setUserPoolId.fulfilled, (state: any, action) => {
      state.userPoolId = action.payload;
    });
    builder.addCase(setClientId.fulfilled, (state: any, action) => {
      state.clientId = action.payload;
    });
    builder.addCase(setCognitoSingleSignOnUrl.fulfilled, (state: any, action) => {
      state.cognitoSingleSignOnUrl = action.payload;
    });
    builder.addCase(setUserAuthenticationType.fulfilled, (state: any, action) => {
      state.userAuthenticationType = action.payload;
    });
    builder.addCase(setAuthApi.fulfilled, (state: any, action) => {
      state.authApi = action.payload;
    });
    builder.addCase(setUseAuthApiForSignIn.fulfilled, (state: any, action) => {
      state.useAuthApiForSignIn = action.payload;
    });
    builder.addCase(setCustomAuthorizerUrl.fulfilled, (state: any, action) => {
      state.customAuthorizerUrl = action.payload;
    });
    builder.addCase(setBrand.fulfilled, (state: any, action) => {
      state.brand = action.payload;
    });
    builder.addCase(setTagColors.fulfilled, (state: any, action) => {
      state.tagColors = action.payload;
    });
    builder.addCase(setIsSidebarExpanded.fulfilled, (state: any, action) => {
      state.isSidebarExpanded = action.payload;
    });
    builder.addCase(setCurrentActionEvent.fulfilled, (state: any, action) => {
      state.currentActionEvent = action.payload;
    });
    builder.addCase(setIsWorkspacesExpanded.fulfilled, (state: any, action) => {
      state.isWorkspacesExpanded = action.payload;
    });
    builder.addCase(setPendingArchive.fulfilled, (state: any, action) => {
      state.pendingArchive = action.payload;
    });
  }
});

export const ConfigState = (state: RootState) => state.configState;
export default configSlice.reducer;
