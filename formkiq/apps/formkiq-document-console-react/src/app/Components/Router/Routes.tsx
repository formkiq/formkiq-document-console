import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const SignIn = React.lazy(() => import('../../Views/SignIn/sign-in'));
const ForgotPassword = React.lazy(
  () => import('../../Views/SignIn/forgot-password')
);
const ChangePassword = React.lazy(
  () => import('../../Views/SignIn/change-password')
);
const ConfirmRegistration = React.lazy(
  () => import('../../Views/SignIn/confirm-registration')
);
const Page404 = React.lazy(() => import('../../Views/404/index'));
const Documents = React.lazy(() => import('../../Views/Documents/documents'));
const DocumentNew = React.lazy(
  () => import('../../Views/Documents/documentNew')
);
const DocumentView = React.lazy(
  () => import('../../Views/Documents/documentView')
);
const DocumentSettings = React.lazy(
  () => import('../../Views/Documents/documentSettings')
);
const DocumentHelp = React.lazy(
  () => import('../../Views/Documents/documentHelp')
);

const Workflows = React.lazy(() => import('../../Views/Workflows/workflows'));
const ApiExplorer = React.lazy(
  () => import('../../Views/Integrations/Api/apiExplorer')
);
const Webhooks = React.lazy(
  () => import('../../Views/Integrations/Webhooks/webhooks')
);
const AccountSettings = React.lazy(
  () => import('../../Views/Account/accountSettings')
);

const RoutesMapper = () => {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />}></Route>
      <Route path="/forgot-password" element={<ForgotPassword />}></Route>
      <Route path="/change-password" element={<ChangePassword />}></Route>
      <Route
        path="/confirm-registration"
        element={<ConfirmRegistration />}
      ></Route>
      <Route path="/" element={<Navigate to="/documents" />} />

      <Route path="/documents" element={<Documents />}></Route>
      <Route path="/documents/folders/*" element={<Documents />}></Route>
      <Route path="/documents/settings" element={<DocumentSettings />}></Route>
      <Route path="/documents/help" element={<DocumentHelp />}></Route>
      <Route path="/documents/new/:extension" element={<DocumentNew />}></Route>
      <Route path="/documents/:id" element={<Documents />}></Route>
      <Route path="/documents/:id/view" element={<DocumentView />}></Route>
      <Route path="/documents" element={<Documents />}></Route>
      <Route path="/my-documents/folders/*" element={<Documents />}></Route>
      <Route path="/my-documents" element={<Documents />}></Route>
      <Route
        path="/my-documents/settings"
        element={<DocumentSettings />}
      ></Route>
      <Route path="/my-documents/help" element={<DocumentHelp />}></Route>
      <Route
        path="/my-documents/new/:extension"
        element={<DocumentNew />}
      ></Route>
      <Route path="/my-documents/:id" element={<Documents />}></Route>
      <Route path="/my-documents/:id/view" element={<DocumentView />}></Route>

      <Route path="/team-documents" element={<Documents />}></Route>
      <Route path="/team-documents/folders/*" element={<Documents />}></Route>
      <Route
        path="/team-documents/settings"
        element={<DocumentSettings />}
      ></Route>
      <Route path="/team-documents/help" element={<DocumentHelp />}></Route>
      <Route
        path="/team-documents/new/:extension"
        element={<DocumentNew />}
      ></Route>
      <Route path="/team-documents/:id" element={<Documents />}></Route>
      <Route path="/team-documents/:id/view" element={<DocumentView />}></Route>
      <Route path="/team-documents" element={<Documents />}></Route>

      <Route path="/shared-folders/" element={<Documents />}></Route>
      <Route path="/shared-folders/:siteId" element={<Documents />}></Route>
      <Route
        path="/shared-folders/:siteId/folders/*"
        element={<Navigate to="/shared-folders/" />}
      />
      <Route
        path="/shared-folders/:siteId/settings"
        element={<DocumentSettings />}
      ></Route>
      <Route
        path="/shared-folders/:siteId/help"
        element={<DocumentHelp />}
      ></Route>
      <Route
        path="/shared-folders/:siteId/new/:extension"
        element={<DocumentNew />}
      ></Route>
      <Route path="/shared-folders/:siteId/:id" element={<Documents />}></Route>
      <Route
        path="/shared-folders/:siteId/:id/view"
        element={<DocumentView />}
      ></Route>
      <Route path="/shared-folders/:siteId" element={<Documents />}></Route>

      <Route path="/workflows" element={<Workflows />}></Route>
      <Route path="/integrations/api" element={<ApiExplorer />}></Route>
      <Route path="/integrations/webhooks" element={<Webhooks />}></Route>
      <Route path="/account/settings" element={<AccountSettings />}></Route>
      <Route path="*" element={<Page404 />}></Route>
    </Routes>
  );
};

export default RoutesMapper;
