import {useEffect, useMemo, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {Close, Pencil, Plus, Save, Trash} from '../../Components/Icons/icons';
import RegoEditor from '../../Components/TextEditors/RegoEditor';
import {useAuthenticatedState} from '../../Store/reducers/auth';
import {openDialog as openConfirmationDialog} from '../../Store/reducers/globalConfirmControls';
import {openDialog as openNotificationDialog} from '../../Store/reducers/globalNotificationControls';
import {useAppDispatch} from '../../Store/store';
import {DocumentsService} from '../../helpers/services/documentsService';
import RadioListbox from "../../Components/Generic/Listboxes/RadioListbox";
import ButtonPrimaryGradient from "../../Components/Generic/Buttons/ButtonPrimaryGradient";
import {useParams} from "react-router-dom";
import CreatePolicyModal from '../../Components/AccessControl/CreatePolicyModal';

export function AccessControl() {
  const {siteId} = useParams()
  const [policy, setPolicy] = useState<any>(null);
  const [allPolicies, setAllPolicies] = useState<any[]>([]);
  const [isCreatePolicyModalOpen, setIsCreatePolicyModalOpen] = useState<boolean>(false);
  useEffect(() => {
    if (!siteId) return;
    DocumentsService.getOpenPolicyAgentPolicyItems(siteId).then((res) => {
      if (res.status === 200 && res.policyItems.length > 0) {
        setAllPolicies(res.policyItems);
      }
    });
  }, []);

  useEffect(() => {
    if (!allPolicies) return;
    console.log(typeof allPolicies, 'allPolicies')
  }, [allPolicies])

  function onCreatePolicyModalClose() {
    setIsCreatePolicyModalOpen(false);
  }

  return (
    <>
      <Helmet>
        <title>Manage Policy</title>
      </Helmet>
      <div className="flex justify-between p-2">
        <h6 className="w-full my-2 text-base tracking-normal leading-10 font-bold text-neutral-900 sm:leading-none">
          Site ID: {siteId}
        </h6>
        <ButtonPrimaryGradient className="h-10" onClick={() => setIsCreatePolicyModalOpen(true)}>+ Add
          New</ButtonPrimaryGradient>
      </div>

      {allPolicies && allPolicies.map((policy: any, index: number) => (
        <div key={"policyItem_" + index}>
          <div className="flex justify-between items-center px-2 my-2 h-8 gap-2">
            <h6 className="font-bold text-neutral-900">Policy: {index + 1}</h6>
            <div className="flex items-center gap-2">
              <button className="h-6 w-6 hover:text-primary-500">
                <Pencil/>
              </button>
              <button className="h-5 w-5 hover:text-primary-500">
                <Trash/>
              </button>
            </div>
          </div>
          <RegoEditor
            content={policy.policy}
            readOnly="nocursor"
            onChange={() => {
            }}/>
        </div>
      ))}
      <CreatePolicyModal isOpened={isCreatePolicyModalOpen} onClose={onCreatePolicyModalClose}
                         siteId={siteId ? siteId : 'default'}/>
    </>
  );
}

export default AccessControl;
