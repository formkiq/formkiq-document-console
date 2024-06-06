import {useEffect} from 'react';
import EditTagsAndMetadataList from "./editTagsAndMetadataList";
import {DocumentsService} from "../../../helpers/services/documentsService";
import {openDialog} from "../../../Store/reducers/globalConfirmControls";
import {useAppDispatch} from "../../../Store/store";

function TagsTab({allTags, setAlltags, onTagEdit, value, siteId, onDocumentDataChange, setSelectedTab, updateTags}: any) {

  const dispatch = useAppDispatch();

  const onTagDelete = (tagKey: string) => {
    const deleteFunc = () => {
      setAlltags(null);
      DocumentsService.deleteDocumentTag(
        value?.documentId as string,
        siteId,
        tagKey
      ).then(() => {
        updateTags();
        setTimeout(() => {
          onDocumentDataChange(value);
        }, 500);
      });
    };
    dispatch(
      openDialog({
        callback: deleteFunc,
        dialogTitle: 'Are you sure you want to delete this tag?',
      })
    );
  };

  return (
    <>
      <div className="flex w-full items-center mt-2">
        <div
          className="ml-2 font-semibold grow text-lg inline-block text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 pr-6">
          Edit Tags
        </div>
      </div>
      <div className="flex w-full mt-4">
        <div className="w-full mt-2 mx-2">
          <EditTagsAndMetadataList
            tags={allTags}
            onEdit={onTagEdit}
            onDelete={onTagDelete}
          />
        </div>
      </div>
    </>
  );
}

export default TagsTab;
