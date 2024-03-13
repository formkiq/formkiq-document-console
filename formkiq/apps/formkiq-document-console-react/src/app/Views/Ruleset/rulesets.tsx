import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import { openDialog as openConfirmationDialog } from '../../Store/reducers/globalConfirmControls';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import {
  RulesetsState,
  deleteRuleset,
  fetchRulesets,
  setRulesetsLoadingStatusPending,
} from '../../Store/reducers/rulesets';
import { useAppDispatch } from '../../Store/store';
import { DocumentsService } from '../../helpers/services/documentsService';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import { RequestStatus } from '../../helpers/types/document';
import { Ruleset } from '../../helpers/types/rulesets';
import RulesetsTable from './rulesetsTable';
import ButtonPrimaryGradient from "../../Components/Generic/Buttons/ButtonPrimaryGradient";
import ButtonPrimary from "../../Components/Generic/Buttons/ButtonPrimary";
import ButtonGhost from "../../Components/Generic/Buttons/ButtonGhost";

function Rulesets() {
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
  const {
    rulesets,
    nextToken,
    loadingStatus,
    isLastSearchPageLoaded,
    currentSearchPage,
  } = useSelector(RulesetsState);
  const dispatch = useAppDispatch();
  const [isRulesetEditTabVisible, setIsRulesetEditTabVisible] = useState(false);
  const initialRulesetValue = {
    ruleset: {
      description: '',
      priority: 0,
      version: 0,
      status: 'ACTIVE',
    },
  };
  const [newRulesetValue, setNewRulesetValue] = useState<{ ruleset: Ruleset }>(
    initialRulesetValue as { ruleset: Ruleset }
  );

  // update siteId
  useEffect(() => {
    const recheckSiteInfo = getCurrentSiteInfo(
      pathname,
      user,
      hasUserSite,
      hasDefaultSite,
      hasWorkspaces,
      workspaceSites
    );
    setCurrentSiteId(recheckSiteInfo.siteId);
  }, [pathname]);

  // update rulesets when different siteId selected
  useEffect(() => {
    dispatch(fetchRulesets({ siteId: currentSiteId }));
  }, [currentSiteId]);

  // load more rulesets when table reaches bottom
  const trackScrolling = useCallback(async () => {
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 10 > el.scrollHeight;
      }
      return false;
    };

    const scrollpane = document.getElementById('rulesetsScrollPane');

    if (
      isBottom(scrollpane as HTMLElement) &&
      nextToken &&
      loadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setRulesetsLoadingStatusPending());
      if (nextToken) {
        await dispatch(
          fetchRulesets({
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
    // Track scroll when table reaches bottom
    if (el.offsetHeight + el.scrollTop + 10 > el.scrollHeight) {
      if (el.scrollTop > 0) {
        trackScrolling();
      }
    }
  };

  // Delete ruleset
  const onRulesetDelete = (rulesetId: string) => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to delete this ruleset?',
        callback: () => {
          dispatch(
            deleteRuleset({ rulesetId, siteId: currentSiteId, rulesets })
          );
        },
      })
    );
  };

  // Save new or existing ruleset
  const saveRuleset = () => {
    if (newRulesetValue.ruleset.rulesetId) {
      // Check if editing existing ruleset
      DocumentsService.updateRuleset(
        newRulesetValue.ruleset.rulesetId,
        newRulesetValue,
        currentSiteId
      ).then((res) => {
        if (res.status === 200) {
          dispatch(fetchRulesets({ siteId: currentSiteId }));
          setIsRulesetEditTabVisible(false);
          setNewRulesetValue(initialRulesetValue as { ruleset: Ruleset });
        } else {
          dispatch(
            openNotificationDialog({
              dialogTitle:
                'Error happened while saving ruleset. Please try again later',
            })
          );
        }
      });
    } else {
      DocumentsService.addRuleset(newRulesetValue, currentSiteId).then(
        (res) => {
          if (res.status === 200) {
            dispatch(fetchRulesets({ siteId: currentSiteId }));
            setIsRulesetEditTabVisible(false);
            setNewRulesetValue(initialRulesetValue as { ruleset: Ruleset });
          } else {
            dispatch(
              openNotificationDialog({
                dialogTitle:
                  'Error happened while saving ruleset. Please try again later',
              })
            );
          }
        }
      );
    }
  };

  // Open tab to create/edit ruleset
  const showRulesetEditTab = (rulesetId: string) => {
    const ruleset = rulesets.find((ruleset) => ruleset.rulesetId === rulesetId);
    if (!ruleset) {
      return;
    }
    setNewRulesetValue({ ruleset });
    setIsRulesetEditTabVisible(true);
  };

  function onCancelEdit() {
    setIsRulesetEditTabVisible(false);
    setNewRulesetValue(initialRulesetValue as { ruleset: Ruleset });
  }

  return (
    <>
      <Helmet>
        <title>Rulesets</title>
      </Helmet>
      <div
        className="flex flex-col "
        style={{
          height: `calc(100vh - 3.68rem)`,
        }}
      >
        <div className="w-full p-2 flex justify-end">
          <ButtonPrimaryGradient
            onClick={() => setIsRulesetEditTabVisible(true)}
            style={{height: '40px',}}
          >
            + Create New Ruleset
          </ButtonPrimaryGradient>
        </div>

        {isRulesetEditTabVisible && (
          <RulesetEditingTab
            onCancelEdit={onCancelEdit}
            rulesetValue={newRulesetValue}
            setRulesetValue={setNewRulesetValue}
            saveRuleset={saveRuleset}
          />
        )}

        <div
          className="flex-1 inline-block overflow-y-scroll overflow-x-auto h-full"
          id="rulesetsScrollPane"
          onScroll={handleScroll}
        >
          <RulesetsTable
            rulesets={rulesets}
            onRulesetDelete={onRulesetDelete}
            showRulesetEditTab={showRulesetEditTab}
          />
        </div>
      </div>
    </>
  );
}

