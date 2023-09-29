import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import Deduction from '../../presentational-components/LateArrivalEarlyLeaveReason/Deduction';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_SELECT,
  FIELD_VALID_DATE,
  FIELD_CUSTOM,
} = fieldType;
const { SIZE_SMALL, SIZE_LARGE } = fieldSize;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'code', msgkey: 'Admin_Lbl_Code', type: FIELD_TEXT, isRequired: true },
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
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
    key: 'requestType',
    msgkey: 'Admin_Lbl_LateArrivalEarlyLeaveReasonRequestType',
    type: FIELD_SELECT,
    props: 'requestType',
    isRequired: true,
    multiLanguageValue: true,
  },
  {
    key: 'reasonType',
    msgkey: 'Admin_Lbl_LateArrivalEarlyLeaveReasonType',
    type: FIELD_SELECT,
    props: 'reasonType',
    isRequired: true,
    multiLanguageValue: true,
  },
  {
    key: 'deduction',
    msgkey: 'Admin_Lbl_LateArrivalEarlyLeaveReasonDeduction',
    type: FIELD_CUSTOM,
    help: 'Admin_Help_LateArrivalEarlyLeaveReasonDeduction',
    Component: Deduction,
    enableMode: 'new',
    display: DISPLAY_DETAIL,
    multiLanguageValue: true,
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
    size: SIZE_LARGE,
    display: DISPLAY_DETAIL,
  },
  { key: 'validDateTo', type: FIELD_HIDDEN },
];

const configList: ConfigListMap = { base };

export default configList;
