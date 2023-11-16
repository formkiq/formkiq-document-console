import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import ApiItem from '../../../Components/Integrations/ApiItem/apiItem';
import { useAuthenticatedState } from '../../../Store/reducers/auth';
import { ApiSegment } from './api-segment';
import {
  deleteApiKeyApiItem,
  deleteDocumentApiItem,
  deleteDocumentFulltextApiItem,
  deleteDocumentFulltextTagApiItem,
  deleteDocumentFulltextTagValueApiItem,
  deleteDocumentOcrApiItem,
  deleteDocumentTagValueApiItem,
  deleteDocumentVersionApiItem,
  deleteFolderApiItem,
  deleteFolderDeprecatedApiItem,
  deleteShareApiItem,
  deleteTagSchemaApiItem,
  deleteWebhookApiItem,
  deleteWorkflowApiItem,
  documentFulltextSearch,
  documentsDocumentIdTagsPost,
  documentsDocumentIdTagsTagKeyDelete,
  documentsDocumentIdTagsTagKeyGet,
  documentsTagsPatchApiItem,
  fulltextQueryApiItem,
  getApiKeysApiItem,
  getConfigurationApiItem,
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
  getFoldersApiItem,
  getNewDocumentUploadApiItem,
  getQueuesApiItem,
  getSharesApiItem,
  getSitesApiItem,
  getTagSchemaApiItem,
  getTagSchemasApiItem,
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
  patchWebhookApiItem,
  postApiKeysApiItem,
  postConfigurationApiItem,
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
  postSearchIndices,
  postShareFolderApiItem,
  postTagSchemasApiItem,
  postWebhookTagsApiItem,
  postWebhooksApiItem,
  postWithBodyForNewDocumentUploadApiItem,
  postWorkflowsApiItem,
  putDocumentAntivirusApiItem,
  putDocumentFulltextApiItem,
  putDocumentOcrApiItem,
  putDocumentTagApiItem,
  putDocumentVersionApiItem,
  putWorkflowsApiItem,
  searchDocumentQueryApiItem,
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
          <ApiSegment title="Tag Schemas">
            <div className="ml-2 mb-4 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem apiItem={getTagSchemasApiItem} sites={sites} />
                <ApiItem apiItem={postTagSchemasApiItem} sites={sites} />
                <ApiItem apiItem={getTagSchemaApiItem} sites={sites} />
                <ApiItem apiItem={deleteTagSchemaApiItem} sites={sites} />
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
                <ApiItem apiItem={getQueuesApiItem} sites={sites} />
                <ApiItem apiItem={postQueuesApiItem} sites={sites} />
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
        </div>
      </div>
    </>
  );
}

export default ApiExplorer;
