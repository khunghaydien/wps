import Api from '../../commons/api';

export type relationship = {
  objectName: string;
  fieldName: string;
  isCascadeDelete: boolean;
  isDeprecatedAndHidden: boolean;
  isRestrictedDelete: boolean;
};

export type picklist = {
  value: string;
  label: string;
};
export type field = {
  name: string;
  localName: string;
  label: string;
  length: number;
  precision: number;
  scale: number;
  referenceTo: Array<string>;
  picklistValues: Array<picklist>;
  relationshipName: null;
  calculatedFormula: string;
  inlineHelpText: string;
  defaultValueFormula: string;
  typeName: string;
  isAutoNumber: boolean;
  isCalculated: boolean;
  isCustom: boolean;
  isIdLookup: boolean;
  isNillable: boolean;
  isUnique: boolean;
  isAccessible: boolean;
};

export type sObjDetail = {
  childRelationships: Array<relationship>;
  sObjName: string;
  fields: Array<field>;
};

// eslint-disable-next-line import/prefer-default-export
export const getObjectDetail = (sObjName: string): Promise<sObjDetail> => {
  return Api.invoke({
    path: '/db-tool/sobject/detail',
    param: {
      sObjName,
    },
  })
    .then((response: sObjDetail) => response)
    .catch((err) => {
      throw err;
    });
};
