import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { RootState } from '../../Store/store';
import { connect, useDispatch } from "react-redux";
import { DocumentsService } from '../../helpers/services/documentsService';
import { login } from '../../Store/reducers/auth';
import { configInitialState, setFormkiqVersion } from '../../Store/reducers/config';
import { Windows } from '../../Components/Icons/icons';
import { LocalStorage } from '../../helpers/tools/useLocalStorage';
import { ConfigService } from "../../helpers/services/configService";
import { setDocumentApi, setUserPoolId, setClientId, setUserAuthenticationType, setAuthApi, setCustomAuthorizerUrl, setBrand } from '../../Store/reducers/config'
import { setFormkiqClient } from '../../Store/reducers/data'
import { openDialog } from "../../Store/reducers/globalNotificationControls"
import FormkiqClient from "../../lib/formkiq-client-sdk-es6";

const storage: LocalStorage = LocalStorage.Instance

export function SignIn(props: {
  userAuthenticationType: string,
  customAuthorizerUrl: string
}) {
  const { register, formState: { errors }, handleSubmit } = useForm();
  const dispatch = useDispatch()

  const onSubmit = async (data: any) => {
    storage.setConfig(configInitialState)
    let formkiqClient: any = null
    await ConfigService.getSystemConfigData().then((config) => {
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
    })
    if (formkiqClient) {
      await formkiqClient.login(data.email, data.password).then((response: any) => {
        dispatch(setFormkiqClient(formkiqClient))
        if (response.username) {
          const user = {
            email: response.username,
            idToken: response.idToken,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            sites: [],
            defaultSiteId: null,
            currentSiteId: null
          };
          // formkiqClient.rebuildCognitoClient(user.email, user.idToken, user.accessToken, user.refreshToken)
          // TODO: add promise, make requests concurrently
          DocumentsService.getVersion().then((versionResponse: any) => {
            dispatch(setFormkiqVersion(versionResponse))
            DocumentsService.getSites().then((sitesResponse: any) => {
              if (sitesResponse.sites && sitesResponse.sites.length) {
                sitesResponse.sites.forEach((site: any) => {
                  if (site.siteId === 'default') {
                    user.defaultSiteId = site.siteId
                  }
                })
                if (!user.defaultSiteId) {
                  user.defaultSiteId = sitesResponse.sites[0].sideId
                }
                user.currentSiteId = user.defaultSiteId
                user.sites = sitesResponse.sites
              }
              dispatch(login(user))
            })
          })
        } else {
          if (response.cognitoErrorCode) {
            switch (response.cognitoErrorCode) {
              case 'NotAuthorizedException':
                dispatch(openDialog({ dialogTitle: 'Incorrect email or password. Please try again.'}))
                break;
              default:
                dispatch(openDialog({ dialogTitle: 'An unexpected error has occurred. Please try again in a few minutes.'}))
                console.log(response)
                break
            }
          } else {
            dispatch(openDialog({ dialogTitle: 'An unexpected error has occurred. Please try again in a few minutes.'}))
            console.log(response)
          }
        }
      });
    }
  };
  const signInWithCustomAuthorizer = (event: any, url: any) => {
    event.preventDefault();
    window.location.href = url;
  }

  return (
    <>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full mt-8 justify-center bg-white p-5">
          <div className="font-bold text-lg text-center mb-4">
            <div className="w-full flex justify-center mb-2">
              {props.userAuthenticationType === "activedirectory" && (
                <span className="block w-6">
                  <Windows />
                </span>
              )}
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-coreOrange-500 via-red-500 to-coreOrange-600">
              Sign In
            </span>
            {props.userAuthenticationType === "activedirectory" && (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <>
                <span> with Active Directory</span>
              </>
            )}
            {props.userAuthenticationType !== "cognito" && props.userAuthenticationType !== "activedirectory" && (
              <span> using External Provider</span>
            )}
          </div>
          { props.userAuthenticationType === "cognito" ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="md:w-1/3">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="email">
                    Email Address
                  </label>
                </div>
                <div className="md:w-2/3 lg:w-1/2">
                  <input
                      aria-label="Email Address"
                      type="email"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-xl sm:leading-5"
                      placeholder="me@mycompany.com"
                      {...register("email", {
                        required: true,
                        pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                      })}
                    />
                </div>
              </div>
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="md:w-1/3">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="password">
                    Password
                  </label>
                </div>
                <div className="md:w-2/3 lg:w-1/2">
                  <input
                    aria-label="Password"
                    type="password"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-xl sm:leading-5"
                    placeholder="******"
                    {...register("password")}
                    />
                </div>
              </div>
              <div className="mt-5 sm:mt-8 flex justify-center">
                <input
                  type="submit"
                  value="Sign In"
                  className="bg-gradient-to-l from-coreOrange-400 via-red-400 to-coreOrange-500 hover:from-coreOrange-500 hover:via-red-500 hover:to-coreOrange-600 text-white text-base font-semibold py-2 px-8 rounded-2xl flex cursor-pointer focus:outline-none"
                />
              </div>
              <div  className="mt-8 w-full text-center">
                <a className="underline hover:text-coreOrange-500" href="/forgot-password"> 
                  Forgot Your Password? 
                </a>
              </div>
            </form>
          ) : (
            <div className="w-full flex justify-center">
              { props.customAuthorizerUrl.length && (
                <button
                  className="w-48 flex bg-gradient-to-l from-coreOrange-400 via-red-400 to-coreOrange-500 hover:from-coreOrange-500 hover:via-red-500 hover:to-coreOrange-600 text-white text-base font-semibold py-2 px-8 rounded-2xl flex cursor-pointer focus:outline-none"
                  onClick={event => {signInWithCustomAuthorizer(event, props.customAuthorizerUrl)}}
                  >
                  <span className="">Sign In</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}


const mapStateToProps = (state: RootState) => {
  const { userAuthenticationType, customAuthorizerUrl } = state.configReducer
  return {
    userAuthenticationType,
    customAuthorizerUrl
  };
}

export default connect(mapStateToProps)(SignIn as any)
  