import {formatBytes} from "../../../helpers/services/toolService";
import {useState} from "react";
import {Pencil} from "../../Icons/icons";

function MetadataList({metadata, onEdit}: { metadata: any, onEdit: any }) {

  const [isEditingDeeplinkPath, setIsEditingDeeplinkPath] = useState(false);
  const [deeplinkPath, setDeeplinkPath] = useState(metadata?.deepLinkPath || '');

  const handleSaveDeeplinkPath = () => {
    onEdit('deepLinkPath', deeplinkPath);
    setIsEditingDeeplinkPath(false);
  }


  return (
    <div>
      {metadata ? (
        <div className="overflow-auto max-h-64">
          <table className="border-collapse table-fixed w-full text-sm">
            <thead>
            <tr>
              <th
                className="border-b font-medium p-4 pr-8 pt-0 pb-3 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Path
              </th>
              <th
                className="border-b font-medium p-4 pr-8 pt-0 pb-3 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                DeepLinkPath
              </th>
              <th
                className="border-b font-medium p-4 pr-8 pt-0 pb-3 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Content-Type
              </th>
              <th
                className="border-b font-medium p-4 pr-8 pt-0 pb-3 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Filesize
              </th>
            </tr>
            </thead>

            <tbody className="bg-white nodark:bg-slate-800">
            <tr>
              <td className="p-4 text-start w-52 truncate">{metadata.path}</td>
              <td className="p-4 text-start">{(isEditingDeeplinkPath ?
                <div className='flex items-start gap-2'><input type="text" value={deeplinkPath}
                                                               className="border border-neutral-300 rounded-md h-6"
                                                               placeholder="Deep Link Path"
                                                               onChange={e => setDeeplinkPath(e.target.value)}/>
                  <button onClick={handleSaveDeeplinkPath}>Save</button>
                </div> : <span className='flex items-start gap-2'>{metadata?.deepLinkPath ? metadata?.deepLinkPath :
                  <span className="text-neutral-500 w-72 truncate">No deeplink found</span>}
                  <button type="button" className="h-4 w-4 min-w-4 mt-1"
                          onClick={() => setIsEditingDeeplinkPath(true)}><Pencil/></button></span>)}</td>
              <td className="p-4 text-start">{metadata.contentType}</td>
              <td className="p-4 text-start">{formatBytes(metadata.contentLength)}</td>
            </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center mt-4">
          <div role="status">
            <div className="overflow-x-auto relative">No metadata found</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MetadataList;
