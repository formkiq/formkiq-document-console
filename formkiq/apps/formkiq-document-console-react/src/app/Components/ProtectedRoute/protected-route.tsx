import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { store, RootState } from '../../Store/store'
import { connect } from "react-redux";
import { User } from "../../Store/reducers/auth";
import { useLocation } from 'react-router-dom';
import { is } from "immer/dist/internal";

const publicLocations: string [] = [
  '/sign-in',
  '/forgot-password',
  '/change-password',
  '/confirm-registration'
]

const ProtectedRoute = (props: {children:any, user: User}) => {
  const { pathname, search } = useLocation();  
  const index = publicLocations.indexOf(pathname)
  if (index < 0) { // if not public location
    const searchParams = search.replace('?', '').split('&') as any[]
    let isRegistrationConfirmation = false;
    searchParams.forEach((param: string) => {
      if (param === 'userStatus=NEW_PASSWORD_REQUIRED') {
        isRegistrationConfirmation = true;
        return
      }
    })
    if (isRegistrationConfirmation) {
      window.location.href = '/confirm-registration' + search
      return
    }
    if (!props.user) {
      return <Navigate to="/sign-in" />;
    }
  } else {
    if (props.user) {
      return <Navigate to="/" />;
    }
  }
  return props.children;
};


const mapStateToProps = (state: RootState) => {
  const { user } = state.authReducer;
  return { user: user }
};

export default connect(mapStateToProps)(ProtectedRoute as any);