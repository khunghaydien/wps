import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import EmployeeFieldComponent from '../../components/EmployeeField/EmployeeFieldComponent';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_SELECT, FIELD_CUSTOM } = fieldType;
const { SIZE_SMALL } = fieldSize;
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
    key: 'startMonthOfYear',
    msgkey: 'Admin_Lbl_WorkingTypeStartMonthOfYear',
    type: FIELD_SELECT,
    size: SIZE_SMALL,
    charType: 'numeric',
    isRequired: true,
    display: DISPLAY_DETAIL,
    props: 'startMonthOfYear',
    enableMode: ['new', 'clone'],
  },
  {
    key: 'startDateOfMonth',
    msgkey: 'Admin_Lbl_WorkingTypeStartDayOfMonth',
    type: FIELD_TEXT,
    size: SIZE_SMALL,
    charType: 'numeric',
    isRequired: true,
    display: DISPLAY_DETAIL,
    enableMode: ['new', 'clone'],
  },
  {
    key: 'employeeRepresentationId',
    msgkey: 'Admin_Lbl_EmployeeRepresentation',
    dependent: 'employeeRepresentation',
    type: FIELD_CUSTOM,
    Component: EmployeeFieldComponent,
    display: DISPLAY_DETAIL,
    isRequired: true,
  },
];

const configList: ConfigListMap = { base };

export default configList;
