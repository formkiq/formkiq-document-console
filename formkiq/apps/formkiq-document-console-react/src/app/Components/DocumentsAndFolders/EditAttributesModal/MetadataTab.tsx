import {DocumentsService} from "../../../helpers/services/documentsService";
import {openDialog as openNotificationDialog} from "../../../Store/reducers/globalNotificationControls";
import {useAppDispatch} from "../../../Store/store";
import {useEffect, useState} from "react";
import ButtonPrimaryGradient from "../../Generic/Buttons/ButtonPrimaryGradient";
import {Pencil} from "../../Icons/icons";
import ButtonGhost from "../../Generic/Buttons/ButtonGhost";
import {formatBytes} from "../../../helpers/services/toolService";

function MetadataTab({value, siteId, onDocumentDataChange}: any) {

  const dispatch = useAppDispatch();
  const [metadata, setMetadata] = useState<any>(null)

  const updateMetadata = () => {
    DocumentsService.getDocumentById(value?.documentId as string, siteId).then((res) => {
      const newMetadata = {
        path: res?.path as string,
        deepLinkPath: res?.deepLinkPath as string,
        contentType: res?.contentType as string,
        filesize: res?.contentLength as number,

      }
      setMetadata(newMetadata)
    })
  }

  useEffect(() => {
    updateMetadata()
  }, [value]);

  const onMetadataEdit = (fieldName: string, val: any,) => {
    if (fieldName === 'deepLinkPath') {
      DocumentsService.patchDocumentDetails(value?.documentId as string, {deepLinkPath: val}, siteId).then((res) => {
        if (res.status !== 200) {
          dispatch(
            openNotificationDialog({
              dialogTitle: 'Error updating deep link path',
            })
          );
          return;
        }
        setTimeout(() => {
          onDocumentDataChange(value);
          updateMetadata()
        }, 500);
      });
    }
  }

  const [isEditingDeeplinkPath, setIsEditingDeeplinkPath] = useState(false);
  const [deeplinkPath, setDeeplinkPath] = useState(metadata?.deepLinkPath || '');

  const handleSaveDeeplinkPath = () => {
    onMetadataEdit('deepLinkPath', deeplinkPath);
    setIsEditingDeeplinkPath(false);
  }

  const startEditingDeeplinkPath = () => {
    setDeeplinkPath(metadata?.deepLinkPath || '');
    setIsEditingDeeplinkPath(true);
  }
  const cancelDeeplinkPathEditing = () => {
    setIsEditingDeeplinkPath(false);
    setDeeplinkPath(metadata?.deepLinkPath || '');
  }
  return (
    <div className="flex w-full mt-4">
      <div className="w-full mt-2 mx-2">
        <table className="border border-neutral-300 border-collapse table-fixed w-full text-sm">
          <colgroup>
            <col span={1} style={{width: '200px'}}/>
            <col span={1}/>
          </colgroup>

          <tbody className="bg-white nodark:bg-slate-800">
          <tr className="border-t border-neutral-300">
            <td className="p-4 text-start font-bold">Path:</td>
            <td className="p-4 text-start">{metadata?.path}</td>
          </tr>
          <tr className="border-t border-neutral-300">
            <td className="p-4 text-start font-bold">DeepLinkPath:</td>
            <td className="p-4 text-start"> {(isEditingDeeplinkPath ?
              <div className='flex items-start gap-2'>
                <input type="text" value={deeplinkPath}
                       className="border border-neutral-300 rounded-md h-6 w-full font-normal"
                       placeholder="Deep Link Path"
                       onChange={e => setDeeplinkPath(e.target.value)}/>
                <ButtonPrimaryGradient onClick={handleSaveDeeplinkPath}>Save</ButtonPrimaryGradient>
                <ButtonGhost onClick={cancelDeeplinkPathEditing}>Cancel</ButtonGhost>
              </div> :
              <div
                className='items-start gap-2 font-normal flex max-w-full overflow-hidden w-full'>{metadata?.deepLinkPath ?
                <p className="max-w-32 truncate mr-2 "> {metadata?.deepLinkPath}              </p> :
                <div className="text-neutral-500 font-normal">No deeplink found</div>}
                <div>
                  <button type="button" className="h-4 min-w-4 mt-1 w-4 grow"
                          onClick={startEditingDeeplinkPath}><Pencil/></button>
                </div>
              </div>)}</td>
          </tr>
          <tr className="border-t border-neutral-300">
            <td className="p-4 text-start font-bold">ContentType:</td>
            <td className="p-4 text-start">{metadata?.contentType}</td>
          </tr>
          <tr className="border-t border-neutral-300">
            <td className="p-4 text-start font-bold">Filesize:</td>
            <td className="p-4 text-start">{formatBytes(metadata?.contentLength)}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MetadataTab;
