import { cloneDeep, find, get, invert, pickBy } from 'lodash';

import Api from '../../../commons/api';
import DateUtil from '../../../commons/utils/DateUtil';

export type ExtendedItemId = string | null;
export type ExtendedItemValue = string | null;

export type ExtendedItemSelectedOptionName = string | null;

export type ExtendedItemInfoInputType = {
  label?: string;
  value: string;
};

export type ExtendItemInfo = {
  defaultValueText: string;
  description: string;
  extendedItemCustomId: string;
  inputType: string;
  isRequired: boolean;
  limitLength: string;
  name: string;
  picklist: Array<{ label: string; value: string }>;
};

export type ExtendedItem = {
  id: string;
  index: string;
  info?: ExtendItemInfo;
  name?: string;
  value: string;
};

/* eslint-disable camelcase */
export type CustomEIOption = {
  id: string;
  active: boolean;
  code: string;
  extendedItemCustomId: string;
  name: string;
  name_L0: string;
  name_L1: string;
  name_L2: string;
};

export type CustomEIOptionList = {
  hasMore: boolean;
  records: Array<CustomEIOption>;
};

export type FieldCustomLayout = Array<Array<string>>;

export type ExtendedItemExpectedList = {
  extendedItemDate01Id?: ExtendedItemId;
  extendedItemDate01Info?: ExtendItemInfo;
  extendedItemDate01Value?: ExtendedItemValue;
  extendedItemDate02Id?: ExtendedItemId;
  extendedItemDate02Info?: ExtendItemInfo;
  extendedItemDate02Value?: ExtendedItemValue;
  extendedItemDate03Id?: ExtendedItemId;
  extendedItemDate03Info?: ExtendItemInfo;
  extendedItemDate03Value?: ExtendedItemValue;
  extendedItemDate04Id?: ExtendedItemId;
  extendedItemDate04Info?: ExtendItemInfo;
  extendedItemDate04Value?: ExtendedItemValue;
  extendedItemDate05Id?: ExtendedItemId;
  extendedItemDate05Info?: ExtendItemInfo;
  extendedItemDate05Value?: ExtendedItemValue;
  extendedItemDate06Id?: ExtendedItemId;
  extendedItemDate06Info?: ExtendItemInfo;
  extendedItemDate06Value?: ExtendedItemValue;
  extendedItemDate07Id?: ExtendedItemId;
  extendedItemDate07Info?: ExtendItemInfo;
  extendedItemDate07Value?: ExtendedItemValue;
  extendedItemDate08Id?: ExtendedItemId;
  extendedItemDate08Info?: ExtendItemInfo;
  extendedItemDate08Value?: ExtendedItemValue;
  extendedItemDate09Id?: ExtendedItemId;
  extendedItemDate09Info?: ExtendItemInfo;
  extendedItemDate09Value?: ExtendedItemValue;
  extendedItemDate10Id?: ExtendedItemId;
  extendedItemDate10Info?: ExtendItemInfo;
  extendedItemDate10Value?: ExtendedItemValue;
  extendedItemLookup01Id?: ExtendedItemId;
  extendedItemLookup01Info?: ExtendItemInfo;
  extendedItemLookup01SelectedOptionName?: ExtendedItemSelectedOptionName;
  extendedItemLookup01Value?: ExtendedItemValue;
  extendedItemLookup02Id?: ExtendedItemId;
  extendedItemLookup02Info?: ExtendItemInfo;
  extendedItemLookup02SelectedOptionName?: ExtendedItemSelectedOptionName;
  extendedItemLookup02Value?: ExtendedItemValue;
  extendedItemLookup03Id?: ExtendedItemId;
  extendedItemLookup03Info?: ExtendItemInfo;
  extendedItemLookup03SelectedOptionName?: ExtendedItemSelectedOptionName;
  extendedItemLookup03Value?: ExtendedItemValue;
  extendedItemLookup04Id?: ExtendedItemId;
  extendedItemLookup04Info?: ExtendItemInfo;
  extendedItemLookup04SelectedOptionName?: ExtendedItemSelectedOptionName;
  extendedItemLookup04Value?: ExtendedItemValue;
  extendedItemLookup05Id?: ExtendedItemId;
  extendedItemLookup05Info?: ExtendItemInfo;
  extendedItemLookup05SelectedOptionName?: ExtendedItemSelectedOptionName;
  extendedItemLookup05Value?: ExtendedItemValue;
  extendedItemLookup06Id?: ExtendedItemId;
  extendedItemLookup06Info?: ExtendItemInfo;
  extendedItemLookup06SelectedOptionName?: ExtendedItemSelectedOptionName;
  extendedItemLookup06Value?: ExtendedItemValue;
  extendedItemLookup07Id?: ExtendedItemId;
  extendedItemLookup07Info?: ExtendItemInfo;
  extendedItemLookup07SelectedOptionName?: ExtendedItemSelectedOptionName;
  extendedItemLookup07Value?: ExtendedItemValue;
  extendedItemLookup08Id?: ExtendedItemId;
  extendedItemLookup08Info?: ExtendItemInfo;
  extendedItemLookup08SelectedOptionName?: ExtendedItemSelectedOptionName;
  extendedItemLookup08Value?: ExtendedItemValue;
  extendedItemLookup09Id?: ExtendedItemId;
  extendedItemLookup09Info?: ExtendItemInfo;
  extendedItemLookup09SelectedOptionName?: ExtendedItemSelectedOptionName;
  extendedItemLookup09Value?: ExtendedItemValue;
  extendedItemLookup10Id?: ExtendedItemId;
  extendedItemLookup10Info?: ExtendItemInfo;
  extendedItemLookup10SelectedOptionName?: ExtendedItemSelectedOptionName;
  extendedItemLookup10Value?: ExtendedItemValue;
  extendedItemPicklist01Id?: ExtendedItemId;
  extendedItemPicklist01Info?: ExtendItemInfo;
  extendedItemPicklist01Value?: ExtendedItemValue;
  extendedItemPicklist02Id?: ExtendedItemId;
  extendedItemPicklist02Info?: ExtendItemInfo;
  extendedItemPicklist02Value?: ExtendedItemValue;
  extendedItemPicklist03Id?: ExtendedItemId;
  extendedItemPicklist03Info?: ExtendItemInfo;
  extendedItemPicklist03Value?: ExtendedItemValue;
  extendedItemPicklist04Id?: ExtendedItemId;
  extendedItemPicklist04Info?: ExtendItemInfo;
  extendedItemPicklist04Value?: ExtendedItemValue;
  extendedItemPicklist05Id?: ExtendedItemId;
  extendedItemPicklist05Info?: ExtendItemInfo;
  extendedItemPicklist05Value?: ExtendedItemValue;
  extendedItemPicklist06Id?: ExtendedItemId;
  extendedItemPicklist06Info?: ExtendItemInfo;
  extendedItemPicklist06Value?: ExtendedItemValue;
  extendedItemPicklist07Id?: ExtendedItemId;
  extendedItemPicklist07Info?: ExtendItemInfo;
  extendedItemPicklist07Value?: ExtendedItemValue;
  extendedItemPicklist08Id?: ExtendedItemId;
  extendedItemPicklist08Info?: ExtendItemInfo;
  extendedItemPicklist08Value?: ExtendedItemValue;
  extendedItemPicklist09Id?: ExtendedItemId;
  extendedItemPicklist09Info?: ExtendItemInfo;
  extendedItemPicklist09Value?: ExtendedItemValue;
  extendedItemPicklist10Id?: ExtendedItemId;
  extendedItemPicklist10Info?: ExtendItemInfo;
  extendedItemPicklist10Value?: ExtendedItemValue;
  extendedItemText01Id?: ExtendedItemId;
  extendedItemText01Info?: ExtendItemInfo;
  extendedItemText01Value?: ExtendedItemValue;
  extendedItemText02Id?: ExtendedItemId;
  extendedItemText02Info?: ExtendItemInfo;
  extendedItemText02Value?: ExtendedItemValue;
  extendedItemText03Id?: ExtendedItemId;
  extendedItemText03Info?: ExtendItemInfo;
  extendedItemText03Value?: ExtendedItemValue;
  extendedItemText04Id?: ExtendedItemId;
  extendedItemText04Info?: ExtendItemInfo;
  extendedItemText04Value?: ExtendedItemValue;
  extendedItemText05Id?: ExtendedItemId;
  extendedItemText05Info?: ExtendItemInfo;
  extendedItemText05Value?: ExtendedItemValue;
  extendedItemText06Id?: ExtendedItemId;
  extendedItemText06Info?: ExtendItemInfo;
  extendedItemText06Value?: ExtendedItemValue;
  extendedItemText07Id?: ExtendedItemId;
  extendedItemText07Info?: ExtendItemInfo;
  extendedItemText07Value?: ExtendedItemValue;
  extendedItemText08Id?: ExtendedItemId;
  extendedItemText08Info?: ExtendItemInfo;
  extendedItemText08Value?: ExtendedItemValue;
  extendedItemText09Id?: ExtendedItemId;
  extendedItemText09Info?: ExtendItemInfo;
  extendedItemText09Value?: ExtendedItemValue;
  extendedItemText10Id?: ExtendedItemId;
  extendedItemText10Info?: ExtendItemInfo;
  extendedItemText10Value?: ExtendedItemValue;
};

