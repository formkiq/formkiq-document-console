import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ConfigState } from '../../../../Store/reducers/config';
import { Documents } from '../../../Icons/icons';
import Checkbox from '../NodeComponents/Checkbox';
import NumberInput from '../NodeComponents/NumberInput';
import ParametersSelector from '../NodeComponents/ParametersSelector';
import MultipleParametersSelector from '../NodeComponents/MultipleParametersSelector';
import { NodeContentProps, NodeWrapper } from '../NodeComponents/NodeWrapper';

export function OcrContent({
  isEditing,
  data,
  newStep,
  onChange,
}: NodeContentProps) {
  const { formkiqVersion } = useSelector(ConfigState);

  const [ocrEngineSelectorOptions, setOcrEngineSelectorOptions] = useState<any>(
    {
      TESSERACT: 'Tesseract',
    }
  );
  const [ocrTypesSelectorOptions, setOcrTypesSelectorOptions] = useState<any>({
    TEXT: 'Text Recognition',
  });

  const updateOcrEngineSelectorOptions = () => {
    if (!formkiqVersion.modules.includes('textract')) return;
    setOcrEngineSelectorOptions({
      TESSERACT: 'Tesseract',
      TEXTRACT: 'Textract',
    });
    if (isEditing && newStep?.parameters?.ocrEngine === 'TEXTRACT') {
      onOcrEngineChange('TEXTRACT');
    }
  };

  useEffect(() => {
    updateOcrEngineSelectorOptions();
  }, []);

  const onOcrEngineChange = (value: any) => {
    onChange(value, 'ocrEngine');
    if (value === 'TEXTRACT') {
      setOcrTypesSelectorOptions({
        TEXT: 'Text Recognition',
        FORMS: 'Form Recognition',
        TABLES: 'Table Recognition',
      });
    } else {
      onChange('TEXT', 'ocrParseTypes');
      setOcrTypesSelectorOptions({
        TEXT: 'Text Recognition',
      });
    }
  };
  return (
    <>
      <ParametersSelector
        options={ocrEngineSelectorOptions}
        description="OCR Engine to use"
        onChange={onOcrEngineChange}
        selectedValue={
          isEditing
            ? newStep?.parameters?.ocrEngine
            : data.parameters?.ocrEngine
        }
        isEditing={isEditing}
      />

      <MultipleParametersSelector
        options={ocrTypesSelectorOptions}
        description="OCR Parsing strategy to use"
        onChange={(value: any) => onChange(value, 'ocrParseTypes')}
        selectedValues={
          isEditing
            ? newStep?.parameters?.ocrParseTypes
            : data.parameters?.ocrParseTypes
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
    </>
  );
}

function Ocr(props: any) {
  return (
    <NodeWrapper
      id={props.id}
      icon={<Documents />}
      title="Optical Character Recognition (OCR)"
      isEditing={props.isEditing}
      readOnly={props.readOnly}
      newStep={props.newStep}
      setNewStep={props.setNewStep}
      edges={props.edges}
      addCreatorNode={props.addCreatorNode}
      maxConnections={1}
    >
      <OcrContent {...props} />
    </NodeWrapper>
  );
}

export default Ocr;
