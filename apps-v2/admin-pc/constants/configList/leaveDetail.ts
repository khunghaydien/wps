import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_SELECT, FIELD_VALID_DATE, FIELD_DATE } =
  fieldType;
const { SIZE_SMALL } = fieldSize;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    enableMode: 'new',
    isRequired: true,
  },

  {
    key: 'companyId',
    type: FIELD_HIDDEN,
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
    key: 'leaveName',
    msgkey: 'Admin_Lbl_Leave',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'leaveId',
    msgkey: 'Admin_Lbl_Leave',
    props: 'annualLeaveId',
    type: FIELD_SELECT,
    isRequired: true,
    enableMode: '',
    display: DISPLAY_DETAIL,
  },
  {
    key: 'leaveRanges',
    msgkey: 'Att_Lbl_Range',
    type: FIELD_SELECT,
    props: 'leaveRanges',
    isRequired: true,
    multiLanguageValue: true,
    multiple: true,
  },
  {
    key: 'order',
    msgkey: 'Admin_Lbl_Order',
    type: FIELD_TEXT,
    size: SIZE_SMALL,
    charType: 'numeric',
  },
  {
    key: 'validDateFrom',
    msgkey: 'Admin_Lbl_ValidDate',
    type: FIELD_VALID_DATE,
    display: DISPLAY_DETAIL,
  },
  { key: 'validDateTo', type: FIELD_HIDDEN },
  // 以下、一覧表示用
  {
    key: 'validDateFrom',
    msgkey: 'Admin_Lbl_ValidDateFrom',
    type: FIELD_DATE,
    display: DISPLAY_LIST,
  },
  {
    key: 'validDateTo',
    msgkey: 'Admin_Lbl_ValidDateTo',
    type: FIELD_DATE,
    display: DISPLAY_LIST,
  },
];

const configList: ConfigListMap = { base };

export default configList;
