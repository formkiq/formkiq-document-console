import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { getFileIcon } from '../../../helpers/services/toolService';
import { IDocument } from '../../../helpers/types/document';
import { ConfigState, setPendingArchive } from '../../../Store/reducers/config';
import { useAppDispatch } from '../../../Store/store';
import ButtonGhost from '../../Generic/Buttons/ButtonGhost';
import ButtonPrimary from '../../Generic/Buttons/ButtonPrimary';
import { Close, Spinner } from '../../Icons/icons';

export const PendingArchiveTab = ({
  siteId,
  documentsRootUri,
  archiveStatus,
  setArchiveStatus,
  closeArchiveTab,
  deleteFromPendingArchive,
  setSelectedDocuments,
}: {
  siteId: string;
  documentsRootUri: string;
  archiveStatus: string;
  setArchiveStatus: (value: string) => void;
  closeArchiveTab: () => void;
  deleteFromPendingArchive: (file: IDocument) => void;
  setSelectedDocuments: (documents: IDocument[]) => void;
}) => {
  const dispatch = useAppDispatch();
  const { pendingArchive } = useSelector(ConfigState);

  const ARCHIVE_STATUSES = {
    INITIAL: 'INITIAL',
    PENDING: 'PENDING',
    COMPLETE: 'COMPLETE',
    ERROR: 'ERROR',
  };
  const [intervalId, setIntervalId] = useState<
    string | number | NodeJS.Timeout | undefined
  >(0);
  const [archiveDownloadUrl, setArchiveDownloadUrl] = useState<
    string | undefined
  >(undefined);
  const [isCompressButtonDisabled, setIsCompressButtonDisabled] =
    useState(true);

  const compressDocuments = () => {
    setArchiveStatus(ARCHIVE_STATUSES.PENDING);
    const documentIds: string[] = [];
    pendingArchive.forEach((document) => {
      documentIds.push(document.documentId);
    });

    DocumentsService.compressDocuments(documentIds, siteId).then(
      (response: any) => {
        setArchiveStatus(ARCHIVE_STATUSES.PENDING);
        if (response.status === 201) {
          let counter = 0;
          const downloadArchive = async () => {
            try {
              await fetch(response.downloadUrl).then((r) => {
                if (r.ok) {
                  setArchiveDownloadUrl(response.downloadUrl);
                  setArchiveStatus(ARCHIVE_STATUSES.COMPLETE);
                  dispatch(setPendingArchive([]));
                  setSelectedDocuments([]);
                  clearInterval(downloadInterval);
                }
              });
              if (counter === 120) {
                setArchiveStatus(ARCHIVE_STATUSES.ERROR);
                clearInterval(downloadInterval);
              } else {
                counter += 1;
              }
            } catch (e) {
              console.log(e, 'error');
            }
          };
          const downloadInterval = setInterval(downloadArchive, 500);
          setIntervalId(downloadInterval);
          downloadArchive();
        } else {
          setArchiveStatus(ARCHIVE_STATUSES.ERROR);
        }
      }
    );
  };

  useEffect(() => {
    if (
      pendingArchive === undefined ||
      pendingArchive.length === 0 ||
      archiveStatus === ARCHIVE_STATUSES.COMPLETE ||
      archiveStatus === ARCHIVE_STATUSES.PENDING
    ) {
      setIsCompressButtonDisabled(true);
    } else {
      setIsCompressButtonDisabled(false);
    }

    if (
      archiveStatus === ARCHIVE_STATUSES.COMPLETE &&
      pendingArchive.length > 0
    ) {
      setArchiveStatus(ARCHIVE_STATUSES.INITIAL);
    }
  }, [pendingArchive, archiveStatus, isCompressButtonDisabled]);

  return (
    <div className="w-full h-56 p-4 flex flex-col justify-between relative">
      <div className="absolute flex w-full h-40 justify-center items-center font-bold text-5xl text-gray-100 mb-2">
        {archiveStatus === ARCHIVE_STATUSES.COMPLETE ? (
          ''
        ) : (
          <span>Documents Pending Download (ZIP)</span>
        )}
      </div>
      <div className="h-full border-gray-400 border overflow-y-auto z-20">
        {archiveStatus === ARCHIVE_STATUSES.INITIAL ? (
          pendingArchive ? (
            <div className="grid grid-cols-2 2xl:grid-cols-3">
              {pendingArchive.map((file: IDocument) => (
                <div key={file.documentId} className="flex flex-row p-2">
                  <button
                    className="w-6 mr-2 text-gray-400 cursor-pointer hover:text-primary-500"
                    onClick={() => deleteFromPendingArchive(file)}
                  >
                    <Close />
                  </button>
                  <Link
                    to={`${documentsRootUri}/${file.documentId}/view`}
                    className="cursor-pointer w-16 flex items-center justify-start"
                  >
                    <img
                      src={getFileIcon(file.path, file.deepLinkPath)}
                      className="w-8 inline-block"
                      alt="icon"
                    />
                  </Link>
                  <Link
                    to={`${documentsRootUri}/${file.documentId}/view`}
                    className="cursor-pointer pt-1.5 flex items-center"
                    title={file.path.substring(file.path.lastIndexOf('/') + 1)}
                  >
                    <span>
                      {file.path.substring(file.path.lastIndexOf('/') + 1)
                        .length > 50 ? (
                        <span className="tracking-tighter text-clip overflow-hidden">
                          {file.path.substring(
                            file.path.lastIndexOf('/') + 1,
                            file.path.lastIndexOf('/') + 60
                          )}
                          {file.path.substring(file.path.lastIndexOf('/') + 1)
                            .length > 60 && <span>...</span>}
                        </span>
                      ) : (
                        <span>
                          {file.path.substring(file.path.lastIndexOf('/') + 1)}
                        </span>
                      )}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-md text-gray-500 ml-2">
              No files in archive
            </div>
          )
        ) : archiveStatus === ARCHIVE_STATUSES.PENDING ? (
          <div className="h-full flex flex-col justify-center">
            <Spinner />
            <div className="text-md text-gray-500 ml-2 text-center">
              compressing...
            </div>
          </div>
        ) : (
          <>
            {archiveStatus === ARCHIVE_STATUSES.ERROR ? (
              <div className="h-full flex flex-col justify-center font-semibold text-center">
                <span className="text-red-600">Error: please try again.</span>
                <a
                  href="JavaScript://"
                  onClick={compressDocuments}
                  className="block font-bold hover:underline"
                >
                  retry
                </a>
              </div>
            ) : (
              <div className="flex w-full pt-10 justify-center items-center">
                <ButtonPrimary type="button" style={{ padding: 0 }}>
                  <a href={archiveDownloadUrl} className="w-full h-full block">
                    <div className="text-lg mx-4 text-center cursor-pointer">
                      Download Files (ZIP)
                    </div>
                  </a>
                </ButtonPrimary>
              </div>
            )}
          </>
        )}
      </div>
      <div className="h-12 flex justify-end mt-2">
        {!isCompressButtonDisabled && (
          <ButtonPrimary onClick={compressDocuments} type="button">
            <span>Download Files (ZIP)</span>
          </ButtonPrimary>
        )}
        {archiveStatus === ARCHIVE_STATUSES.COMPLETE && (
          <ButtonGhost onClick={closeArchiveTab} type="button">
            <span>Done</span>
          </ButtonGhost>
        )}
      </div>
    </div>
  );
};
