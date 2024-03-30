import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Close, Plus, Save, Trash } from '../../Components/Icons/icons';
import RegoEditor from '../../Components/TextEditors/RegoEditor';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import { openDialog as openConfirmationDialog } from '../../Store/reducers/globalConfirmControls';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../Store/store';
import { DocumentsService } from '../../helpers/services/documentsService';

export function AccessControl() {
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
  const [policyText, setPolicyText] = useState('');
  const [editorText, setEditorText] = useState('');
  type PolicyType = {
    policy: string;
    siteId: string;
  };
  const [policies, setPolicies] = useState<PolicyType[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [newSiteId, setNewSiteId] = useState('');
  const DEFAULT_POLICY_TEXT =
    '# Attribute-based Access Control (ABAC) version 1 \n# -------------------------------------\n# Write your policy here\n \npackage formkiq';

  function fetchPolicies() {
    DocumentsService.getOpenPolicyAgentConfigurations(currentSiteId).then(
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

  // Save edited policy
  const onSave = () => {
    if (!isDirty) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'No changes detected. Save aborted.',
        })
      );
      return;
    }
    const body = `{"policy": ${JSON.stringify(
      editorText
    )}, "siteId": "${newSiteId}"}`;
    DocumentsService.configureOpenPolicyAgent(body, currentSiteId).then(
      (res) => {
        if (res.status === 200) {
          dispatch(
            openNotificationDialog({
              dialogTitle: 'Site Configuration updated successfully.',
            })
          );
          setIsDirty(false);
          DocumentsService.getOpenPolicyAgentConfigurations(currentSiteId).then(
            (res) => {
              if (res.status === 200) {
                setPolicies(res.opaPolicies);
              }
            }
          );
        } else {
          dispatch(
            openNotificationDialog({
              dialogTitle:
                'Site Configuration did not update correctly. Please check your input and try again.',
            })
          );
        }
      }
    );
  };

  // Change text in editor
  const onTextChange = (value: any) => {
    setEditorText(value);
    if (!isDirty) {
      setIsDirty(true);
    }
  };

  // Select new siteId from the list
  const onSelectSiteId = (event: any) => {
    const changeSiteID = (value: any) => {
      setCurrentSiteId(value);
      const newPolicyText = policies.find(
        (policy: any) => policy.siteId === value
      )?.policy;
      if (newPolicyText) {
        setPolicyText(newPolicyText);
        setIsDirty(false);
      }
    };
    const newSiteId = event.target.value;
    if (isDirty) {
      dispatch(
        openConfirmationDialog({
          callback: () => changeSiteID(newSiteId),
          dialogTitle:
            'You have unsaved changes. Do you want to continue? You will lose your unsaved changes.',
        })
      );
    } else {
      changeSiteID(newSiteId);
    }
  };

  // Delete current policy
  const onDelete = () => {
    const deletePolicy = () => {
      DocumentsService.deleteOpenPolicyAgent(currentSiteId).then((res) => {
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

  // Show/Hide new siteId input
  const toggleInput = () => {
    function createDefaultPolicy() {
      setIsInputExpanded(!isInputExpanded);
      setNewSiteId('');
      setPolicyText(DEFAULT_POLICY_TEXT);
      setIsDirty(true);
    }

    if (!isInputExpanded && isDirty) {
      dispatch(
        openConfirmationDialog({
          callback: () => createDefaultPolicy(),
          dialogTitle:
            'You have unsaved changes. Do you want to continue? You will lose your unsaved changes.',
        })
      );
    } else if (!isInputExpanded && !isDirty) {
      createDefaultPolicy();
    } else {
      setIsInputExpanded(!isInputExpanded);
      setNewSiteId('');
      if (policies.length > 0) {
        setPolicyText(policies[0].policy);
        setCurrentSiteId(policies[0].siteId);
      } else {
        setPolicyText('');
        setCurrentSiteId('');
      }
      setIsDirty(false);
    }
  };

  // Create new policy
  function addPolicy() {
    const body = `{"policy": ${JSON.stringify(
      editorText
    )}, "siteId": "${newSiteId}"}`;
    DocumentsService.configureOpenPolicyAgent(body, newSiteId).then((res) => {
      if (res.status === 200) {
        DocumentsService.getOpenPolicyAgentConfiguration(currentSiteId).then(
          (res) => {
            if (res.status === 200) {
              setPolicies(res.opaPolicies);
              setPolicyText(editorText);
              setCurrentSiteId(newSiteId);
              setIsDirty(false);
            }
          }
        );
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Site Configuration updated successfully.',
          })
        );
        setIsInputExpanded(false);
      } else {
        dispatch(
          openNotificationDialog({
            dialogTitle:
              'Site Configuration did not update correctly. Please check your input and try again.',
          })
        );
      }
    });
  }

  return (
    <>
      <Helmet>
        <title>Admin</title>
      </Helmet>
      <div className="flex justify-between p-2">
        <h6 className="w-full my-2 text-base tracking-tight leading-10 font-bold text-gray-900 sm:leading-none">
          Access Control: Configure Open Policy Agent
        </h6>
        <>
          <button
            onClick={toggleInput}
            className="border-2 ml-2 text-sm font-semibold py-1 px-4 rounded-full flex items-center cursor-pointer text-gray-500 border-gray-400 hover:border-coreOrange-500 hover:text-coreOrange-500 whitespace-nowrap"
          >
            Add Policy{' '}
            <div className="w-4 ml-2">
              <Plus />
            </div>
          </button>
          <button
            onClick={onSave}
            className="border-2 ml-2 text-sm font-semibold py-1 px-4 rounded-full flex items-center cursor-pointer text-gray-500 border-gray-400 hover:border-coreOrange-500 hover:text-coreOrange-500"
          >
            Save{' '}
            <div className="w-5 ml-2">
              <Save />
            </div>
          </button>
          <button
            onClick={onDelete}
            className="border-2 ml-2 text-sm font-semibold py-1 px-4 rounded-full flex items-center cursor-pointer text-gray-500 border-gray-400 hover:border-coreOrange-500 hover:text-coreOrange-500"
          >
            Delete{' '}
            <div className="w-3 ml-2">
              <Trash />
            </div>
          </button>
        </>
      </div>

      {
        <div className="flex justify-start items-center p-2 my-2">
          {isInputExpanded ? (
            <div className="flex flex-col w-full gap-2">
              <div className="flex justify-start items-center w-full">
                <h6 className="font-bold text-gray-900">Enter Site ID:</h6>
                <input
                  type="text"
                  placeholder="Site ID"
                  className="ml-4 appearance-none rounded-md relative block  w-full md:w-1/2 px-3 py-3 border border-gray-600 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-grey-800 focus:border-grey-300"
                  onChange={(event: any) => setNewSiteId(event.target.value)}
                  value={newSiteId}
                />
              </div>
              <div className="flex justify-start items-center">
                <button
                  onClick={addPolicy}
                  className="border-2 ml-2 text-sm font-semibold py-1 px-4 rounded-full flex items-center cursor-pointer text-gray-500 border-gray-400 hover:border-coreOrange-500 hover:text-coreOrange-500 whitespace-nowrap"
                >
                  Create
                </button>
                <button
                  onClick={toggleInput}
                  className="border-2 ml-2 text-sm font-semibold py-1 px-4 rounded-full flex items-center cursor-pointer text-gray-400 border-gray-300 hover:border-coreOrange-500 hover:text-coreOrange-500 whitespace-nowrap"
                >
                  Cancel{' '}
                  <div className="w-4 ml-2">
                    <Close />
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <>
              <h6 className="font-bold text-gray-900">Site ID:</h6>
              <select
                className=" ml-4 appearance-none rounded-md relative block  w-full md:w-1/2 px-3 py-3 border border-gray-600 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-grey-800 focus:border-grey-300 focus:z-10"
                value={currentSiteId}
                onChange={(event) => {
                  onSelectSiteId(event);
                }}
              >
                {policies && policies.length > 0 && (
                  <>
                    {policies.map((policy, i: number) => {
                      return (
                        <option key={i} value={policy.siteId}>
                          {policy.siteId}
                        </option>
                      );
                    })}
                  </>
                )}
              </select>
            </>
          )}
        </div>
      }
      <RegoEditor content={policyText} onChange={onTextChange} />
    </>
  );
}

export default AccessControl;
