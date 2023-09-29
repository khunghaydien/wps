import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_SELECT,
  FIELD_TEXTAREA,
  FIELD_NUMBER,
  FIELD_AUTOSUGGEST_TEXT,
} = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;
const { SIZE_SMALL } = fieldSize;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'companyId', type: FIELD_HIDDEN },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    isRequired: true,
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
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    isRequired: true,
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
    key: 'inputType',
    msgkey: 'Admin_Lbl_InputType',
    props: 'inputType',
    type: FIELD_SELECT,
    multiLanguageValue: true,
    isRequired: true,
    //    help: 'Admin_Help_ExpTypeInputType',
  },
  {
    key: 'limitLength',
    msgkey: 'Admin_Lbl_LimitLength',
    type: FIELD_NUMBER,
    size: SIZE_SMALL,
    charType: 'numeric',
    condition: (baseValueGetter) => baseValueGetter('inputType') === 'Text',
  },
  {
    key: 'picklistLabel_L0',
    msgkey: 'Admin_Lbl_PickListLabel',
    type: FIELD_TEXTAREA,
    condition: (baseValueGetter) => baseValueGetter('inputType') === 'Picklist',
  },
  {
    key: 'picklistLabel_L1',
    msgkey: 'Admin_Lbl_PickListLabel',
    type: FIELD_TEXTAREA,
    condition: (baseValueGetter) => baseValueGetter('inputType') === 'Picklist',
  },
  {
    key: 'picklistValue',
    msgkey: 'Admin_Lbl_PickListValue',
    type: FIELD_TEXTAREA,
    condition: (baseValueGetter) => baseValueGetter('inputType') === 'Picklist',
  },
  {
    key: 'defaultValueText',
    msgkey: 'Admin_Lbl_DefaultValue',
    props: 'defaultValueText',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    condition: (baseValueGetter) => baseValueGetter('inputType') === 'Text',
  },
  {
    key: 'extendedItemCustomId',
    msgkey: 'Admin_Lbl_CustomExtendedItem',
    dependent: 'extendedItemCustom',
    props: 'extendedItemCustomId',
    type: FIELD_AUTOSUGGEST_TEXT,
    isRequired: true,
    autoSuggest: {
      value: 'id',
      label: 'name',
      buildLabel: (item) => `${item.code} - ${item.name}`,
      suggestionKey: ['id', 'code', 'name'],
    },
    help: 'Admin_Help_AutoSuggest',
    action: 'searchExtendedItemCustom',
    condition: (baseValueGetter) => baseValueGetter('inputType') === 'Lookup',
  },
  {
    key: 'description',
    msgkey: 'Admin_Lbl_Description',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'description_L0',
    msgkey: 'Admin_Lbl_Description',
    type: FIELD_TEXTAREA,
    display: DISPLAY_DETAIL,
    help: 'Admin_Help_ExpExtendedItem',
  },
  {
    key: 'description_L1',
    msgkey: 'Admin_Lbl_Description',
    type: FIELD_TEXTAREA,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'description_L2',
    msgkey: 'Admin_Lbl_Description',
    type: FIELD_TEXTAREA,
    display: DISPLAY_DETAIL,
  },
];

const configList: ConfigListMap = { base };

export default configList;
