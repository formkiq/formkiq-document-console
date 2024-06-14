import {Listbox} from "@headlessui/react";
import {RequestStatus} from "../../helpers/types/queues";
import {fetchGroups, setGroupsLoadingStatusPending} from "../../Store/reducers/queues";
import {RootState, useAppDispatch} from "../../Store/store";
import {useCallback, useEffect} from "react";
import {useSelector} from 'react-redux';
import {Check, CheckedRadio, ChevronDown, ChevronRight, UncheckedRadio} from "../Icons/icons";


const GroupsSelect = ({
                        siteId,
                        selectedGroups,
                        setSelectedGroups,
                      }: {
  siteId: string;
  selectedGroups: string[];
  setSelectedGroups: (groups: string[]) => void;
}) => {
  const {
    groups,
    nextGroupsToken,
    groupsLoadingStatus,
    currentGroupsSearchPage,
    isLastGroupsSearchPageLoaded,
  } = useSelector((state: RootState) => state.queuesState);

  const dispatch = useAppDispatch();

  // load approval groups
  useEffect(() => {
    dispatch(fetchGroups({siteId, limit: 50}));
  }, []);

  const handleSelectGroups = (groups: string[]) => {
    setSelectedGroups(groups);
  };

  // load more groups when table reaches bottom
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
      dispatch(setGroupsLoadingStatusPending());
      if (nextGroupsToken) {
        await dispatch(
          fetchGroups({
            siteId,
            nextToken: nextGroupsToken,
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

  return (groups && groups.length > 0 ? (
    <div id="groupsScrollPane" className='relative h-full'>
      <Listbox
        value={selectedGroups}
        onChange={(value: string[]) => handleSelectGroups(value)}
        multiple
      >
        <Listbox.Button
          className="h-full max-h-8 bg-neutral-100 px-4 w-32 text-start font-medium flex flex-row justify-between items-center text-xs  rounded-md">
                <span className="block truncate">
                  {selectedGroups.length > 0
                    ? selectedGroups.join(', ')
                    : 'Select ...'}
                </span>
          <div className="w-3 text-neutral-500" style={{minWidth: '12px'}}>{<ChevronDown/>}</div>
        </Listbox.Button>
        <Listbox.Options
          onScroll={handleScroll}
          className="absolute top-9 left-0 h-48 overflow-y-scroll bg-white shadow-md border border-neutral-100 font-medium z-50"
        >
          {groups.map((group) => (
            <Listbox.Option
              key={group.name}
              value={group.name}
              className="h-12 hover:bg-neutral-200 px-6 flex items-center text-xs"
            >
              {({active, selected}) => (
                <div className="relative w-full h-full flex items-center">
                  <input type="checkbox" name="status" value={group.name} checked={selected} readOnly
                         className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"/>
                  <label className="flex items-center justify-between gap-2 w-full"><span
                    className="block truncate">{group.name}</span>
                    <div className="w-4">{selected ? <CheckedRadio/> : <UncheckedRadio/>}</div>
                  </label>
                </div>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  ) : (
    <p> No Groups found. </p>
  ))
};

export default GroupsSelect;
