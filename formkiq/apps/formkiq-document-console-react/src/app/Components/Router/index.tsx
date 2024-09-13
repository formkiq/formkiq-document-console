import { Suspense } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HelmetProvider } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { ConfigState } from '../../Store/reducers/config';
import GlobalConfirmDialog from '../Dialogs/GlobalConfirmDialog/globalConfirmDialog';
import GlobalNotificationDialog from '../Dialogs/GlobalNotificationDialog/globalNotificationDialog';
import GlobalProgressDialog from '../Dialogs/GlobalProgressDialog/globalProgressDialog';
import Navbar from '../Layout/navbar';
import Sidebar from '../Layout/sidebar';
import LoadingPage from '../LoadingPage';
import ProtectedRoute from '../ProtectedRoute/protected-route';
import RoutesMapper from './Routes';
import {DocumentActionsProvider} from "../DocumentsAndFolders/DocumentActionsPopover/DocumentActionsContext";

const Router = () => {
  const { isSidebarExpanded } = useSelector(ConfigState);

  return (
    <HelmetProvider>
      <DndProvider backend={HTML5Backend}>
        <DocumentActionsProvider>
          <div className="flex overflow-x-hidden">
            <div className={(isSidebarExpanded ? 'w-64' : 'w-14') + ' grow-0'}>
              <Sidebar />
            </div>
            <div className="grow overflow-y-hidden">
              <Navbar />
              <div className="flex grow flex-row">
                <div className="main-content flex-1">
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingPage />}>
                      <RoutesMapper />
                    </Suspense>
                  </ProtectedRoute>
                </div>
              </div>
            </div>
            <GlobalConfirmDialog />
            <GlobalNotificationDialog />
            <GlobalProgressDialog />
          </div>
        </DocumentActionsProvider>
      </DndProvider>
    </HelmetProvider>
  );
};

export default Router;
