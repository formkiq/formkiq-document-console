import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthState } from '../../Store/reducers/auth';
import { ConfigState } from '../../Store/reducers/config';
import { DataCacheState } from '../../Store/reducers/data';
import { openDialog } from '../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../Store/store';
import FormkiqClient from '../../lib/formkiq-client-sdk-es6';

export function ConfirmRegistration() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();
  const { authApi } = useSelector(ConfigState);

  const password = useRef(null);
  password.current = watch('password', '');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const search = useLocation().search;
  const username = new URLSearchParams(search).get('username');
  const userStatus = new URLSearchParams(search).get('userStatus');
  const session = new URLSearchParams(search).get('session');
  const { formkiqClient } = useSelector(DataCacheState);
  const { user } = useSelector(AuthState);
  const { documentApi, userPoolId, clientId } = useSelector(ConfigState);

  useEffect(() => {
    if (!session || session === '0') {
      navigate('/reset-password');
    }
  }, []);

  const onSubmit = async (data: any) => {
    let newformkiqClient = formkiqClient;
    if (!newformkiqClient.apiClient) {
      newformkiqClient = new FormkiqClient(documentApi, userPoolId, clientId);
      newformkiqClient.resetClient(documentApi, userPoolId, clientId);
      newformkiqClient.rebuildCognitoClient(
        user?.email,
        user?.idToken,
        user?.accessToken,
        user?.refreshToken
      );
    }
    await newformkiqClient.documentsApi.apiClient.cognitoClient
      .confirmRegistration(
        authApi + '/respondToAuthChallenge',
        username,
        userStatus,
        session,
        data.password
      )
      .then((response: any) => {
        if (response.message && response.message === 'Change Password') {
          dispatch(
            openDialog({ dialogTitle: 'Your password has been saved.' })
          );
          navigate('/sign-in');
        } else {
          dispatch(
            openDialog({
              dialogTitle:
                'An error has occurred. Please try again in a few minutes.',
            })
          );
          return;
        }
      });
  };
  return (
    <>
      <Helmet>
        <title>Confirm User</title>
      </Helmet>
      <div className="flex flex-col lg:flex-row">
        <div className="mt-8 h-screen flex-1 bg-white p-5">
          <div className="font-bold text-lg text-center mb-8">
            Set Your Password
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="md:flex md:items-center mx-4 mb-4 relative">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="password"
                >
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
                  {...register('password', {
                    minLength: {
                      value: 6,
                      message:
                        'Your new password must have at least 6 characters',
                    },
                  })}
                />
                {errors['password'] && errors['password'].message && (
                  <p className="pt-1 text-red-600">
                    {errors['password'].message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="md:flex md:items-center mx-4 mb-4 relative">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="passwordConfirm"
                >
                  Repeat New Password
                </label>
              </div>
              <div className="md:w-2/3 lg:w-1/2">
                <input
                  aria-label="Repeat New Password"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-xl sm:leading-5"
                  placeholder="******"
                  {...register('confirmPassword', {
                    validate: (value) => value === password.current,
                  })}
                />
                {errors['confirmPassword'] && (
                  <p className="pt-1 text-red-600">
                    The passwords do not match
                  </p>
                )}
              </div>
            </div>
            <div className="mt-5 sm:mt-8 flex justify-center">
              <input
                type="submit"
                value="Set Password"
                className="px-8 cursor-pointer py-3 mx-1 border border-transparent text-base leading-6 font-medium rounded-md shadow
                  text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline
                  transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ConfirmRegistration;
