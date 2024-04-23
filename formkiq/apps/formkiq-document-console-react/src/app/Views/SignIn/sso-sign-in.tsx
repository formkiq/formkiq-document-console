import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { login } from '../../Store/reducers/auth';
import {
  configInitialState,
  setAuthApi,
  setBrand,
  setClientId,
  setCognitoSingleSignOnUrl,
  setCustomAuthorizerUrl,
  setDocumentApi,
  setFormkiqVersion,
  setUseAuthApiForSignIn,
  setUserAuthenticationType,
  setUserPoolId,
} from '../../Store/reducers/config';
import { setFormkiqClient } from '../../Store/reducers/data';
import { openDialog } from '../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../Store/store';
import { ConfigService } from '../../helpers/services/configService';
import { DocumentsService } from '../../helpers/services/documentsService';
import { LocalStorage } from '../../helpers/tools/useLocalStorage';
import FormkiqClient from '../../lib/formkiq-client-sdk-es6';

const storage: LocalStorage = LocalStorage.Instance;

export function SsoSignIn() {
  const {
    formState: { errors },
  } = useForm();

  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  const customAuthSubmit = async (data: any) => {
    storage.setConfig(configInitialState);
    let formkiqClient: any = null;
    let authApi = '';
    let useAuthApiForSignIn = false;
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
      if (config.cognitoSingleSignOnUrl) {
        dispatch(setCognitoSingleSignOnUrl(config.cognitoSingleSignOnUrl));
      }
      if (config.userAuthentication) {
        dispatch(setUserAuthenticationType(config.userAuthentication));
      }
      if (config.authApi) {
        dispatch(setAuthApi(config.authApi));
        authApi = config.authApi;
      }
      if (config.useAuthApiForSignIn) {
        dispatch(setUseAuthApiForSignIn(config.useAuthApiForSignIn));
        useAuthApiForSignIn = config.useAuthApiForSignIn;
      }
      if (config.cognitoHostedUi) {
        dispatch(setCustomAuthorizerUrl(config.cognitoHostedUi));
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
      if (formkiqClient) {
        const options: RequestInit = {
          method: 'POST',
          body: JSON.stringify({
            code: data.code,
          }),
        };
        fetch(authApi + '/login', options)
          .then((r) =>
            r.json().then((data) => ({ httpStatus: r.status, body: data }))
          )
          .then((obj) => {
            if (obj.body.AuthenticationResult) {
              const user = {
                email: obj.body.AuthenticationResult.email,
                idToken: obj.body.AuthenticationResult.IdToken,
                accessToken: obj.body.AuthenticationResult.AccessToken,
                refreshToken: obj.body.AuthenticationResult.RefreshToken,
                sites: [],
                defaultSiteId: null,
                currentSiteId: null,
                isAdmin: false,
              };
              formkiqClient.rebuildCognitoClient(
                user?.email,
                user?.idToken,
                user?.accessToken,
                user?.refreshToken
              );
              dispatch(setFormkiqClient(formkiqClient));
              // TODO: add promise, make requests concurrently
              DocumentsService.getVersion().then((versionResponse: any) => {
                dispatch(setFormkiqVersion(versionResponse));
                DocumentsService.getSites().then((sitesResponse: any) => {
                  if (sitesResponse.sites && sitesResponse.sites.length) {
                    let isAdmin = false;
                    sitesResponse.sites.forEach((site: any) => {
                      if (site.siteId === 'default') {
                        user.defaultSiteId = site.siteId;
                      }
                      if (
                        site.permissions &&
                        site.permissions.indexOf('ADMIN') > -1
                      ) {
                        // NOTE: admin is instance-wide, so any ADMIN permission means instance-wide admin atm
                        isAdmin = true;
                      }
                    });
                    if (!user.defaultSiteId) {
                      user.defaultSiteId = sitesResponse.sites[0].sideId;
                    }
                    user.currentSiteId = user.defaultSiteId;
                    user.sites = sitesResponse.sites;
                    user.isAdmin = isAdmin;
                  }
                  if (user.sites.length) {
                    dispatch(login(user));
                  } else {
                    dispatch(
                      openDialog({
                        dialogTitle:
                          'No access is allowed to this application for this user. Please contact your administrator.',
                      })
                    );
                  }
                });
              });
            }
          });
      }
    });
    return;
  };

  useEffect(() => {
    if (code) {
      const signInData = {
        code,
      };
      customAuthSubmit(signInData);
    }
  }, [code]);

  return (
    <>
      <Helmet>
        <title>Single Sign On</title>
      </Helmet>
    </>
  );
}

export default SsoSignIn;
