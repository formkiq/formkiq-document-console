import {useEffect, useMemo, useState} from "react";
import {Position} from "reactflow";
import {IntelligentClassification, Plus} from "../../../Icons/icons";
import {DefaultSourceHandle} from "../../Handles/handles";
import NodeTitle from "../NodeComponents/NodeTitle";
import {NodeNameSelector} from "../NodeComponents/NodeNameSelector";
import ParametersSelector from "../NodeComponents/ParametersSelector";
import {DocumentsService} from "../../../../helpers/services/documentsService";
import {useAuthenticatedState} from "../../../../Store/reducers/auth";
import {getCurrentSiteInfo, getUserSites} from "../../../../helpers/services/toolService";
import {useLocation} from "react-router-dom";

function IntelligentDocumentProcessing({
                                         newStep,
                                         setNewStep,
                                         isEditing,
                                         data,
                                         edges,
                                         id,
                                         addCreatorNode,
                                         onChange,
                                         readOnly
                                       }: any) {
  const {user} = useAuthenticatedState();
  const {hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites} =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const {siteId} = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );
  const MAX_CONNECTIONS = 1;
  let isHandleConnectable = false
  let connectionsNumber = MAX_CONNECTIONS
  if (edges) {
    connectionsNumber = edges.filter((e: any) => e.source === id).length;
  }
  isHandleConnectable = useMemo(() => {
    if (readOnly) return false;
    return connectionsNumber < MAX_CONNECTIONS;
  }, [connectionsNumber, MAX_CONNECTIONS]);

  const [mappingSelectorOptions, setMappingSelectorOptions] = useState<any>({});

  const fetchMappings = () => {
    DocumentsService.getMappings(siteId, 100).then((res: any) => {
      if (res.status === 200) {
        if (res.mappings.length > 0) {
          const options = res.mappings.reduce((acc: any, mapping: any) => {
            acc[mapping.mappingId] = mapping.name;
            return acc;
          }, {});
          setMappingSelectorOptions(options);
        }
      }
    });
  }
  useEffect(() => {
    fetchMappings();
  }, []);
  return (
    <>
      {isEditing && <NodeNameSelector newStep={newStep} setNewStep={setNewStep}/>}
      {!isEditing && <NodeTitle icon={<IntelligentClassification/>} title="Intelligent Document Processing"/>}
      {!isEditing && <div className="h-px bg-gray-400 my-1.5 w-full"></div>}
      <ParametersSelector options={mappingSelectorOptions}
                          description='Mapping'
                          onChange={(value: any) => onChange(value, 'mappingId')}
                          selectedValue={isEditing ? (newStep?.parameters?.mappingId) : data.parameters?.mappingId}
                          isEditing={isEditing}/>

      {!isEditing && <DefaultSourceHandle
        type="source"
        position={Position.Right}
        id="approve"
        maxConnections={1}
        nodeId={id}
        readOnly={readOnly}
      ></DefaultSourceHandle>}
      {isHandleConnectable && (
        <div
          className="w-6 mt-6 rounded-full bg-green-400 text-white hover:border-green-700 p-1  cursor-pointer absolute right-[-36px] border-2 border-white hover:text-green-700 nodrag"
          style={{top: 'calc(50% - 12px)'}}
          onClick={addCreatorNode}
        >
          <Plus/>
        </div>
      )}
    </>
  );
}

export default IntelligentDocumentProcessing;
