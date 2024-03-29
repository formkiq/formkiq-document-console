import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import FormkiqClient from '../lib/formkiq-client-sdk-es6';
import authMiddleware from './middleware/auth';
import configMiddleware from './middleware/config';
import authState from './reducers/auth';
import configState from './reducers/config';
import dataCacheState from './reducers/data';
import documentListState from './reducers/documentsList';
import globalConfirmControls from './reducers/globalConfirmControls';
import globalNotificationControls from './reducers/globalNotificationControls';
import globalProgressControls from './reducers/globalProgressControls';

export const store = configureStore({
  reducer: {
    authState,
    documentListState,
    configState,
    dataCacheState,
    globalConfirmControls,
    globalNotificationControls,
    globalProgressControls,
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
  formkiqClient.rebuildCognitoClient(
    user?.email,
    user?.idToken,
    user?.accessToken,
    user?.refreshToken,
    user?.sites,
    user?.defaultSiteId,
    user?.currentSiteId
  );
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
