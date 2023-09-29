import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_AUTOSUGGEST_TEXT } = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;
const { SIZE_SMALL } = fieldSize;

const base: ConfigList = [
  {
    key: 'id',
    type: FIELD_HIDDEN,
  },
  {
    key: 'isoCurrencyCode',
    msgkey: 'Admin_Lbl_CurrencyCode',
    isRequired: true,
    type: FIELD_AUTOSUGGEST_TEXT,
    props: 'isoCurrencyCode',
    autoSuggest: {
      value: 'value',
      label: 'label',
      buildLabel: (item) => `${item.label}`,
      suggestionKey: ['value', 'label'],
    },
    help: 'Admin_Help_AutoSuggest',
    enableMode: 'new',
    action: 'searchIsoCurrencyCode',
  },
  {
    key: 'name',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'name_L0',
    msgkey: 'Admin_Lbl_Name',
    isRequired: true,
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'name_L1',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'name_L2',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'decimalPlaces',
    msgkey: 'Admin_Lbl_DecimalPlaces',
    isRequired: true,
    type: FIELD_TEXT,
    charType: 'numeric',
    size: SIZE_SMALL,
  },
  {
    key: 'symbol',
    msgkey: 'Admin_Lbl_CurrencySymbol',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    size: SIZE_SMALL,
  },
];

const configList: ConfigListMap = { base };

export default configList;
