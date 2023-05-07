import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { ConfigState } from '../../Store/reducers/config';
import { openDialog } from '../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../Store/store';

export function ForgotPassword() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const dispatch = useAppDispatch();
  const { authApi } = useSelector(ConfigState);

  const onSubmit = async (data: any) => {
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
        if (obj.body.cognitoErrorCode) {
          dispatch(
            openDialog({
              dialogTitle:
                'An error occurred. Please try again in a few minutes.',
            })
          );
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
        <title>Forgot Password</title>
      </Helmet>
      <div className="flex flex-col lg:flex-row">
        <div className="mt-8 h-screen flex-1 bg-white p-5">
          <div className="font-bold text-lg text-center mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-coreOrange-500 via-red-500 to-coreOrange-600">
              Forgot Your Password?
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
            <div className="mt-5 sm:mt-8 flex justify-center">
              <input
                type="submit"
                value="Reset Password"
                className="bg-gradient-to-l from-coreOrange-400 via-red-400 to-coreOrange-500 hover:from-coreOrange-500 hover:via-red-500 hover:to-coreOrange-600 text-white text-base font-semibold py-2 px-8 rounded-2xl flex cursor-pointer focus:outline-none"
              />
            </div>
            <div className="mt-8 w-full text-center">
              <a
                className="underline hover:text-coreOrange-500"
                href="/sign-in"
              >
                Back to Sign In
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