const totalNumExtendedItems = 10;
export const totalNumTextExtendedItems = 10;
export const totalNumPicklistExtendedItems = 10;
export const totalNumLookupExtendedItems = 10;
export const totalNumDateExtendedItems = 10;

/**
 * Initial extended items with empty values
 *
 * @returns {ExtendedItemExpectedList}
 */
export const initialEmptyEIs = (): ExtendedItemExpectedList => {
  const eIValues = {};
  for (let i = 0; i < totalNumTextExtendedItems; i++) {
    const index = `0${i + 1}`.slice(-2);
    eIValues[`extendedItemText${index}Id`] = null;
    eIValues[`extendedItemText${index}Value`] = null;
    eIValues[`extendedItemText${index}Info`] = null;
  }
  for (let i = 0; i < totalNumPicklistExtendedItems; i++) {
    const index = `0${i + 1}`.slice(-2);
    eIValues[`extendedItemPicklist${index}Id`] = null;
    eIValues[`extendedItemPicklist${index}Value`] = null;
    eIValues[`extendedItemPicklist${index}Info`] = null;
  }
  for (let i = 0; i < totalNumLookupExtendedItems; i++) {
    const index = `0${i + 1}`.slice(-2);
    eIValues[`extendedItemLookup${index}Id`] = null;
    eIValues[`extendedItemLookup${index}Value`] = null;
    eIValues[`extendedItemLookup${index}Info`] = null;
    eIValues[`extendedItemLookup${index}SelectedOptionName`] = null;
  }
  for (let i = 0; i < totalNumDateExtendedItems; i++) {
    const index = `0${i + 1}`.slice(-2);
    eIValues[`extendedItemDate${index}Id`] = null;
    eIValues[`extendedItemDate${index}Value`] = null;
    eIValues[`extendedItemDate${index}Info`] = null;
  }
  return eIValues;
};

