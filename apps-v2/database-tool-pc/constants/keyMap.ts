export type KeyMap = {
  [key: string]: string;
};
export const FIELD_KEY_MAP = {
  name: 'localName',
  label: 'label',
  type: 'typeName',
  referenceTo: 'referenceTo',
  picklist: 'picklistValues',
  length: 'length',
  precision: 'precision',
  scale: 'scale',
  calculatedFormula: 'calculatedFormula',
  inlineHelpText: 'inlineHelpText',
  defaultValue: 'defaultValueFormula',
  isAutoNumber: 'isAutoNumber',
  isCalculated: 'isCalculated',
  isCustom: 'isCustom',
  isIdLookup: 'isIdLookup',
  isNullable: 'isNillable',
  isUnique: 'isUnique',
  isAccessible: 'isAccessible',
};

export const RELATIONSHIP_KEY_MAP = {
  objectName: 'objectName',
  fieldName: 'fieldName',
  relationshipName: 'relationshipName',
  isCascadeDelete: 'isCascadeDelete',
  isDeprecatedAndHidden: 'isDeprecatedAndHidden',
  isRestrictedDelete: 'isRestrictedDelete',
};

export const RECORD_DETAIL_COLUMN = ['name', 'label', 'type', 'value'];

export const ID_FIELD = 'Id';

export const NEW_ADD_ROW_PREFIX = 'new_';
