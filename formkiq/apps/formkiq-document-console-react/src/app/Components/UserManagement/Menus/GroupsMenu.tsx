import { Trash} from "../../Icons/icons";
import {ILine} from "../../../helpers/types/line";

type GroupsMenuPropsType = {
  deleteGroups: () => void;
  onShareClick: (event: any, value: ILine | null) => void;
}

function GroupsMenu({deleteGroups, onShareClick}: GroupsMenuPropsType) {
  return (
    <div
      className="flex justify-between items-center h-14 min-h-[56px] px-6 text-sm font-bold text-neutral-900 border-b border-neutral-300 ">
      <h2>My Groups</h2>
      <div className="flex gap-6">

        <button title="Delete" className="w-5 hover:text-primary-500" onClick={deleteGroups}>
          <Trash/>
          <span className="sr-only">Delete</span>
        </button>

        {/*Sharing a group not implemented yet*/}
        {/*<button title="Share" className="w-5 hover:text-primary-500" onClick={(e)=>onShareClick(e,null)}>*/}
        {/*  <Export/>*/}
        {/*  <span className="sr-only">Share</span>*/}
        {/*</button>*/}
      </div>
    </div>
  );
}

export default GroupsMenu;
