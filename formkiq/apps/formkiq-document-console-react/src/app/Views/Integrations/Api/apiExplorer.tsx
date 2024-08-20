import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import ApiItem from '../../../Components/Integrations/ApiItem/apiItem';
import { useAuthenticatedState } from '../../../Store/reducers/auth';
import { ApiSegment } from './api-segment';
import {
  deleteApiKeyApiItem,
  deleteConfigurationOpaPolicyApiItem,
  deleteDocumentAccessAttributesApiItem,
  deleteDocumentApiItem,
  deleteDocumentFulltextApiItem,
  deleteDocumentFulltextTagApiItem,
  deleteDocumentFulltextTagValueApiItem,
  deleteDocumentOcrApiItem,
  deleteDocumentTagValueApiItem,
  deleteDocumentVersionApiItem,
  deleteFolderApiItem,
  deleteFolderDeprecatedApiItem,
  deleteQueueApiItem,
  deleteRuleApiItem,
  deleteRulesetApiItem,
  deleteShareApiItem,
  deleteWebhookApiItem,
  deleteWorkflowApiItem,
  documentFulltextSearch,
  documentsDocumentIdTagsPost,
  documentsDocumentIdTagsTagKeyDelete,
  documentsDocumentIdTagsTagKeyGet,
  documentsTagsPatchApiItem,
  fulltextQueryApiItem,
  getApiKeysApiItem,
  getCaseApiItem,
  getCaseDocumentsApiItem,
  getCaseNigoDocumentsApiItem,
  getCaseNigosApiItem,
  getCaseTaskDocumentsApiItem,
  getCaseTasksApiItem,
  getCasesApiItem,
  getConfigurationApiItem,
  getConfigurationOpaPoliciesApiItem,
  getDocumentAccessAttributesApiItem,
  getDocumentActionsApiItem,
  getDocumentApiItem,
  getDocumentContentApiItem,
  getDocumentFulltextApiItem,
  getDocumentOcrApiItem,
  getDocumentReplaceUploadApiItem,
  getDocumentSyncsApiItem,
  getDocumentTagsApiItem,
  getDocumentUrlApiItem,
  getDocumentVersionsApiItem,
  getDocumentsApiItem,
  getDocumentsInQueueApiItem,
  getDocumentsInWorkflowApiItem,
  getExaminePdfDetailsApiItem,
  getExaminePdfUploadUrlApiItem,
  getFoldersApiItem,
  getNewDocumentUploadApiItem,
  getQueueApiItem,
  getQueuesApiItem,
  getRuleApiItem,
  getRulesApiItem,
  getRulesetApiItem,
  getRulesetsApiItem,
  getSharesApiItem,
  getSitesApiItem,
  getVersionApiItem,
  getWebhookApiItem,
  getWebhookTagsApiItem,
  getWebhooksApiItem,
  getWorkflowApiItem,
  getWorkflowByIdInDocumentApiItem,
  getWorkflowsApiItem,
  getWorkflowsInDocumentApiItem,
  moveDocumentApiItem,
  patchDocumentApiItem,
  patchDocumentFulltextApiItem,
  patchRuleApiItem,
  patchRulesetApiItem,
  patchWebhookApiItem,
  postApiKeysApiItem,
  postConfigurationApiItem,
  postDocumentAccessAttributesApiItem,
  postDocumentActionsApiItem,
  postDocumentCompressApiItem,
  postDocumentOcrApiItem,
  postDocumentWorkflowApiItem,
  postDocumentWorkflowDecisionsApiItem,
  postDocumentsApiItem,
  postDocumentsPublicApiItem,
  postFoldersApiItem,
  postPrivateWebhooksApiItem,
  postPublicWebhooksApiItem,
  postQueuesApiItem,
  postRuleApiItem,
  postRulesetsApiItem,
  postSearchIndices,
  postShareFolderApiItem,
  postWebhookTagsApiItem,
  postWebhooksApiItem,
  postWithBodyForNewDocumentUploadApiItem,
  postWorkflowsApiItem,
  putConfigurationOpaPolicyApiItem,
  putDocumentAccessAttributesApiItem,
  putDocumentAntivirusApiItem,
  putDocumentFulltextApiItem,
  putDocumentOcrApiItem,
  putDocumentTagApiItem,
  putDocumentVersionApiItem,
  putWorkflowsApiItem,
  searchDocumentQueryApiItem,
  getConfigurationOpaPolicyApiItem,
  getConfigurationOpaPolicyItemsApiItem,
  getAttributesApiItem,
  postAttributeApiItem,
  getAttributeApiItem,
  deleteAttributeApiItem,
  getDocumentAttributesApiItem,
  postDocumentAttributesApiItem,
  putDocumentAttributesApiItem,
  getDocumentAttributeApiItem,
  deleteDocumentAttributeApiItem,
  deleteDocumentAttributeValueApiItem,
  putDocumentAttributeApiItem,
  getGroupsApiItem,
  postGroupApiItem,
  deleteGroupApiItem,
  getGroupUsersApiItem,
  postGroupUserApiItem,
  deleteGroupUserApiItem,
  getUsersApiItem,
  postUserApiItem,
  getUserApiItem,
  deleteUserApiItem,
  getUserGroupsApiItem,
  putUserOperationApiItem,
  getGroupApiItem,
  getSiteSchemaApiItem,
  putSiteSchemaApiItem,
  getSiteClassificationsApiItem,
  postSiteClassificationApiItem,
  getSiteClassificationApiItem,
  deleteSiteClassificationApiItem,
  putSiteClassificationApiItem,
  getUserActivitiesApiItem,
  getDocumentUserActivitiesApiItem,
  postRetryDocumentActionsApiItem
} from './helpers';

