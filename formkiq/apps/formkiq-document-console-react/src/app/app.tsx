import { useEffect, useState } from 'react';
import './App.css';
import { Spinner } from './Components/Icons/icons';
import Router from './Components/Router';
import {
  setAuthApi,
  setBrand,
  setClientId,
  setCognitoSingleSignOnUrl,
  setCustomAuthorizerUrl,
  setDocumentApi,
  setUseAuthApiForSignIn,
  setUserAuthenticationType,
  setUserPoolId,
} from './Store/reducers/config';
import { setFormkiqClient } from './Store/reducers/data';
import { store, useAppDispatch } from './Store/store';
import './app.module.scss';
import { ConfigService } from './helpers/services/configService';
import FormkiqClient from './lib/formkiq-client-sdk-es6';

export const App = () => {
  const [hasConfigLoaded, setHasConfigLoaded] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let formkiqClient = null;
    ConfigService.getSystemConfigData().then((config) => {
      if (config.documentApi) {
        dispatch(setDocumentApi(config.documentApi));
      }
      if (config.userPoolId) {
        dispatch(setUserPoolId(config.userPoolId));
      }
      if (config.clientId) {
        dispatch(setClientId(config.clientId));
      }
      if (config.userAuthentication) {
        dispatch(setUserAuthenticationType(config.userAuthentication));
      }
      if (config.authApi) {
        dispatch(setAuthApi(config.authApi));
      }
      if (config.useAuthApiForSignIn) {
        dispatch(setUseAuthApiForSignIn(config.useAuthApiForSignIn));
      }
      if (config.cognitoHostedUi) {
        dispatch(setCustomAuthorizerUrl(config.cognitoHostedUi));
      }
      if (config.cognitoSingleSignOnUrl) {
        dispatch(setCognitoSingleSignOnUrl(config.cognitoSingleSignOnUrl));
      }
      if (config.brand) {
        dispatch(setBrand(config.brand));
      }
      formkiqClient = new FormkiqClient(
        config.documentApi,
        config.userPoolId,
        config.clientId
      );
      formkiqClient.resetClient(
        config.documentApi,
        config.userPoolId,
        config.clientId
      );
      const { user } = store.getState().authState;
      formkiqClient.rebuildCognitoClient(
        user?.email,
        user?.idToken,
        user?.accessToken,
        user?.refreshToken
      );
      dispatch(setFormkiqClient(formkiqClient));
      setHasConfigLoaded(true);
    });
  }, []);

  return <>{hasConfigLoaded ? <Router /> : <Spinner />}</>;
};
export default App;