const sortEIByType = (extendedItems: Array<ExtendedItem>) => {
  const sortingOrder = ['Text', 'Picklist', 'Date', 'Lookup'];
  extendedItems.sort((a, b) => {
    const keyA = get(a, 'info.inputType', '');
    const keyB = get(b, 'info.inputType', '');
    return sortingOrder.indexOf(keyA) - sortingOrder.indexOf(keyB);
  });
  return extendedItems;
};

/**
 * Format ExtendedItemExpectedList to ExtendedItem array, mainly for display purpose
 * e.g. {extendedItemText01Id, extendedItemText01Value ...} -> [{index, id, info, value}, {...},{...}]
 *
 * @param {ExtendedItemExpectedList} item
 * @returns {Array<ExtendedItem>}
 */
export const getExtendedItemArray = (
  item: ExtendedItemExpectedList
): Array<ExtendedItem> => {
  const extendedItems = [];
  for (let i = 1; i <= totalNumExtendedItems; i++) {
    const num = `0${i}`.slice(-2);
    extendedItems.push({
      index: num,
      id: item[`extendedItemText${num}Id`],
      info: item[`extendedItemText${num}Info`],
      value: item[`extendedItemText${num}Value`],
    });
    extendedItems.push({
      index: num,
      id: item[`extendedItemPicklist${num}Id`],
      info: item[`extendedItemPicklist${num}Info`],
      value: item[`extendedItemPicklist${num}Value`],
    });
    extendedItems.push({
      index: num,
      id: item[`extendedItemLookup${num}Id`],
      info: item[`extendedItemLookup${num}Info`],
      value: item[`extendedItemLookup${num}Value`],
      name: item[`extendedItemLookup${num}SelectedOptionName`],
    });
    extendedItems.push({
      index: num,
      id: item[`extendedItemDate${num}Id`],
      info: item[`extendedItemDate${num}Info`],
      value: item[`extendedItemDate${num}Value`],
    });
  }
  return sortEIByType(extendedItems);
};

