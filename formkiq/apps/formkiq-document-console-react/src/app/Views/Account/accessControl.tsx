import {useEffect, useMemo, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {Trash} from '../../Components/Icons/icons';
import RegoEditor from '../../Components/TextEditors/RegoEditor';
import {useAuthenticatedState} from '../../Store/reducers/auth';
import {openDialog as openConfirmationDialog} from '../../Store/reducers/globalConfirmControls';
import {openDialog as openNotificationDialog} from '../../Store/reducers/globalNotificationControls';
import {useAppDispatch} from '../../Store/store';
import {DocumentsService} from '../../helpers/services/documentsService';
import RadioListbox from "../../Components/Generic/Listboxes/RadioListbox";
import ButtonPrimaryGradient from "../../Components/Generic/Buttons/ButtonPrimaryGradient";
import {Link} from "react-router-dom";

export function AccessControl() {
  const {user} = useAuthenticatedState();
  const [siteIds, setSiteIds] = useState<string[]>([]);
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
    setSiteIds(sites.concat(workspaceSites).map((site) => site.siteId));
    return sites.concat(workspaceSites);
  }, [user]);

  const dispatch = useAppDispatch();
  const [currentSiteId, setCurrentSiteId] = useState(sites[0].siteId);
  const [policyText, setPolicyText] = useState('');
  const [editorText, setEditorText] = useState('');
  type PolicyType = {
    policy: string;
    siteId: string;
  };
  const [policies, setPolicies] = useState<PolicyType[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  function fetchPolicies() {
    DocumentsService.getOpenPolicyAgentPolicies().then(
      (res) => {
        if (res.status === 200) {
          setPolicies(res.opaPolicies);
          if (res.opaPolicies.length > 0) {
            setPolicyText(res.opaPolicies[0].policy);
          } else {
            setPolicyText('');
          }
        } else {
          dispatch(
            openNotificationDialog({
              dialogTitle:
                'Site Configuration did not load correctly. Please try again later.',
            })
          );
        }
      }
    );
  }

  // Load policies initially.
  useEffect(() => {
    fetchPolicies();
    setIsDirty(false);
  }, []);

  // Change text in editor
  const onTextChange = (value: any) => {
    setEditorText(value);
    if (!isDirty) {
      setIsDirty(true);
    }
  };

  // Select new siteId from the list
  const onSelectSiteId = (siteId: any) => {
    const changeSiteID = (value: any) => {
      setCurrentSiteId(value);
      const newPolicyText = policies.find(
        (policy: any) => policy.siteId === value
      )?.policy;
      if (newPolicyText) {
        setPolicyText(newPolicyText);
        setIsDirty(false);
      } else {
        setPolicyText('');
      }
    };
    changeSiteID(siteId);
  };

  // Delete current policy
  const onDelete = () => {
    const deletePolicy = () => {
      DocumentsService.deleteOpenPolicyAgentPolicyItems(currentSiteId).then((res) => {
        if (res.status === 200) {
          dispatch(
            openNotificationDialog({
              dialogTitle: 'Site Configuration deleted successfully.',
            })
          );
          fetchPolicies();
        } else {
          dispatch(
            openNotificationDialog({
              dialogTitle:
                'Site Configuration did not delete correctly. Please check your input and try again.',
            })
          );
        }
      });
    };
    dispatch(
      openConfirmationDialog({
        callback: () => deletePolicy(),
        dialogTitle: 'Do you want to delete this policy?',
      })
    );
  };


  return (
    <>
      <Helmet>
        <title>Access Control</title>
      </Helmet>
      <div className="flex justify-between items-center gap-2 p-2">
        <h6 className="w-full my-2 text-base tracking-normal leading-10 font-bold text-gray-900 sm:leading-none">
          Access Control: Configure Open Policy Agent
        </h6>
        <Link to={currentSiteId}>
          <ButtonPrimaryGradient className="h-8">ManagePolicy</ButtonPrimaryGradient>
        </Link>
        <button className="h-6 w-6 hover:text-primary-500" onClick={onDelete}><Trash/></button>
      </div>

      <div className="flex justify-start items-center px-2 my-2 h-8 gap-2">
        <h6 className="font-bold text-gray-900">Site ID:</h6>
        <RadioListbox
          values={siteIds}
          titles={siteIds}
          selectedValue={currentSiteId}
          setSelectedValue={onSelectSiteId}
        />
      </div>
      <RegoEditor content={policyText} onChange={onTextChange} readOnly="nocursor"/>
    </>
  );
}

export default AccessControl;
