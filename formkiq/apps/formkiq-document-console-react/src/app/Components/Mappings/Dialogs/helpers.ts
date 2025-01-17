import {
  MappingAttribute,
  MappingAttributeLabelMatchingType,
  MappingAttributeMetadataField,
  MappingAttributeSourceType,
} from '../../../helpers/types/mappings';

export const isAttributeValid = (attribute: any) => {
  if (attribute.attributeKey?.length === 0) return false;
  if (attribute.sourceType?.length === 0) return false;
  if (
    attribute.sourceType !== 'MANUAL' &&
    attribute.labelMatchingType?.length === 0
  )
    return false;
  if (
    attribute.sourceType !== 'MANUAL' &&
    attribute.labelTexts?.length === 0 &&
    (!attribute.labelText || attribute.labelText.length === 0)
  )
    return false;
  return true;
};

// Function to get error messages
export const getAttributeErrorMessages = (attribute: any) => {
  const errorMessages = [];
  if (attribute.attributeKey?.length === 0) {
    errorMessages.push('Please select an attribute key.');
  }
  if (attribute.sourceType?.length === 0) {
    errorMessages.push('Please select a source type.');
  }
  if (
    attribute.sourceType !== 'MANUAL' &&
    (!attribute.labelMatchingType || attribute.labelMatchingType?.length === 0)
  ) {
    errorMessages.push('Please select a label matching type.');
  }
  if (
    attribute.sourceType !== 'MANUAL' &&
    attribute.labelTexts?.length === 0 &&
    (!attribute.labelText || attribute.labelText?.length === 0)
  ) {
    errorMessages.push('Please add a label text.');
  }
  return errorMessages;
};

export const createNewAttribute = (attribute: any) => {
  const newAttribute: MappingAttribute = {
    attributeKey: attribute.attributeKey,
    sourceType: attribute.sourceType as MappingAttributeSourceType,
    labelMatchingType:
      attribute.labelMatchingType as MappingAttributeLabelMatchingType,
    metadataField: attribute.metadataField as MappingAttributeMetadataField,
    validationRegex: attribute.validationRegex,
    labelTexts: [],
  };
  if (attribute.defaultValues?.length) {
    newAttribute.defaultValues = attribute.defaultValues;
  } else if (attribute.defaultValue.length > 0) {
    newAttribute.defaultValue = attribute.defaultValue;
  }
  if (attribute.labelTexts?.length) {
    newAttribute.labelTexts = attribute.labelTexts;
  } else if (attribute.labelText?.length > 0) {
    newAttribute.labelTexts = [attribute.labelText];
  }
  return newAttribute;
};

export const preventDialogClose = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
};
