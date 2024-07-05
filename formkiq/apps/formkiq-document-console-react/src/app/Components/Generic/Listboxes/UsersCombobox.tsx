import {Combobox} from "@headlessui/react";
import {Check} from "../../Icons/icons";
import {ChevronDown} from "../../Icons/icons";
import {useSelector} from "react-redux";
import {
  fetchUsers,
  setGroupsLoadingStatusPending,
  UserManagementState
} from "../../../Store/reducers/userManagement";
import {RequestStatus} from "../../../helpers/types/document";
import {useAppDispatch} from "../../../Store/store";
import {useCallback, useRef, useState} from "react";
import {User} from "../../../helpers/types/userManagement";

function UsersCombobox({
                         selectedValue,
                         setSelectedValue,
                       }: any) {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('')
  const {
    users,
    usersLoadingStatus,
    nextUsersToken,
    isLastUsersSearchPageLoaded,
    currentUsersSearchPage
  } = useSelector(UserManagementState);
  const buttonRef = useRef<HTMLButtonElement>(null)

  const filteredUsers =
    query === ''
      ? users
      : users.filter((user) => {
        return user.email.toLowerCase().includes(query.toLowerCase());
      })

  const trackScrolling = useCallback(async () => {
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 10 > el.scrollHeight;
      }
      return false;
    };

    const scrollpane = document.getElementById('usersScrollPane');
    if (
      isBottom(scrollpane as HTMLElement) &&
      nextUsersToken &&
      usersLoadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setGroupsLoadingStatusPending());
      if (nextUsersToken) {
        await dispatch(
          fetchUsers({
            nextToken: nextUsersToken,
            page: currentUsersSearchPage + 1,
          })
        );
      }
    }
  }, [nextUsersToken, usersLoadingStatus, isLastUsersSearchPageLoaded]);

  const handleScroll = (event: any) => {
    const el = event.target;
    // Track scroll when table reaches bottom
    if (el.offsetHeight + el.scrollTop + 10 > el.scrollHeight) {
      if (el.scrollTop > 0) {
        trackScrolling();
      }
    }
  };

  const handleFilter = (event: any) => {
    setQuery(event.target.value);
    trackScrolling();
  };

  const onUserSelect = (value: any) => {
    setSelectedValue(value);
  };

  return (
    <div className='relative h-full w-full'>
      <Combobox value={selectedValue} onChange={onUserSelect}>
        <Combobox.Input onChange={handleFilter} placeholder='Search email' onClick={() => buttonRef.current?.click()}
                        displayValue={(value: User | null) => value?.email || ''}
                        className="h-full max-h-8 bg-neutral-100 px-4 w-full text-start font-medium flex flex-row justify-between items-center text-xs  rounded-md relative"
        />

        <Combobox.Button className="w-3 text-neutral-500 absolute right-2 top-3" ref={buttonRef}
                         style={{minWidth: '12px'}}>
          {<ChevronDown/>}
        </Combobox.Button>

        <Combobox.Options
          id="usersScrollPane" onScroll={handleScroll}
          className="absolute top-9 right-0 h-48 w-full overflow-y-scroll bg-white shadow-md border border-neutral-100 font-medium z-50">
          {filteredUsers.map((user, index) => (
            <Combobox.Option key={user.username} value={user}
                             className={"h-12 hover:bg-neutral-200 px-6 flex items-center text-xs" + (selectedValue?.username === user.username ? " text-neutral-900 bg-neutral-200" : " text-neutral-500")}>
              <div className="relative w-full h-full flex items-center ">
                <input type="radio" name="status" value={user.username}
                       checked={selectedValue?.username === user.username} readOnly
                       className={"absolute left-0 top-0 h-full w-full cursor-pointer opacity-0 "}/>
                <label className="flex items-center gap-2 w-full">
                  <div className="w-4">{selectedValue?.username === user.username && <Check/>}</div>
                  <span className="block truncate">{filteredUsers[index].email}</span>

                </label>
              </div>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox></div>
  );
}


export default UsersCombobox;
