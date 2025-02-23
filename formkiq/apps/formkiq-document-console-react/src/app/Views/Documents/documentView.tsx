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
  MsOfficeContentTypes,
  TextFileEditorEditableContentTypes,
  TextFileEditorViewableContentTypes,
} from '../../helpers/constants/contentTypes';
import { DocumentsService } from '../../helpers/services/documentsService';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import { IDocument } from '../../helpers/types/document';
import { useIsReadOnlyUser } from '../../hooks/is-read-only-user.hook';

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
  const isReadOnlyUser = useIsReadOnlyUser({ user, siteId });
  const [currentDocumentsRootUri, setCurrentDocumentsRootUri] =
    useState(siteDocumentsRootUri);
  const [currentDocumentsRootName, setCurrentDocumentsRootName] = useState(
    siteDocumentsRootName
  );
  const [officeDoc, setOfficeDoc] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [downloadOnly, setDownloadOnly] = useState(false);

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

          if (MsOfficeContentTypes.indexOf(response.contentType) > -1) {
            DocumentsService.getDocumentUrl(id, siteId, '', false).then(
              (urlResponse: any) => {
                setDocumentContent(urlResponse.url);
                setOfficeDoc(true);
              }
            );
          } else if (
            InlineViewableContentTypes.indexOf(response.contentType) > -1
          ) {
            const viewVersionKey =
              versionKey && versionKey.length ? versionKey : '';
            // Check if it's a text file
            const isTextFile = response.contentType.startsWith('text/');
            if (isTextFile) {
              DocumentsService.getDocumentContent(
                currentSiteId,
                id ?? '',
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
              const viewVersionKey =
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
            const viewVersionKey =
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
            const viewVersionKey =
              versionKey && versionKey.length ? versionKey : '';
            DocumentsService.getDocumentContent(
              currentSiteId,
              id,
              viewVersionKey,
              true
            ).then(async (res: any) => {
              if (res.content) {
                setDocumentContent(res.content);
              } else if (res.contentUrl) {
                try {
                  const urlResponse = await fetch(res.contentUrl);
                  const text = await urlResponse.text();
                  const processedContent = handleTextContent(text);
                  setDocumentContent(processedContent);
                } catch (error) {
                  console.error('Error fetching text content from URL:', error);
                }
              }
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
    setMode(getModeFromPath());
    if (isReadOnlyUser && getModeFromPath() === 'edit') {
      navigate(pathname.replace(/\/edit$/, '/view'));
    }
  }, [pathname]);

  const [viewDocument, setViewDocument] = useState<IDocument | null>(null);
  const [documentContent, setDocumentContent] = useState<string | null>('');
  const [documentCsvContent, setDocumentCsvContent] = useState<CSVRow[]>([]);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  const getViewerUrl = (url: string) => {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(
      url
    )}&embedded=true&ui=1`;
  };

  // Cleanup for blob URLs
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const DocumentViewer = () => {
    // S3 Content Type mapping within the component
    const S3_CONTENT_TYPES = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      bmp: 'image/bmp',
      svg: 'image/svg+xml',
      txt: 'text/plain',
      csv: 'text/csv',
      md: 'text/markdown',
      json: 'application/json',
    };

    // Helper to get content type from filename
    const getContentTypeFromFilename = (filename: string) => {
      const extension = filename.split('.').pop()?.toLowerCase() || '';
      return (
        S3_CONTENT_TYPES[extension as keyof typeof S3_CONTENT_TYPES] ||
        'application/octet-stream'
      );
    };

    // Handle S3 document content type detection
    const handleS3Document = async (document: IDocument) => {
      if (!document.deepLinkPath?.startsWith('s3://')) {
        return;
      }

      // ONLY S3 PROTOCOL DEEP LINKS
      try {
        const urlResponse = await DocumentsService.getDocumentUrl(
          id ?? '',
          currentSiteId,
          versionKey || '',
          true
        );

        // If we don't have a content type, try to detect it
        if (!document.contentType || document.contentType === 'text/html') {
          // First try to get it from the URL's content-disposition
          const filename = extractFilenameFromUrl(urlResponse.url);
          if (filename) {
            const imageMatch = filename.match(/\.(png|jpe?g|gif|bmp)$/i);
            if (imageMatch) {
              setViewDocument({
                ...document,
                contentType: `image/${
                  imageMatch[1].toLowerCase() === 'jpg'
                    ? 'jpeg'
                    : imageMatch[1].toLowerCase()
                }`,
              });
            } else {
              // If not an image, try to get content type from S3 path
              const s3Filename = document.deepLinkPath.split('/').pop() || '';
              const contentType = getContentTypeFromFilename(s3Filename);
              setViewDocument({
                ...document,
                contentType,
              });

              // Special handling for text files from S3
              if (contentType.startsWith('text/')) {
                const response = await fetch(urlResponse.url);
                const text = await response.text();
                const processedContent = handleTextContent(text);
                const blob = new Blob([processedContent], {
                  type: `${contentType};charset=utf-8`,
                });
                const blobUrl = URL.createObjectURL(blob);
                setBlobUrl(blobUrl);
                setDocumentContent(blobUrl);
                return;
              } else if (
                MsOfficeContentTypes.indexOf(contentType) > -1 ||
                contentType === 'application/pdf'
              ) {
                setOfficeDoc(true);
              } else if (document.contentType.startsWith('text/')) {
                // Handle text files that already have a content type
                const response = await fetch(urlResponse.url);
                const text = await response.text();
                const processedContent = handleTextContent(text);
                const blob = new Blob([processedContent], {
                  type: `${document.contentType};charset=utf-8`,
                });
                const blobUrl = URL.createObjectURL(blob);
                setBlobUrl(blobUrl);
                setDocumentContent(blobUrl);
                return;
              }
            }
          }
        }

        setDocumentContent(urlResponse.url);
      } catch (error) {
        console.error('Error retrieving S3 document URL:', error);
      }
    };

    useEffect(() => {
      if (viewDocument?.deepLinkPath) {
        if (viewDocument.deepLinkPath.startsWith('s3://')) {
          handleS3Document(viewDocument);
        } else {
          setDocumentContent(viewDocument.deepLinkPath);
        }
      }
    }, [viewDocument?.deepLinkPath]);

    // As a fallback, check the URL extension for images
    const isImageFromUrl =
      documentContent && /\.(png|jpe?g|gif|bmp)(\?|$)/i.test(documentContent);

    if (viewDocument?.contentType) {
      if (
        viewDocument.contentType === 'text/csv' &&
        viewDocument.deepLinkPath &&
        viewDocument.deepLinkPath.length > 0
      ) {
        setOfficeDoc(true);
      }
    }

    return (
      <>
        <div className="w-full h-full">
          {viewDocument &&
            (InlineViewableContentTypes.indexOf(viewDocument.contentType) >
              -1 ||
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
                ) : officeDoc ? (
                  <div className="relative w-full h-full">
                    {iframeLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white">
                        <Spinner />
                      </div>
                    )}
                    <iframe
                      title="Document Viewer"
                      className="w-full h-full"
                      style={{ backgroundColor: 'white' }}
                      src={getViewerUrl(documentContent || '')}
                      onLoad={() => setIframeLoading(false)}
                    />
                  </div>
                ) : (
                  <>
                    <iframe
                      title="Document Viewer"
                      className="mt-4 w-full h-full"
                      src={documentContent || undefined}
                    />
                  </>
                )}
              </>
            )}

          <>
            {/* CSV Viewer - unchanged */}
            {viewDocument &&
              viewDocument.contentType === 'text/csv' &&
              documentCsvContent !== undefined &&
              documentCsvContent[0] && (
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
              TextFileEditorViewableContentTypes.indexOf(
                viewDocument.contentType
              ) > -1 &&
              documentContent !== undefined && (
                <TextFileEditor
                  currentDocument={viewDocument}
                  documentContent={documentContent}
                  contentType={viewDocument.contentType}
                  siteId={currentSiteId}
                  readOnly={
                    TextFileEditorEditableContentTypes.indexOf(
                      viewDocument.contentType
                    ) === -1 || mode === 'view'
                  }
                />
              )}
          </>
        </div>
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>Document</title>
      </Helmet>

      {viewDocument && (
        <div className="flex flex-col lg:flex-row">
          <div className="h-92/100h flex-1 bg-white inline-block">
            {documentContent !== undefined ? (
              <>
                {documentContent && officeDoc ? (
                  <div className="relative w-full h-full">
                    {iframeLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white">
                        <Spinner />
                      </div>
                    )}
                    <iframe
                      title="Document Viewer"
                      className="w-full h-full"
                      style={{ backgroundColor: 'white' }}
                      src={getViewerUrl(documentContent)}
                      onLoad={() => setIframeLoading(false)}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full">
                    <DocumentViewer />
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
