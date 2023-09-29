import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_SELECT, FIELD_TEXTAREA } = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

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
    enableMode: 'new',
  },
  {
    key: 'picklistLabel_L0',
    msgkey: 'Admin_Lbl_PickListLabel',
    type: FIELD_TEXTAREA,
    condition: (baseValueGetter) => baseValueGetter('inputType') === 'PickList',
  },
  {
    key: 'picklistLabel_L1',
    msgkey: 'Admin_Lbl_PickListLabel',
    type: FIELD_TEXTAREA,
    condition: (baseValueGetter) => baseValueGetter('inputType') === 'PickList',
  },
  {
    key: 'picklistValue',
    msgkey: 'Admin_Lbl_PickListValue',
    type: FIELD_TEXTAREA,
    condition: (baseValueGetter) => baseValueGetter('inputType') === 'PickList',
  },
];

const configList: ConfigListMap = { base };

export default configList;
