import MetadataList from "./MetadataList";
import {DocumentsService} from "../../../helpers/services/documentsService";
import {openDialog as openNotificationDialog} from "../../../Store/reducers/globalNotificationControls";
import {useAppDispatch} from "../../../Store/store";
import {useEffect, useState} from "react";

function MetadataTab({value, siteId,onDocumentDataChange}:any) {

  const dispatch = useAppDispatch();
  const [metadata, setMetadata] = useState<any>(null)

  const updateMetadata = () => {
    if (value?.documentInstance) {
      const newMetadata = {
        path: value?.documentInstance?.path as string,
        deepLinkPath: value?.documentInstance?.deepLinkPath as string,
        contentType: value?.documentInstance?.contentType as string,
        filesize: value?.documentInstance?.contentLength as number,
      }
      setMetadata(newMetadata)
    }

    if (!value?.documentInstance) {
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
          updateMetadata();
        }, 500);
      });
    }
  }

  return (
    <div className="flex w-full mt-4">
      <div className="w-full mt-2 mx-2">
        <MetadataList
          metadata={metadata}
          onEdit={onMetadataEdit}
        />
      </div>
    </div>
  );
}

export default MetadataTab;