export default Rulesets;

const RulesetEditingTab = ({
  onCancelEdit,
  rulesetValue,
  setRulesetValue,
  saveRuleset,
}: {
  onCancelEdit: () => void;
  rulesetValue: any;
  setRulesetValue: (rulesetValue: any) => void;
  saveRuleset: () => void;
}) => {
  const onSubmit = (e: any) => {
    e.preventDefault();
    saveRuleset();
  };
  return (
    <form
      className="flex flex-col lg:flex-row justify-start items-end gap-2 p-2"
      onSubmit={onSubmit}
    >
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
          value={rulesetValue.ruleset.description}
          onChange={(e) =>
            setRulesetValue({
              ruleset: { ...rulesetValue.ruleset, description: e.target.value },
            })
          }
          minLength={1}
          required={true}
          autoFocus={true}
          min="0"
          className="w-52 p-2 border border-neutral-300 rounded"
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
          value={rulesetValue.ruleset.priority}
          onChange={(e) =>
            setRulesetValue({
              ruleset: { ...rulesetValue.ruleset, priority: e.target.value },
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
          htmlFor="version"
          className="block text-sm font-medium text-gray-700"
        >
          Version
        </label>
        <input
          name="version"
          placeholder="Version"
          type="number"
          min="0"
          value={rulesetValue.ruleset.version}
          onChange={(e) =>
            setRulesetValue({
              ruleset: { ...rulesetValue.ruleset, version: e.target.value },
            })
          }
          required={true}
          className="w-24 p-2 border border-neutral-300 rounded"
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
          className="w-36 p-2 border border-neutral-300 rounded"
          value={rulesetValue.ruleset.status}
          onChange={(e) =>
            setRulesetValue({
              ruleset: { ...rulesetValue.ruleset, status: e.target.value },
            })
          }
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>
      <div className="flex flex-row gap-2 h-[42px]">
        <ButtonPrimary
          type="submit"
        >
          Save
        </ButtonPrimary>
        <ButtonGhost
          type="button"
          onClick={onCancelEdit}
        >
          Cancel
        </ButtonGhost>
      </div>
    </form>
  );
};
