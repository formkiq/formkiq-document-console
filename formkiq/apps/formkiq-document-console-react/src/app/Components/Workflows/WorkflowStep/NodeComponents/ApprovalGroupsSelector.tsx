import {Listbox} from "@headlessui/react";
import {RequestStatus} from "../../../../helpers/types/queues";
import {Step} from "../../../../helpers/types/workflows";
import {fetchQueues, setQueuesLoadingStatusPending} from "../../../../Store/reducers/queues";
import {fetchGroups} from "../../../../Store/reducers/userManagement";
import {RootState, useAppDispatch} from "../../../../Store/store";
import {useCallback, useEffect, useState} from "react";
import {useSelector} from 'react-redux';
import {Check, ChevronRight} from "../../../Icons/icons";
import DisplayValue from "./DisplayValue";

const ApprovalGroupsSelector = ({
                                  newStep,
                                  setNewStep,
                                  siteId,
                                  isEditing,
                                  approvalGroups,
                                }: {
  newStep: Step | null;
  setNewStep: (step: Step | null) => void;
  siteId: string;
  isEditing: boolean;
  approvalGroups: any;

}) => {
  const {
    groups,
    nextGroupsToken,
    groupsLoadingStatus,
    currentGroupsSearchPage,
    isLastGroupsSearchPageLoaded,
    isLoadingMore,
  } = useSelector((state: RootState) => state.userManagementState);

  const dispatch = useAppDispatch();
  const [isGroupsSelectorOpen, setIsGroupsSelectorOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  // load approval groups
  useEffect(() => {
    if (newStep) {
      setIsGroupsSelectorOpen(true);
      dispatch(fetchGroups({}));
    } else {
      setIsGroupsSelectorOpen(false);
    }
  }, [newStep, siteId]);

  // update selected groups
  useEffect(() => {
    const newStepGroups = groups.filter((group) =>
      newStep?.queue?.approvalGroups?.includes(group.name)
    );

    if (newStepGroups.length > 0) {
      setSelectedGroups(newStepGroups.map((group) => group.name));
    } else {
      setSelectedGroups([]);
    }
  }, [newStep, groups]);

  const handleSelectGroups = (groups: string[]) => {
    if (!newStep) return;
    const step: Step = {...newStep};
    if (step.queue) {
      step.queue = {
        ...step.queue,
        approvalGroups: groups,
      };
    } else {
      step.queue = {
        approvalGroups: groups,
      };
    }
    setNewStep(step);
  };

  // load more queues when table reaches bottom
  const trackScrolling = useCallback(async () => {
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 10 > el.scrollHeight;
      }
      return false;
    };

    const scrollpane = document.getElementById('groupsScrollPane');

    if (
      isBottom(scrollpane as HTMLElement) &&
      nextGroupsToken &&
      groupsLoadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setQueuesLoadingStatusPending());
      if (nextGroupsToken) {
        await dispatch(
          fetchQueues({
            siteId,
            nextGroupsToken,
            page: currentGroupsSearchPage + 1,
          })
        );
      }
    }
  }, [nextGroupsToken, groupsLoadingStatus, isLastGroupsSearchPageLoaded]);

  const handleScroll = (event: any) => {
    const el = event.target;
    // Track scroll when table reaches bottom
    if (el.offsetHeight + el.scrollTop + 10 > el.scrollHeight) {
      if (el.scrollTop > 0) {
        trackScrolling();
      }
    }
  };

  return (
    <>{isEditing ? (
        isGroupsSelectorOpen &&
        (groups && groups.length > 0 ? (
          <div>
            <div className="text-sm text-gray-800 mt-4 mb-2">
              Approval Groups:
            </div>
            <Listbox
              value={selectedGroups}
              onChange={(value: string[]) => handleSelectGroups(value)}
              multiple
            >
              <Listbox.Button
                className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-gray-300 nodrag nowheel">
                <span className="block truncate">
                  {selectedGroups.length > 0
                    ? selectedGroups.join(', ')
                    : 'Select ...'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <div className="rotate-90 w-4">
                    <ChevronRight/>
                  </div>
                </span>
              </Listbox.Button>
              <Listbox.Options
                id="groupsScrollPane"
                onScroll={handleScroll}
                className="mt-1 max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm nodrag nowheel"
              >
                {groups.map((group) => (
                  <Listbox.Option
                    key={group.name}
                    value={group.name}
                    className={({active}) =>
                      `relative cursor-default select-none py-2 px-4 ${
                        active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                      }`
                    }
                  >
                    {({active, selected}) => (
                      <div className="flex item-center justify-start">
                        <div className="w-5 h-5 mr-2">
                          {selected && <Check/>}
                        </div>
                        {group.name}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>
        ) : (
          <p> No Groups found. </p>
        ))) :
      <DisplayValue description={"Approval Groups"}
                    value={(approvalGroups && approvalGroups.length > 0) && approvalGroups.join(', ')}/>
    }
    </>
  );
};

export default ApprovalGroupsSelector;
