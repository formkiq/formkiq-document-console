import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import ButtonGhost from '../../Components/Generic/Buttons/ButtonGhost';
import ButtonPrimary from '../../Components/Generic/Buttons/ButtonPrimary';
import ButtonPrimaryGradient from '../../Components/Generic/Buttons/ButtonPrimaryGradient';
import ButtonTertiary from '../../Components/Generic/Buttons/ButtonTertiary';
import { Close, Plus } from '../../Components/Icons/icons';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import { openDialog as openConfirmationDialog } from '../../Store/reducers/globalConfirmControls';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import {
  RulesetsState,
  deleteRule,
  fetchRules,
  fetchRuleset,
  setRulesetsLoadingStatusPending,
} from '../../Store/reducers/rulesets';
import { useAppDispatch } from '../../Store/store';
import { DocumentsService } from '../../helpers/services/documentsService';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import { RequestStatus } from '../../helpers/types/document';
import { Rule } from '../../helpers/types/rulesets';
import RulesTable from './rulesTable';

function Ruleset() {
  const { user } = useAuthenticatedState();
  const { hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites } =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const { siteId } = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );
  const [currentSiteId, setCurrentSiteId] = useState(siteId);

  const { id } = useParams();
  const [rulesetId, setRulesetId] = useState(id || '');
  const {
    ruleset,
    rules,
    nextToken,
    loadingStatus,
    isLastSearchPageLoaded,
    currentSearchPage,
  } = useSelector(RulesetsState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchRuleset({ rulesetId: id, siteId: currentSiteId }));
    dispatch(fetchRules({ rulesetId: id, siteId: currentSiteId }));
  }, []);

  useEffect(() => {
    if (id) {
      setRulesetId(id);
    }
  }, [id]);

  const initialRuleValue: { rule: Rule } = {
    rule: {
      ruleId: '',
      priority: 0,
      description: '',
      workflowId: '',
      status: 'ACTIVE',
      conditions: {
        must: [
          {
            criterion: 'TEXT',
            value: '',
            operation: 'EQ',
          },
        ],
      },
    },
  };

  const onRuleDelete = (ruleId: string) => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to delete this rule?',
        callback: () => {
          dispatch(
            deleteRule({ rulesetId, ruleId, siteId: currentSiteId, rules })
          );
        },
      })
    );
  };

  const [isRuleEditTabVisible, setIsRuleEditTabVisible] = useState(false);

  const trackScrolling = useCallback(async () => {
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 10 > el.scrollHeight;
      }
      return false;
    };

    const scrollpane = document.getElementById('rulesScrollPane');

    if (
      isBottom(scrollpane as HTMLElement) &&
      nextToken &&
      loadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setRulesetsLoadingStatusPending());
      if (nextToken) {
        await dispatch(
          fetchRules({
            rulesetId: id,
            siteId: currentSiteId,
            nextToken,
            page: currentSearchPage + 1,
          })
        );
      }
    }
  }, [nextToken, loadingStatus, isLastSearchPageLoaded]);

  const handleScroll = (event: any) => {
    const el = event.target;
    //track scroll when table reaches bottom
    if (el.offsetHeight + el.scrollTop + 10 > el.scrollHeight) {
      if (el.scrollTop > 0) {
        trackScrolling();
      }
    }
  };

  const [newRuleValue, setNewRuleValue] = useState<{ rule: Rule }>(
    initialRuleValue
  );

  const saveRule = () => {
    if (newRuleValue.rule.ruleId) {
      // Check if editing existing rule
      DocumentsService.updateRule(
        rulesetId,
        newRuleValue.rule.ruleId,
        newRuleValue,
        currentSiteId
      ).then((res) => {
        if (res.status === 200) {
          dispatch(fetchRules({ siteId: currentSiteId, rulesetId }));
          setIsRuleEditTabVisible(false);
          setNewRuleValue(initialRuleValue);
        } else {
          dispatch(
            openNotificationDialog({
              dialogTitle:
                'Error happened while saving rule. Please try again later',
            })
          );
        }
      });
    } else {
      DocumentsService.addRule(rulesetId, newRuleValue, currentSiteId).then(
        (res) => {
          if (res.status === 200) {
            dispatch(fetchRules({ siteId: currentSiteId, rulesetId }));
            setIsRuleEditTabVisible(false);
            setNewRuleValue(initialRuleValue);
          } else {
            dispatch(
              openNotificationDialog({
                dialogTitle:
                  'Error happened while saving rule. Please try again later',
              })
            );
          }
        }
      );
    }
  };

  // Open tab to create/edit ruleset
  const showRuleEditTab = (ruleId: string) => {
    const rule = rules.find((rule) => rule.ruleId === ruleId);
    if (!rule) {
      return;
    }
    setNewRuleValue({ rule });
    setIsRuleEditTabVisible(true);
  };

  function onCancelEdit() {
    setIsRuleEditTabVisible(false);
    setNewRuleValue(initialRuleValue as { rule: Rule });
  }

  return (
    <>
      <Helmet>
        <title>Ruleset</title>
      </Helmet>
      <div
        className="flex flex-col "
        style={{
          height: `calc(100vh - 3.68rem)`,
        }}
      >
        <div className="w-full p-2 flex">
          <h3 className="text-lg font-bold mr-2">{ruleset?.description}</h3>
          <span className="pl-2 pt-0.5">
            <a
              href="/rulesets"
              className="text-sm text-primary-500 hover:text-primary-600"
            >
              back to rulesets
            </a>
          </span>
        </div>
        <div className="w-full p-2 flex">
          <ButtonPrimaryGradient
            onClick={() => setIsRuleEditTabVisible(true)}
            style={{ height: '36px' }}
          >
            + Create New Rule
          </ButtonPrimaryGradient>
        </div>
        {isRuleEditTabVisible && (
          <RuleEditingTab
            onCancelEdit={onCancelEdit}
            ruleValue={newRuleValue}
            setRuleValue={setNewRuleValue}
            createNewRule={saveRule}
            currentSiteId={currentSiteId}
          />
        )}
        <div
          className=" flex-1 inline-block overflow-y-scroll overflow-x-auto h-full"
          id="rulesScrollPane"
          onScroll={handleScroll}
        >
          <RulesTable
            rules={rules}
            onRuleDelete={onRuleDelete}
            showRuleEditTab={showRuleEditTab}
            setNewRuleValue={setNewRuleValue}
          />
        </div>
      </div>
    </>
  );
}

