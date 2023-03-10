import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { connect, useDispatch } from 'react-redux'
import { openDialog} from "../../Store/reducers/globalNotificationControls"
import { RootState } from "../../Store/store";

export function ForgotPassword({ authApi }: { authApi: string }) {
  const { register, formState: { errors }, handleSubmit } = useForm();
  const dispatch = useDispatch()
  
  
  const onSubmit = async (data:any) => {
    const body = {
      username: data.email
    }
    const options: RequestInit = {
      method: 'POST',
      body: (JSON.stringify(body) as BodyInit),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
    }
    fetch(authApi + '/forgotPassword', options)
    .then(r =>  r.json().then(data => ({httpStatus: r.status, body: data})))
    .then(obj => {
      if (obj.body.cognitoErrorCode) {
        dispatch(openDialog({ dialogTitle: 'An error occurred. Please try again in a few minutes.'}))
      } else {
        dispatch(openDialog({ dialogTitle: 'A reset password email has been sent to ' + data.email}))
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
            Forgot Your Password?
            <small className="block">
              Enter your email address to receive a link to reset your password
            </small>
          </div>
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
            <div className="mt-5 sm:mt-8 flex justify-center">
              <input
                type="submit"
                value="Reset Password"
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

const mapStateToProps = (state: RootState) => {
  const { authApi } = state.configReducer
  return {
    authApi,
  };
}

export default connect(mapStateToProps)(ForgotPassword as any)