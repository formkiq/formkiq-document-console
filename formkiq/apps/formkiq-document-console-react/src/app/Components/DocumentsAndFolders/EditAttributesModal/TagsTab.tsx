import EditTagsList from "./editTagsList";
import {DocumentsService} from "../../../helpers/services/documentsService";
import {openDialog} from "../../../Store/reducers/globalConfirmControls";
import {useAppDispatch} from "../../../Store/store";

function TagsTab({allTags, setAlltags, onTagEdit, value, siteId, onDocumentDataChange, updateTags}: any) {

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
      <div className="flex w-full mt-4">
        <div className="w-full mt-2 mx-2">
          <EditTagsList
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
