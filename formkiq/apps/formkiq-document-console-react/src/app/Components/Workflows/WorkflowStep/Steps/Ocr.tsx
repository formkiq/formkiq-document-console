import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Position } from 'reactflow';
import { ConfigState } from '../../../../Store/reducers/config';
import { Documents, Plus } from '../../../Icons/icons';
import { DefaultSourceHandle } from '../../Handles/handles';
import Checkbox from '../NodeComponents/Checkbox';
import { NodeNameSelector } from '../NodeComponents/NodeNameSelector';
import NodeTitle from '../NodeComponents/NodeTitle';
import NumberInput from '../NodeComponents/NumberInput';
import ParametersSelector from '../NodeComponents/ParametersSelector';

function Ocr({
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
  const { formkiqVersion } = useSelector(ConfigState);

  let ocrTypesSelectorOptions: any = {
    TEXT: 'Text Recognition',
  };

  let ocrEngineSelectorOptions: any = {
    TESSERACT: 'Tesseract',
  };

  // add textract if module enabled
  if (formkiqVersion.modules.includes('textract')) {
    ocrEngineSelectorOptions = {
      ...ocrEngineSelectorOptions,
      TEXTRACT: 'Textract',
    };
    ocrTypesSelectorOptions = {
      ...ocrTypesSelectorOptions,
      FORMS: 'Form Recognition',
      TABLES: 'Table Recognition',
    };
  }

  const MAX_CONNECTIONS = 1;
  let isHandleConnectable = false;
  let connectionsNumber = MAX_CONNECTIONS;
  if (edges) {
    connectionsNumber = edges.filter((e: any) => e.source === id).length;
  }
  isHandleConnectable = useMemo(() => {
    if(readOnly) return false;
    return connectionsNumber < MAX_CONNECTIONS;
  }, [connectionsNumber, MAX_CONNECTIONS]);

  return (
    <>
      {isEditing && (
        <NodeNameSelector
          newStep={newStep}
          setNewStep={setNewStep}
        />
      )}
      {!isEditing && (
        <NodeTitle
          icon={<Documents />}
          title="Optical Character Recognition (OCR)"
        />
      )}
      {!isEditing && <div className="h-px bg-gray-400 my-1.5 w-full"></div>}
      <ParametersSelector
        options={ocrTypesSelectorOptions}
        description="OCR Parsing strategy to use"
        onChange={(value: any) => onChange(value, 'ocrParseTypes')}
        selectedValue={
          isEditing
            ? newStep?.parameters?.ocrParseTypes
            : data.parameters?.ocrParseTypes
        }
        isEditing={isEditing}
      />

      <ParametersSelector
        options={ocrEngineSelectorOptions}
        description="OCR Engine to use"
        onChange={(value: any) => onChange(value, 'ocrEngine')}
        selectedValue={
          isEditing
            ? newStep?.parameters?.ocrEngine
            : data.parameters?.ocrEngine
        }
        isEditing={isEditing}
      />

      <NumberInput
        description="Number of Pages to Process (from start)"
        editDescription='use "-1" for no limit'
        defaultValue={-1}
        min={-1}
        onChange={(value: any) => onChange(value, 'ocrNumberOfPages')}
        selectedValue={
          isEditing
            ? newStep?.parameters?.ocrNumberOfPages
            : data.parameters?.ocrNumberOfPages
        }
        isEditing={isEditing}
      />

      <Checkbox
        description="PDF Documents convert images to text"
        onChange={(value: any) =>
          onChange(value, 'addPdfDetectedCharactersAsText')
        }
        selectedValue={
          isEditing
            ? newStep?.parameters?.addPdfDetectedCharactersAsText
            : data.parameters?.addPdfDetectedCharactersAsText
        }
        isEditing={isEditing}
      />

      {!isEditing && (
        <DefaultSourceHandle
          type="source"
          position={Position.Right}
          id="approve"
          maxConnections={1}
          nodeId={id}
          readOnly={readOnly}
        ></DefaultSourceHandle>
      )}
      {isHandleConnectable && (
        <div
          className="w-6 mt-6 rounded-full bg-green-400 text-white hover:border-green-700 p-1  cursor-pointer absolute right-[-36px] border-2 border-white hover:text-green-700 nodrag"
          style={{ top: 'calc(50% - 12px)' }}
          onClick={addCreatorNode}
        >
          <Plus />
        </div>
      )}
    </>
  );
}

export default Ocr;
