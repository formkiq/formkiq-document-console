import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import FormkiqClient from '../lib/formkiq-client-sdk-es6';
import authMiddleware from './middleware/auth';
import configMiddleware from './middleware/config';
import attributesState from './reducers/attributes';
import attributesDataState from './reducers/attributesData';
import authState from './reducers/auth';
import configState from './reducers/config';
import dataCacheState from './reducers/data';
import documentListState from './reducers/documentsList';
import globalConfirmControls from './reducers/globalConfirmControls';
import globalNotificationControls from './reducers/globalNotificationControls';
import globalProgressControls from './reducers/globalProgressControls';
import queuesState from './reducers/queues';
import rulesetsState from './reducers/rulesets';
import schemasState from './reducers/schemas';
import userManagementState from './reducers/userManagement';
import workflowsState from './reducers/workflows';
import userActivitiesState from './reducers/userActivities';
import mappingsState from './reducers/mappings';
import webhooksState from './reducers/webhooks';

export const store = configureStore({
  reducer: {
    authState,
    documentListState,
    configState,
    dataCacheState,
    globalConfirmControls,
    globalNotificationControls,
    globalProgressControls,
    rulesetsState,
    workflowsState,
    schemasState,
    queuesState,
    attributesState,
    userManagementState,
    attributesDataState,
    userActivitiesState,
    mappingsState,
    webhooksState,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .prepend(authMiddleware.middleware)
      .prepend(configMiddleware.middleware)
      .concat(thunkMiddleware),
  devTools: true,
});

let { formkiqClient } = store.getState().dataCacheState;
const { user } = store.getState().authState;
if (!formkiqClient.apiClient && user) {
  const { documentApi, userPoolId, clientId } = store.getState().configState;
  formkiqClient = new FormkiqClient(documentApi, userPoolId, clientId);
  formkiqClient.resetClient(documentApi, userPoolId, clientId);
  formkiqClient.rebuildCognitoClient(
    user?.email,
    user?.idToken,
    user?.accessToken,
    user?.refreshToken
  );
}
if (!formkiqClient.documentsApi?.apiClient?.cognitoClient?.idToken && user) {
  try {
    formkiqClient.rebuildCognitoClient(
      user?.email,
      user?.idToken,
      user?.accessToken,
      user?.refreshToken,
      user?.sites,
      user?.defaultSiteId,
      user?.currentSiteId
    );
  } catch (e: any) {
    console.error('An error occurred building the cognito client.');
  }
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
