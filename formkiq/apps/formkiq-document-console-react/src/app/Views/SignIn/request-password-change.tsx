import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Spinner } from '../../Components/Icons/icons';
import { ConfigState } from '../../Store/reducers/config';
import { openDialog } from '../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../Store/store';

export function RequestPasswordChange() {
  const [isSpinnerDisplayed, setIsSpinnerDisplayed] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const dispatch = useAppDispatch();
  const { authApi } = useSelector(ConfigState);
  const { pathname } = useLocation();

  const onSubmit = async (data: any) => {
    setIsSpinnerDisplayed(true);
    const body = {
      username: data.email,
    };
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify(body) as BodyInit,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };
    fetch(authApi + '/forgotPassword', options)
      .then((r) =>
        r.json().then((data) => ({ httpStatus: r.status, body: data }))
      )
      .then((obj) => {
        setIsSpinnerDisplayed(false);
        if (obj.body.code) {
          if (obj.body.message) {
            dispatch(
              openDialog({
                dialogTitle: obj.body.message,
              })
            );
          } else {
            dispatch(
              openDialog({
                dialogTitle:
                  'An unexpected error has occurred. Please try again in a few minutes.',
              })
            );
          }
        } else {
          dispatch(
            openDialog({
              dialogTitle:
                'A reset password email has been sent to ' + data.email,
            })
          );
        }
      });
  };
  return (
    <>
      <Helmet>
        <title>
          {pathname === '/forgot-password'
            ? 'Forgot Password'
            : 'Reset Password'}
        </title>
      </Helmet>
      <div className="flex flex-col lg:flex-row">
        <div className="mt-8 h-screen flex-1 bg-white p-5">
          <div className="font-bold text-lg text-center mb-8">
            <span className="text-transparent text-2xl bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
              {pathname === '/forgot-password'
                ? 'Forgot Your Password?'
                : 'Your temporary password has expired.'}
            </span>
            <small className="block">
              Enter your email address to receive a link to reset your password
            </small>
          </div>
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
            <div className="mt-5 sm:mt-8 flex justify-center relative">
              <input
                type="submit"
                value="Reset Password"
                className="bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white text-base font-semibold py-2 px-8 rounded-md flex cursor-pointer focus:outline-none"
              />
              {isSpinnerDisplayed && (
                <div
                  className="absolute"
                  style={{ right: 'calc(50% - 140px)', top: '5px' }}
                >
                  <Spinner />
                </div>
              )}
            </div>
            <div className="mt-8 w-full text-center">
              <a className="underline hover:text-primary-500" href="/sign-in">
                Back to Sign In
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default RequestPasswordChange;
