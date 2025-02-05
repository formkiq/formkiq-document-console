import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TextFileEditor from '../../Components/DocumentsAndFolders/TextFileEditor/textFileEditor';
import { Spinner } from '../../Components/Icons/icons';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import { ConfigState } from '../../Store/reducers/config';
import {
  setCurrentDocument,
  setCurrentDocumentPath,
} from '../../Store/reducers/data';
import { useAppDispatch } from '../../Store/store';
import {
  InlineEditableContentTypes,
  InlineViewableContentTypes,
  OnlyOfficeContentTypes,
  TextFileEditorEditableContentTypes,
  TextFileEditorViewableContentTypes,
} from '../../helpers/constants/contentTypes';
import { DocumentsService } from '../../helpers/services/documentsService';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import { IDocument } from '../../helpers/types/document';

interface CSVRow {
  [key: string]: string;
}

/**
 * Helper function to extract the filename from the URL’s
 * response-content-disposition parameter.
 */
function extractFilenameFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const disposition = urlObj.searchParams.get('response-content-disposition');
    if (disposition) {
      // Example: "inline; filename*=UTF-8''formkiq-advanced-wordmark-transparent.png"
      const matches = disposition.match(
        /filename\*?=['"]?(?:UTF-8'')?([^;'" ]+)/i
      );
      if (matches && matches[1]) {
        return decodeURIComponent(matches[1]);
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to parse URL:', error);
    return null;
  }
}

export function DocumentView() {
  const { id } = useParams();
  const versionKey = new URLSearchParams(useLocation().search).get(
    'versionKey'
  );
  const { user } = useAuthenticatedState();

  const { formkiqVersion } = useSelector(ConfigState);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites } =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const {
    siteId,
    siteRedirectUrl,
    siteDocumentsRootUri,
    siteDocumentsRootName,
  } = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );
  if (siteRedirectUrl.length) {
    navigate(
      {
        pathname: `${siteRedirectUrl}/${id}/view`,
      },
      { replace: true }
    );
  }
  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const [currentDocumentsRootUri, setCurrentDocumentsRootUri] =
    useState(siteDocumentsRootUri);
  const [currentDocumentsRootName, setCurrentDocumentsRootName] = useState(
    siteDocumentsRootName
  );
  const [isCurrentSiteReadonly, setIsCurrentSiteReadonly] =
    useState<boolean>(true);

  const [mode, setMode] = useState(getModeFromPath());
  const isDocumentContentTypeEditable = (contentType: string) =>
    TextFileEditorEditableContentTypes.indexOf(contentType) > -1 ||
    InlineEditableContentTypes.indexOf(contentType) > -1;

  function getModeFromPath() {
    const mode = pathname.split('/').pop();
    return mode === 'view' || mode === 'edit' ? mode : 'view';
  }

  const customParse = (csvText: string): CSVRow[] => {
    const lines = csvText.split('\n').filter((line) => line.trim() !== '');
    const headers = parseCSVLine(lines[0]);
    return lines.slice(1).map((line) => {
      const values = parseCSVLine(line);
      const row: CSVRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const handleTextContent = (content: string) => {
    try {
      let decodedString;
      try {
        const decoded = atob(content);
        const bytes = new Uint8Array(decoded.length);
        for (let i = 0; i < decoded.length; i++) {
          bytes[i] = decoded.charCodeAt(i);
        }
        decodedString = new TextDecoder('utf-8').decode(bytes);
      } catch (e) {
        decodedString = content;
      }
      const parser = new DOMParser();
      let decodedContent =
        parser.parseFromString(
          `<!doctype html><body>${decodedString}`,
          'text/html'
        ).body.textContent || '';
      decodedContent = decodedContent.replace(/^\uFEFF/, '');
      decodedContent = decodedContent
        .replace(/Ã„/g, 'Ä')
        .replace(/â€ž/g, '"')
        .replace(/â€œ/g, '"');
      return decodedContent;
    } catch (error) {
      console.error('Error processing text content:', error);
      return content;
    }
  };

  useEffect(() => {
    if (id) {
      let ooConfig: any;
      const handleScript = (e: any) => {
        if (e.type === 'load') {
          const script = window.document.querySelector(`script[id="ooScript"]`);
          (window as any).DocsAPI.DocEditor('onlyofficeContainer', ooConfig);
        }
      };
      DocumentsService.getDocumentById(id, currentSiteId).then(
        (response: IDocument) => {
          setViewDocument(response);
          dispatch(setCurrentDocument(response));
          dispatch(setCurrentDocumentPath(response.path));
          // redirect if file is not editable type
          if (
            !isDocumentContentTypeEditable(response.contentType) &&
            mode === 'edit'
          ) {
            navigate(pathname.replace(/\/edit$/, '/view'));
          }
          if (
            formkiqVersion.modules?.indexOf('onlyoffice') > -1 &&
            OnlyOfficeContentTypes.indexOf(response.contentType) > -1
          ) {
            DocumentsService.editDocumentWithOnlyoffice(id, currentSiteId).then(
              (onlyofficeResponse: any) => {
                setOOConfig(onlyofficeResponse.config);
                ooConfig = onlyofficeResponse.config;
                const script = window.document.createElement('script');
                (script as HTMLScriptElement).type = 'application/javascript';
                (script as HTMLScriptElement).id = 'ooScript';
                (script as HTMLScriptElement).src =
                  onlyofficeResponse.onlyOfficeUrl +
                  '/web-apps/apps/api/documents/api.js';
                (script as HTMLScriptElement).async = false;
                window.document.body.appendChild(script);
                script.addEventListener('load', handleScript);
              }
            );
          } else if (
            InlineViewableContentTypes.indexOf(response.contentType) > -1
          ) {
            let viewVersionKey =
              versionKey && versionKey.length ? versionKey : '';
            // Check if it's a text file
            const isTextFile = response.contentType.startsWith('text/');
            if (isTextFile) {
              DocumentsService.getDocumentContent(
                currentSiteId,
                id,
                viewVersionKey,
                true
              ).then((contentResponse: any) => {
                const processedContent = handleTextContent(
                  contentResponse.content
                );
                const blob = new Blob([processedContent], {
                  type: `${response.contentType};charset=utf-8`,
                });
                const url = URL.createObjectURL(blob);
                setBlobUrl(url);
                setDocumentContent(url);
              });
            } else {
              DocumentsService.getDocumentUrl(
                id,
                currentSiteId,
                viewVersionKey
              ).then((urlResponse: any) => {
                setDocumentContent(urlResponse.url);
              });
            }
          } else if (response.deepLinkPath && response.deepLinkPath.length) {
            const deepLinkPath = response.deepLinkPath;
            if (deepLinkPath.startsWith('s3://')) {
              let viewVersionKey =
                versionKey && versionKey.length ? versionKey : '';
              DocumentsService.getDocumentUrl(
                id,
                currentSiteId,
                viewVersionKey,
                true
              )
                .then((urlResponse: any) => {
                  const url = urlResponse.url;
                  // If contentType is missing or not an image, try to extract filename from URL
                  if (
                    !response.contentType ||
                    !response.contentType.startsWith('image/')
                  ) {
                    const filename = extractFilenameFromUrl(url);
                    if (filename) {
                      const imageMatch = filename.match(
                        /\.(png|jpe?g|gif|bmp)$/i
                      );
                      if (imageMatch) {
                        setViewDocument({
                          ...response,
                          contentType: `image/${
                            imageMatch[1].toLowerCase() === 'jpg'
                              ? 'jpeg'
                              : imageMatch[1].toLowerCase()
                          }`,
                        });
                      }
                    }
                  }
                  setDocumentContent(url);
                })
                .catch((error: any) => {
                  console.error('Error retrieving S3 document URL:', error);
                });
            } else {
              setDocumentContent(deepLinkPath);
            }
          } else if (response.contentType === 'text/csv') {
            let viewVersionKey =
              versionKey && versionKey.length ? versionKey : '';
            DocumentsService.getDocumentContent(
              currentSiteId,
              id,
              viewVersionKey
            ).then((contentResponse: any) => {
              try {
                setDocumentCsvContent(customParse(contentResponse.content));
              } catch (error: any) {
                setDocumentCsvContent([]);
              }
            });
          } else if (
            TextFileEditorViewableContentTypes.indexOf(response.contentType) >
            -1
          ) {
            let viewVersionKey =
              versionKey && versionKey.length ? versionKey : '';
            DocumentsService.getDocumentContent(
              currentSiteId,
              id,
              viewVersionKey,
              true
            ).then((res: any) => {
              if (res.content) {
                setDocumentContent(res.content);
              }
            });
          } else {
            let viewVersionKey =
              versionKey && versionKey.length ? versionKey : '';
            DocumentsService.getDocumentUrl(
              id,
              currentSiteId,
              viewVersionKey,
              false
            ).then((urlResponse: any) => {
              const a = window.document.createElement('a');
              a.style.display = 'none';
              a.href = urlResponse.url;
              a.download = response.path.substring(
                response.path.lastIndexOf('/') + 1
              );
              window.document.body.appendChild(a);
              a.click();
              a.remove();
              window.URL.revokeObjectURL(urlResponse.url);
              const url =
                currentDocumentsRootUri +
                '/folders/' +
                response.path.substring(0, response.path.lastIndexOf('/')) +
                '#id=' +
                id;
              setTimeout(() => {
                navigate(url);
              }, 200);
            });
          }
        }
      );
    }
  }, [id, versionKey]);

  useEffect(() => {
    const recheckSiteInfo = getCurrentSiteInfo(
      pathname,
      user,
      hasUserSite,
      hasDefaultSite,
      hasWorkspaces,
      workspaceSites
    );
    if (recheckSiteInfo.siteRedirectUrl.length) {
      navigate(
        {
          pathname: `${siteRedirectUrl}/${id}/view`,
        },
        { replace: true }
      );
    }
    setCurrentSiteId(recheckSiteInfo.siteId);
    setCurrentDocumentsRootUri(recheckSiteInfo.siteDocumentsRootUri);
    setCurrentDocumentsRootName(recheckSiteInfo.siteDocumentsRootName);
    setIsCurrentSiteReadonly(recheckSiteInfo.isSiteReadOnly);
    setMode(getModeFromPath());
    if (recheckSiteInfo.isSiteReadOnly && getModeFromPath() === 'edit') {
      navigate(pathname.replace(/\/edit$/, '/view'));
    }
  }, [pathname]);

  const [viewDocument, setViewDocument] = useState<IDocument | null>(null);
  const [ooConfig, setOOConfig] = useState<any | null>(null);
  const [documentContent, setDocumentContent] = useState<string | null>('');
  const [documentCsvContent, setDocumentCsvContent] = useState<CSVRow[]>([]);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // Cleanup for blob URLs
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const DocumentViewer = () => {
    // As a fallback, also check the URL extension.
    const isImageFromUrl =
      documentContent && /\.(png|jpe?g|gif|bmp)(\?|$)/i.test(documentContent);
    return (
      <div className="w-full h-full">
        {viewDocument &&
          (InlineViewableContentTypes.indexOf(viewDocument.contentType) > -1 ||
            (viewDocument.deepLinkPath &&
              viewDocument.deepLinkPath.length > 0)) && (
            <>
              {documentContent &&
              (viewDocument.contentType?.startsWith('image/') ||
                isImageFromUrl) ? (
                <img
                  src={documentContent}
                  alt="Document"
                  className="mt-4 w-auto h-auto max-w-[95%] mx-auto object-contain"
                />
              ) : (
                <iframe
                  title="Document Viewer"
                  className="mt-4 w-full h-full"
                  src={documentContent || undefined}
                />
              )}
            </>
          )}

        {/* CSV Viewer */}
        {viewDocument &&
          viewDocument.contentType === 'text/csv' &&
          documentCsvContent !== undefined && (
            <div className="mt-5 h-[calc(100vh-120px)] overflow-auto shadow-md sm:rounded-lg">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
                      <tr>
                        {Object.keys(documentCsvContent[0]).map(
                          (header, index) => (
                            <th
                              key={index}
                              scope="col"
                              className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                            >
                              {header}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {documentCsvContent.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {Object.values(row).map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        {/* Text File Editor */}
        {viewDocument &&
          TextFileEditorViewableContentTypes.indexOf(viewDocument.contentType) >
            -1 &&
          documentContent !== undefined && (
            <TextFileEditor
              currentDocument={viewDocument}
              documentContent={documentContent}
              contentType={viewDocument.contentType}
              siteId={currentSiteId}
              readOnly={
                isCurrentSiteReadonly ||
                TextFileEditorEditableContentTypes.indexOf(
                  viewDocument.contentType
                ) === -1 ||
                mode === 'view'
              }
            />
          )}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Document</title>
      </Helmet>
      {viewDocument && (
        <div className="flex flex-col lg:flex-row">
          <div className="-mt-3 h-92/100h flex-1 bg-white inline-block">
            {documentContent !== undefined || ooConfig ? (
              <>
                {documentContent !== undefined && (
                  <div className="w-full h-full">
                    <DocumentViewer />
                  </div>
                )}
                {ooConfig && (
                  <div className="relative w-full h-full mt-3">
                    <div
                      className="w-full h-full"
                      id="onlyofficeContainer"
                    ></div>
                  </div>
                )}
              </>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default DocumentView;
