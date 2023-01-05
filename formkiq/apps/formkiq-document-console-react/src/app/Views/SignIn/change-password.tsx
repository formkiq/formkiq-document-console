import { useRef } from 'react';
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux'
import { useLocation } from "react-router-dom";
import { openDialog} from "../../Store/reducers/globalNotificationControls"
import { store } from '../../Store/store';
import FormkiqClient from "../../lib/formkiq-client-sdk-es6";

export function ChangePassword() {
  const { register, formState: { errors }, handleSubmit, watch } = useForm();
  const newPassword = useRef(null);
  newPassword.current = watch("newPassword", "");
  const dispatch = useDispatch()
  const search = useLocation().search
  let email = new URLSearchParams(search).get('email')
  if (email && email.length) {
    email = email.replace(' ', '+')
  }
  const verificationCode = new URLSearchParams(search).get('code')
  
  const onSubmit = async (data: any) => {
    let { formkiqClient } = store.getState().dataCacheReducer
    if (!formkiqClient.apiClient) {
      const { user } = store.getState().authReducer
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
    await formkiqClient.documentsApi.apiClient.cognitoClient.confirmPassword(email, verificationCode, data.newPassword).then((response: any) => {
      if (response.cognitoErrorCode) {
        dispatch(openDialog({ dialogTitle: 'An error occurred. Please try again in a few minutes.'}))
      } else {
        dispatch(openDialog({ dialogTitle: 'Your password has been changed.'}))
      }
    })
  };
  return (
    <>
      <Helmet>
        <title>Change Password</title>
      </Helmet>
      <div className="flex flex-col lg:flex-row">
        <div className="mt-8 h-screen flex-1 bg-white p-5">
          <div className="font-bold text-lg text-center mb-8">
            Change Your Password
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="md:flex md:items-center mx-4 mb-4 relative">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="newPassword">
                  New Password
                </label>
              </div>
              <div className="md:w-2/3 lg:w-1/2">
                <input
                  aria-label="New Password"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-xl sm:leading-5"
                  placeholder="******"
                  {...register("newPassword", {
                    minLength: {
                      value: 6,
                      message: "Your new password must have at least 6 characters"
                    }
                  })}
                  />
                {errors['newPassword'] && errors['newPassword'].message && (
                  <p className="pt-1 text-red-600">{(errors['newPassword'].message as string)}</p>
                )}
              </div>
            </div>
            <div className="md:flex md:items-center mx-4 mb-4 relative">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="confirmPassword">
                  Repeat Your New Password
                </label>
              </div>
              <div className="md:w-2/3 lg:w-1/2">
                <input
                  aria-label="Repeat Your New Password"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-xl sm:leading-5"
                  placeholder="******"
                  {...register("confirmPassword", {
                    validate: value =>
                      value === newPassword.current
                  })}
                  />
                {errors['confirmPassword'] && (<p className="pt-1 text-red-600">The passwords do not match</p>)}
              </div>
            </div>
            <div className="mt-5 sm:mt-8 flex justify-center">
              <input
                type="submit"
                value="Set New Password"
                className="px-8 cursor-pointer py-3 mx-1 border border-transparent text-base leading-6 font-medium rounded-md shadow
                  text-white bg-coreOrange-500 hover:bg-coreOrange-400 focus:outline-none focus:shadow-outline
                  transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
              />
              
            </div>
            <div  className="mt-8 w-full text-center">
                <a className="underline"  href="/sign-in"> 
                  Back to Sign In
                </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChangePassword;
  