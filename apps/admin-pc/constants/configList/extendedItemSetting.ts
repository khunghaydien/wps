import { Config, ConfigList, ConfigListItem } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldType from '../fieldType';

const { FIELD_SELECT } = fieldType;
const { DISPLAY_DETAIL } = displayType;

const totalNumberOfExtendedItemPicklist = 10;
const totalNumberOfExtendedItemText = 10;
const totalNumberOfExtendedItemLookup = 10;
const totalNumberOfExtendedItemDate = 10;

const extendedItemUsedInOptions = [
  {
    msgkey: 'Admin_Lbl_ExpenseRequestAndExpenseReport',
    value: 'ExpenseRequestAndExpenseReport',
  },
  {
    msgkey: 'Admin_Lbl_ExpenseReport',
    value: 'ExpenseReport',
  },
];

const getNumberOfExtendedItems = (type: string): number => {
  switch (type) {
    case 'Text':
      return totalNumberOfExtendedItemText;
    case 'Picklist':
      return totalNumberOfExtendedItemPicklist;
    case 'Date':
      return totalNumberOfExtendedItemDate;
    case 'Lookup':
      return totalNumberOfExtendedItemLookup;
    default:
      return 0;
  }
};

// eslint-disable-next-line import/prefer-default-export
export const getExtendedItemList = (type: string): ConfigListItem => {
  const extendedItemLists: ConfigList = [];
  const numberOfExtendedItems = getNumberOfExtendedItems(type);
  for (let i = 1; i <= numberOfExtendedItems; i++) {
    const index = `0${i}`.slice(-2);
    const eItem: Config = {
      key: `extendedItem${type}${index}Id`,
      msgkey: `Admin_Lbl_ExtendedItem${type}${index}`,
      props: `extendedItem${type}Id`,
      dependent: `extendedItem${type}${index}`,
      type: FIELD_SELECT,
      display: DISPLAY_DETAIL,
    };
    const eItemUsedIn: Config = {
      key: `extendedItem${type}${index}UsedIn`,
      class: 'admin-pc-contents-detail-pane__body__item-list__sub-item',
      msgkey: 'Admin_Lbl_ExtendedItemUsedIn',
      props: `extendedItem${type}Id`,
      options: extendedItemUsedInOptions,
      dependent: `extendedItem${type}${index}`,
      type: FIELD_SELECT,
      display: DISPLAY_DETAIL,
    };
    const eItemRequiredFor: Config = {
      key: `extendedItem${type}${index}RequiredFor`,
      class: 'admin-pc-contents-detail-pane__body__item-list__sub-item',
      msgkey: 'Admin_Lbl_ExtendedItemRequiredFor',
      props: `extendedItem${type}Id`,
      options: extendedItemUsedInOptions,
      dependent: `extendedItem${type}${index}`,
      type: FIELD_SELECT,
      display: DISPLAY_DETAIL,
    };
    extendedItemLists.push(eItem);
    extendedItemLists.push(eItemUsedIn);
    extendedItemLists.push(eItemRequiredFor);
  }
  return {
    section: `ExtendedItem${type}`,
    msgkey: `Admin_Lbl_ExtendedItem${type}`,
    isExpandable: true,
    configList: extendedItemLists,
  };
};