export function ApiExplorer() {
  const { user } = useAuthenticatedState();

  const sites = useMemo(() => {
    let userSite = null;
    let defaultSite = null;
    const sites: any[] = [];
    const workspaceSites: any[] = [];
    if (user && user.sites) {
      user.sites.forEach((site: any) => {
        if (site.siteId === user.email) {
          userSite = site;
        } else if (site.siteId === 'default') {
          defaultSite = site;
        } else {
          workspaceSites.push(site);
        }
      });
    }
    if (defaultSite) {
      sites.push(defaultSite);
    }
    if (userSite) {
      sites.push(userSite);
    }
    return sites.concat(workspaceSites);
  }, [user]);

  return (
    <>
      <Helmet>
        <title>API Explorer</title>
      </Helmet>
      <div className="p-4 flex w-full flex-col lg:flex-row max-w-screen-xl">
        <div className="w-full inline-block">
          <ApiSegment title="Documents & Folders">
            <div className="ml-2 mb-4 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem apiItem={getDocumentsApiItem} sites={sites} />
                <ApiItem apiItem={postDocumentsApiItem} sites={sites} />
                <ApiItem apiItem={getDocumentApiItem} sites={sites} />
                <ApiItem apiItem={patchDocumentApiItem} sites={sites} />
                <ApiItem apiItem={deleteDocumentApiItem} sites={sites} />
                <ApiItem apiItem={getDocumentContentApiItem} sites={sites} />
                <ApiItem apiItem={getDocumentUrlApiItem} sites={sites} />
                <ApiSegment title="Public Document Endpoints">
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem
                        apiItem={postDocumentsPublicApiItem}
                        sites={sites}
                      />
                    </div>
                  </div>
                </ApiSegment>
                <ApiSegment title="Folders">
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem apiItem={getFoldersApiItem} sites={sites} />
                      <ApiItem apiItem={postFoldersApiItem} sites={sites} />
                      <ApiItem apiItem={moveDocumentApiItem} sites={sites} />
                      <ApiItem apiItem={deleteFolderApiItem} sites={sites} />
                      <ApiItem
                        apiItem={deleteFolderDeprecatedApiItem}
                        sites={sites}
                      />
                    </div>
                  </div>
                </ApiSegment>
                <ApiSegment title="Document Actions">
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem
                        apiItem={getDocumentActionsApiItem}
                        sites={sites}
                      />
                      <ApiItem
                        apiItem={postDocumentActionsApiItem}
                        sites={sites}
                      />
                      <ApiItem
                        apiItem={postRetryDocumentActionsApiItem}
                        sites={sites}
                      />
                    </div>
                  </div>
                </ApiSegment>
                <ApiSegment
                  title={
                    <div className="uppercase font-semibold text-base">
                      Document Antivirus
                      <small className="block">(and Anti-Malware)</small>
                    </div>
                  }
                >
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem
                        apiItem={putDocumentAntivirusApiItem}
                        sites={sites}
                      />
                    </div>
                  </div>
                </ApiSegment>
                <ApiSegment title="Document Compress">
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem
                        apiItem={postDocumentCompressApiItem}
                        sites={sites}
                      />
                    </div>
                  </div>
                </ApiSegment>
                <ApiSegment
                  title={
                    <div className="uppercase font-semibold text-base">
                      Document OCR{' '}
                      <small className="block text-sm">
                        (Optical Character Recognition)
                      </small>
                    </div>
                  }
                >
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem apiItem={getDocumentOcrApiItem} sites={sites} />
                      <ApiItem apiItem={postDocumentOcrApiItem} sites={sites} />
                      <ApiItem apiItem={putDocumentOcrApiItem} sites={sites} />
                      <ApiItem
                        apiItem={deleteDocumentOcrApiItem}
                        sites={sites}
                      />
                    </div>
                  </div>
                </ApiSegment>
                <ApiSegment title="Document Syncs">
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem
                        apiItem={getDocumentSyncsApiItem}
                        sites={sites}
                      />
                    </div>
                  </div>
                </ApiSegment>
                <ApiSegment title="Document Search">
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem
                        apiItem={searchDocumentQueryApiItem}
                        sites={sites}
                      />
                      <ApiItem apiItem={postSearchIndices} sites={sites} />
                    </div>
                  </div>
                </ApiSegment>
                <ApiSegment title="Document Fulltext Search">
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem apiItem={documentFulltextSearch} sites={sites} />
                      <ApiItem apiItem={fulltextQueryApiItem} sites={sites} />
                      <ApiItem
                        apiItem={getDocumentFulltextApiItem}
                        sites={sites}
                      />
                      <ApiItem
                        apiItem={putDocumentFulltextApiItem}
                        sites={sites}
                      />
                      <ApiItem
                        apiItem={patchDocumentFulltextApiItem}
                        sites={sites}
                      />
                      <ApiItem
                        apiItem={deleteDocumentFulltextApiItem}
                        sites={sites}
                      />
                    </div>
                  </div>
                </ApiSegment>
                <ApiSegment title="Document Tags">
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem apiItem={getDocumentTagsApiItem} sites={sites} />
                      <ApiItem
                        apiItem={documentsDocumentIdTagsPost}
                        sites={sites}
                      />
                      <ApiItem
                        apiItem={documentsDocumentIdTagsTagKeyGet}
                        sites={sites}
                      />
                      <ApiItem apiItem={putDocumentTagApiItem} sites={sites} />
                      <ApiItem
                        apiItem={documentsDocumentIdTagsTagKeyDelete}
                        sites={sites}
                      />
                      <ApiItem
                        apiItem={deleteDocumentTagValueApiItem}
                        sites={sites}
                      />
                      <ApiItem
                        apiItem={deleteDocumentFulltextTagApiItem}
                        sites={sites}
                      />
                      <ApiItem
                        apiItem={deleteDocumentFulltextTagValueApiItem}
                        sites={sites}
                      />
                      <ApiItem
                        apiItem={documentsTagsPatchApiItem}
                        sites={sites}
                      />
                    </div>
                  </div>
                </ApiSegment>
                <ApiSegment title="Document Access Attributes">
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem
                        apiItem={getDocumentAccessAttributesApiItem}
                        sites={sites}
                      />
                      <ApiItem
                        apiItem={postDocumentAccessAttributesApiItem}
                        sites={sites}
                      />
                      <ApiItem
                        apiItem={putDocumentAccessAttributesApiItem}
                        sites={sites}
                      />
                      <ApiItem
                        apiItem={deleteDocumentAccessAttributesApiItem}
                        sites={sites}
                      />
                    </div>
                  </div>
                </ApiSegment>
                <ApiSegment title="Document Upload">
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem
                        apiItem={getNewDocumentUploadApiItem}
                        sites={sites}
                      />
                      <ApiItem
                        apiItem={postWithBodyForNewDocumentUploadApiItem}
                        sites={sites}
                      />
                      <ApiItem
                        apiItem={getDocumentReplaceUploadApiItem}
                        sites={sites}
                      />
                    </div>
                  </div>
                </ApiSegment>
                <ApiSegment title="Document Versions">
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem
                        apiItem={getDocumentVersionsApiItem}
                        sites={sites}
                      />
                      <ApiItem
                        apiItem={putDocumentVersionApiItem}
                        sites={sites}
                      />
                      <ApiItem
                        apiItem={deleteDocumentVersionApiItem}
                        sites={sites}
                      />
                    </div>
                  </div>
                </ApiSegment>
                <ApiSegment title="Document Attributes">
                    <div className="ml-2 flex flex-cols">
                        <div className="w-4 border-l"></div>
                        <div className="grow">
                            <ApiItem apiItem={getDocumentAttributesApiItem} sites={sites} />
                            <ApiItem apiItem={postDocumentAttributesApiItem} sites={sites} />
                            <ApiItem apiItem={putDocumentAttributesApiItem} sites={sites} />
                            <ApiItem apiItem={getDocumentAttributeApiItem} sites={sites} />
                            <ApiItem apiItem={putDocumentAttributeApiItem} sites={sites} />
                            <ApiItem apiItem={deleteDocumentAttributeApiItem} sites={sites} />
                            <ApiItem apiItem={deleteDocumentAttributeValueApiItem} sites={sites} />
                        </div>
                    </div>
                </ApiSegment>
              </div>
            </div>
          </ApiSegment>
          <ApiSegment title="Shares">
            <div className="ml-2 mb-4 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem apiItem={getSharesApiItem} sites={sites} />
                <ApiItem apiItem={postShareFolderApiItem} sites={sites} />
                <ApiItem apiItem={deleteShareApiItem} sites={sites} />
              </div>
            </div>
          </ApiSegment>
          <ApiSegment title="Sites">
            <div className="ml-2 mb-4 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem apiItem={getSitesApiItem} sites={sites} />
              </div>
            </div>
          </ApiSegment>
          <ApiSegment title="Schemas">
            <div className="ml-2 mb-4 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem apiItem={getSiteSchemaApiItem} sites={sites} />
                <ApiItem apiItem={putSiteSchemaApiItem} sites={sites} />
                <ApiItem apiItem={getSiteClassificationsApiItem} sites={sites} />
                <ApiItem apiItem={postSiteClassificationApiItem} sites={sites} />
                <ApiItem apiItem={getSiteClassificationApiItem} sites={sites} />
                <ApiItem apiItem={deleteSiteClassificationApiItem} sites={sites} />
                <ApiItem apiItem={putSiteClassificationApiItem} sites={sites} />
              </div>
            </div>
          </ApiSegment>
          <ApiSegment title="Webhooks">
            <div className="ml-2 mb-4 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem apiItem={getWebhooksApiItem} sites={sites} />
                <ApiItem apiItem={postWebhooksApiItem} sites={sites} />
                <ApiItem apiItem={getWebhookApiItem} sites={sites} />
                <ApiItem apiItem={patchWebhookApiItem} sites={sites} />
                <ApiItem apiItem={deleteWebhookApiItem} sites={sites} />
                <ApiItem apiItem={getWebhookTagsApiItem} sites={sites} />
                <ApiItem apiItem={postWebhookTagsApiItem} sites={sites} />
                <ApiItem apiItem={postPrivateWebhooksApiItem} sites={sites} />
                <ApiSegment title="Public Webhook Endpoints">
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem
                        apiItem={postPublicWebhooksApiItem}
                        sites={sites}
                      />
                    </div>
                  </div>
                </ApiSegment>
              </div>
            </div>
          </ApiSegment>
          <ApiSegment title="Rulesets">
            <div className="ml-2 mb-4 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem apiItem={getRulesetsApiItem} sites={sites} />
                <ApiItem apiItem={postRulesetsApiItem} sites={sites} />
                <ApiItem apiItem={getRulesetApiItem} sites={sites} />
                <ApiItem apiItem={patchRulesetApiItem} sites={sites} />
                <ApiItem apiItem={deleteRulesetApiItem} sites={sites} />
                <ApiItem apiItem={getRulesApiItem} sites={sites} />
                <ApiItem apiItem={postRuleApiItem} sites={sites} />
                <ApiItem apiItem={getRuleApiItem} sites={sites} />
                <ApiItem apiItem={patchRuleApiItem} sites={sites} />
                <ApiItem apiItem={deleteRuleApiItem} sites={sites} />
              </div>
            </div>
          </ApiSegment>
          <ApiSegment title="Workflows and Queues">
            <div className="ml-2 mb-4 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem apiItem={getWorkflowsApiItem} sites={sites} />
                <ApiItem apiItem={postWorkflowsApiItem} sites={sites} />
                <ApiItem apiItem={getWorkflowApiItem} sites={sites} />
                <ApiItem apiItem={putWorkflowsApiItem} sites={sites} />
                <ApiItem apiItem={deleteWorkflowApiItem} sites={sites} />
                <ApiItem apiItem={postDocumentWorkflowApiItem} sites={sites} />
                <ApiItem
                  apiItem={getDocumentsInWorkflowApiItem}
                  sites={sites}
                />
                <ApiItem apiItem={getQueuesApiItem} sites={sites} />
                <ApiItem apiItem={postQueuesApiItem} sites={sites} />
                <ApiItem apiItem={getQueueApiItem} sites={sites} />
                <ApiItem apiItem={deleteQueueApiItem} sites={sites} />
                <ApiItem apiItem={getDocumentsInQueueApiItem} sites={sites} />
                <ApiItem
                  apiItem={getWorkflowsInDocumentApiItem}
                  sites={sites}
                />
                <ApiItem
                  apiItem={getWorkflowByIdInDocumentApiItem}
                  sites={sites}
                />
                <ApiItem
                  apiItem={postDocumentWorkflowDecisionsApiItem}
                  sites={sites}
                />
              </div>
            </div>
          </ApiSegment>
          <ApiSegment title="Configuration">
            <div className="ml-2 mb-4 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem apiItem={getConfigurationApiItem} sites={sites} />
                <ApiItem apiItem={postConfigurationApiItem} sites={sites} />
                <ApiItem
                  apiItem={getConfigurationOpaPoliciesApiItem}
                  sites={sites}
                />
                <ApiItem
                  apiItem={getConfigurationOpaPolicyApiItem}
                  sites={sites}
                />
                <ApiItem
                  apiItem={getConfigurationOpaPolicyItemsApiItem}
                  sites={sites}
                />
                <ApiItem
                  apiItem={putConfigurationOpaPolicyApiItem}
                  sites={sites}
                />
                <ApiItem
                  apiItem={deleteConfigurationOpaPolicyApiItem}
                  sites={sites}
                />
              </div>
            </div>
          </ApiSegment>
          <ApiSegment title="API Keys">
            <div className="ml-2 mb-4 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem apiItem={getApiKeysApiItem} sites={sites} />
                <ApiItem apiItem={postApiKeysApiItem} sites={sites} />
                <ApiItem apiItem={deleteApiKeyApiItem} sites={sites} />
              </div>
            </div>
          </ApiSegment>
          <ApiSegment title="Version">
            <div className="ml-2 mb-4 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem apiItem={getVersionApiItem} sites={sites} />
              </div>
            </div>
          </ApiSegment>
          <ApiSegment title="Cases">
            <div className="ml-2 mb-4 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem apiItem={getCasesApiItem} sites={sites} />
                <ApiItem apiItem={getCaseApiItem} sites={sites} />
                <ApiItem apiItem={getCaseDocumentsApiItem} sites={sites} />
                <ApiItem apiItem={getCaseTasksApiItem} sites={sites} />
                <ApiItem apiItem={getCaseTaskDocumentsApiItem} sites={sites} />
                <ApiItem apiItem={getCaseNigosApiItem} sites={sites} />
                <ApiItem apiItem={getCaseNigoDocumentsApiItem} sites={sites} />
              </div>
            </div>
          </ApiSegment>
          <ApiSegment title="Examine Objects">
            <div className="ml-2 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem
                  apiItem={getExaminePdfUploadUrlApiItem}
                  sites={sites}
                />
                <ApiItem apiItem={getExaminePdfDetailsApiItem} sites={sites} />
              </div>
            </div>
          </ApiSegment>
          <ApiSegment title="Attributes">
              <div className="ml-2 flex flex-cols">
                  <div className="w-4 border-l"></div>
                  <div className="grow">
                      <ApiItem apiItem={getAttributesApiItem} sites={sites} />
                      <ApiItem apiItem={postAttributeApiItem} sites={sites} />
                      <ApiItem apiItem={getAttributeApiItem} sites={sites} />
                      <ApiItem apiItem={deleteAttributeApiItem} sites={sites} />
                  </div>
              </div>
          </ApiSegment>
          <ApiSegment title="User Management">
            <div className="ml-2 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem apiItem={getGroupsApiItem} sites={sites} />
                <ApiItem apiItem={postGroupApiItem} sites={sites} />
                <ApiItem apiItem={getGroupApiItem} sites={sites} />
                <ApiItem apiItem={deleteGroupApiItem} sites={sites} />
                <ApiItem apiItem={getGroupUsersApiItem} sites={sites} />
                <ApiItem apiItem={postGroupUserApiItem} sites={sites} />
                <ApiItem apiItem={deleteGroupUserApiItem} sites={sites} />
                <ApiItem apiItem={getUsersApiItem} sites={sites} />
                <ApiItem apiItem={postUserApiItem} sites={sites} />
                <ApiItem apiItem={getUserApiItem} sites={sites} />
                <ApiItem apiItem={deleteUserApiItem} sites={sites} />
                <ApiItem apiItem={getUserGroupsApiItem} sites={sites} />
                <ApiItem apiItem={putUserOperationApiItem} sites={sites} />
              </div>
            </div>
          </ApiSegment>
          <ApiSegment title="User Activities">
            <div className="ml-2 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem apiItem={getUserActivitiesApiItem} sites={sites} />
                <ApiItem apiItem={getDocumentUserActivitiesApiItem} sites={sites} />
              </div>
            </div>
          </ApiSegment>
        </div>
      </div>
    </>
  );
}

export default ApiExplorer;
