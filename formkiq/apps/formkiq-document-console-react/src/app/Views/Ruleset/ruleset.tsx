import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Close, Plus } from '../../Components/Icons/icons';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import { openDialog as openConfirmationDialog } from '../../Store/reducers/globalConfirmControls';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import {
  RulesetsState,
  deleteRule,
  fetchRules,
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
    rules,
    nextToken,
    loadingStatus,
    isLastSearchPageLoaded,
    currentSearchPage,
  } = useSelector(RulesetsState);
  const dispatch = useAppDispatch();

  useEffect(() => {
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
            attribute: 'TEXT',
            fieldName: '',
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
        <div className="w-full p-2 flex justify-end">
          <button
            onClick={() => setIsRuleEditTabVisible(true)}
            className="bg-gray-200 hover:bg-gray-300  font-bold py-2 px-4 rounded"
          >
            Create New Rule
          </button>
        </div>
        {isRuleEditTabVisible && (
          <RuleEditingTab
            onCancelEdit={onCancelEdit}
            ruleValue={newRuleValue}
            setRuleValue={setNewRuleValue}
            createNewRule={saveRule}
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
            // ShowRuleCreationTab={ShowRuleCreationTab}
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
}: {
  onCancelEdit: () => void;
  ruleValue: any;
  setRuleValue: (ruleValue: any) => void;
  createNewRule: () => void;
}) => {
  const dispatch = useAppDispatch();

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

  const addCondition = () => {
    setRuleValue({
      rule: {
        ...ruleValue.rule,
        conditions: {
          ...ruleValue.rule.conditions,
          must: [
            ...ruleValue.rule.conditions.must,
            {
              attribute: 'TEXT',
              fieldName: '',
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
      case 'attribute':
        newMust[index] = { ...newMust[index], attribute: e.target.value };
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
    <form onSubmit={onSubmit} className="max-h-80 overflow-y-auto">
      <div className="flex flex-col lg:flex-row justify-start items-end gap-2 p-2">
        <div className="flex flex-col justify-start gap-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
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
            className="w-52 p-2 border-2 border-gray-300 rounded"
          />
        </div>
        <div className="flex flex-col justify-start gap-2">
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700"
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
            className="w-24 p-2 border-2 border-gray-300 rounded"
          />
        </div>

        <div className="flex flex-col justify-start gap-2">
          <label
            htmlFor="workflowId"
            className="block text-sm font-medium text-gray-700"
          >
            Workflow ID
          </label>
          <input
            name="workflowId"
            placeholder="Workflow ID"
            value={ruleValue.rule.workflowId}
            onChange={(e) =>
              setRuleValue({
                rule: { ...ruleValue.rule, workflowId: e.target.value },
              })
            }
            required={true}
            className="w-24 p-2 border-2 border-gray-300 rounded"
          />
        </div>

        <div className="flex flex-col justify-start gap-2">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            name="status"
            id="status"
            className="w-36 p-2 border-2 border-gray-300 rounded"
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

      {ruleValue.rule.conditions.must.map((condition: any, index: number) => {
        return (
          <div
            key={index}
            className="flex flex-col lg:flex-row justify-start items-end gap-2 p-2"
          >
            <div className="flex flex-col justify-start gap-2">
              <label
                htmlFor="attribute"
                className="block text-sm font-medium text-gray-700"
              >
                Attribute
              </label>
              <select
                name="attribute"
                className="w-36 p-2 border-2 border-gray-300 rounded"
                value={ruleValue.rule.conditions.must[index].attribute}
                onChange={(e) => onConditionsChange(e, index, 'attribute')}
              >
                <option value="TEXT">TEXT</option>
                <option value="CONTENT_TYPE">CONTENT_TYPE</option>
                <option value="BARCODE">BARCODE</option>
                <option value="FIELD">FIELD</option>
              </select>
            </div>

            <div className="flex flex-col justify-start gap-2">
              <label
                htmlFor="fieldName"
                className="block text-sm font-medium text-gray-700"
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
                className="w-52 p-2 border-2 border-gray-300 rounded"
              />
            </div>

            <div className="flex flex-col justify-start gap-2">
              <label
                htmlFor="operation"
                className="block text-sm font-medium text-gray-700"
              >
                Operation
              </label>
              <select
                name="operation"
                className="w-36 p-2 border-2 border-gray-300 rounded"
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
                className="block text-sm font-medium text-gray-700"
              >
                Value
              </label>
              <input
                name="value"
                placeholder="Value"
                type="text"
                value={ruleValue.rule.conditions.must[index].value}
                onChange={(e) => onConditionsChange(e, index, 'value')}
                className="w-52 p-2 border-2 border-gray-300 rounded"
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
              className="w-5 text-gray-700 mb-2 hover:text-coreOrange-500 cursor-pointer focus:outline-none focus:text-coreOrange-500 active:text-coreOrange-500 transition-all duration-300 ease-in-out"
              type="button"
              aria-label="Delete condition"
            >
              <Close />
            </button>
          </div>
        );
      })}
      <div className="">
        <button
          onClick={addCondition}
          className="flex flex-row justify-start items-end gap-2 p-2 hover:text-coreOrange-500"
        >
          <div className="w-5">
            <Plus />
          </div>
          Add Condition
        </button>
      </div>
      <div className="flex flex-col lg:flex-row justify-start items-end gap-2 p-2">
        <button
          className="bg-coreOrange-500 hover:bg-coreOrange-600 active:bg-coreOrange-400 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          {' '}
          Save
        </button>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
          onClick={onCancelEdit}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
