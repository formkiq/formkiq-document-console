import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { LocalStorage } from '../../helpers/tools/useLocalStorage';
import {
  setAuthApi,
  setBrand,
  setClientId,
  setCustomAuthorizerUrl,
  setDocumentApi,
  setFormkiqVersion,
  setIsSidebarExpanded,
  setTagColors,
  setUseAuthApiForSignIn,
  setUserAuthenticationType,
  setUserPoolId,
} from '../reducers/config';

const storage: LocalStorage = LocalStorage.Instance;
const configMiddleware = createListenerMiddleware();

const updateConfig = async (action: any) => {
  // Run whatever additional side-effect-y logic you want here
  //console.log(action)
  const config = storage.getConfig();
  if (config) {
    switch (action.type) {
      case 'config/setDocumentApi':
        config.documentApi = action.payload;
        break;
      case 'config/setUserPoolId':
        config.userPoolId = action.payload;
        break;
      case 'config/setClientId':
        config.clientId = action.payload;
        break;
      case 'config/setUserAuthenticationType':
        config.userAuthenticationType = action.payload;
        break;
      case 'config/setAuthApi':
        config.authApi = action.payload;
        break;
      case 'config/setUseAuthApiForSignIn':
        config.useAuthApiForSignIn = action.payload;
        break;
      case 'config/setCustomAuthorizerUrl':
        config.customAuthorizerUrl = action.payload;
        break;
      case 'config/setBrand':
        config.brand = action.payload;
        break;
      case 'config/setFormkiqVersion':
        config.formkiqVersion = action.payload;
        break;
      case 'config/setTagColors':
        config.tagColors = action.payload;
        break;
      case 'config/setIsSidebarExpanded':
        config.isSidebarExpanded = action.payload;
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
    setDocumentApi,
    setUserPoolId,
    setClientId,
    setUserAuthenticationType,
    setAuthApi,
    setUseAuthApiForSignIn,
    setCustomAuthorizerUrl,
    setBrand,
    setFormkiqVersion,
    setTagColors,
    setIsSidebarExpanded
  ),
  effect: updateConfig,
});

export default configMiddleware;
