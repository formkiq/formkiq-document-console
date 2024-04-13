import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { login } from '../../Store/reducers/auth';
import {
  configInitialState,
  setAuthApi,
  setBrand,
  setClientId,
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
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const searchParams = search.replace('?', '').split('&') as any[];
  let isDemo = false;
  let isSsoLogin = false;
  let ssoCode = '';
  searchParams.forEach((param: string) => {
    if (param === 'demo=tryformkiq') {
      isDemo = true;
      return;
    } else if (param.indexOf('code=') > -1) {
      isSsoLogin = true;
      ssoCode = param.split('=')[1];
      return;
    }
  });

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
        return;
        fetch(authApi + '/login', options)
          .then((r) =>
            r.json().then((data) => ({ httpStatus: r.status, body: data }))
          )
          .then((obj) => {
            console.log(obj);
            if (obj.body.AuthenticationResult) {
              const user = {
                email: data.email,
                idToken: obj.body.AuthenticationResult.IdToken,
                accessToken: obj.body.AuthenticationResult.AccessToken,
                refreshToken: obj.body.AuthenticationResult.RefreshToken,
                sites: [],
                defaultSiteId: null,
                currentSiteId: null,
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
                    sitesResponse.sites.forEach((site: any) => {
                      if (site.siteId === 'default') {
                        user.defaultSiteId = site.siteId;
                      }
                    });
                    if (!user.defaultSiteId) {
                      user.defaultSiteId = sitesResponse.sites[0].sideId;
                    }
                    user.currentSiteId = user.defaultSiteId;
                    user.sites = sitesResponse.sites;
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

  if (isSsoLogin) {
    const signInData = {
      code: ssoCode,
    };
    customAuthSubmit(signInData);
  }

  return (
    <>
      <Helmet>
        <title>Single Sign On</title>
      </Helmet>
    </>
  );
}

export default SsoSignIn;
