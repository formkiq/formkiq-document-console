import { useState } from 'react';

import { Schema } from '../helpers/types/schemas';

type useEditSchemaAttributeParams = {
  schema: Schema;
  setSchema: (newSchema: Schema) => void;
  requiredKey: string;
  requiredDefaultValues: string[];
  requiredAllowedValues: string[];
  optionalAllowedValues: string[];
  optionalKey: string;
};

export const useEditSchemaAttribute = ({
  schema,
  requiredKey,
  requiredDefaultValues,
  requiredAllowedValues,
  setSchema,
  optionalKey,
  optionalAllowedValues,
}: useEditSchemaAttributeParams) => {
  const [requiredMinValues, setRequiredMinValues] = useState(0);
  const [requiredMaxValues, setRequiredMaxValues] = useState(-1);
  const [optionalMinValues, setOptionalMinValues] = useState(0);
  const [optionalMaxValues, setOptionalMaxValues] = useState(-1);

  // Required attributes
  const editRequiredAttribute = (index: number) => {
    const updatedRequired = schema.attributes.required && [
      ...schema.attributes.required,
    ];
    if (updatedRequired) {
      updatedRequired[index] = {
        attributeKey: requiredKey,
        defaultValue:
          requiredDefaultValues.length === 1
            ? requiredDefaultValues[0]
            : undefined,
        defaultValues:
          requiredDefaultValues.length > 1 ? requiredDefaultValues : undefined,
        allowedValues: requiredAllowedValues,
        minNumberOfValues: requiredMinValues,
        maxNumberOfValues: requiredMaxValues,
      };
    }

    setSchema({
      ...schema,
      attributes: { ...schema.attributes, required: updatedRequired },
    });
  };

  // Optional attributes
  const editOptionalAttribute = (index: number) => {
    const updatedOptional = schema.attributes.optional && [
      ...schema.attributes.optional,
    ];
    if (updatedOptional) {
      updatedOptional[index] = {
        attributeKey: optionalKey,
        allowedValues: optionalAllowedValues,
        minNumberOfValues: optionalMinValues,
        maxNumberOfValues: optionalMaxValues,
      };
    }

    setSchema({
      ...schema,
      attributes: { ...schema.attributes, optional: updatedOptional },
    });
  };

  return {
    editRequiredAttribute,
    editOptionalAttribute,
    requiredMinValues,
    setRequiredMinValues,
    requiredMaxValues,
    setRequiredMaxValues,
    optionalMinValues,
    setOptionalMinValues,
    optionalMaxValues,
    setOptionalMaxValues,
  };
};
