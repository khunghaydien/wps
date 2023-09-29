import forEach from 'lodash/forEach';
import isNil from 'lodash/isNil';
import reduce from 'lodash/reduce';

import FIELD_TYPE from '../constants/fieldType';
import { FunctionTypeList } from '../constants/functionType';

import msg from '../../commons/languages';

import * as ConfigUtil from './ConfigUtil';

export type Action = {
  [key: string]: Function;
};

export type Record = {
  [key: string]: any;
};

export const getter = (record: Record) => (key: string) => {
  if (key in record) {
    return record[key];
  } else {
    return undefined;
  }
};

/**
 * Make record object with sfObjFieldValues.
 */
export const make = (
  configList: any,
  sfObjFieldValues: {
    [key: string]: any;
  }
) => {
  return configList.reduce((record, config) => {
    if (config.section) {
      return {
        ...record,
        ...make(config.configList || [], sfObjFieldValues),
      };
    } else if (config.key) {
      record[config.key] = ConfigUtil.getDefaultValue(config, sfObjFieldValues);
      return record;
    } else {
      return record;
    }
  }, {});
};

/**
 * Make record object with sourceValues.
 */
export const clone = (configList: any, sourceValues: Record) => {
  return configList.reduce((record, config) => {
    if (config.section) {
      return {
        ...record,
        ...clone(config.configList || [], sourceValues),
      };
    } else if (config.key) {
      record[config.key] = ConfigUtil.getClonedValue(config, sourceValues);
      return record;
    } else {
      return record;
    }
  }, {});
};

/**
 * Chack to need value for remote
 *
 * FIXME:
 * API に送信するデータかどうかを判断するために condition も確認するべきなのですが、
 * リファクタリング前のソースコードが、そのようになってなかったのでコメントアウトしています。
 */
export const isValueForRemote = (
  config: ConfigUtil.Config,
  functionTypeList: FunctionTypeList // baseValueGetter: (string) => mixed,
): // historyValueGetter: (string) => mixed
boolean =>
  ConfigUtil.isDisplayDetail(config) &&
  ConfigUtil.isAllowedFunction(config, functionTypeList);
// ConfigUtil.isEffective(
//   config,
//   functionTypeList,
//   baseValueGetter,
//   historyValueGetter
// );

/**
 * Check if value is empty.
 */
const isEmptyValue = (value) => isNil(value) || value === '';

/**
 * Check values are vaild
 */
export const getFirstInvalidConfig = (
  configList: any,
  record: Record,
  functionTypeList: FunctionTypeList,
  baseValueGetter: (arg0: string) => any,
  historyValueGetter: (arg0: string) => any
): ConfigUtil.Config | null => {
  let result: ConfigUtil.Config | null = null;

  forEach(configList, (config) => {
    const isEffective = ConfigUtil.isEffective(
      config,
      functionTypeList,
      baseValueGetter,
      historyValueGetter
    );
    if (config.section) {
      if (isEffective) {
        result = getFirstInvalidConfig(
          config.configList || [],
          record,
          functionTypeList,
          baseValueGetter,
          historyValueGetter
        );
      }
    } else if (config.key) {
      const value = record[config.key];
      if (isEffective && config.isRequired) {
        switch (config.type) {
          case FIELD_TYPE.FIELD_TIME_START_END:
            const subValue = record[config.subkey];
            result =
              isEmptyValue(value) || isEmptyValue(subValue) ? config : null;
            break;
          case FIELD_TYPE.FIELD_CUSTOM:
            if ('subkey' in config) {
              const minValue = record[config.subkey];
              result =
                isEmptyValue(value) || isEmptyValue(minValue) ? config : null;
            } else {
              result = isEmptyValue(value) ? config : null;
            }
            break;
          default:
            result = isEmptyValue(value) ? config : null;
        }
      }
    } else {
      throw new TypeError('Invaild configList of arugment');
    }
    return !result;
  });

  return result;
};

/**
 * Make record object for remote
 */
export const makeForRemote = (
  configList: any,
  orgRecord: Record = {},
  edtRecord: Record = {},
  functionTypeList: FunctionTypeList,
  baseValueGetter: (arg0: string) => any,
  historyValueGetter: (arg0: string) => any
) => {
  return configList.reduce((result, config) => {
    if (config.section) {
      return {
        ...result,
        ...makeForRemote(
          config.configList || [],
          orgRecord,
          edtRecord,
          functionTypeList,
          baseValueGetter,
          historyValueGetter
        ),
      };
    } else if (config.key) {
      if (isValueForRemote(config, functionTypeList)) {
        switch (config.type) {
          case FIELD_TYPE.FIELD_CHECKBOX:
            result[config.key] = !!edtRecord[config.key];
            break;
          default:
            if (isNil(edtRecord[config.key]) || edtRecord[config.key] === '') {
              result[config.key] = null;
            } else {
              result[config.key] = edtRecord[config.key];
            }
        }
      }
      return result;
    } else {
      return result;
    }
  }, {});
};

export const convertForView = (record: Record) =>
  reduce(
    record,
    (result, value, key) => {
      if (isNil(value)) {
        result[key] = '';
      } else {
        result[key] = value;
      }
      return result;
    },
    {}
  );

export const getHeaderTitle = (id: string) => {
  return id !== '' ? msg().Admin_Lbl_Edit : msg().Admin_Lbl_New;
};
