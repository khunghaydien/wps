import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_SELECT,
  FIELD_VALID_DATE,
  FIELD_CHECKBOX,
} = fieldType;

const { SIZE_LARGE } = fieldSize;

const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'companyId', type: FIELD_HIDDEN },
  { key: 'code', msgkey: 'Admin_Lbl_Code', type: FIELD_TEXT, isRequired: true },
  {
    key: 'summaryPeriod',
    msgkey: 'Admin_Lbl_SummaryPeriod',
    type: FIELD_SELECT,
    props: 'summaryPeriod',
    display: DISPLAY_DETAIL,
    isRequired: true,
    multiLanguageValue: true,
    enableMode: 'new',
  },
  {
    key: 'startDateOfMonth',
    msgkey: 'Admin_Lbl_StartDateOfMonth',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    isRequired: true,
    condition: (baseValueGetter) =>
      baseValueGetter('summaryPeriod') === 'Month',
    enableMode: 'new',
  },
  {
    key: 'startDayOfWeek',
    msgkey: 'Admin_Lbl_StartDayOfWeek',
    type: FIELD_SELECT,
    props: 'weekDays',
    display: DISPLAY_DETAIL,
    isRequired: true,
    defaultValue: 'Monday',
    condition: (baseValueGetter) => baseValueGetter('summaryPeriod') === 'Week',
    multiLanguageValue: true,
    enableMode: 'new',
  },
  {
    key: 'monthMark',
    msgkey: 'Admin_Lbl_MonthMark',
    type: FIELD_SELECT,
    props: 'monthMark',
    display: DISPLAY_DETAIL,
    isRequired: true,
    multiLanguageValue: true,
    enableMode: 'new',
  },
  {
    key: 'useRequest',
    msgkey: 'Admin_Lbl_UseTimeTrackRequest',
    type: FIELD_CHECKBOX,
    label: 'Admin_Lbl_Use',
    display: DISPLAY_DETAIL,
    defaultValue: true,
  },
  {
    key: 'useTimeAutoHoursAllocation',
    msgkey: 'Admin_Lbl_UseTimeAutoHoursAllocation',
    type: FIELD_CHECKBOX,
    label: 'Admin_Lbl_Use',
    display: DISPLAY_DETAIL,
    defaultValue: false,
  },
  {
    key: 'useWorkReportByJob',
    msgkey: 'Admin_Lbl_UseWorkReportByJob',
    type: FIELD_CHECKBOX,
    label: 'Admin_Lbl_Use',
    display: DISPLAY_DETAIL,
    defaultValue: false,
  },
  {
    section: 'SettingOfConsistencyWithAttendanceHours',
    msgkey: 'Admin_Lbl_SettingOfConsistencyWithAttendanceHours',
    isExpandable: false,
    configList: [
      {
        key: 'strictlyChecksAttOnRequest',
        msgkey: 'Admin_Lbl_StrictlyChecksAttOnRequest',
        defaultValue: false,
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'checksAttAsWarnOnInput',
        msgkey: 'Admin_Lbl_ChecksAttAsWarnOnInput',
        defaultValue: false,
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: 'NoSubmittedRequestAlert',
    msgkey: 'Admin_Lbl_NoSubmittedRequestAlert',
    isExpandable: false,
    configList: [
      {
        key: 'enableNoSubmittedRequestAlert',
        msgkey: 'Admin_Lbl_EnableNoSubmittedRequestAlert',
        defaultValue: false,
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
];

const history: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'baseId', type: FIELD_HIDDEN },
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
];

const configList: ConfigListMap = { base, history };

export default configList;
