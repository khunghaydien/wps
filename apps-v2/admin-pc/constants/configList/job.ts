import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import JobParentContainer from '../../containers/JobParentContainer';

import EmployeeFieldComponent from '../../components/EmployeeField/EmployeeFieldComponent';
import JobTypeSelectionComponent from '../../components/JobTypeSelectionField/JobTypeSelectionComponent';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_AUTOSUGGEST_TEXT,
  FIELD_CHECKBOX,
  FIELD_VALID_DATE,
  FIELD_CUSTOM,
} = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;
const { SIZE_LARGE } = fieldSize;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'code', msgkey: 'Admin_Lbl_Code', type: FIELD_TEXT, isRequired: true },
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
  { key: 'companyId', type: FIELD_HIDDEN },
  {
    key: 'departmentId',
    msgkey: 'Admin_Lbl_Department',
    type: FIELD_AUTOSUGGEST_TEXT,
    props: 'departmentId',
    dependent: 'department',
    autoSuggest: {
      value: 'id',
      label: 'name',
      buildLabel: (item) => `${item.code} - ${item.name}`,
      suggestionKey: ['id', 'code', 'name'],
    },
    help: 'Admin_Help_AutoSuggest',
  },
  {
    key: 'parentId',
    msgkey: 'Admin_Lbl_ParentJob',
    type: FIELD_CUSTOM,
    dependent: 'parent',
    props: 'jobId',
    Component: JobParentContainer,
  },
  {
    key: 'jobOwnerId',
    msgkey: 'Admin_Lbl_JobOwnerName',
    dependent: 'jobOwner',
    type: FIELD_CUSTOM,
    Component: EmployeeFieldComponent,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'isSelectableTimeTrack',
    msgkey: 'Admin_Lbl_IsSelectableTimeTrack',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
    defaultValue: true,
    useFunction: 'useWorkTime',
  },
  {
    key: 'isSelectableExpense',
    msgkey: 'Admin_Lbl_IsSelectableExpense',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
    defaultValue: true,
    useFunction: 'useExpense',
  },
  {
    key: 'isEditLockedOfTimeTracking',
    msgkey: 'Admin_Lbl_EditLockedOfTimeTracking',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
    defaultValue: false,
    useFunction: 'useWorkTime',
  },
  {
    key: 'validDateFrom',
    msgkey: 'Admin_Lbl_ValidDate',
    type: FIELD_VALID_DATE,
    display: DISPLAY_DETAIL,
    size: SIZE_LARGE,
    readOnly: true,
    help: 'Admin_Help_JobValidDate',
  },
  { key: 'validDateTo', type: FIELD_HIDDEN },
];

const history = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'baseId', type: FIELD_HIDDEN },
  {
    key: 'validDateFrom',
    msgkey: 'Admin_Lbl_ValidDate',
    type: FIELD_VALID_DATE,
    display: DISPLAY_DETAIL,
    size: SIZE_LARGE,
  },
  { key: 'validDateTo', type: FIELD_HIDDEN },
  {
    key: 'comment',
    msgkey: 'Admin_Lbl_ReasonForRevision',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    size: SIZE_LARGE,
  },
  {
    key: 'jobType',
    msgkey: 'Admin_Lbl_JobType',
    props: 'jobTypeId',
    dependent: 'jobType',
    defaultValue: { name: '', code: '', id: '' },
    type: FIELD_CUSTOM,
    Component: JobTypeSelectionComponent,
  },
  {
    key: 'isDirectCharged',
    msgkey: 'Admin_Lbl_DirectCharged',
    label: 'Admin_Msg_DirectCharged',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
    defaultValue: true,
  },
  {
    key: 'isScopedAssignment',
    msgkey: 'Admin_Lbl_EnableEmployeeAssignments',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
    defaultValue: true,
    help: 'Admin_Help_EnableEmployeeAssignments',
  },
];

const configList: ConfigListMap = { base, history };

export default configList;
