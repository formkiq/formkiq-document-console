import {useCallback, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {useSelector} from 'react-redux';
import {RequestStatus} from '../../helpers/types/document';
import {openDialog as openConfirmationDialog} from '../../Store/reducers/globalConfirmControls';
import {useAppDispatch} from '../../Store/store';
import {openDialog as openNotificationDialog} from '../../Store/reducers/globalNotificationControls';
import ShareModal from '../../Components/Share/share';
import {
  deleteGroup,
  fetchGroups,
  setGroupsLoadingStatusPending,
  UserManagementState
} from "../../Store/reducers/userManagement";
import GroupsMenu from "../../Components/UserManagement/Menus/GroupsMenu";
import {Plus} from "../../Components/Icons/icons";
import CreateGroupModal from "../../Components/UserManagement/Modals/CreateGroupModal";
import GroupsTable from "./groupsTable";

function Groups() {
  const {
    groups,
    nextGroupsToken,
    groupsLoadingStatus,
    isLastGroupsSearchPageLoaded,
    currentGroupsSearchPage,
  } = useSelector(UserManagementState);
  const dispatch = useAppDispatch();
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [selectedGroupNames, setSelectedGroupNames] = useState<string[]>([]);

  useEffect(() => {
      dispatch(fetchGroups({}));
  }, []);

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
            nextToken:nextGroupsToken,
            page: currentGroupsSearchPage + 1,
          })
        );
      }
    }
  }, [nextGroupsToken, groupsLoadingStatus,     isLastGroupsSearchPageLoaded]);

  const handleScroll = (event: any) => {
    const el = event.target;
    // Track scroll when table reaches bottom
    if (el.offsetHeight + el.scrollTop + 10 > el.scrollHeight) {
      if (el.scrollTop > 0) {
        trackScrolling();
      }
    }
  };

  // delete selected groups
  const onGroupsDelete = () => {
    if (selectedGroupNames.length === 0) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Please select at least one group',
        })
      );
    }

    const deleteGroups = () => {
      for (const groupName of selectedGroupNames) {
        dispatch(deleteGroup({groups, groupName}));
      }
    };

    if (selectedGroupNames.length > 0) {
      dispatch(
        openConfirmationDialog({
          dialogTitle:
            'Are you sure you want to delete ' +
            selectedGroupNames.length +
            ' selected groups?',
          callback: deleteGroups,
        })
      );
    }
  };

  // delete one group
  const onGroupDelete = (groupName: string) => {
    dispatch(openConfirmationDialog(
      {
        dialogTitle:
          'Are you sure you want to delete ' +
          groupName +
          '?',
        callback: () => {
          dispatch(deleteGroup({groups, groupName}));
        },
      }
    ));
  };

  const onGroupInfoClick = (groupName:string) => {
    // TODO: open group info pane
    console.log(groupName)
  }

  const onManageMembersClick =  (groupName:string) => {
    // TODO: open manage users modal
    console.log(groupName)
  }

  return (
    <>
      <Helmet>
        <title>Groups</title>
      </Helmet>
      <div
        className="flex flex-row "
        style={{
          height: `calc(100vh - 3.68rem)`,
        }}
      >
        <div className="flex-1 inline-block h-full">
          <div className=" flex flex-col w-full h-full">
            <GroupsMenu
              deleteGroups={onGroupsDelete}
            />
            <div className="w-full py-4 px-6">
              <button type="button"
                      className="p-6 border border-neutral-300 rounded-md flex items-center gap-4 justify-center hover:bg-neutral-100 font-bold text-sm"
                      onClick={() => setIsCreateGroupModalOpen(true)}>
                <div
                  className="w-6 h-6 p-1 flex items-center justify-center border border-2 border-neutral-900 rounded-full">
                  <Plus/>
                </div>
                Create New Group
              </button>
            </div>
            <h2 className="px-6 pb-4 text-sm font-bold">Your Groups</h2>
            <div className="relative overflow-hidden h-full">
              <div
                className="overflow-y-scroll overflow-x-auto h-full w-full"
                id="groupsScrollPane"
                onScroll={handleScroll}
              >
                <GroupsTable
                  groups={groups}
                  selectedGroupNames={selectedGroupNames}
                  onDeleteClick={onGroupDelete}
                  setSelectedGroupNames={setSelectedGroupNames}
                  onGroupInfoClick={onGroupInfoClick}
                  onManageMembersClick={onManageMembersClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        setIsOpen={setIsCreateGroupModalOpen}
      />
    </>
  );
}

export default Groups;
