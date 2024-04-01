import { useCallback, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mode } from 'vanilla-jsoneditor';
import { Spinner } from '../../Components/Icons/icons';
import { JSONEditorReact } from '../../Components/TextEditors/JsonEditor';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../Store/store';
import { DocumentsService } from '../../helpers/services/documentsService';

export function ObjectExamineTool() {
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
  const dispatch = useAppDispatch();
  const [currentSiteId, setCurrentSiteId] = useState(sites[0].siteId);
  const defaultValue = {};
  const [content, setContent] = useState({
    text: undefined,
    json: defaultValue,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsLoading(true);
      setFileName(event.target.files?.[0]?.name || null);
      // TODO: hide JSON editor and re-show on load
      setContent({ text: undefined, json: {} });
      try {
        const { uploadUrl, objectId } = await getUploadUrl(
          event.target.files?.[0]
        );
        await addDocument(uploadUrl, event.target.files?.[0], objectId);
      } catch (error: any) {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Error',
            dialogMessage: error.message,
          })
        );
        setIsLoading(false);
      }
    },
    []
  );

  const getUploadUrl = async (file: any) => {
    const result = await DocumentsService.getExaminePdfUploadUrl(currentSiteId);
    if (result.status !== 200) {
      throw new Error('Failed to get upload URL');
    }
    return { uploadUrl: result.uploadUrl, objectId: result.id };
  };

  const addDocument = async (url: string, file: any, objectId: string) => {
    const response = await fetch(url, {
      method: 'PUT',
      body: file,
    });
    if (response.status !== 200) {
      throw new Error('Failed to upload document');
    }
    await examinePdfDocument(objectId);
  };

  const examinePdfDocument = async (objectId: string) => {
    const result = await DocumentsService.getExaminePdfDetails(
      currentSiteId,
      objectId
    );
    if (result.status !== 200) {
      throw new Error('Failed to examine document');
    }
    setContent({ text: undefined, json: result.fileinfo }); // Update state
    setIsLoading(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Helmet>
        <title>Examine PDF</title>
      </Helmet>
      <div className="flex flex-col p-2">
        <h3 className="w-full my-2 text-xl tracking-tight leading-10 font-bold text-gray-900 sm:leading-none">
          Examine PDF
        </h3>
        <div className="p-4 max-w-screen-lg font-semibold mb-4">
          Upload a PDF to determine its properties, specifically the names of
          fields and values.
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            hidden={true}
          />
          <button
            className="bg-gradient-to-l from-coreOrange-400 via-red-400 to-coreOrange-500 hover:from-coreOrange-500 hover:via-red-500 hover:to-coreOrange-600 text-white text-sm font-semibold py-2 px-4 rounded-md flex"
            onClick={handleClick}
          >
            Select File
          </button>
          {fileName ? (
            <p className="text-sm">{fileName}</p>
          ) : (
            <p className="text-sm">No file selected</p>
          )}
          {isLoading && <Spinner />}
        </div>
      </div>
      <JSONEditorReact content={content} mode={Mode.text} readOnly={true} />
    </>
  );
}

export default ObjectExamineTool;
