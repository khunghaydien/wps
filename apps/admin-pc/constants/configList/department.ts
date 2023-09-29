import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import EmployeeFieldComponent from '../../components/EmployeeField/EmployeeFieldComponent';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_AUTOSUGGEST_TEXT,
  FIELD_TEXTAREA,
  FIELD_VALID_DATE,
  FIELD_CUSTOM,
} = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;
const { SIZE_LARGE } = fieldSize;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'code', msgkey: 'Admin_Lbl_Code', type: FIELD_TEXT, isRequired: true },
  { key: 'companyId', type: FIELD_HIDDEN },
];

const history: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'baseId', type: FIELD_HIDDEN }, //  { key: 'validDateFrom', type: FIELD_HIDDEN },
  {
    key: 'validDateFrom',
    msgkey: 'Admin_Lbl_ValidDate',
    type: FIELD_VALID_DATE,
    size: SIZE_LARGE,
    display: DISPLAY_DETAIL,
  },
  { key: 'validDateTo', type: FIELD_HIDDEN },
  {
    key: 'comment',
    msgkey: 'Admin_Lbl_ReasonForRevision',
    type: FIELD_TEXT,
    size: SIZE_LARGE,
    display: DISPLAY_DETAIL,
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
    key: 'managerId',
    msgkey: 'Admin_Lbl_DeparmentManagerName',
    dependent: 'manager',
    type: FIELD_CUSTOM,
    Component: EmployeeFieldComponent,
  },
  {
    key: 'parentId',
    msgkey: 'Admin_Lbl_ParentDepartName',
    props: 'departmentId',
    dependent: 'parent',
    type: FIELD_AUTOSUGGEST_TEXT,
    autoSuggest: {
      value: 'id',
      label: 'name',
      buildLabel: (item) => `${item.code} - ${item.name}`,
      suggestionKey: ['id', 'code', 'name'],
    },
    help: 'Admin_Help_AutoSuggest',
    action: 'searchParentDepartment',
  },
  {
    key: 'remarks',
    msgkey: 'Admin_Lbl_Remarks',
    type: FIELD_TEXTAREA,
    size: SIZE_LARGE,
  },
];

const configList: ConfigListMap = { base, history };

export default configList;
