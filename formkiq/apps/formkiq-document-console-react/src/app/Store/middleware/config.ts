import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { LocalStorage } from '../../helpers/tools/useLocalStorage';
import {
  setAuthApi,
  setBrand,
  setClientId,
  setCognitoSingleSignOnUrl,
  setCustomAuthorizerUrl,
  setDocumentApi, setFormkiqVersion,
  setIsSidebarExpanded,
  setTagColors,
  setUseAuthApiForSignIn,
  setUserAuthenticationType,
  setUserPoolId,
  setWorkflowFilterPreference,
} from '../reducers/config';

const storage: LocalStorage = LocalStorage.Instance;
const configMiddleware = createListenerMiddleware();

const updateConfig = async (action: any) => {
  // Run whatever additional side-effect-y logic you want here
  const config = storage.getConfig();
  if (config) {
    switch (action.type) {
      case 'config/setDocumentApi/fulfilled':
        config.documentApi = action.payload;
        break;
      case 'config/setUserPoolId/fulfilled':
        config.userPoolId = action.payload;
        break;
      case 'config/setClientId/fulfilled':
        config.clientId = action.payload;
        break;
      case 'config/setCognitoSingleSignOnUrl/fulfilled':
        config.cognitoSingleSignOnUrl = action.payload;
        break;
      case 'config/setUserAuthenticationType/fulfilled':
        config.userAuthenticationType = action.payload;
        break;
      case 'config/setAuthApi/fulfilled':
        config.authApi = action.payload;
        break;
      case 'config/setUseAuthApiForSignIn/fulfilled':
        config.useAuthApiForSignIn = action.payload;
        break;
      case 'config/setCustomAuthorizerUrl/fulfilled':
        config.customAuthorizerUrl = action.payload;
        break;
      case 'config/setBrand/fulfilled':
        config.brand = action.payload;
        break;
      case 'config/setTagColors/fulfilled':
        config.tagColors = action.payload;
        break;
      case 'config/setIsSidebarExpanded/fulfilled':
        config.isSidebarExpanded = action.payload;
        break;
      case 'config/setFormkiqVersion/fulfilled':
        config.formkiqVersion = action.payload;
        break;
      case 'config/setWorkflowFilterPreference/fulfilled':
        config.workflowFilterPreference = action.payload;
        break;
    }
    storage.setConfig(config);
  }
  // Can cancel other running instances
};
// Add one or more listener entries that look for specific actions.
// They may contain any sync or async logic, similar to thunks.
configMiddleware.startListening({
  matcher: isAnyOf(
    setFormkiqVersion.fulfilled,
    setUserPoolId.fulfilled,
    setClientId.fulfilled,
    setCognitoSingleSignOnUrl.fulfilled,
    setUserAuthenticationType.fulfilled,
    setAuthApi.fulfilled,
    setUseAuthApiForSignIn.fulfilled,
    setCustomAuthorizerUrl.fulfilled,
    setBrand.fulfilled,
    setTagColors.fulfilled,
    setIsSidebarExpanded.fulfilled,
    setDocumentApi.fulfilled,
    setWorkflowFilterPreference.fulfilled
  ),
  effect: updateConfig,
});

export default configMiddleware;
