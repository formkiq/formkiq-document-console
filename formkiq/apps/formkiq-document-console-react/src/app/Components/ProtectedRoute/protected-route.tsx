import { useSelector } from 'react-redux';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { AuthState } from '../../Store/reducers/auth';

const publicLocations: string[] = [
  '/sign-in',
  '/sso-sign-in',
  '/forgot-password',
  '/reset-password',
  '/change-password',
  '/confirm-registration',
];

const ProtectedRoute = (props: { children: any }) => {
  const { pathname, search } = useLocation();
  const index = publicLocations.indexOf(decodeURI(pathname));
  const [searchParams] = useSearchParams();

  const { user } = useSelector(AuthState);
  const ssoCode = searchParams.get('code');
  const userStatus = searchParams.get('userStatus');
  if (index < 0) {
    // if not public location
    const searchParams = search.replace('?', '').split('&') as any[];
    let isRegistrationConfirmation = false;
    let isDemo = false;

    searchParams.forEach((param: string) => {
      if (
        param === 'userStatus=NEW_PASSWORD_REQUIRED' ||
        param === 'userStatus=FORCE_CHANGE_PASSWORD'
      ) {
        isRegistrationConfirmation = true;
        return;
      } else if (param === 'demo=tryformkiq') {
        isDemo = true;
        return;
      }
    });
    if (isRegistrationConfirmation) {
      window.location.href = '/confirm-registration' + search;
      return;
    } else if (isDemo) {
      return <Navigate to="/sign-in?demo=tryformkiq" />;
    }
    if (!user) {
      if (ssoCode && !userStatus?.length && pathname !== '/sso-sign-in') {
        return <Navigate to={'/sso-sign-in?code=' + ssoCode} />;
      } else {
        return <Navigate to="/sign-in" />;
      }
    }
  } else {
    const ssoCode = searchParams.get('code');
    const userStatus = searchParams.get('userStatus');
    if (user) {
      return <Navigate to="/" />;
    } else if (ssoCode && !userStatus?.length && pathname !== '/sso-sign-in') {
      return <Navigate to={'/sso-sign-in?code=' + ssoCode} />;
    }
  }
  return props.children;
};

export default ProtectedRoute;
