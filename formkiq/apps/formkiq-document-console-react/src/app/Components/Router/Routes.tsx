import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SsoSignIn from '../../Views/SignIn/sso-sign-in';
import Queues from '../../Views/Workflows/queues';
import WorkflowDesigner from '../../Views/Workflows/workflowDesigner';

const SignIn = React.lazy(() => import('../../Views/SignIn/sign-in'));
const RequestPasswordChange = React.lazy(
  () => import('../../Views/SignIn/request-password-change')
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
const ApiKeys = React.lazy(
  () => import('../../Views/Integrations/Api/apiKeys')
);
const Webhooks = React.lazy(
  () => import('../../Views/Integrations/Webhooks/webhooks')
);
const AccountSettings = React.lazy(
  () => import('../../Views/Account/accountSettings')
);
const Rulesets = React.lazy(() => import('../../Views/Ruleset/rulesets'));

const Ruleset = React.lazy(() => import('../../Views/Ruleset/ruleset'));

const Rule = React.lazy(() => import('../../Views/Ruleset/rule'));
const AccessControl = React.lazy(
  () => import('../../Views/Account/accessControl')
);
const ManagePolicy = React.lazy(
  () => import('../../Views/Account/managePolicy')
);

const ObjectExamineTool = React.lazy(
  () => import('../../Views/Account/objectExamineTool')
);

const Schemas = React.lazy(() => import('../../Views/Schemas/schemas'));
const Classification = React.lazy(
  () => import('../../Views/Schemas/classification')
);
const SiteSchema = React.lazy(() => import('../../Views/Schemas/siteSchema'));
const Groups = React.lazy(() => import('../../Views/UserManagement/groups'));
const Group = React.lazy(() => import('../../Views/UserManagement/group'));
const Users = React.lazy(() => import('../../Views/UserManagement/users'));

const UserActivities = React.lazy(
    () => import('../../Views/Account/userActivities')
);

const Attributes = React.lazy(
    () => import('../../Views/Attributes/attributes')
);

const Mappings = React.lazy(
    () => import('../../Views/Mappings/mappings')
);

const RoutesMapper = () => {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />}></Route>
      <Route path="/sso-sign-in" element={<SsoSignIn />}></Route>
      <Route
        path="/forgot-password"
        element={<RequestPasswordChange />}
      ></Route>
      <Route path="/reset-password" element={<RequestPasswordChange />}></Route>
      <Route path="/change-password" element={<ChangePassword />}></Route>
      <Route
        path="/confirm-registration"
        element={<ConfirmRegistration />}
      ></Route>
      <Route path="/" element={<Navigate to="/documents" />} />

      <Route path="/documents" element={<Documents />}></Route>
      <Route path="/documents/folders/*" element={<Documents />}></Route>
      <Route path="/documents/queues/*" element={<Documents />}></Route>
      <Route path="/documents/settings" element={<DocumentSettings />}></Route>
      <Route path="/documents/help" element={<DocumentHelp />}></Route>
      <Route path="/documents/new/:extension" element={<DocumentNew />}></Route>
      <Route path="/documents/:id" element={<Documents />}></Route>
      <Route path="/documents/:id/view" element={<DocumentView />}></Route>
      <Route path="/documents" element={<Documents />}></Route>
      <Route path="/my-documents/folders/*" element={<Documents />}></Route>
      <Route
        path="/my-documents/queues/:queueId"
        element={<Documents />}
      ></Route>
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
        path="/team-documents/queues/:queueId"
        element={<Documents />}
      ></Route>
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

      <Route path="/workspaces/" element={<Documents />}></Route>
      <Route path="/workspaces/:siteId" element={<Documents />}></Route>
      <Route
        path="/workspaces/:siteId/folders/*"
        element={<Documents />}
      ></Route>
      <Route
        path="/workspaces/:siteId/queues/:queueId"
        element={<Documents />}
      ></Route>
      <Route
        path="/workspaces/:siteId/settings"
        element={<DocumentSettings />}
      ></Route>
      <Route path="/workspaces/:siteId/help" element={<DocumentHelp />}></Route>
      <Route
        path="/workspaces/:siteId/new/:extension"
        element={<DocumentNew />}
      ></Route>
      <Route path="/workspaces/:siteId/:id" element={<Documents />}></Route>
      <Route
        path="/workspaces/:siteId/:id/view"
        element={<DocumentView />}
      ></Route>

      <Route path="/rulesets" element={<Rulesets />}></Route>
      <Route path="/rulesets/workspaces/:siteId" element={<Rulesets />}></Route>
      <Route
        path="/rulesets/workspaces/:siteId/:id"
        element={<Ruleset />}
      ></Route>
      <Route
        path="/rulesets/workspaces/:siteId/:id/rule/:ruleId"
        element={<Rule />}
      ></Route>
      <Route path="/rulesets/:id" element={<Ruleset />}></Route>
      <Route path="/rulesets/:id/rule/:ruleId" element={<Rule />}></Route>

      <Route path="/schemas" element={<Schemas />}></Route>
      <Route path="/schemas/workspaces/:siteId" element={<Schemas />}></Route>
      <Route
        path="/schemas/workspaces/:siteId/:classificationId"
        element={<Classification />}
      ></Route>
      <Route path="/schemas/site-schema" element={<SiteSchema />}></Route>
      <Route
        path="/schemas/workspaces/:siteId/site-schema"
        element={<SiteSchema />}
      ></Route>
      <Route
        path="/schemas/:classificationId"
        element={<Classification />}
      ></Route>

      <Route
        path="/workspaces/:siteId/workflows/designer"
        element={<WorkflowDesigner />}
      ></Route>
      <Route path="/workflows" element={<Workflows />}></Route>
      <Route
        path="/workflows/workspaces/:siteId"
        element={<Workflows />}
      ></Route>
      <Route path="/workflows/designer" element={<WorkflowDesigner />}></Route>
      <Route
        path="/workflows/workspaces/:siteId/designer"
        element={<WorkflowDesigner />}
      ></Route>
      <Route path="/queues" element={<Queues />}></Route>
      <Route path="/queues/workspaces/:siteId" element={<Queues />}></Route>
      <Route path="/mappings" element={<Mappings />}></Route>
      <Route path="/integrations/api" element={<ApiExplorer />}></Route>
      <Route
        path="/admin/api-keys/workspaces/:siteId"
        element={<ApiKeys />}
      ></Route>
      <Route path="/integrations/webhooks" element={<Webhooks />}></Route>
      <Route path="/admin/settings" element={<AccountSettings />}></Route>
      <Route path="/admin/api-keys" element={<ApiKeys />}></Route>
      <Route path="/admin/groups" element={<Groups />}></Route>
      <Route path="/admin/groups/:groupName" element={<Group />}></Route>
      <Route path="/admin/users" element={<Users />}></Route>
      <Route path="/admin/access-control" element={<AccessControl />}></Route>
      <Route
        path="/admin/access-control/:siteId"
        element={<ManagePolicy />}
      ></Route>
      <Route
        path="/object-examine-tool"
        element={<ObjectExamineTool />}
      ></Route>
      <Route path="/admin/user-activities" element={<UserActivities />}></Route>
      <Route path="/admin/user-activities/workspaces/:siteId" element={<UserActivities />}></Route>
      <Route path="/attributes" element={<Attributes />}></Route>
      <Route path="/attributes/workspaces/:siteId" element={<Attributes />}></Route>
      <Route path="*" element={<Page404 />}></Route>
    </Routes>
  );
};

export default RoutesMapper;
