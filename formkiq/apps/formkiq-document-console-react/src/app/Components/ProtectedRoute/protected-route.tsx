import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthState } from '../../Store/reducers/auth';

const publicLocations: string[] = [
  '/sign-in',
  '/forgot-password',
  '/change-password',
  '/confirm-registration',
];

const ProtectedRoute = (props: { children: any }) => {
  const { pathname, search } = useLocation();
  const index = publicLocations.indexOf(pathname);
  const { user } = useSelector(AuthState);
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
      return <Navigate to="/sign-in" />;
    }
  } else {
    if (user) {
      return <Navigate to="/" />;
    }
  }
  return props.children;
};

export default ProtectedRoute;
