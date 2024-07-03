import {Trash} from "../../Icons/icons";
import {useAuthenticatedState} from "../../../Store/reducers/auth";

type GroupsMenuPropsType = {
  deleteGroups: () => void;
}

function GroupsMenu({deleteGroups}: GroupsMenuPropsType) {
  const {user} = useAuthenticatedState();

  return (
    <div
      className="flex justify-between items-center h-14 min-h-[56px] px-6 text-sm font-bold text-neutral-900 border-b border-neutral-300 ">
      <h2>My Groups</h2>
      {user.isAdmin &&
        <div className="flex gap-6">

          <button title="Delete" className="w-5 hover:text-primary-500" onClick={deleteGroups}>
            <Trash/>
            <span className="sr-only">Delete</span>
          </button>
        </div>
      }
    </div>
  );
}

export default GroupsMenu;
