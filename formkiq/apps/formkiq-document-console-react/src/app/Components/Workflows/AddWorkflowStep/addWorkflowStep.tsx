import { useForm } from 'react-hook-form';

export default function AddWorkflowStep({ onAdd }: { onAdd: any }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const onSave = () => {
    onAdd();
  };

  const toggleStepAction = (val: any) => {
    console.log(val);
    switch (val) {
      case 'Approval':
        document
          .getElementById('settingsForApproval')
          ?.classList.remove('hidden');
        document
          .getElementById('settingsForAntivirus')
          ?.classList.add('hidden');
        document.getElementById('settingsForOcr')?.classList.add('hidden');
        document.getElementById('settingsForFulltext')?.classList.add('hidden');
        document
          .getElementById('settingsForDocumentTagging')
          ?.classList.add('hidden');
        document.getElementById('settingsForFolder')?.classList.add('hidden');
        document.getElementById('settingsForMetadata')?.classList.add('hidden');
        break;
      case 'Antivirus':
        document.getElementById('settingsForApproval')?.classList.add('hidden');
        document
          .getElementById('settingsForAntivirus')
          ?.classList.remove('hidden');
        document.getElementById('settingsForOcr')?.classList.add('hidden');
        document.getElementById('settingsForFulltext')?.classList.add('hidden');
        document
          .getElementById('settingsForDocumentTagging')
          ?.classList.add('hidden');
        document.getElementById('settingsForFolder')?.classList.add('hidden');
        document.getElementById('settingsForMetadata')?.classList.add('hidden');
        break;
      case 'Ocr':
        document.getElementById('settingsForApproval')?.classList.add('hidden');
        document
          .getElementById('settingsForAntivirus')
          ?.classList.add('hidden');
        document.getElementById('settingsForOcr')?.classList.remove('hidden');
        document.getElementById('settingsForFulltext')?.classList.add('hidden');
        document
          .getElementById('settingsForDocumentTagging')
          ?.classList.add('hidden');
        document.getElementById('settingsForFolder')?.classList.add('hidden');
        document.getElementById('settingsForMetadata')?.classList.add('hidden');
        break;
      case 'Fulltext':
        // NOTE: no fulltext settings atm
        document.getElementById('settingsForApproval')?.classList.add('hidden');
        document
          .getElementById('settingsForAntivirus')
          ?.classList.add('hidden');
        document.getElementById('settingsForOcr')?.classList.add('hidden');
        document.getElementById('settingsForFulltext')?.classList.add('hidden');
        document
          .getElementById('settingsForDocumentTagging')
          ?.classList.add('hidden');
        document.getElementById('settingsForFolder')?.classList.add('hidden');
        document.getElementById('settingsForMetadata')?.classList.add('hidden');
        break;
      case 'DocumentTagging':
        document.getElementById('settingsForApproval')?.classList.add('hidden');
        document
          .getElementById('settingsForAntivirus')
          ?.classList.add('hidden');
        document.getElementById('settingsForOcr')?.classList.add('hidden');
        document.getElementById('settingsForFulltext')?.classList.add('hidden');
        document
          .getElementById('settingsForDocumentTagging')
          ?.classList.remove('hidden');
        document.getElementById('settingsForFolder')?.classList.add('hidden');
        document.getElementById('settingsForMetadata')?.classList.add('hidden');
        break;
      case 'Folder':
        document.getElementById('settingsForApproval')?.classList.add('hidden');
        document
          .getElementById('settingsForAntivirus')
          ?.classList.add('hidden');
        document.getElementById('settingsForOcr')?.classList.add('hidden');
        document.getElementById('settingsForFulltext')?.classList.add('hidden');
        document
          .getElementById('settingsForDocumentTagging')
          ?.classList.add('hidden');
        document
          .getElementById('settingsForFolder')
          ?.classList.remove('hidden');
        document.getElementById('settingsForMetadata')?.classList.add('hidden');
        break;
      case 'Metadata':
        document.getElementById('settingsForApproval')?.classList.add('hidden');
        document
          .getElementById('settingsForAntivirus')
          ?.classList.add('hidden');
        document.getElementById('settingsForOcr')?.classList.add('hidden');
        document.getElementById('settingsForFulltext')?.classList.add('hidden');
        document
          .getElementById('settingsForDocumentTagging')
          ?.classList.add('hidden');
        document.getElementById('settingsForFolder')?.classList.add('hidden');
        document
          .getElementById('settingsForMetadata')
          ?.classList.remove('hidden');
        break;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSave)} className="w-full">
      <div className="flex flex-wrap bg-yellow-100 items-start mx-4 mb-4 relative w-3/4 p-2 rounded-md border-2">
        <div className="flex items-start mx-4 mb-4 relative w-full">
          <div className="w-full flex flex-wrap">
            <label className="pr-4 w-full md:w-1/4 font-semibold">
              New Step Action:
            </label>
            <select
              aria-label="New Step Action"
              name="stepAction"
              onChange={(event) => {
                toggleStepAction(event.target.value);
              }}
              className="appearance-none rounded-md relative block w-3/4 md:w-1/2 px-2 py-2 border border-gray-600
                text-sm font-semibold
                placeholder-gray-500 text-gray-900 rounded-t-md
                focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
            >
              <option value="">-- choose --</option>
              <option value="Approval">Review / Approval Queue</option>
              <option value="Antivirus">Anti-Malware Scan</option>
              <option value="Ocr">Optical Character Recognition (OCR)</option>
              <option value="Fulltext">Fulltext Search - Add to Index</option>
              <option value="DocumentTagging">
                Intelligent Document Classification
              </option>
              <option value="Folder">Move / Save to Folder</option>
              <option value="Metadata">Add / Edit Document Metadata</option>
            </select>
          </div>
        </div>
        <div
          id="settingsForApproval"
          className="hidden flex items-start pl-5 relative w-full"
        >
          <div className="w-full flex flex-wrap">
            <label className="pr-4 w-full md:w-1/4">Action on Rejection:</label>
            <select
              aria-label="Action on Rejection"
              name="rejectionAction"
              className="appearance-none rounded-md relative block w-3/4 md:w-1/2 px-2 py-2 border border-gray-600
                text-sm
                placeholder-gray-500 text-gray-900 rounded-t-md
                focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
            >
              <option value="End">End Workflow</option>
              <option value="Back">Back to Step...</option>
              <option value="Next">On to Next Step</option>
              <option value="Disabled">No Rejection Allowed</option>
            </select>
          </div>
        </div>
        <div
          id="settingsForAntivirus"
          className="hidden flex items-start pl-5 relative w-full"
        >
          <div className="w-full flex flex-wrap">
            <label className="pr-4 w-full md:w-1/4">
              Action on Failed Scan:
            </label>
            <select
              aria-label="Action on Failed Scan"
              name="failureAction"
              className="appearance-none rounded-md relative block w-3/4 md:w-1/2 px-2 py-2 border border-gray-600
                text-sm
                placeholder-gray-500 text-gray-900 rounded-t-md
                focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
            >
              <option value="End">End Workflow</option>
              <option value="Back">Back to Step...</option>
              <option value="Next">On to Next Step</option>
            </select>
          </div>
        </div>
        <div
          id="settingsForOcr"
          className="hidden flex items-start pl-5 relative w-full"
        >
          <div className="w-full flex flex-wrap">
            <label className="pr-4 w-full md:w-1/4">OCR Type:</label>
            <select
              aria-label="Action on Failed Scan"
              name="failureAction"
              className="appearance-none rounded-md relative block w-3/4 md:w-1/2 px-2 py-2 border border-gray-600
                text-sm
                placeholder-gray-500 text-gray-900 rounded-t-md
                focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
            >
              <option value="Text">Text Recognition</option>
              <option value="Form">Form Recognition</option>
              <option value="Table">Table Recognition</option>
            </select>
          </div>
        </div>
        <div
          id="settingsForFulltext"
          className="hidden flex items-start pl-5 relative w-full"
        >
          Fulltext Search Settings - None
        </div>
        <div
          id="settingsForDocumentTagging"
          className="hidden flex items-start pl-5 relative w-full"
        >
          <div className="flex items-start mx-4 mb-4 relative w-full">
            <div className="w-full mr-12">
              <textarea
                rows={4}
                aria-label="List of tags (separated by commas)"
                className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600
                                        text-sm
                                        placeholder-gray-500 text-gray-900 rounded-t-md
                                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
                placeholder="List of tags (separated by commas)"
              ></textarea>
            </div>
          </div>
        </div>
        <div
          id="settingsForFolder"
          className="hidden flex items-start pl-5 relative w-full"
        >
          <div className="flex items-start mx-4 mb-4 relative w-full">
            <div className="w-full md:w-1/2 mr-12">
              <input
                aria-label="path"
                type="text"
                className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600
                                        text-sm
                                        placeholder-gray-500 text-gray-900 rounded-t-md
                                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
                placeholder="Folder Path"
              />
            </div>
          </div>
        </div>
        <div
          id="settingsForMetadata"
          className="hidden flex items-start pl-5 relative w-full"
        >
          <div className="flex items-start mx-4 mb-4 relative w-full">
            <div className="w-full mr-12">
              <textarea
                rows={4}
                aria-label="Metadata keys/values (one per line)"
                className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600
                                        text-sm
                                        placeholder-gray-500 text-gray-900 rounded-t-md
                                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
                placeholder="Metadata keys/values (one per line)"
              ></textarea>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-center mt-4 ml-2">
          <input
            type="submit"
            value="Add Step"
            className="bg-gradient-to-l from-coreOrange-400 via-red-400 to-coreOrange-500 hover:from-coreOrange-500 hover:via-red-500 hover:to-coreOrange-600 text-white text-sm font-semibold py-2 px-8 rounded-2xl flex cursor-pointer focus:outline-none"
          />
        </div>
      </div>
    </form>
  );
}
