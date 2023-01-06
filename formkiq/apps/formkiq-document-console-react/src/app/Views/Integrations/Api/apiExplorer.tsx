import { Helmet } from "react-helmet-async"
import { useEffect, useState } from 'react'
import { RootState } from "../../../Store/store"
import { connect } from "react-redux"
import { ArrowRight, ArrowBottom } from '../../../Components/Icons/icons';
import ApiItem from "../../../Components/Integrations/ApiItem/apiItem"
import {
  deleteDocumentApiItem,
  documentsDocumentIdTagsPost,
  documentsDocumentIdTagsTagKeyDelete,
  documentsDocumentIdTagsTagKeyGet,
  getDocumentTagsApiItem,
  putDocumentTagApiItem,
  deleteDocumentTagValueApiItem,
  deleteDocumentFulltextTagApiItem,
  deleteDocumentFulltextTagValueApiItem,
  getDocumentApiItem,
  getDocumentsApiItem,
  patchDocumentApiItem,
  postDocumentsApiItem,
  getDocumentContentApiItem,
  postDocumentsPublicApiItem,
  getDocumentActionsApiItem,
  postDocumentActionsApiItem,
  putDocumentAntivirusApiItem,
  getDocumentOcrApiItem,
  postDocumentOcrApiItem,
  putDocumentOcrApiItem,
  deleteDocumentOcrApiItem,
  getDocumentVersionsApiItem,
  putDocumentVersionApiItem,
  getDocumentUrlApiItem,
  getNewDocumentUploadApiItem,
  postWithBodyForNewDocumentUploadApiItem,
  getDocumentReplaceUploadApiItem,
  moveDocumentApiItem,
  deleteFolderApiItem,
  deleteTagFromIndexApiItem,
  searchDocumentQueryApiItem,
  postSearchIndices,
  documentFulltextSearch,
  fulltextQueryApiItem,
  getDocumentFulltextApiItem,
  putDocumentFulltextApiItem,
  patchDocumentFulltextApiItem,
  deleteDocumentFulltextApiItem,
  getTagSchemasApiItem,
  postTagSchemasApiItem,
  getTagSchemaApiItem,
  deleteTagSchemaApiItem,
  getWebhooksApiItem,
  postWebhooksApiItem,
  getWebhookApiItem,
  patchWebhookApiItem,
  deleteWebhookApiItem,
  getWebhookTagsApiItem,
  postWebhookTagsApiItem,
  postPrivateWebhooksApiItem,
  postPublicWebhooksApiItem,
  getSitesApiItem,
  getVersionApiItem
} from './helpers';


