import { Helmet } from "react-helmet-async"
import { useState, useEffect } from 'react'
import { RootState } from "../../Store/store"
import { connect } from "react-redux"
import { ComingSoon } from '../../Components/Icons/icons';

export function Workflows({ user }: any) {

  return (
    <>
      <Helmet>
        <title>Workflows</title>
      </Helmet>
      <div className="max-w-screen-lg text-center font-semibold mb-4">
        <div className="flex ml-2 pb-8 grow justify-center">
          <div className="w-24">
            <ComingSoon />
          </div>
        </div>
        You will be able to set up workflows in the Document Console beginning with FormKiQ Version 1.10
      </div>
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  return { user: state.authReducer?.user }
};

export default connect(mapStateToProps)(Workflows as any);
  