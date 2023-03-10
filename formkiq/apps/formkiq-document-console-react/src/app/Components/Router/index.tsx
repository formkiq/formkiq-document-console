import React, { Suspense, useEffect } from 'react'
import LoadingPage from '../LoadingPage'
import RoutesMapper from './Routes'
import { RootState } from '../../Store/store';
import { connect } from "react-redux";
import ProtectedRoute from '../ProtectedRoute/protected-route'
import Navbar from '../Layout/navbar'
import Sidebar from '../Layout/sidebar'
import { HelmetProvider } from "react-helmet-async"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import GlobalConfirmDialog from '../Dialogs/GlobalConfirmDialog/globalConfirmDialog'
import GlobalNotificationDialog from '../Dialogs/GlobalNotificationDialog/globalNotificationDialog'
import GlobalProgressDialog from '../Dialogs/GlobalProgressDialog/globalProgressDialog'

const Router = (props: {
  isSidebarExpanded: boolean;
}) => {
  return (
    <HelmetProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="flex overflow-x-hidden">
          <div className={(props.isSidebarExpanded ? 'w-64' : 'w-14') + ' grow-0'}>
            <Sidebar />
          </div>
          <div className="grow overflow-y-hidden">
            <Navbar />
            <div className="flex grow flex-row">
              <div className="main-content flex-1">
              <ProtectedRoute>
                <Suspense fallback={<LoadingPage/>}>
                  <RoutesMapper/>
                </Suspense>
              </ProtectedRoute>
              </div>
            </div>
          </div>
          <GlobalConfirmDialog />
          <GlobalNotificationDialog />
          <GlobalProgressDialog />
        </div>
      </DndProvider>
    </HelmetProvider>
  )
}

const mapStateToProps = (state: RootState) => {
  const { isSidebarExpanded } = state.configReducer
  return { isSidebarExpanded }
}

export default connect(mapStateToProps)(Router as any)
