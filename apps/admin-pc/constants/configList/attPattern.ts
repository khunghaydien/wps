import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_CHECKBOX,
  FIELD_VALID_DATE,
  // FIELD_SELECT,
  FIELD_TIME_START_END,
  FIELD_TIME,
} = fieldType;
const { SIZE_MEDIUM } = fieldSize;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    isRequired: true,
    labelSize: SIZE_MEDIUM,
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
    isRequired: true,
    display: DISPLAY_DETAIL,
    labelSize: SIZE_MEDIUM,
  },
  {
    key: 'name_L1',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    labelSize: SIZE_MEDIUM,
  },
  {
    key: 'name_L2',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    labelSize: SIZE_MEDIUM,
  },
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
  {
    key: 'order',
    msgkey: 'Admin_Lbl_Order',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    labelSize: SIZE_MEDIUM,
    charType: 'numeric',
  },
  {
    key: 'validDateFrom',
    msgkey: 'Admin_Lbl_ValidDate',
    type: FIELD_VALID_DATE,
    display: DISPLAY_DETAIL,
    labelSize: SIZE_MEDIUM,
  },
  { key: 'validDateTo', type: FIELD_HIDDEN },
  {
    key: 'useAMHalfDayLeave',
    msgkey: 'Admin_Lbl_AMHalfDayLeave',
    label: 'Admin_Lbl_Use',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
    labelSize: SIZE_MEDIUM,
  },
  {
    key: 'usePMHalfDayLeave',
    msgkey: 'Admin_Lbl_PMHalfDayLeave',
    label: 'Admin_Lbl_Use',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
    labelSize: SIZE_MEDIUM,
  }, // TODO: 変形労働制以外になった時に設定します。
  // {
  //   key: 'workSystem',
  //   msgkey: 'Admin_Lbl_WorkingTypeName',
  //   type: FIELD_SELECT,
  //   props: 'workSystem',
  //   multiLanguageValue: true,
  //   labelSize: SIZE_MEDIUM,
  //   isRequired: true,
  // },
  {
    key: 'workSystem',
    type: FIELD_HIDDEN,
    defaultValue: 'JP:Modified',
  },
  {
    section: 'AttPatternOptions',
    msgkey: 'Admin_Lbl_AttPatternOptions',
    isExpandable: false,
    configList: [
      {
        key: 'startTime',
        subkey: 'endTime',
        msgkey: 'Admin_Lbl_WorkingHours',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        isRequired: true,
        labelSize: SIZE_MEDIUM,
      },
      { key: 'endTime', type: FIELD_HIDDEN },
      {
        key: 'contractedWorkHours',
        msgkey: 'Admin_Lbl_WorkingTypeContractedWorkHours',
        type: FIELD_TIME,
        display: DISPLAY_DETAIL,
        isRequired: true,
        labelSize: SIZE_MEDIUM,
      },
      {
        key: 'rest1StartTime',
        subkey: 'rest1EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeRest1',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
      },
      { key: 'rest1EndTime', type: FIELD_HIDDEN },
      {
        key: 'rest2StartTime',
        subkey: 'rest2EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeRest2',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
      },
      { key: 'rest2EndTime', type: FIELD_HIDDEN },
      {
        key: 'rest3StartTime',
        subkey: 'rest3EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeRest3',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
      },
      { key: 'rest3EndTime', type: FIELD_HIDDEN },
      {
        key: 'rest4StartTime',
        subkey: 'rest4EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeRest4',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
      },
      { key: 'rest4EndTime', type: FIELD_HIDDEN },
      {
        key: 'rest5StartTime',
        subkey: 'rest5EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeRest5',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
      },
      { key: 'rest5EndTime', type: FIELD_HIDDEN },
      {
        key: 'amStartTime',
        subkey: 'amEndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAm',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter: (arg0: string) => unknown) =>
          !!baseValueGetter('useAMHalfDayLeave'),
      },
      { key: 'amEndTime', type: FIELD_HIDDEN },
      {
        key: 'amContractedWorkHours',
        msgkey: 'Admin_Lbl_WorkingTypeAmContractedWorkHours',
        type: FIELD_TIME,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter: (arg0: string) => unknown) =>
          !!baseValueGetter('useAMHalfDayLeave'),
      },
      {
        key: 'amRest1StartTime',
        subkey: 'amRest1EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRest1',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter: (arg0: string) => unknown) =>
          !!baseValueGetter('useAMHalfDayLeave'),
      },
      { key: 'amRest1EndTime', type: FIELD_HIDDEN },
      {
        key: 'amRest2StartTime',
        subkey: 'amRest2EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRest2',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter: (arg0: string) => unknown) =>
          !!baseValueGetter('useAMHalfDayLeave'),
      },
      { key: 'amRest2EndTime', type: FIELD_HIDDEN },
      {
        key: 'amRest3StartTime',
        subkey: 'amRest3EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRest3',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter: (arg0: string) => unknown) =>
          !!baseValueGetter('useAMHalfDayLeave'),
      },
      { key: 'amRest3EndTime', type: FIELD_HIDDEN },
      {
        key: 'amRest4StartTime',
        subkey: 'amRest4EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRest4',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter: (arg0: string) => unknown) =>
          !!baseValueGetter('useAMHalfDayLeave'),
      },
      { key: 'amRest4EndTime', type: FIELD_HIDDEN },
      {
        key: 'amRest5StartTime',
        subkey: 'amRest5EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRest5',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter: (arg0: string) => unknown) =>
          !!baseValueGetter('useAMHalfDayLeave'),
      },
      { key: 'amRest5EndTime', type: FIELD_HIDDEN },
      {
        key: 'pmStartTime',
        subkey: 'pmEndTime',
        msgkey: 'Admin_Lbl_WorkingTypePm',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter: (arg0: string) => unknown) =>
          !!baseValueGetter('usePMHalfDayLeave'),
      },
      { key: 'pmEndTime', type: FIELD_HIDDEN },
      {
        key: 'pmContractedWorkHours',
        msgkey: 'Admin_Lbl_WorkingTypePmContractedWorkHours',
        type: FIELD_TIME,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter: (arg0: string) => unknown) =>
          !!baseValueGetter('usePMHalfDayLeave'),
      },
      {
        key: 'pmRest1StartTime',
        subkey: 'pmRest1EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRest1',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter: (arg0: string) => unknown) =>
          !!baseValueGetter('usePMHalfDayLeave'),
      },
      { key: 'pmRest1EndTime', type: FIELD_HIDDEN },
      {
        key: 'pmRest2StartTime',
        subkey: 'pmRest2EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRest2',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter: (arg0: string) => unknown) =>
          !!baseValueGetter('usePMHalfDayLeave'),
      },
      { key: 'pmRest2EndTime', type: FIELD_HIDDEN },
      {
        key: 'pmRest3StartTime',
        subkey: 'pmRest3EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRest3',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter: (arg0: string) => unknown) =>
          !!baseValueGetter('usePMHalfDayLeave'),
      },
      { key: 'pmRest3EndTime', type: FIELD_HIDDEN },
      {
        key: 'pmRest4StartTime',
        subkey: 'pmRest4EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRest4',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter: (arg0: string) => unknown) =>
          !!baseValueGetter('usePMHalfDayLeave'),
      },
      { key: 'pmRest4EndTime', type: FIELD_HIDDEN },
      {
        key: 'pmRest5StartTime',
        subkey: 'pmRest5EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRest5',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter: (arg0: string) => unknown) =>
          !!baseValueGetter('usePMHalfDayLeave'),
      },
      { key: 'pmRest5EndTime', type: FIELD_HIDDEN },
      {
        key: 'boundaryOfStartTime',
        msgkey: 'Admin_Lbl_AttPatternBoundaryStartTimeOfDay',
        type: FIELD_TIME,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        help: 'Admin_Help_BoundaryOfStartTime',
      },
      {
        key: 'boundaryOfEndTime',
        msgkey: 'Admin_Lbl_AttPatternBoundaryEndTimeOfDay',
        type: FIELD_TIME,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        help: 'Admin_Help_BoundaryOfEndTime',
      },
    ],
  },
  {
    section: 'RequestOptions',
    msgkey: 'Admin_Lbl_RequestOptions',
    isExpandable: false,
    configList: [
      {
        section: 'OvertimeWorkRequest',
        msgkey: 'Admin_Lbl_OvertimeWorkRequest',
        isExpandable: false,
        configList: [
          {
            key: 'useOvertimeWorkApply',
            msgkey: '',
            type: FIELD_CHECKBOX,
            label: 'Admin_Lbl_Use',
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
          },
          {
            key: 'requireOvertimeWorkApply',
            msgkey: '',
            type: FIELD_CHECKBOX,
            label: 'Admin_Lbl_RequireRequestForAcceptAsWorkHours',
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            condition: (baseValueGetter) =>
              !!baseValueGetter('useOvertimeWorkApply'),
          },
          {
            key: 'requireOvertimeWorkApplyAfter',
            msgkey: 'Admin_Lbl_EndTimeOfAcceptAsWorkingHour',
            type: FIELD_TIME,
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            condition: (baseValueGetter) =>
              !!baseValueGetter('useOvertimeWorkApply') &&
              !!baseValueGetter('requireOvertimeWorkApply'),
            help: 'Admin_Help_EndTimeOfAcceptAsWorkingHourForAttPattern',
          },
        ],
      },
      {
        section: 'EarlyStartWorkRequest',
        msgkey: 'Admin_Lbl_EarlyStartWorkRequest',
        isExpandable: false,
        configList: [
          {
            key: 'useEarlyStartWorkApply',
            msgkey: '',
            type: FIELD_CHECKBOX,
            label: 'Admin_Lbl_Use',
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
          },
          {
            key: 'requireEarlyStartWorkApply',
            msgkey: '',
            type: FIELD_CHECKBOX,
            label: 'Admin_Lbl_RequireRequestForAcceptAsWorkHours',
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            condition: (baseValueGetter) =>
              !!baseValueGetter('useEarlyStartWorkApply'),
          },
          {
            key: 'requireEarlyStartWorkApplyBefore',
            msgkey: 'Admin_Lbl_StartTimeOfAcceptAsWorkingHour',
            type: FIELD_TIME,
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            condition: (baseValueGetter) =>
              !!baseValueGetter('useEarlyStartWorkApply') &&
              !!baseValueGetter('requireEarlyStartWorkApply'),
            help: 'Admin_Help_StartTimeOfAcceptAsWorkingHourForAttPattern',
          },
        ],
      },
    ],
  },
];

const configList: ConfigListMap = {
  base,
};

export default configList;
