import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Spinner, Windows } from '../../Components/Icons/icons';
import { login } from '../../Store/reducers/auth';
import {
  ConfigState,
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

export function SignIn() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const {
    userAuthenticationType,
    cognitoSingleSignOnUrl,
    customAuthorizerUrl,
  } = useSelector(ConfigState);
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

  const onSubmit = async (data: any) => {
    storage.setConfig(configInitialState);
    let formkiqClient: any = null;
    let authApi = '';
    let useAuthApiForSignIn = false;
    await ConfigService.getSystemConfigData().then((config) => {
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
    });
    if (formkiqClient) {
      let options: RequestInit;
      if (isSsoLogin) {
        options = {
          method: 'POST',
          body: JSON.stringify({
            code: data.code,
          }),
        };
      } else {
        options = {
          method: 'POST',
          body: JSON.stringify({
            username: data.email,
            password: data.password,
          }),
        };
      }
      if (useAuthApiForSignIn) {
        await fetch(authApi + '/login', options)
          .then((r) =>
            r.json().then((data) => ({ httpStatus: r.status, body: data }))
          )
          .then((obj) => {
            if (obj.body.AuthenticationResult) {
              const user = {
                email: data.email,
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
                  let isAdmin = false;
                  if (sitesResponse.sites && sitesResponse.sites.length) {
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
            } else {
              if (obj.body.code) {
                switch (obj.body.code) {
                  case 'NotAuthorizedException':
                    dispatch(
                      openDialog({
                        dialogTitle:
                          'Incorrect email or password. Please try again.',
                      })
                    );
                    break;
                  default:
                    dispatch(
                      openDialog({
                        dialogTitle:
                          'An unexpected error has occurred. Please try again in a few minutes.',
                      })
                    );
                    console.log(obj.body);
                    break;
                }
              } else {
                dispatch(
                  openDialog({
                    dialogTitle:
                      'An unexpected error has occurred. Please try again in a few minutes.',
                  })
                );
                console.log(obj.body);
              }
            }
          });
      } else {
        await formkiqClient
          .login(data.email, data.password)
          .then((response: any) => {
            dispatch(setFormkiqClient(formkiqClient));
            if (response.username) {
              const user = {
                email: response.username,
                idToken: response.idToken,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                sites: [],
                defaultSiteId: null,
                currentSiteId: null,
                isAdmin: false,
              };
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
            } else {
              if (response.cognitoErrorCode) {
                switch (response.cognitoErrorCode) {
                  case 'NotAuthorizedException':
                    dispatch(
                      openDialog({
                        dialogTitle:
                          'Incorrect email or password. Please try again.',
                      })
                    );
                    break;
                  default:
                    dispatch(
                      openDialog({
                        dialogTitle:
                          'An unexpected error has occurred. Please try again in a few minutes.',
                      })
                    );
                    console.log(response);
                    break;
                }
              } else {
                dispatch(
                  openDialog({
                    dialogTitle:
                      'An unexpected error has occurred. Please try again in a few minutes.',
                  })
                );
                console.log(response);
              }
            }
          });
      }
    }
  };
  const signInWithCustomAuthorizer = (event: any, url: any) => {
    event.preventDefault();
    window.location.href = url;
  };

  if (isDemo) {
    const signInData = {
      email: 'demo@formkiq.com',
      password: 'tryformkiq',
    };
    onSubmit(signInData);
  }

  return (
    <>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <div className="flex flex-col lg:flex-row justify-center flex-wrap">
        <div className="w-full flex justify-center mt-8">
          <h1 className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Sign In
          </h1>
        </div>
        <div className="w-2/3 mt-8 mx-10 justify-center p-2 border border-gray-400 rounded-md text-gray-900 font-semibold bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300">
          {cognitoSingleSignOnUrl && cognitoSingleSignOnUrl.length && (
            <div className="w-full flex justify-center py-8 border-b border-gray-400 mb-8">
              <button
                className="w-48 flex bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white text-base font-semibold py-2 px-8 rounded-2xl flex cursor-pointer focus:outline-none"
                onClick={(event) => {
                  window.location.href = `${cognitoSingleSignOnUrl}`;
                }}
              >
                Single Sign-On
              </button>
            </div>
          )}
          <div className="font-bold text-lg text-center mb-4">
            <div className="w-full flex justify-center mb-2">
              {userAuthenticationType === 'activedirectory' && (
                <span className="block w-6">
                  <Windows />
                </span>
              )}
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600"></span>
            {userAuthenticationType === 'activedirectory' && (
              <>
                <span> Sign In with Active Directory</span>
              </>
            )}
            {userAuthenticationType !== 'cognito' &&
              userAuthenticationType !== 'activedirectory' && (
                <span> Sign In using External Provider</span>
              )}
          </div>
          {userAuthenticationType === 'cognito' && !isDemo ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="md:w-1/3">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                </div>
                <div className="md:w-2/3 lg:w-1/2">
                  <input
                    aria-label="Email Address"
                    type="email"
                    data-test-id="email"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-xl sm:leading-5"
                    placeholder="me@mycompany.com"
                    {...register('email', {
                      required: true,
                      pattern:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    })}
                  />
                </div>
              </div>
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="md:w-1/3">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="password"
                  >
                    Password
                  </label>
                </div>
                <div className="md:w-2/3 lg:w-1/2">
                  <input
                    aria-label="Password"
                    type="password"
                    data-test-id="password"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-xl sm:leading-5"
                    placeholder="******"
                    {...register('password')}
                  />
                </div>
              </div>
              <div className="mt-5 sm:mt-8 flex justify-center">
                <input
                  type="submit"
                  data-test-id="sign-in"
                  value="Sign In"
                  className="bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white text-base font-semibold py-2 px-8 rounded-2xl flex cursor-pointer focus:outline-none"
                />
              </div>
              <div className="mt-8 w-full text-center">
                <a
                  className="underline hover:text-primary-500"
                  href="/forgot-password"
                >
                  Forgot Your Password?
                </a>
              </div>
            </form>
          ) : (
            <div className="w-full flex justify-center">
              {customAuthorizerUrl.length && !isDemo && (
                <button
                  className="w-48 flex bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white text-base font-semibold py-2 px-8 rounded-2xl flex cursor-pointer focus:outline-none"
                  onClick={(event) => {
                    signInWithCustomAuthorizer(event, customAuthorizerUrl);
                  }}
                >
                  <span className="">Sign In</span>
                </button>
              )}
              {isDemo && <Spinner />}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SignIn;