export function ApiExplorer({ user }: any) {

  const [documentsExpanded, setDocumentsExpanded] = useState(true)
  const [documentPublicExpanded, setDocumentPublicExpanded] = useState(false)
  const [documentActionsExpanded, setDocumentActionsExpanded] = useState(false)
  const [documentAntivirusExpanded, setDocumentAntivirusExpanded] = useState(false)
  const [documentOcrExpanded, setDocumentOcrExpanded] = useState(false)
  const [documentSearchExpanded, setDocumentSearchExpanded] = useState(false)
  const [documentFulltextSearchExpanded, setDocumentFulltextSearchExpanded] = useState(false)
  const [documentTagsExpanded, setDocumentTagsExpanded] = useState(false)
  const [documentUploadExpanded, setDocumentUploadExpanded] = useState(false)
  const [documentVersionsExpanded, setDocumentVersionsExpanded] = useState(false)
  const [documentFoldersExpanded, setDocumentFoldersExpanded] = useState(false)
  const [sitesExpanded, setSitesExpanded] = useState(false)
  const [tagSchemasExpanded, setTagSchemasExpanded] = useState(false)
  const [webhooksExpanded, setWebhooksExpanded] = useState(false)
  const [webhookPublicExpanded, setWebhookPublicExpanded] = useState(false)
  const [versionExpanded, setVersionExpanded] = useState(false)
  const toggleDocumentsExpand = () => {
    setDocumentsExpanded(!documentsExpanded)
  }
  const toggleDocumentPublicExpand = () => {
    if (!documentPublicExpanded) {
      setDocumentsExpanded(true)
    }
    setDocumentPublicExpanded(!documentPublicExpanded)
  }
  const toggleDocumentActionsExpand = () => {
    if (!documentActionsExpanded) {
      setDocumentsExpanded(true)
    }
    setDocumentActionsExpanded(!documentActionsExpanded)
  }
  const toggleDocumentAntivirusExpand = () => {
    if (!documentAntivirusExpanded) {
      setDocumentsExpanded(true)
    }
    setDocumentAntivirusExpanded(!documentAntivirusExpanded)
  }
  const toggleDocumentOcrExpand = () => {
    if (!documentOcrExpanded) {
      setDocumentsExpanded(true)
    }
    setDocumentOcrExpanded(!documentOcrExpanded)
  }
  const toggleDocumentSearchExpand = () => {
    if (!documentUploadExpanded) {
      setDocumentsExpanded(true)
    }
    setDocumentSearchExpanded(!documentSearchExpanded)
  }
  const toggleDocumentFulltextSearchExpand = () => {
    if (!documentUploadExpanded) {
      setDocumentsExpanded(true)
    }
    setDocumentFulltextSearchExpanded(!documentFulltextSearchExpanded)
  }
  const toggleDocumentTagsExpand = () => {
    if (!documentTagsExpanded) {
      setDocumentsExpanded(true)
    }
    setDocumentTagsExpanded(!documentTagsExpanded)
  }
  const toggleDocumentUploadExpand = () => {
    if (!documentUploadExpanded) {
      setDocumentsExpanded(true)
    }
    setDocumentUploadExpanded(!documentUploadExpanded)
  }
  const toggleDocumentVersionsExpand = () => {
    if (!documentVersionsExpanded) {
      setDocumentsExpanded(true)
    }
    setDocumentVersionsExpanded(!documentVersionsExpanded)
  }
  const toggleDocumentFoldersExpand = () => {
    if (!documentFoldersExpanded) {
      setDocumentsExpanded(true)
    }
    setDocumentFoldersExpanded(!documentFoldersExpanded)
  } 
  const toggleSitesExpand = () => {
    setSitesExpanded(!sitesExpanded)
  }
  const toggleTagSchemasExpand = () => {
    setTagSchemasExpanded(!tagSchemasExpanded)
  }
  const toggleWebhooksExpand = () => {
    setWebhooksExpanded(!webhooksExpanded)
  }
  const toggleWebhookPublicExpand = () => {
    if (!webhookPublicExpanded) {
      setWebhooksExpanded(true)
    }
    setWebhookPublicExpanded(!webhookPublicExpanded)
  }
  const toggleVersionExpand = () => {
    setVersionExpanded(!versionExpanded)
  }

  let userSite = null
  let defaultSite = null
  let sites: any[] = []
  const sharedFolderSites: any[] = []
  if (user && user.sites) {
    user.sites.forEach((site: any) => {
      if (site.siteId === user.email) {
        userSite = site
      } else if (site.siteId === 'default') {
        defaultSite = site
      } else {
        sharedFolderSites.push(site)
      }
    })
  }
  if (defaultSite) {
    sites.push(defaultSite)
  }
  if (userSite) {
    sites.push(userSite)
  }
  sites = sites.concat(sharedFolderSites)

  return (
    <>
      <Helmet>
        <title>API Explorer</title>
      </Helmet>
      <div className="flex w-full flex-col lg:flex-row max-w-screen-xl">
        <div className="w-full inline-block">
          <div
            className="w-full flex self-start text-gray-400 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap py-4 cursor-pointer"
            onClick={toggleDocumentsExpand}
            >
            <div className="flex justify-end mt-3 mr-1">
              { documentsExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
            </div>
            <div className="uppercase font-semibold text-base">
              Documents & Folders
            </div>
          </div>
          { documentsExpanded && (
            <div className="ml-2 mb-4 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem apiItem={getDocumentsApiItem} sites={sites}></ApiItem>
                <ApiItem apiItem={postDocumentsApiItem} sites={sites}></ApiItem>
                <ApiItem apiItem={getDocumentApiItem} sites={sites}></ApiItem>
                <ApiItem apiItem={patchDocumentApiItem} sites={sites}></ApiItem>
                <ApiItem apiItem={deleteDocumentApiItem} sites={sites}></ApiItem>
                <ApiItem apiItem={getDocumentContentApiItem} sites={sites}></ApiItem>
                <ApiItem apiItem={getDocumentUrlApiItem} sites={sites}></ApiItem>
                <div
                  className="w-full flex self-start text-gray-400 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap pb-2 cursor-pointer"
                  onClick={toggleDocumentPublicExpand}
                  >
                  <div className="flex justify-end mt-3 mr-1">
                    { documentPublicExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
                  </div>
                  <div className="uppercase font-semibold text-base">
                    Public Document Endpoints
                  </div>
                </div>
                { documentPublicExpanded && (
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem apiItem={postDocumentsPublicApiItem} sites={sites}></ApiItem>
                    </div>
                  </div>
                )}
                <div
                  className="w-full flex self-start text-gray-400 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap pb-2 cursor-pointer"
                  onClick={toggleDocumentActionsExpand}
                  >
                  <div className="flex justify-end mt-3 mr-1">
                    { documentActionsExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
                  </div>
                  <div className="uppercase font-semibold text-base">
                    Document Actions
                  </div>
                </div>
                { documentActionsExpanded && (
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem apiItem={getDocumentActionsApiItem} sites={sites}></ApiItem>
                      <ApiItem apiItem={postDocumentActionsApiItem} sites={sites}></ApiItem>
                    </div>
                  </div>
                )}
                <div
                  className="w-full flex self-start text-gray-400 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap pb-2 cursor-pointer"
                  onClick={toggleDocumentAntivirusExpand}
                  >
                  <div className="flex justify-end mt-3 mr-1">
                    { documentAntivirusExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
                  </div>
                  <div className="uppercase font-semibold text-base">
                    Document Antivirus
                    <small className="block">
                      (and Anti-Malware)
                    </small>
                  </div>
                </div>
                { documentAntivirusExpanded && (
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem apiItem={putDocumentAntivirusApiItem} sites={sites}></ApiItem>
                    </div>
                  </div>
                )}
                <div
                  className="w-full flex self-start text-gray-400 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap pb-2 cursor-pointer"
                  onClick={toggleDocumentOcrExpand}
                  >
                  <div className="flex justify-end mt-3 mr-1">
                    { documentOcrExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
                  </div>
                  <div className="uppercase font-semibold text-base">
                    Document OCR <small className="block text-sm">(Optical Character Recognition)</small>
                  </div>
                </div>
                { documentOcrExpanded && (
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem apiItem={getDocumentOcrApiItem} sites={sites}></ApiItem>
                      <ApiItem apiItem={postDocumentOcrApiItem} sites={sites}></ApiItem>
                      <ApiItem apiItem={putDocumentOcrApiItem} sites={sites}></ApiItem>
                      <ApiItem apiItem={deleteDocumentOcrApiItem} sites={sites}></ApiItem>
                    </div>
                  </div>
                )}
                <div
                  className="w-full flex self-start text-gray-400 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap pb-2 cursor-pointer"
                  onClick={toggleDocumentSearchExpand}
                  >
                  <div className="flex justify-end mt-3 mr-1">
                    { documentSearchExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
                  </div>
                  <div className="uppercase font-semibold text-base">
                    Document Search
                  </div>
                </div>
                { documentSearchExpanded && (
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem apiItem={searchDocumentQueryApiItem} sites={sites}></ApiItem>
                      <ApiItem apiItem={postSearchIndices} sites={sites}></ApiItem>
                    </div>
                  </div>
                )}
                <div
                  className="w-full flex self-start text-gray-400 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap pb-2 cursor-pointer"
                  onClick={toggleDocumentFulltextSearchExpand}
                  >
                  <div className="flex justify-end mt-3 mr-1">
                    { documentFulltextSearchExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
                  </div>
                  <div className="uppercase font-semibold text-base">
                    Document Fulltext Search
                  </div>
                </div>
                { documentFulltextSearchExpanded && (
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem apiItem={documentFulltextSearch} sites={sites}></ApiItem>
                      <ApiItem apiItem={fulltextQueryApiItem} sites={sites}></ApiItem>
                      <ApiItem apiItem={getDocumentFulltextApiItem} sites={sites}></ApiItem>
                      <ApiItem apiItem={putDocumentFulltextApiItem} sites={sites}></ApiItem>
                      <ApiItem apiItem={patchDocumentFulltextApiItem} sites={sites}></ApiItem>
                      <ApiItem apiItem={deleteDocumentFulltextApiItem} sites={sites}></ApiItem>
                    </div>
                  </div>
                )}
                <div
                  className="w-full flex self-start text-gray-400 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap pb-2 cursor-pointer"
                  onClick={toggleDocumentTagsExpand}
                  >
                  <div className="flex justify-end mt-3 mr-1">
                    { documentTagsExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
                  </div>
                  <div className="uppercase font-semibold text-base">
                    Document Tags
                  </div>
                </div>
                { documentTagsExpanded && (
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem apiItem={getDocumentTagsApiItem} sites={sites}></ApiItem>
                      <ApiItem apiItem={documentsDocumentIdTagsPost} sites={sites}></ApiItem>
                      <ApiItem apiItem={documentsDocumentIdTagsTagKeyGet} sites={sites}></ApiItem>
                      <ApiItem apiItem={putDocumentTagApiItem} sites={sites}></ApiItem>
                      <ApiItem apiItem={documentsDocumentIdTagsTagKeyDelete} sites={sites}></ApiItem>
                      <ApiItem apiItem={deleteDocumentTagValueApiItem} sites={sites}></ApiItem>
                      <ApiItem apiItem={deleteDocumentFulltextTagApiItem} sites={sites}></ApiItem>
                      <ApiItem apiItem={deleteDocumentFulltextTagValueApiItem} sites={sites}></ApiItem>
                    </div>
                  </div>
                )}
                <div
                  className="w-full flex self-start text-gray-400 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap pb-2 cursor-pointer"
                  onClick={toggleDocumentUploadExpand}
                  >
                  <div className="flex justify-end mt-3 mr-1">
                    { documentUploadExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
                  </div>
                  <div className="uppercase font-semibold text-base">
                    Document Upload
                  </div>
                </div>
                { documentUploadExpanded && (
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem apiItem={getNewDocumentUploadApiItem} sites={sites}></ApiItem>
                      <ApiItem apiItem={postWithBodyForNewDocumentUploadApiItem} sites={sites}></ApiItem>
                      <ApiItem apiItem={getDocumentReplaceUploadApiItem} sites={sites}></ApiItem>
                    </div>
                  </div>
                )}
                <div
                  className="w-full flex self-start text-gray-400 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap pb-2 cursor-pointer"
                  onClick={toggleDocumentVersionsExpand}
                  >
                  <div className="flex justify-end mt-3 mr-1">
                    { documentVersionsExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
                  </div>
                  <div className="uppercase font-semibold text-base">
                    Document Versions
                  </div>
                </div>
                { documentVersionsExpanded && (
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem apiItem={getDocumentVersionsApiItem} sites={sites}></ApiItem>
                      <ApiItem apiItem={putDocumentVersionApiItem} sites={sites}></ApiItem>
                    </div>
                  </div>
                )}
                <div
                  className="w-full flex self-start text-gray-400 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap pb-2 cursor-pointer"
                  onClick={toggleDocumentFoldersExpand}
                  >
                  <div className="flex justify-end mt-3 mr-1">
                    { documentFoldersExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
                  </div>
                  <div className="uppercase font-semibold text-base">
                    Folders
                  </div>
                </div>
                { documentFoldersExpanded && (
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem apiItem={moveDocumentApiItem} sites={sites}></ApiItem>
                      <ApiItem apiItem={deleteFolderApiItem} sites={sites}></ApiItem>
                      {/*<ApiItem apiItem={deleteTagFromIndexApiItem} sites={sites}></ApiItem>*/}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div
            className="w-full flex self-start text-gray-400 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap py-4 cursor-pointer"
            onClick={toggleSitesExpand}
            >
            <div className="flex justify-end mt-3 mr-1">
              { sitesExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
            </div>
            <div className="uppercase font-semibold text-base">
              Sites
            </div>
          </div>
          { sitesExpanded && (
            <div className="ml-2 mb-4 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem apiItem={getSitesApiItem} sites={sites}></ApiItem>
              </div>
            </div>
          )}
          <div
            className="w-full flex self-start text-gray-400 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap py-4 cursor-pointer"
            onClick={toggleTagSchemasExpand}
            >
            <div className="flex justify-end mt-3 mr-1">
              { tagSchemasExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
            </div>
            <div className="uppercase font-semibold text-base">
              Tag Schemas
            </div>
          </div>
          { tagSchemasExpanded && (
            <div className="ml-2 mb-4 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem apiItem={getTagSchemasApiItem} sites={sites}></ApiItem>
                <ApiItem apiItem={postTagSchemasApiItem} sites={sites}></ApiItem>
                <ApiItem apiItem={getTagSchemaApiItem} sites={sites}></ApiItem>
                <ApiItem apiItem={deleteTagSchemaApiItem} sites={sites}></ApiItem>
              </div>
            </div>
          )}
          <div
            className="w-full flex self-start text-gray-400 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap py-4 cursor-pointer"
            onClick={toggleWebhooksExpand}
            >
            <div className="flex justify-end mt-3 mr-1">
              { webhooksExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
            </div>
            <div className="uppercase font-semibold text-base">
              Webhooks
            </div>
          </div>
          { webhooksExpanded && (
            <div className="ml-2 mb-4 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem apiItem={getWebhooksApiItem} sites={sites}></ApiItem>
                <ApiItem apiItem={postWebhooksApiItem} sites={sites}></ApiItem>
                <ApiItem apiItem={getWebhookApiItem} sites={sites}></ApiItem>
                <ApiItem apiItem={patchWebhookApiItem} sites={sites}></ApiItem>
                <ApiItem apiItem={deleteWebhookApiItem} sites={sites}></ApiItem>
                <ApiItem apiItem={getWebhookTagsApiItem} sites={sites}></ApiItem>
                <ApiItem apiItem={postWebhookTagsApiItem} sites={sites}></ApiItem>
                <ApiItem apiItem={postPrivateWebhooksApiItem} sites={sites}></ApiItem>
                <div
                  className="w-full flex self-start text-gray-400 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap pb-2 cursor-pointer"
                  onClick={toggleWebhookPublicExpand}
                  >
                  <div className="flex justify-end mt-3 mr-1">
                    { webhookPublicExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
                  </div>
                  <div className="uppercase font-semibold text-base">
                    Public Webhook Endpoints
                  </div>
                </div>
                { webhookPublicExpanded && (
                  <div className="ml-2 flex flex-cols">
                    <div className="w-4 border-l"></div>
                    <div className="grow">
                      <ApiItem apiItem={postPublicWebhooksApiItem} sites={sites}></ApiItem>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div
            className="w-full flex self-start text-gray-400 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap py-4 cursor-pointer"
            onClick={toggleVersionExpand}
            >
            <div className="flex justify-end mt-3 mr-1">
              { versionExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
            </div>
            <div className="uppercase font-semibold text-base">
              Version
            </div>
          </div>
          { versionExpanded && (
            <div className="ml-2 mb-4 flex flex-cols">
              <div className="w-4 border-l"></div>
              <div className="grow">
                <ApiItem apiItem={getVersionApiItem} sites={sites}></ApiItem>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


const mapStateToProps = (state: RootState) => {
  return { user: state.authReducer?.user }
};

export default connect(mapStateToProps)(ApiExplorer as any);
  