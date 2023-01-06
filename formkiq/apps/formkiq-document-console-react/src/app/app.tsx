import './app.module.scss'
import './App.css';
import { useEffect, useState } from 'react'
import Router from './Components/Router'
import { useDispatch } from 'react-redux'
import { ConfigService } from "./helpers/services/configService";
import { Spinner } from "./Components/Icons/icons"
import { setDocumentApi, setUserPoolId, setClientId, setUserAuthenticationType, setAuthApi, setCustomAuthorizerUrl, setBrand } from './Store/reducers/config'
import { setFormkiqClient } from './Store/reducers/data';
import FormkiqClient from "./lib/formkiq-client-sdk-es6";
import { store } from './Store/store';

export const App = () => {

  const [hasConfigLoaded, setHasConfigLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(()=>{
    let formkiqClient = null
    ConfigService.getSystemConfigData().then((config) => {
      if (config.documentApi) {
        dispatch(setDocumentApi(config.documentApi))
      }
      if (config.userPoolId) {
        dispatch(setUserPoolId(config.userPoolId))
      }
      if (config.clientId) {
        dispatch(setClientId(config.clientId))
      }
      if (config.userAuthentication) {  
        dispatch(setUserAuthenticationType(config.userAuthentication))
      }
      if (config.authApi) {
        dispatch(setAuthApi(config.authApi))
      }
      if (config.cognitoHostedUi) {
        dispatch(setCustomAuthorizerUrl(config.cognitoHostedUi))
      }
      if (config.brand) {
        dispatch(setBrand(config.brand))
      }
      formkiqClient = new FormkiqClient(config.documentApi, config.userPoolId, config.clientId)
      formkiqClient.resetClient(config.documentApi, config.userPoolId, config.clientId)
      const { user } = store.getState().authReducer
      formkiqClient.rebuildCognitoClient(
        user?.email,
        user?.idToken,
        user?.accessToken,
        user?.refreshToken
      );
      dispatch(setFormkiqClient(formkiqClient))
      setHasConfigLoaded(true)
    })
  },[])

  return (
    <>
      { hasConfigLoaded ? (
        <Router />
      ) : (
        <Spinner />
      )}
    </>
  )

}
export default App;