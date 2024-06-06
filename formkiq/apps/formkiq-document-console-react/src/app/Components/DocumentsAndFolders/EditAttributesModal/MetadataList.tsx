import {formatBytes} from "../../../helpers/services/toolService";
import {useState} from "react";
import {Pencil} from "../../Icons/icons";
import ButtonPrimaryGradient from "../../Generic/Buttons/ButtonPrimaryGradient";

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
          <table className="border border-neutral-300 border-collapse table-fixed w-full text-sm">
            <thead className="sticky top-0 bg-white font-bold py-3 bg-neutral-100">
            <tr>
              <th
                className="w-48 p-4 pr-8 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Path
              </th>
              <th
                className="p-4 pr-8 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                DeepLinkPath
              </th>
              <th
                className="w-36 p-4 pr-8 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Content-Type
              </th>
              <th
                className="w-24 p-4 pr-8 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Filesize
              </th>
            </tr>
            </thead>

            <tbody className="bg-white nodark:bg-slate-800">
            <tr className="border-t border-neutral-300">
              <td className="p-4 text-start truncate">{metadata.path}</td>
              <td className="p-4 text-start ">{(isEditingDeeplinkPath ?
                <div className='flex items-start gap-2'><input type="text" value={deeplinkPath}
                                                               className="border border-neutral-300 rounded-md h-6 w-36"
                                                               placeholder="Deep Link Path"
                                                               onChange={e => setDeeplinkPath(e.target.value)}/>
                  <ButtonPrimaryGradient onClick={handleSaveDeeplinkPath}>Save</ButtonPrimaryGradient>
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
