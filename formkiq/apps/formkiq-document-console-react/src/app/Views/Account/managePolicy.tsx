import {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {Pencil, Trash} from '../../Components/Icons/icons';
import RegoEditor from '../../Components/TextEditors/RegoEditor';
import {DocumentsService} from '../../helpers/services/documentsService';
import ButtonPrimaryGradient from "../../Components/Generic/Buttons/ButtonPrimaryGradient";
import {useParams} from "react-router-dom";
import CreatePolicyModal from '../../Components/AccessControl/CreatePolicyModal';
import EditPolicyModal from "../../Components/AccessControl/EditPolicyModal";
import {useAppDispatch} from "../../Store/store";
import {openDialog as openNotificationDialog} from "../../Store/reducers/globalNotificationControls";
import {openDialog as openConfirmationDialog} from "../../Store/reducers/globalConfirmControls";

export function AccessControl() {
  const {siteId} = useParams()
  const [allPolicyItems, setAllPolicyItems] = useState<any[]>([]);
  const [isCreatePolicyModalOpen, setIsCreatePolicyModalOpen] = useState<boolean>(false);
  const [isEditPolicyModalOpen, setIsEditPolicyModalOpen] = useState<boolean>(false);
  const [editPolicyIndex, setEditPolicyIndex] = useState<number>(-1);
  const dispatch = useAppDispatch();

  function updatePolicyItems() {
    if (!siteId) return;
    DocumentsService.getOpenPolicyAgentPolicyItems(siteId).then((res) => {
      if (res.status === 200 && res.policyItems.length > 0) {
        setAllPolicyItems(res.policyItems);
      } else {
        setAllPolicyItems([]);
      }
    });
  }

  useEffect(() => {
    updatePolicyItems()
  }, []);


  function onCreatePolicyModalClose() {
    updatePolicyItems()
    setIsCreatePolicyModalOpen(false);
  }

  function onEditPolicyModalClose() {
    updatePolicyItems()
    setIsEditPolicyModalOpen(false);
  }

  function onDeletePolicyItem(index: number) {
    function deletePolicyItem() {
      if (!siteId) return;
      const newPolicyItems: any = [...allPolicyItems];
      newPolicyItems.forEach((item: any, i: number) => {
        newPolicyItems[i] = {
          ...item,
          type: "ALLOW"
        }
      })
      newPolicyItems.splice(index, 1);
      if (newPolicyItems.length > 0) {
        DocumentsService.setOpenPolicyAgentPolicyItems(siteId, {policyItems: newPolicyItems}).then((response) => {
          if (response.status === 200) {
            updatePolicyItems()
          } else {
            dispatch(openNotificationDialog({
              dialogTitle: `Error.\n ${response.errors.map((error: any) => error.error).join(", \n")}`
            }))
          }
        })
      } else {
        DocumentsService.deleteOpenPolicyAgentPolicyItems(siteId).then((response) => {
          if (response.status === 200) {
            updatePolicyItems()
          } else {
            dispatch(openNotificationDialog({
              dialogTitle: `Error.\n ${response.errors.map((error: any) => error.error).join(", \n")}`
            }))
          }
        })
      }
    }

    dispatch(openConfirmationDialog({
      dialogTitle: "Are you sure you want to delete this policy item?",
      callback: deletePolicyItem
    }))

  }

  return (
    <>
      <Helmet>
        <title>Manage Policy</title>
      </Helmet>
      <div className="flex justify-between p-2">
        <div className="flex gap-4 items-center">
          <h6 className="w-full my-2 text-base tracking-normal leading-10 font-bold text-neutral-900 sm:leading-none">
            Edit Policy Items
          </h6>
          <div className="w-[2px] min-w-[2px] block h-6 bg-neutral-500 "></div>
          <a className="text-sm font-bold text-gray-500 hover:text-primary-600 cursor-pointer whitespace-nowrap"
             href={`/account/accessControl?selectedPolicySiteId=${siteId}`}>
            Back To Policy View
          </a>
        </div>
        <ButtonPrimaryGradient className="h-8" onClick={() => setIsCreatePolicyModalOpen(true)}>+ Add
          New Policy Item</ButtonPrimaryGradient>
      </div>
      <h6 className="my-2 pl-2 text-base tracking-normal leading-10 font-medium text-neutral-900 sm:leading-none">
        Site ID: {siteId}
      </h6>
      {allPolicyItems && allPolicyItems.map((policyItem: any, index: number) => (
        <div key={"policyItem_" + index}>
          <div className="flex justify-between items-center px-2 my-2 h-8 gap-2">
            <h6 className="font-bold text-neutral-900">Policy: {index + 1}</h6>
            <div className="flex items-center gap-2">
              <button className="h-6 w-6 hover:text-primary-500" onClick={() => {
                setEditPolicyIndex(index)
                setIsEditPolicyModalOpen(true)
              }}>
                <Pencil/>
              </button>
              <button className="h-5 w-5 hover:text-primary-500" onClick={() => onDeletePolicyItem(index)}>
                <Trash/>
              </button>
            </div>
          </div>
          <RegoEditor
            content={policyItem.policy}
            readOnly="nocursor"
            onChange={() => {
            }}/>
        </div>
      ))}
      <CreatePolicyModal isOpened={isCreatePolicyModalOpen}
                         onClose={onCreatePolicyModalClose}
                         policyItems={allPolicyItems}
                         siteId={siteId ? siteId : 'default'}/>
      <EditPolicyModal isOpened={isEditPolicyModalOpen}
                       onClose={onEditPolicyModalClose}
                       policyItems={allPolicyItems}
                       siteId={siteId ? siteId : 'default'} index={editPolicyIndex}/>
    </>
  );
}

export default AccessControl;