export default Ruleset;

const RuleEditingTab = ({
  onCancelEdit,
  ruleValue,
  setRuleValue,
  createNewRule,
  currentSiteId,
}: {
  onCancelEdit: () => void;
  ruleValue: any;
  setRuleValue: (ruleValue: any) => void;
  createNewRule: () => void;
  currentSiteId: string;
}) => {
  const dispatch = useAppDispatch();
  const [workflows, setWorkflows] = useState([]);
  const onSubmit = (e: any) => {
    e.preventDefault();
    if (ruleValue.rule.conditions.must.length === 0) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Please add at least one condition',
        })
      );
      return;
    }
    createNewRule();
  };

  useEffect(() => {
    // TODO: figure out size or paging/infinite load
    DocumentsService.getWorkflows(currentSiteId, null, null, null, 100).then(
      (response: any) => {
        setWorkflows(response.workflows);
        if (!ruleValue.rule.workflowId) {
          setRuleValue({
            rule: {
              ...ruleValue.rule,
              workflowId: response.workflows[0].workflowId,
            },
          });
        }
      }
    );
  }, [currentSiteId]);

  const addCondition = () => {
    setRuleValue({
      rule: {
        ...ruleValue.rule,
        conditions: {
          ...ruleValue.rule.conditions,
          must: [
            ...ruleValue.rule.conditions.must,
            {
              criterion: 'TEXT',
              value: '',
              operation: 'EQ',
            },
          ],
        },
      },
    });
  };

  const onConditionsChange = (e: any, index: number, inputName: string) => {
    const newMust = [...ruleValue.rule.conditions.must];
    switch (inputName) {
      case 'fieldName':
        newMust[index] = { ...newMust[index], fieldName: e.target.value };
        break;
      case 'attributeKey':
        newMust[index] = { ...newMust[index], attributeKey: e.target.value };
        break;
      case 'criterion':
        newMust[index] = { ...newMust[index], criterion: e.target.value };
        if (e.target.value !== 'FIELD') {
          delete newMust[index].fieldName;
        }
        break;
      case 'operation':
        newMust[index] = { ...newMust[index], operation: e.target.value };
        break;
      case 'value':
        newMust[index] = { ...newMust[index], value: e.target.value };
        break;
    }
    setRuleValue({
      rule: {
        ...ruleValue.rule,
        conditions: { ...ruleValue.rule.conditions, must: newMust },
      },
    });
  };

  return (
    <form onSubmit={onSubmit} className="max-h-120 overflow-y-auto">
      <div className="flex flex-col lg:flex-row justify-start items-end gap-2 p-2">
        <div className="flex flex-col justify-start gap-2">
          <label
            htmlFor="description"
            className="block text-sm font-bold text-neutral-900"
          >
            Description
          </label>
          <input
            name="description"
            placeholder="Description"
            type="text"
            value={ruleValue.rule.description}
            onChange={(e) =>
              setRuleValue({
                rule: { ...ruleValue.rule, description: e.target.value },
              })
            }
            minLength={1}
            required={true}
            autoFocus={true}
            className="w-64 p-2 border border-neutral-300 rounded"
          />
        </div>
        <div className="flex flex-col justify-start gap-2">
          <label
            htmlFor="priority"
            className="block text-sm font-bold text-neutral-900"
          >
            Priority
          </label>
          <input
            name="priority"
            placeholder="Priority"
            type="number"
            min="0"
            value={ruleValue.rule.priority}
            onChange={(e) =>
              setRuleValue({
                rule: { ...ruleValue.rule, priority: e.target.value },
              })
            }
            required={true}
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-24 p-2 border border-neutral-300 rounded"
          />
        </div>
        <div className="flex flex-col justify-start gap-2">
          <label
            htmlFor="status"
            className="block text-sm font-bold text-neutral-900"
          >
            Status
          </label>
          <select
            name="status"
            id="status"
            className="w-36 p-2 border border-neutral-300 rounded"
            value={ruleValue.rule.status}
            onChange={(e) =>
              setRuleValue({
                rule: { ...ruleValue.rule, status: e.target.value },
              })
            }
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-start items-end gap-2 p-2">
        <div className="flex flex-col justify-start gap-2">
          <label
            htmlFor="workflowId"
            className="block text-sm font-bold text-neutral-900"
          >
            Workflow to Trigger
          </label>
          <select
            aria-label="Workflow to Trigger"
            value={ruleValue.rule.workflowId}
            name="workflowId"
            className="appearance-none -md relative block w-full px-3 py-3 border border-neutral-300 placeholder-gray-500 text-gray-900 -t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 rounded"
            onChange={(e) =>
              setRuleValue({
                rule: { ...ruleValue.rule, workflowId: e.target.value },
              })
            }
          >
            {workflows &&
              workflows.map((workflow: any, i: number) => {
                return (
                  <option key={i} value={workflow.workflowId}>
                    {workflow.name} ({workflow.workflowId})
                  </option>
                );
              })}
          </select>
        </div>
      </div>

      {ruleValue.rule.conditions.must.map((condition: any, index: number) => {
        return (
          <div
            key={index}
            className="flex flex-col lg:flex-row justify-start items-end gap-2 p-2"
          >
            <div className="flex flex-col justify-start gap-2">
              <label
                htmlFor="criterion"
                className="block text-sm font-bold text-neutral-900"
              >
                Criterion
              </label>
              <select
                name="criterion"
                className="w-36 p-2 border border-neutral-300 rounded"
                value={ruleValue.rule.conditions.must[index].criterion}
                onChange={(e) => onConditionsChange(e, index, 'criterion')}
              >
                <option value="TEXT">TEXT</option>
                <option value="CONTENT_TYPE">CONTENT_TYPE</option>
                <option value="BARCODE">BARCODE</option>
                <option value="FIELD">FIELD</option>
                <option value="ATTRIBUTE">ATTRIBUTE</option>
              </select>
            </div>

            {ruleValue.rule.conditions.must[index].criterion === 'FIELD' && (
              <div className="flex flex-col justify-start gap-2">
                <label
                  htmlFor="fieldName"
                  className="block text-sm font-bold text-neutral-900"
                >
                  Field Name
                </label>
                <input
                  name="fieldName"
                  placeholder="Field Name"
                  type="text"
                  value={ruleValue.rule.conditions.must[index].fieldName}
                  onChange={(e) => onConditionsChange(e, index, 'fieldName')}
                  minLength={1}
                  required={true}
                  className="w-72 p-2 border border-neutral-300 rounded"
                />
              </div>
            )}

            {ruleValue.rule.conditions.must[index].criterion ===
              'ATTRIBUTE' && (
              <div className="flex flex-col justify-start gap-2">
                <label
                  htmlFor="attributeKey"
                  className="block text-sm font-bold text-neutral-900"
                >
                  Attribute Key
                </label>
                <input
                  name="attributeKey"
                  placeholder="Attribute Key"
                  type="text"
                  value={ruleValue.rule.conditions.must[index].attributeKey}
                  onChange={(e) => onConditionsChange(e, index, 'attributeKey')}
                  minLength={1}
                  required={true}
                  className="w-72 p-2 border border-neutral-300 rounded"
                />
              </div>
            )}

            <div className="flex flex-col justify-start gap-2">
              <label
                htmlFor="operation"
                className="block text-sm font-bold text-neutral-900"
              >
                Operation
              </label>
              <select
                name="operation"
                className="w-36 p-2 border border-neutral-300 rounded"
                value={ruleValue.rule.conditions.must[index].operation}
                onChange={(e) => onConditionsChange(e, index, 'operation')}
              >
                <option value="EQ">Equal</option>
                <option value="CONTAINS">Contains</option>
              </select>
            </div>

            <div className="flex flex-col justify-start gap-2">
              <label
                htmlFor="value"
                className="block text-sm font-bold text-neutral-900"
              >
                Value
              </label>
              <input
                name="value"
                placeholder="Value"
                type="text"
                value={ruleValue.rule.conditions.must[index].value}
                onChange={(e) => onConditionsChange(e, index, 'value')}
                className="w-72 p-2 border border-neutral-300 rounded"
              />
            </div>

            <button
              onClick={() => {
                const newMust = [...ruleValue.rule.conditions.must];
                newMust.splice(index, 1);
                setRuleValue({
                  rule: {
                    ...ruleValue.rule,
                    conditions: { ...ruleValue.rule.conditions, must: newMust },
                  },
                });
              }}
              className="w-5 text-neutral-900 mb-2 hover:text-primary-500 cursor-pointer focus:outline-none focus:text-primary-500 active:text-primary-500 transition-all duration-300 ease-in-out"
              type="button"
              aria-label="Delete condition"
            >
              <Close />
            </button>
          </div>
        );
      })}
      <div className="">
        <ButtonTertiary
          onClick={addCondition}
          type="button"
          className="flex flex-row justify-start items-end gap-2 p-2 my-2 hover:text-primary-500"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="w-5">
            <Plus />
          </div>
          Add Condition
        </ButtonTertiary>
      </div>
      <div className="flex flex-row gap-2 h-[42px] ml-2 mb-2">
        <ButtonPrimary type="submit">Save</ButtonPrimary>
        <ButtonGhost type="button" onClick={onCancelEdit}>
          Cancel
        </ButtonGhost>
      </div>
    </form>
  );
};
