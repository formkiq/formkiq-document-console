import {Menu, Transition} from "@headlessui/react";
import {Copy, CopyToClipboard, Download, MoreActions, Trash} from "../../Icons/icons";
import {Tooltip} from "react-tooltip";

export default function WorkflowsActionsPopover({
                                                  workflow,
                                                  siteId,
                                                  onDeleteClick,
                                                  handleDuplicateClick,
                                                  handleDownloadClick,
                                                  handleCopyToClipBoard,
                                                  showTooltipId
                                                }:any) {
  return (
    <Menu as="div" className="flex items-center">
      <Menu.Button
        className="ml-2 rounded-md hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        data-tooltip-id={workflow.workflowId ?? 'copy-tooltip'}
        data-tooltip-content="Copied!">

        <div className="h-5 w-5">
          <MoreActions/>
        </div>
      </Menu.Button>
      <Tooltip id={workflow.workflowId ?? 'copy-tooltip'}
               isOpen={showTooltipId === workflow.workflowId}/>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items
          className="absolute -left-52 z-50 mt-2 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">

          <Menu.Item>
            {({active}) => (
              <button
                onClick={() => handleDuplicateClick(workflow.workflowId, siteId)}
                className={`${active ? "bg-gray-100 text-primary-500" : "text-gray-900"} flex items-center py-2 px-3 w-full justify-start text-start font-medium`}
              >
                <div className="mr-2 h-5 w-6">
                  <Copy/></div>
                Duplicate Workflow
              </button>
            )}
          </Menu.Item>

          <Menu.Item>
            {({active}) => (
              <button
                onClick={() => handleCopyToClipBoard(workflow.workflowId, siteId)}
                className={`${active ? "bg-gray-100 text-primary-500" : "text-gray-900"} flex items-center py-2 px-3 w-full justify-start text-start font-medium`}
              >
                <div className="mr-2 h-6 w-6">
                  <CopyToClipboard/></div>
                Copy JSON to Clipboard
              </button>
            )}
          </Menu.Item>

          <Menu.Item>
            {({active}) => (
              <button
                onClick={() => handleDownloadClick(workflow.workflowId, siteId)}
                className={`${active ? "bg-gray-100 text-primary-500" : "text-gray-900"} flex items-center py-2 px-3 w-full justify-start text-start font-medium`}
              >
                <div className="mr-2 h-5 w-6">
                  <Download/></div>
                Download JSON
              </button>
            )}
          </Menu.Item>

          <Menu.Item>
            {({active}) => (
              <button onClick={onDeleteClick(workflow.workflowId, siteId)}
                      className={`${active ? "bg-neutral-100 text-primary-500" : "text-neutral-900"} flex items-center py-2 px-3 w-full justify-start text-start font-medium`}
              >
                <div className="mr-2 h-5 w-6">
                  <Trash/></div>
                Delete
              </button>
            )}
          </Menu.Item>

        </Menu.Items>
      </Transition>
    </Menu>
  )
}
