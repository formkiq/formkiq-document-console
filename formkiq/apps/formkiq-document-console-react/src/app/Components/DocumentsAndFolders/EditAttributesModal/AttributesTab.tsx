import AddDocumentAttributeForm from "./AddDocumentAttributeForm";
import AttributesList from "./AttributesList";
import {useCallback, useEffect} from "react";
import {RequestStatus} from "../../../helpers/types/document";
import {
  AttributesState,
  fetchDocumentAttributes,
  setDocumentAttributesLoadingStatusPending
} from "../../../Store/reducers/attributes";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../../Store/store";
import {DocumentsService} from "../../../helpers/services/documentsService";
import {openDialog} from "../../../Store/reducers/globalConfirmControls";
import {openDialog as openNotificationDialog} from "../../../Store/reducers/globalNotificationControls";

function AttributesTab({onDocumentDataChange, siteId, value, getValue}: any) {
  const dispatch = useAppDispatch();
  const {
    documentAttributes,
    documentAttributesNextToken,
    documentAttributesLoadingStatus,
    documentAttributesCurrentSearchPage,
    documentAttributesIsLastSearchPageLoaded
  } = useSelector(AttributesState)

  useEffect(() => {
    if (!value?.documentId || !siteId) {
      return;
    }
    dispatch(fetchDocumentAttributes({siteId, documentId: value?.documentId as string}));
  }, [value]);

  // load more documentAttributes when table reaches bottom
  const trackScrolling = useCallback(async () => {
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 10 > el.scrollHeight;
      }
      return false;
    };

    const scrollpane = document.getElementById('documentAttributesScrollPane');

    if (
      isBottom(scrollpane as HTMLElement) &&
      documentAttributesNextToken &&
      documentAttributesLoadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setDocumentAttributesLoadingStatusPending());
      if (documentAttributesNextToken) {
        await dispatch(
          fetchDocumentAttributes({
            siteId: siteId,
            nextToken: documentAttributesNextToken,
            page: documentAttributesCurrentSearchPage + 1,
            documentId: value?.documentId as string,
            limit: 100
          })
        );
      }
    }
  }, [documentAttributesNextToken, documentAttributesLoadingStatus, documentAttributesIsLastSearchPageLoaded]);

  const handleScroll = (event: any) => {
    const el = event.target;
    // Track scroll when table reaches bottom
    if (el.offsetHeight + el.scrollTop + 10 > el.scrollHeight) {
      if (el.scrollTop > 0) {
        trackScrolling();
      }
    }
  };

  const deleteDocumentAttribute = (key: string) => {
    if (!value?.documentId) {
      return;
    }

    const deleteAttribute = () => {
      DocumentsService.deleteDocumentAttribute(siteId, value?.documentId, key).then(() => {
        dispatch(fetchDocumentAttributes({siteId, documentId: value?.documentId as string}));
        setTimeout(() => {
          onDocumentDataChange(value);
        }, 500);
      });
    };

    dispatch(
      openDialog({
        callback: deleteAttribute,
        dialogTitle: "Are you sure you want to delete attribute '" + key + "' from the document?",
      })
    );
  }

  function editAttribute(attributeKey: string, newAttributeValue: any, ) {
    if (!attributeKey || !newAttributeValue) return;
    if (!value?.documentId) return;

    DocumentsService.setDocumentAttributeValue(siteId, value?.documentId, attributeKey, newAttributeValue).then((res) => {
      if (res.status !== 200) {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Error updating attribute',
          })
        );
        return;
      }
      dispatch(fetchDocumentAttributes({siteId, documentId: value?.documentId as string}));
      setTimeout(() => {
        onDocumentDataChange(value);
      }, 500);
    });

  }


  return (
    <div className="mt-4">
      <AddDocumentAttributeForm
        onDocumentDataChange={onDocumentDataChange}
        siteId={siteId}
        value={value}
        getValue={getValue}
      />

      <div className="w-full mt-4 mx-2">
        <AttributesList attributes={documentAttributes}
                        handleScroll={handleScroll}
                        deleteDocumentAttribute={deleteDocumentAttribute}
                        editAttribute={editAttribute}
        />
      </div>
    </div>
  );
}

export default AttributesTab;