/**
 * 1. Copy extended item values from source to target
 * 2. Set default value if field only exit in target
 *
 * Use Case: when changing expense type, keep the already filled EI field value
 *
 * e.g. source: {extendedItemText01Value: 'value1'}
 *      target: {extendedItemText01Value: '001', extendedItemText01Value: null}
 *      return {extendedItemText01Value: 'value1', extendedItemText01Value: defaultValue}
 *
 * @param {ExtendedItemExpectedList} target
 * @param {ExtendedItemExpectedList} [source]
 * @returns
 */
export const copyEIsFromSource = (
  target: ExtendedItemExpectedList,
  source?: ExtendedItemExpectedList
) => {
  // if no target: return empty; if no source, still need to handle default value
  if (!target) {
    return {};
  }

  const sourceItems = source || {};
  const targetItems = cloneDeep(target);
  const invertedSourceRecord = invert(sourceItems);

  Object.keys(targetItems).forEach((key) => {
    const EIId = targetItems[key]; // e.g "a116F00000BOEZ0QAP"
    const isEI = /^extendedItem.*Id$/.test(key);

    // if key is extendedItem
    if (isEI) {
      const targetEI = key.replace('Id', ''); // e.g extendedItemText01
      const isEILookup = /^extendedItemLookup.*Id$/.test(key);

      // if is in target
      if (EIId) {
        // e.g check whether the target EI is in source
        const sourceEIID = invertedSourceRecord[EIId]; // e.g "extendedItemText01Id"

        // if source contains the target EI
        if (sourceEIID) {
          const sourceEI = sourceEIID.replace('Id', ''); // e.g extendedItemText01
          // update newRecordItem with source EI Value & Info
          targetItems[`${targetEI}Value`] = sourceItems[`${sourceEI}Value`];
          if (isEILookup) {
            targetItems[`${targetEI}SelectedOptionName`] =
              sourceItems[`${sourceEI}SelectedOptionName`];
          }
        } else {
          // if exist only in target: use target with default value
          targetItems[`${targetEI}Value`] = get(
            targetItems,
            `${targetEI}Info.defaultValueText`
          );
          if (isEILookup) {
            targetItems[`${targetEI}SelectedOptionName`] = null;
          }
        }
      } else {
        // if not in target, reset value
        targetItems[`${targetEI}Value`] = null;
        if (isEILookup) {
          targetItems[`${targetEI}SelectedOptionName`] = null;
        }
      }
    }
  });

  return targetItems;
};

/**
 * Copy extended item values from source to target, then get only the EI part
 * e.g. source: {extendedItemText01Value: 'value1'}
 *      target: {extendedItemText01Value: '001', extendedItemText01Value: null, randomKey: 'random'}
 *      return {extendedItemText01Value: 'value1', extendedItemText01Value: defaultValue}
 *
 * @param {ExtendedItemExpectedList} target
 * @param {ExtendedItemExpectedList} [source]
 * @returns
 */
export const getEIsOnly = (
  target: ExtendedItemExpectedList,
  source?: ExtendedItemExpectedList
) => {
  const wholeObject: Record<string, any> =
    copyEIsFromSource(target, source) || {};
  const onlyExtendedItems = pickBy(
    wholeObject,
    (v: any, key: string) =>
      key.includes('extendedItem') || key.includes('fieldCustomLayout')
  );
  return onlyExtendedItems;
};

/**
 * Filter extended items with values only
 * e.g. param {extendedItemText01Id: '001', extendedItemText02Id: null}
 *      return [{index, id, info, value}] which only contains info for extendedItemText01 because 02 don't have value
 *
 * @param {ExtendedItemExpectedList} items
 * @returns {Array<ExtendedItem>}
 */
const existExtendedItems = (
  items: ExtendedItemExpectedList
): Array<ExtendedItem> =>
  getExtendedItemArray(items).filter((i: ExtendedItem) => i.id);

