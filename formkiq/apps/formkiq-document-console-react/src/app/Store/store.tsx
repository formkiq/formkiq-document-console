import { configureStore } from '@reduxjs/toolkit'
import authMiddleware from './middleware/auth'
import authReducer from './reducers/auth'
import documentsReducer from './reducers/documentsList'
import configMiddleware from './middleware/config'
import configReducer from './reducers/config'
import dataCacheReducer from './reducers/data'
import globalConfirmControls from './reducers/globalConfirmControls'
import globalNotificationControls from './reducers/globalNotificationControls'
import globalProgressControls from './reducers/globalProgressControls'
import thunkMiddleware from 'redux-thunk'
import FormkiqClient from "../lib/formkiq-client-sdk-es6";


export const store = configureStore({
  reducer: {
    authReducer,
    documentsReducer,
    configReducer,
    dataCacheReducer,
    globalConfirmControls,
    globalNotificationControls,
    globalProgressControls,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }).prepend(authMiddleware.middleware).prepend(configMiddleware.middleware).concat(thunkMiddleware),
  devTools: true
})

let { formkiqClient } = store.getState().dataCacheReducer
const { user } = store.getState().authReducer
if (!formkiqClient.apiClient && user) {
  const { documentApi, userPoolId, clientId } = store.getState().configReducer
  formkiqClient = new FormkiqClient(documentApi, userPoolId, clientId)
  formkiqClient.resetClient(documentApi, userPoolId, clientId)
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

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch