import * as React from 'react';

import get from 'lodash/get';
import isFinite from 'lodash/isFinite';
import isFunction from 'lodash/isFunction';

import DISPLAY_TYPE, { DisplayType } from '../constants/displayType';
import { FieldSize } from '../constants/fieldSize';
import FIELD_TYPE, { FieldType } from '../constants/fieldType';
import { FunctionType, FunctionTypeList } from '../constants/functionType';

import { Record } from './RecordUtil';

type $Config = {
  // Field key.
  key: string;

  // Label message key in en_US.csv.
  msgkey?: string;
  // Help message key in en_US.csv.
  help?: string;
  // Title(?) message key in en_US.csv.
  // FIXMI: I did not find an implementation that uses this property.
  title?: string;
  // Specify element class name of row.
  class?: string;

  // Specify field value type.
  charType?: string;
  // On required value.
  isRequired?: boolean;
  // Specify default value
  defaultValue?: unknown;

  // Path to get values from API when initilaizing.
  // Response values is saved to sfObjFieldValues specified `props` property.
  // (Need to set `props`.)
  path?: string;
  // Option values from sfObjFieldValues.
  props?: string;

  // Redux's action name for initilazing sfObjFieldValue
  // if validDateFrom of history record is changed.
  action?: string;

  // Field is displayed by this value.
  enableMode?: '' | 'new' | 'edit';

  // Specify display view, only list, detail or both.
  display?: DisplayType[keyof DisplayType];

  // Specify view value in list instead.
  dependent?: string;

  // Specify displayed by another value.
  condition?: (
    arg0: (arg0: string) => any,
    arg1: (arg0: string) => any
  ) => boolean;

  // Specify to use function.
  useFunction?: FunctionType[keyof FunctionType];

  // Column size.
  // FIXME: Some configs use out of FieldSize.
  size?: FieldSize[keyof FieldSize] | 7;
  // Label size.
  labelSize?: FieldSize[keyof FieldSize];
  // If no need label
  noLabel?: boolean;
  // Specify solution message key in en_US.csv.
};

type FieldTypeNone = $Config & {
  type: FieldType['FIELD_NONE'];
};

type FieldTypeHidden = $Config & {
  type: FieldType['FIELD_HIDDEN'];
};

type FieldTypeText = $Config & {
  type: FieldType['FIELD_TEXT'];
};

type FieldTypeTextarea = $Config & {
  type: FieldType['FIELD_TEXTAREA'];
};

type FieldTypeSelect = $Config & {
  type: FieldType['FIELD_SELECT'];
  // On multiple value.
  multiple?: boolean;
  // Create location label in option.
  multiLanguageValue?: boolean;
  // Specify Options
  options?: {
    msgkey: string;
    value: unknown;
  }[];
  // On to ignore it self.
  ignoreItself?: boolean;
};

type FieldTypeDate = $Config & {
  type: FieldType['FIELD_DATE'];
  // Specify readOnly
  readOnly?: boolean;
};

type FieldTypeCheckbox = $Config & {
  type: FieldType['FIELD_CHECKBOX'];
  // Specify label if type is FIELD_CHECKBOX.
  label?: string;
};

type FieldTypeUserName = $Config & {
  type: FieldType['FIELD_USER_NAME'];
  // Specify Suffix of name value.
  ltype?: string;
};

type FieldTypeValidDate = $Config & {
  type: FieldType['FIELD_VALID_DATE'];
};

type FieldTypeTime = $Config & {
  type: FieldType['FIELD_TIME'];
  // Specify label
  label?: string;
};

type FieldTypeTimeStartEnd = $Config & {
  type: FieldType['FIELD_TIME_START_END'];
  subkey: string;
};

type FieldTypeSelectWithPlaceholder = $Config & {
  type: FieldType['FIELD_SELECT_WITH_PLACEHOLDER'];
  // On multiple value.
  multiple?: boolean;
  // Create location label in option.
  multiLanguageValue?: boolean;
  // Specify Options
  options?: {
    msgkey: string;
    value: unknown;
  }[];
  // disable reset value to '' when value not in the options
  disableReset?: boolean;
  // On to ignore it self.
  ignoreItself?: boolean;
  // Custom label for select dropdown placeholder
  placeholderLabel?: string;
};

type FieldTypeNumber = $Config & {
  type: FieldType['FIELD_NUMBER'];
  max?: number;
  min?: number;
  step?: number;
};

type FieldTypeRadio = $Config & {
  type: FieldType['FIELD_RADIO'];
};

type FieldTypeCustom = $Config & {
  type: FieldType['FIELD_CUSTOM'];
  Component: React.ComponentType<any>;
};

type FieldTypeAutosuggestText = $Config & {
  type: FieldType['FIELD_AUTOSUGGEST_TEXT'];
  // Specify auto suggest setting
  autoSuggest: {
    value: string;
    label: string;
    buildLabel: (arg0: any) => string;
    suggestionKey: string[];
  };
};

export type Config =
  | FieldTypeNone
  | FieldTypeHidden
  | FieldTypeText
  | FieldTypeTextarea
  | FieldTypeSelect
  | FieldTypeDate
  | FieldTypeCheckbox
  | FieldTypeUserName
  | FieldTypeValidDate
  | FieldTypeTime
  | FieldTypeTimeStartEnd
  | FieldTypeSelectWithPlaceholder
  | FieldTypeNumber
  | FieldTypeRadio
  | FieldTypeCustom
  | FieldTypeAutosuggestText;

export type Section = {
  // Section key.
  section: string;
  // Display expandable button.
  isExpandable?: boolean;
  // Label message key in en_US.csv.
  msgkey?: Config['msgkey'];
  // Description key in en_US.csv.
  descriptionKey?: string;
  // Specify dispaly by another value.
  condition?: Config['condition'];
  // Specify to use function.
  useFunction?: Config['useFunction'];
  // Child configs
  configList?: Array<Config | Section>;
};

export type ConfigListItem = Config | Section;

export type ConfigList = Array<any>;

export type ConfigListMap = {
  base: ConfigList;
  history?: ConfigList;
};

/**
 * Flattens config array.
 */
export const flatten = (...configLists: ConfigList[]): any => {
  return configLists.reduce((list, configList) => {
    if (!configList) {
      return list;
    } else {
      return configList.reduce(($list, config: any) => {
        if (config.section && config.configList) {
          return $list.concat(flatten(config.configList));
        } else if (config.key && config.type) {
          return $list.concat(config);
        } else {
          return $list;
        }
      }, list);
    }
  }, []);
};

/**
 * Invoke condition
 */
export const isSatisfiedCondition = (
  config: {
    readonly condition?: Config['condition'];
  },
  baseValueGetter: (arg0: string) => unknown,
  historyValueGetter: (arg0: string) => unknown
): boolean => {
  const { condition } = config;
  if (!isFunction(condition)) {
    return true;
  }
  return condition(baseValueGetter, historyValueGetter);
};

/**
 * Check has function
 */
export const isAllowedFunction = (
  config: {
    readonly useFunction?: Config['useFunction'];
  },
  functionTypeList: FunctionTypeList
): boolean => !config.useFunction || !!functionTypeList[config.useFunction];

/**
 * is a effectable config
 */
export const isEffective = (
  config: {
    readonly condition?: Config['condition'];
    readonly useFunction?: Config['useFunction'];
  },
  functionTypeList: FunctionTypeList,
  baseValueGetter: (arg0: string) => unknown,
  historyValueGetter: (arg0: string) => unknown
): boolean =>
  isAllowedFunction(config, functionTypeList) &&
  isSatisfiedCondition(config, baseValueGetter, historyValueGetter);

/**
 * is a value of detail view
 */
export const isDisplayDetail = (config: Config) =>
  !config.display ||
  config.display === DISPLAY_TYPE.DISPLAY_DETAIL ||
  config.display === DISPLAY_TYPE.DISPLAY_BOTH;

/**
 * is a value of detail view
 */
export const isDisplayList = (config: Config) =>
  config.display === DISPLAY_TYPE.DISPLAY_LIST ||
  config.display === DISPLAY_TYPE.DISPLAY_BOTH;

/**
 * check charType
 */
export const checkCharType = (config: Config, value: any): boolean => {
  switch (config.charType) {
    case 'numeric':
      return isFinite(value);
    default:
      return true;
  }
};

/**
 * Get Effective Config
 */
export const getEffectiveConfig = (
  key: string,
  configList: any,
  functionTypeList: FunctionTypeList,
  baseValueGetter: (arg0: string) => unknown,
  historyValueGetter: (arg0: string) => unknown
): Config | void => {
  let result;
  for (const config of configList) {
    if (
      config.type &&
      config.key === key &&
      isEffective(config, functionTypeList, baseValueGetter, historyValueGetter)
    ) {
      result = config;
    } else if (
      config.section &&
      config.configList &&
      isEffective(config, functionTypeList, baseValueGetter, historyValueGetter)
    ) {
      result = getEffectiveConfig(
        key,
        config.configList,
        functionTypeList,
        baseValueGetter,
        historyValueGetter
      );
    }
    if (result) {
      break;
    }
  }
  return result;
};

/**
 * Get default value from config
 */
export const getDefaultValue = (
  config: any,
  sfObjFieldValues: {
    [key: string]: any;
  }
) => {
  const { type } = config;
  if (config.defaultValue !== undefined) {
    return config.defaultValue;
  } else if (type === FIELD_TYPE.FIELD_SELECT) {
    if (config.multiple) {
      return [];
    } else if (config.isRequired) {
      if (config.props) {
        return get(sfObjFieldValues, `${config.props}[0].value`, '');
      } else if (config.options) {
        return get(config.options, `[0].value`, '');
      } else {
        return '';
      }
    } else {
      return '';
    }
  } else {
    return '';
  }
};

export const getClonedValue = (config: Config, sourceValues: Record) => {
  if (['code', 'id'].includes(config.key)) {
    return '';
  }
  return get(sourceValues, config.key);
};