const extendedItemToLabelValue = (
  extendedItem: ExtendedItem
): { code?: string; label: string; value: string } => {
  if (!extendedItem.info) {
    return { label: '', value: '' };
  }
  let displayValue = '';
  let displayCode;
  switch (extendedItem.info.inputType) {
    case 'Text':
      displayValue = extendedItem.value;
      break;
    case 'Picklist':
      const targetEI = find(extendedItem.info.picklist, {
        value: extendedItem.value,
      });
      displayValue = targetEI ? targetEI.label : '';
      break;
    case 'Lookup':
      displayValue = extendedItem.value
        ? `${extendedItem.value} - ${extendedItem.name || ''}`
        : '';
      displayCode = extendedItem.value;
      break;
    case 'Date':
      displayValue = DateUtil.dateFormat(extendedItem.value) || '';
      break;
    default:
      displayValue = '';
  }
  const extendedItemName = extendedItem.info ? extendedItem.info.name : '';
  return { label: extendedItemName, value: displayValue, code: displayCode };
};

/**
 * Get array of {label, value} from extended items
 * Mainly for display purpose
 *
 * e.g. {extendedItemText01Value: 'value1'}
 *      return [{label, value}]
 *
 * @param {ExtendedItemExpectedList} items
 * @returns {Array<{ label: string, value: string, code?:string }>}
 */
export const getLabelValueFromEIs = (
  items: ExtendedItemExpectedList
): Array<{ code?: string; label: string; value: string }> =>
  sortEIByType(existExtendedItems(items)).map((extendedItem: ExtendedItem) =>
    extendedItemToLabelValue(extendedItem)
  );
/**
 * Get array of {label, value} from extended items according to custom layout
 * Mainly for display purpose
 *
 * @param {FieldCustomLayout} layout
 * @param {ExtendedItemExpectedList} items
 * @returns {Array<Array<{ label: string, value: string, code?:string }>>}
 */
export const getCustomLayoutFromEIs = (
  layout: FieldCustomLayout,
  items: ExtendedItemExpectedList
): Array<Array<{ code?: string; label: string; value: string }>> => {
  const extendedItemsWithLayout: Array<
    Array<{
      code?: string;
      label: string;
      value: string;
    }>
  > = [];
  const extendedItemTitles = [];
  const extendedItemsWithID = existExtendedItems(items);
  const prefix = 'extendedItem';
  for (const key in items) {
    const isExtendedItemId = items[key] && /^extendedItem.*Id$/.test(key);
    if (isExtendedItemId) {
      extendedItemTitles.push({
        id: items[key],
        text: key.replace(prefix, '').slice(0, -2),
      });
    }
  }
  for (const i in layout) {
    const row = [];
    for (const j in layout[i]) {
      const item = find(extendedItemTitles, { text: layout[i][j] });
      const id = item ? item.id : null;
      if (id) {
        const extendedItem = find(extendedItemsWithID, { id });
        row.push(extendedItemToLabelValue(extendedItem));
      }
    }
    if (row.length) {
      extendedItemsWithLayout.push(row);
    }
  }
  return extendedItemsWithLayout;
};

export type EISearchObj = {
  idx: string | null;
  extendedItemCustomId: string | null;
  extendedItemLookupId: string | null;
  hintMsg: string | null;
  name: string | null;
  target: string | null;
};

/**
 * Search lookup extended items
 *
 * @param {?string} extendedItemCustomId
 * @param {?string} query keyword contained in either code or name
 * @returns {Promise<CustomEIOptionList>}
 */
export const getCustomEIOptionList = (
  extendedItemCustomId?: string,
  query?: string,
  companyId?: string
): Promise<CustomEIOptionList> =>
  Api.invoke({
    path: '/extended-item-custom-option/search',
    param: {
      extendedItemCustomId,
      query,
      companyId,
      activeOnly: true,
    },
  }).then((response: CustomEIOptionList) => response);

export const getRecentlyUsedCustomEI = (
  employeeBaseId: string,
  extendedItemLookupId?: string,
  extendedItemCustomId?: string
): Promise<CustomEIOptionList> =>
  Api.invoke({
    path: '/extended-item-custom-option/recently-used/list',
    param: {
      employeeBaseId,
      extendedItemCustomId,
      extendedItemLookupId,
      activeOnly: true,
    },
  }).then((response: CustomEIOptionList) => response);
