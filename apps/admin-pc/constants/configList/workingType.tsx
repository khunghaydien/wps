import * as React from 'react';

import { VALID_PERIOD_UNIT as SUBSTITUTE_LEAVE_VALID_PERIOD_UNIT } from '../../../domain/models/attendance/SubstituteLeaveType';

import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import AnnualPaidTimeLeaveMaximumDays from '../../presentational-components/WorkingType/AnnualPaidTimeLeaveMaximumDays';
import AvailableTimeLeaveRangeForHourlyLeave from '../../presentational-components/WorkingType/AvailableTimeLeaveRangeForHourlyLeave';
import CompensatoryLeavePreRequestDays from '../../presentational-components/WorkingType/CompensatoryLeavePreRequestDays';
import CompensatoryLeaveRange from '../../presentational-components/WorkingType/CompensatoryLeaveRange';
import {
  CompensatoryLeaveThresholdAllDay,
  CompensatoryLeaveThresholdHalfDay,
} from '../../presentational-components/WorkingType/CompensatoryLeaveThreshold';
import DefaultCommuteCount from '../../presentational-components/WorkingType/DefaultCommuteCount';
import AttInputableLabeledRadioFields from '../../presentational-components/WorkingType/Fields/AttInputableLabeledRadioFields';
import LegalRestTimeCheck from '../../presentational-components/WorkingType/LegalRestTimeCheck';
import {
  RequireEarlyStartWorkApplyBefore,
  RequireOvertimeWorkApplyAfter,
} from '../../presentational-components/WorkingType/RequireWorkApply';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_CHECKBOX,
  FIELD_SELECT,
  FIELD_SELECT_WITH_PLACEHOLDER,
  FIELD_VALID_DATE,
  FIELD_TIME,
  FIELD_TIME_START_END,
  FIELD_CUSTOM,
} = fieldType;
const { SIZE_SMALL, SIZE_MEDIUM } = fieldSize;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    isRequired: true,
  }, // FIXME: GENIE-4818の対応 当面はMonthで固定する
  //  { key: 'payrollPeriod', msgkey: 'Admin_Lbl_WorkingTypePayrollPeriod', type: FIELD_SELECT, size: SIZE_SMALL, display: DISPLAY_DETAIL, props: 'payrollPeriod', multiLanguageValue: true },
  { key: 'payrollPeriod', type: FIELD_HIDDEN, defaultValue: 'Month' },
  {
    key: 'startMonthOfYear',
    msgkey: 'Admin_Lbl_WorkingTypeStartMonthOfYear',
    type: FIELD_SELECT,
    size: SIZE_SMALL,
    charType: 'numeric',
    isRequired: true,
    display: DISPLAY_DETAIL,
    props: 'startMonthOfYear',
  },
  {
    key: 'startDayOfMonth',
    msgkey: 'Admin_Lbl_WorkingTypeStartDayOfMonth',
    type: FIELD_TEXT,
    size: SIZE_SMALL,
    charType: 'numeric',
    isRequired: true,
    display: DISPLAY_DETAIL,
    enableMode: ['new', 'clone'],
  },
  {
    key: 'startDayOfWeek',
    msgkey: 'Admin_Lbl_WorkingTypeStartDayOfWeek',
    type: FIELD_SELECT,
    size: SIZE_SMALL,
    charType: 'numeric',
    isRequired: true,
    display: DISPLAY_DETAIL,
    props: 'startDayOfWeek',
    multiLanguageValue: true,
  },
  {
    key: 'yearMark',
    msgkey: 'Admin_Lbl_WorkingTypeYearMark',
    type: FIELD_SELECT,
    charType: 'numeric',
    isRequired: true,
    display: DISPLAY_DETAIL,
    props: 'yearMark',
    multiLanguageValue: true,
    enableMode: ['new', 'clone'],
  },
  {
    key: 'monthMark',
    msgkey: 'Admin_Lbl_WorkingTypeMonthMark',
    type: FIELD_SELECT,
    charType: 'numeric',
    isRequired: true,
    display: DISPLAY_DETAIL,
    props: 'monthMark',
    multiLanguageValue: true,
    enableMode: ['new', 'clone'],
  },
  {
    key: 'workSystem',
    msgkey: 'Admin_Lbl_WorkingTypeWorkSystem',
    type: FIELD_SELECT,
    isRequired: true,
    display: DISPLAY_DETAIL,
    props: 'workSystem',
    multiLanguageValue: true,
    enableMode: ['new', 'clone'],
  },
  {
    key: 'withoutCoreTime',
    msgkey: 'Admin_Lbl_WithoutCoreTime',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
    props: 'workSystem',
    enableMode: ['new', 'clone'],
    condition: (baseValueGetter) => baseValueGetter('workSystem') === 'JP:Flex',
  },
  {
    key: 'modifiedPeriodUnit',
    msgkey: 'Att_Lbl_ModifiedPeriodUnit',
    type: FIELD_SELECT,
    isRequired: true,
    display: DISPLAY_DETAIL,
    props: 'modifiedPeriodUnit',
    enableMode: ['new', 'clone'],
    condition: (baseValueGetter) =>
      baseValueGetter('workSystem') === 'JP:Modified',
    multiLanguageValue: true,
  },
];

const history: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'baseId', type: FIELD_HIDDEN },
  {
    key: 'validDateFrom',
    msgkey: 'Admin_Lbl_ValidDate',
    type: FIELD_VALID_DATE,
    size: 7,
    display: DISPLAY_DETAIL,
    labelSize: SIZE_MEDIUM,
  },
  { key: 'validDateTo', type: FIELD_HIDDEN },
  {
    key: 'comment',
    msgkey: 'Admin_Lbl_ReasonForRevision',
    type: FIELD_TEXT,
    size: 7,
    display: DISPLAY_DETAIL,
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
    msgkey: 'Admin_Lbl_WorkingTypeName',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    isRequired: true,
    labelSize: SIZE_MEDIUM,
  },
  {
    key: 'name_L1',
    msgkey: 'Admin_Lbl_WorkingTypeName',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    labelSize: SIZE_MEDIUM,
  },
  {
    key: 'name_L2',
    msgkey: 'Admin_Lbl_WorkingTypeName',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    labelSize: SIZE_MEDIUM,
  },
  {
    key: 'weeklyDayTypeSUN',
    msgkey: 'Admin_Lbl_WorkingTypeWeeklyDayTypeSUN',
    type: FIELD_SELECT,
    isRequired: true,
    display: DISPLAY_DETAIL,
    props: 'weeklyDayType',
    multiLanguageValue: true,
    labelSize: SIZE_MEDIUM,
  },
  {
    key: 'weeklyDayTypeMON',
    msgkey: 'Admin_Lbl_WorkingTypeWeeklyDayTypeMON',
    type: FIELD_SELECT,
    isRequired: true,
    display: DISPLAY_DETAIL,
    props: 'weeklyDayType',
    multiLanguageValue: true,
    labelSize: SIZE_MEDIUM,
  },
  {
    key: 'weeklyDayTypeTUE',
    msgkey: 'Admin_Lbl_WorkingTypeWeeklyDayTypeTUE',
    type: FIELD_SELECT,
    isRequired: true,
    display: DISPLAY_DETAIL,
    props: 'weeklyDayType',
    multiLanguageValue: true,
    labelSize: SIZE_MEDIUM,
  },
  {
    key: 'weeklyDayTypeWED',
    msgkey: 'Admin_Lbl_WorkingTypeWeeklyDayTypeWED',
    type: FIELD_SELECT,
    isRequired: true,
    display: DISPLAY_DETAIL,
    props: 'weeklyDayType',
    multiLanguageValue: true,
    labelSize: SIZE_MEDIUM,
  },
  {
    key: 'weeklyDayTypeTHU',
    msgkey: 'Admin_Lbl_WorkingTypeWeeklyDayTypeTHU',
    type: FIELD_SELECT,
    isRequired: true,
    display: DISPLAY_DETAIL,
    props: 'weeklyDayType',
    multiLanguageValue: true,
    labelSize: SIZE_MEDIUM,
  },
  {
    key: 'weeklyDayTypeFRI',
    msgkey: 'Admin_Lbl_WorkingTypeWeeklyDayTypeFRI',
    type: FIELD_SELECT,
    isRequired: true,
    display: DISPLAY_DETAIL,
    props: 'weeklyDayType',
    multiLanguageValue: true,
    labelSize: SIZE_MEDIUM,
  },
  {
    key: 'weeklyDayTypeSAT',
    msgkey: 'Admin_Lbl_WorkingTypeWeeklyDayTypeSAT',
    type: FIELD_SELECT,
    isRequired: true,
    display: DISPLAY_DETAIL,
    props: 'weeklyDayType',
    multiLanguageValue: true,
    labelSize: SIZE_MEDIUM,
  },
  {
    key: 'leaveCodeList',
    msgkey: 'Admin_Lbl_LeaveCodeList',
    type: FIELD_SELECT,
    help: 'Admin_Help_CanSelectMultiple',
    display: DISPLAY_DETAIL,
    props: 'leaveCode',
    multiple: true,
    labelSize: SIZE_MEDIUM,
  },
  {
    section: 'WorkingTypeOptions',
    msgkey: 'Admin_Lbl_WorkingTypeOptions',
    isExpandable: true,
    configList: [
      {
        key: 'patternCodeList',
        msgkey: 'Admin_Lbl_AttPatternCodeList',
        type: FIELD_SELECT,
        help: 'Admin_Help_AttPatternCodeList',
        display: DISPLAY_DETAIL,
        props: 'attPatternCode',
        multiple: true,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Modified',
      },
      {
        key: 'useFixedContractedWorkingHours',
        msgkey: 'Admin_Lbl_AttPatternUseFixedContractedWorkingHours',
        label: 'Admin_Lbl_Use',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Modified',
      },
      //      { key: 'automaticLegalHolidayAssign', msgkey: 'Admin_Lbl_WorkingTypeAutomaticLegalHolidayAssign', type: FIELD_CHECKBOX, size: SIZE_SMALL, display: DISPLAY_DETAIL, labelSize: SIZE_MEDIUM },
      //      { key: 'boundaryTimeOfDay', msgkey: 'Admin_Lbl_WorkingTypeBoundaryTimeOfDay', type: FIELD_TIME, size: SIZE_SMALL, display: DISPLAY_DETAIL, labelSize: SIZE_MEDIUM },
      // GENIE-9678 FEから値を渡さずnullにする
      // { key: 'boundaryTimeOfDay', type: FIELD_HIDDEN, defaultValue: '0' },
      //      { key: 'classificationNextDayWork', msgkey: 'Admin_Lbl_WorkingTypeClassificationNextDayWork', type: FIELD_SELECT, display: DISPLAY_DETAIL, labelSize: SIZE_MEDIUM, props: 'classificationNextDayWork', multiLanguageValue: true },
      //      { key: 'startOfNightWork', msgkey: 'Admin_Lbl_WorkingTypeStartOfNightWork', type: FIELD_TIME, size: SIZE_SMALL, display: DISPLAY_DETAIL, labelSize: SIZE_MEDIUM },
      //      { key: 'endOfNightWork', msgkey: 'Admin_Lbl_WorkingTypeEndOfNightWork', type: FIELD_TIME, size: SIZE_SMALL, display: DISPLAY_DETAIL, labelSize: SIZE_MEDIUM },
      // GENIE-4763 固定値に変更 22:00(60 * 22 = 1320) 〜 05:00(60 * 5 = 300)
      { key: 'startOfNightWork', type: FIELD_HIDDEN, defaultValue: '1320' },
      { key: 'endOfNightWork', type: FIELD_HIDDEN, defaultValue: '300' }, //      { key: 'legalHolidayAssignmentDays', msgkey: 'Admin_Lbl_WorkingTypeLegalHolidayAssignmentDays', type: FIELD_SELECT, size: SIZE_SMALL, charType: 'numeric', display: DISPLAY_DETAIL, labelSize: SIZE_MEDIUM, props: 'legalHolidayAssignmentDays' },
      //      { key: 'legalHolidayAssignmentPeriod', msgkey: 'Admin_Lbl_WorkingTypeLegalHolidayAssignmentPeriod', type: FIELD_SELECT, size: SIZE_SMALL, charType: 'numeric', display: DISPLAY_DETAIL, labelSize: SIZE_MEDIUM, props: 'legalHolidayAssignmentPeriod' },
      // NOTE: GENIE-5928 - １日の法定労働時間」を非表示にする
      {
        key: 'legalWorkTimeADay',
        type: FIELD_HIDDEN,
        defaultValue: '480',
        isRequired: true,
      }, //      { key: 'legalWorkTimeAWeek', msgkey: 'Admin_Lbl_WorkingTypeLegalWorkTimeAWeek', type: FIELD_TIME, size: SIZE_SMALL, display: DISPLAY_DETAIL, labelSize: SIZE_MEDIUM },
      // FIXME: GenieGENIE-4732 に関する暫定対応。週40時間固定とするため40*60で2400
      {
        key: 'legalWorkTimeAWeek',
        type: FIELD_HIDDEN,
        defaultValue: '2400',
        isRequired: true,
      },
      {
        key: 'offsetOvertimeAndDeductionTime',
        msgkey: 'Admin_Lbl_WorkingTypeOvertimeAndDeductionTime',
        label: 'Admin_Lbl_WorkingTypeOffset',
        type: FIELD_CHECKBOX,
        size: SIZE_SMALL,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'JP:Discretion' &&
          baseValueGetter('workSystem') !== 'JP:Manager' &&
          baseValueGetter('workSystem') !== 'JP:Flex',
      },
      {
        key: 'useAMHalfDayLeave',
        msgkey: 'Admin_Lbl_AMHalfDayLeave',
        label: 'Admin_Lbl_Use',
        type: FIELD_CHECKBOX,
        size: SIZE_SMALL,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ),
      },
      {
        key: 'usePMHalfDayLeave',
        msgkey: 'Admin_Lbl_PMHalfDayLeave',
        label: 'Admin_Lbl_Use',
        type: FIELD_CHECKBOX,
        size: SIZE_SMALL,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ),
      },
      {
        key: 'useHalfDayLeave',
        msgkey: 'Admin_Lbl_HalfDayLeave',
        label: 'Admin_Lbl_Use',
        type: FIELD_CHECKBOX,
        size: SIZE_SMALL,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Flex' &&
          !!baseValueGetter('withoutCoreTime'),
      },
      {
        key: 'halfDayLeaveHours',
        msgkey: 'Admin_Lbl_HalfDayLeaveHours',
        label: 'Admin_Lbl_Use',
        type: FIELD_TIME,
        size: SIZE_SMALL,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        isRequired: true,
        condition: (baseValueGetter, historyValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Flex' &&
          !!baseValueGetter('withoutCoreTime') &&
          !!historyValueGetter('useHalfDayLeave'),
      },
      {
        key: 'allowWorkDuringHalfDayLeave',
        msgkey: 'Admin_Lbl_AllowToWorkOnHalfDayLeaveTime',
        label: 'Admin_Lbl_Admit',
        type: FIELD_CHECKBOX,
        size: SIZE_SMALL,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        defaultValue: false,
        condition: (baseValueGetter, historyValueGetter) =>
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) &&
          (!!historyValueGetter('useAMHalfDayLeave') ||
            !!historyValueGetter('usePMHalfDayLeave')),
      },
      {
        key: 'isIncludeHolidayWorkInPlainTime',
        msgkey: 'Admin_Lbl_IncludeHolidayWorkInPlainTime',
        label: 'Admin_Lbl_Include',
        type: FIELD_CHECKBOX,
        size: SIZE_SMALL,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        defaultValue: true,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Flex',
      },
      {
        key: 'isIncludeHolidayWorkInDeemedTime',
        msgkey: 'Admin_Lbl_IncludeHolidayWorkInDeemedTime',
        label: 'Admin_Lbl_Include',
        type: FIELD_CHECKBOX,
        size: SIZE_SMALL,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        defaultValue: false,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Discretion',
      },
      {
        key: 'useLegalRestCheck1',
        msgkey: 'Admin_Lbl_LegalRestTimeCheck1',
        defaultValue: true,
        type: FIELD_CUSTOM,
        size: 7,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        Component: ((props) => (
          <LegalRestTimeCheck
            {...props}
            childrenKeys={{
              workTime: 'legalRestCheck1WorkTimeThreshold',
              restTime: 'legalRestCheck1RequiredRestTime',
            }}
          />
        )) as React.ComponentType<any>,
      },
      {
        key: 'legalRestCheck1WorkTimeThreshold',
        type: FIELD_HIDDEN,
        defaultValue: '360',
        condition: (baseValueGetter, historyValueGetter) =>
          !!historyValueGetter('useLegalRestCheck1'),
      },
      {
        key: 'legalRestCheck1RequiredRestTime',
        type: FIELD_HIDDEN,
        defaultValue: '45',
        condition: (baseValueGetter, historyValueGetter) =>
          !!historyValueGetter('useLegalRestCheck1'),
      },
      {
        key: 'useLegalRestCheck2',
        msgkey: 'Admin_Lbl_LegalRestTimeCheck2',
        defaultValue: true,
        type: FIELD_CUSTOM,
        size: 7,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        Component: ((props) => (
          <LegalRestTimeCheck
            {...props}
            childrenKeys={{
              workTime: 'legalRestCheck2WorkTimeThreshold',
              restTime: 'legalRestCheck2RequiredRestTime',
            }}
          />
        )) as React.ComponentType<any>,
        condition: (baseValueGetter, historyValueGetter) =>
          !!historyValueGetter('useLegalRestCheck1'),
      },
      {
        key: 'legalRestCheck2WorkTimeThreshold',
        type: FIELD_HIDDEN,
        defaultValue: '480',
        condition: (baseValueGetter, historyValueGetter) =>
          !!historyValueGetter('useLegalRestCheck2'),
      },
      {
        key: 'legalRestCheck2RequiredRestTime',
        type: FIELD_HIDDEN,
        defaultValue: '60',
        condition: (baseValueGetter, historyValueGetter) =>
          !!historyValueGetter('useLegalRestCheck2'),
      },
      {
        key: 'useAnnualPaidTimeLeave',
        msgkey: 'Admin_Lbl_TimeLeaveAnnualPaidLeave',
        defaultValue: true,
        type: FIELD_CUSTOM,
        size: 7,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        Component: ((props) => (
          <AnnualPaidTimeLeaveMaximumDays
            {...props}
            childrenKeys={{
              maximumDays: 'annualPaidTimeLeaveMaximumDays',
            }}
          />
        )) as React.ComponentType<any>,
      },
      {
        key: 'annualPaidTimeLeaveMaximumDays',
        type: FIELD_HIDDEN,
        defaultValue: '5',
      },
      {
        key: 'useOtherTimeLeave',
        msgkey: 'Admin_Lbl_TimeLeaveOther',
        label: 'Admin_Lbl_Use',
        type: FIELD_CHECKBOX,
        size: SIZE_SMALL,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        defaultValue: true,
      },
      {
        key: 'useTimeLeaveRange',
        msgkey: 'Admin_Lbl_AvailableWorkingTimeRangeForHourlyLeave',
        type: FIELD_CUSTOM,
        size: SIZE_SMALL,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        Component: ((props) => (
          <AvailableTimeLeaveRangeForHourlyLeave
            {...props}
            childrenKeys={{
              startOfTimeLeave: 'startOfTimeLeave',
              endOfTimeLeave: 'endOfTimeLeave',
            }}
          />
        )) as React.ComponentType<any>,
        condition: (baseValueGetter, historyValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Flex' &&
          baseValueGetter('withoutCoreTime') &&
          (historyValueGetter('useAnnualPaidTimeLeave') ||
            historyValueGetter('useOtherTimeLeave')),
      },
      {
        key: 'startOfTimeLeave',
        type: FIELD_HIDDEN,
      },
      {
        key: 'endOfTimeLeave',
        type: FIELD_HIDDEN,
      },
      {
        key: 'useManageCommuteCount',
        msgkey: 'Admin_Lbl_UseManageCommuteCount',
        label: 'Admin_Lbl_Use',
        type: FIELD_CHECKBOX,
        size: SIZE_SMALL,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        defaultValue: false,
      },
      {
        key: 'strictlyCommuteCountOnFixRequest',
        msgkey: 'Admin_Lbl_StrictlyCommuteCountOnFixRequest',
        label: 'Admin_Lbl_Use',
        type: FIELD_CHECKBOX,
        size: SIZE_SMALL,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        defaultValue: false,
        condition: (_baseValueGetter, historyValueGetter) =>
          historyValueGetter('useManageCommuteCount'),
      },
      {
        key: 'defaultCommuteCount',
        msgkey: 'Admin_Lbl_DefaultCommuteCount',
        type: FIELD_CUSTOM,
        Component: ((props) => (
          <DefaultCommuteCount
            {...props}
            commuteCountKeys={{
              defaultCommuteForwardCount: 'defaultCommuteForwardCount',
              defaultCommuteBackwardCount: 'defaultCommuteBackwardCount',
            }}
          />
        )) as React.ComponentType<any>,
        labelSize: SIZE_MEDIUM,
        display: DISPLAY_DETAIL,
        condition: (_baseValueGetter, historyValueGetter) =>
          historyValueGetter('useManageCommuteCount'),
      },
      {
        key: 'defaultCommuteForwardCount',
        type: FIELD_HIDDEN,
      },
      {
        key: 'defaultCommuteBackwardCount',
        type: FIELD_HIDDEN,
      },
    ],
  },
  {
    section: 'WorkingTypeTime',
    msgkey: 'Admin_Lbl_WorkingTypeTime',
    isExpandable: true,
    configList: [
      {
        key: 'flexStartTime',
        subkey: 'flexEndTime',
        msgkey: 'Admin_Lbl_FlexHours',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        isRequired: true,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Flex',
      },
      { key: 'flexEndTime', type: FIELD_HIDDEN },
      {
        key: 'startTime',
        subkey: 'endTime',
        msgkey: 'Admin_Lbl_WorkingHours',
        type: FIELD_TIME_START_END,
        isRequired: true,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'JP:Flex' &&
          baseValueGetter('workSystem') !== 'JP:Discretion' &&
          baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'startTime',
        subkey: 'endTime',
        msgkey: 'Admin_Lbl_CoreTime',
        type: FIELD_TIME_START_END,
        isRequired: true,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Flex' &&
          !baseValueGetter('withoutCoreTime'),
      },
      {
        key: 'startTime',
        subkey: 'endTime',
        msgkey: 'Admin_Lbl_WorkingHoursCriterion',
        type: FIELD_TIME_START_END,
        isRequired: false,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Discretion',
      },
      {
        key: 'startTime',
        subkey: 'endTime',
        msgkey: 'Admin_Lbl_WorkingHoursCriterion',
        type: FIELD_TIME_START_END,
        isRequired: true, // It should be false (and be merged with the field above) after GENIE-5944
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      { key: 'endTime', type: FIELD_HIDDEN },
      {
        key: 'deemedWorkHours',
        msgkey: 'Admin_Lbl_DeemedWorkHours',
        type: FIELD_TIME,
        size: SIZE_SMALL,
        isRequired: true,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Discretion',
      },
      {
        key: 'deemedOvertimeHours',
        msgkey: 'Admin_Lbl_DeemedOvertimeHours',
        type: FIELD_TIME,
        size: SIZE_SMALL,
        isRequired: false,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Discretion',
      },
      {
        key: 'contractedWorkHours',
        msgkey: 'Admin_Lbl_WorkingTypeContractedWorkHours',
        type: FIELD_TIME,
        size: SIZE_SMALL,
        isRequired: true,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'JP:Discretion' &&
          baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'contractedWorkHours',
        msgkey: 'Admin_Lbl_WorkingTypeWorkHoursCriterion',
        type: FIELD_TIME,
        size: SIZE_SMALL,
        isRequired: true, // It should be false after GENIE-5944
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      {
        key: 'rest1StartTime',
        subkey: 'rest1EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeRest1',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'rest1StartTime',
        subkey: 'rest1EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeRestCriterion1',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      { key: 'rest1EndTime', type: FIELD_HIDDEN },
      {
        key: 'rest2StartTime',
        subkey: 'rest2EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeRest2',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'rest2StartTime',
        subkey: 'rest2EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeRestCriterion2',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      { key: 'rest2EndTime', type: FIELD_HIDDEN },
      {
        key: 'rest3StartTime',
        subkey: 'rest3EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeRest3',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'rest3StartTime',
        subkey: 'rest3EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeRestCriterion3',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      { key: 'rest3EndTime', type: FIELD_HIDDEN },
      {
        key: 'rest4StartTime',
        subkey: 'rest4EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeRest4',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'rest4StartTime',
        subkey: 'rest4EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeRestCriterion4',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      { key: 'rest4EndTime', type: FIELD_HIDDEN },
      {
        key: 'rest5StartTime',
        subkey: 'rest5EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeRest5',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'rest5StartTime',
        subkey: 'rest5EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeRestCriterion5',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      { key: 'rest5EndTime', type: FIELD_HIDDEN },
      {
        key: 'amStartTime',
        subkey: 'amEndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAm',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'JP:Flex' &&
          baseValueGetter('workSystem') !== 'JP:Discretion' &&
          baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'amStartTime',
        subkey: 'amEndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmCriterion',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Discretion' ||
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      {
        key: 'amStartTime',
        subkey: 'amEndTime',
        msgkey: 'Admin_Lbl_WorkingTypeFlexAm',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Flex' &&
          !baseValueGetter('withoutCoreTime'),
      },
      { key: 'amEndTime', type: FIELD_HIDDEN },
      {
        key: 'amContractedWorkHours',
        msgkey: 'Admin_Lbl_WorkingTypeAmContractedWorkHours',
        type: FIELD_TIME,
        size: SIZE_SMALL,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'JP:Discretion' &&
          baseValueGetter('workSystem') !== 'JP:Manager' &&
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ),
      },
      {
        key: 'amContractedWorkHours',
        msgkey: 'Admin_Lbl_WorkingTypeAmWorkHoursCriterion',
        type: FIELD_TIME,
        size: SIZE_SMALL,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      {
        key: 'amRest1StartTime',
        subkey: 'amRest1EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRest1',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) && baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'amRest1StartTime',
        subkey: 'amRest1EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRestCriterion1',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      { key: 'amRest1EndTime', type: FIELD_HIDDEN },
      {
        key: 'amRest2StartTime',
        subkey: 'amRest2EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRest2',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) && baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'amRest2StartTime',
        subkey: 'amRest2EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRestCriterion2',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      { key: 'amRest2EndTime', type: FIELD_HIDDEN },
      {
        key: 'amRest3StartTime',
        subkey: 'amRest3EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRest3',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) && baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'amRest3StartTime',
        subkey: 'amRest3EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRestCriterion3',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      { key: 'amRest3EndTime', type: FIELD_HIDDEN },
      {
        key: 'amRest4StartTime',
        subkey: 'amRest4EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRest4',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) && baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'amRest4StartTime',
        subkey: 'amRest4EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRestCriterion4',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      { key: 'amRest4EndTime', type: FIELD_HIDDEN },
      {
        key: 'amRest5StartTime',
        subkey: 'amRest5EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRest5',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) && baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'amRest5StartTime',
        subkey: 'amRest5EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRestCriterion5',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      { key: 'amRest5EndTime', type: FIELD_HIDDEN },
      {
        key: 'pmStartTime',
        subkey: 'pmEndTime',
        msgkey: 'Admin_Lbl_WorkingTypePm',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'JP:Flex' &&
          baseValueGetter('workSystem') !== 'JP:Discretion' &&
          baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'pmStartTime',
        subkey: 'pmEndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmCriterion',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Discretion' ||
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      {
        key: 'pmStartTime',
        subkey: 'pmEndTime',
        msgkey: 'Admin_Lbl_WorkingTypeFlexPm',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Flex' &&
          !baseValueGetter('withoutCoreTime'),
      },
      { key: 'pmEndTime', type: FIELD_HIDDEN },
      {
        key: 'pmContractedWorkHours',
        msgkey: 'Admin_Lbl_WorkingTypePmContractedWorkHours',
        type: FIELD_TIME,
        size: SIZE_SMALL,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'JP:Discretion' &&
          baseValueGetter('workSystem') !== 'JP:Manager' &&
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ),
      },
      {
        key: 'pmContractedWorkHours',
        msgkey: 'Admin_Lbl_WorkingTypePmWorkHoursCriterion',
        type: FIELD_TIME,
        size: SIZE_SMALL,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      {
        key: 'pmRest1StartTime',
        subkey: 'pmRest1EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRest1',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) && baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'pmRest1StartTime',
        subkey: 'pmRest1EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRestCriterion1',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      { key: 'pmRest1EndTime', type: FIELD_HIDDEN },
      {
        key: 'pmRest2StartTime',
        subkey: 'pmRest2EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRest2',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) && baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'pmRest2StartTime',
        subkey: 'pmRest2EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRestCriterion2',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      { key: 'pmRest2EndTime', type: FIELD_HIDDEN },
      {
        key: 'pmRest3StartTime',
        subkey: 'pmRest3EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRest3',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) && baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'pmRest3StartTime',
        subkey: 'pmRest3EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRestCriterion3',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      { key: 'pmRest3EndTime', type: FIELD_HIDDEN },
      {
        key: 'pmRest4StartTime',
        subkey: 'pmRest4EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRest4',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) && baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'pmRest4StartTime',
        subkey: 'pmRest4EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRestCriterion4',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      { key: 'pmRest4EndTime', type: FIELD_HIDDEN },
      {
        key: 'pmRest5StartTime',
        subkey: 'pmRest5EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRest5',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) && baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'pmRest5StartTime',
        subkey: 'pmRest5EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRestCriterion5',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager',
      },
      { key: 'pmRest5EndTime', type: FIELD_HIDDEN },
      {
        key: 'boundaryOfStartTime',
        msgkey: 'Admin_Lbl_WorkingTypeBoundaryStartTimeOfDay',
        type: FIELD_TIME,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Modified',
        help: 'Admin_Help_BoundaryOfStartTime',
      },
      {
        key: 'boundaryOfEndTime',
        msgkey: 'Admin_Lbl_WorkingTypeBoundaryEndTimeOfDay',
        type: FIELD_TIME,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Modified',
        help: 'Admin_Help_BoundaryOfEndTime',
      },
    ],
  },
  {
    section: 'RequestOptions',
    msgkey: 'Admin_Lbl_RequestOptions',
    isExpandable: true,
    configList: [
      {
        key: 'allowToChangeApproverSelf',
        msgkey: 'Admin_Lbl_AllowToChangeApprover',
        type: FIELD_CHECKBOX,
        defaultValue: false,
        label: 'Admin_Lbl_AllowRequesterToChangeApprover',
        display: DISPLAY_DETAIL,
        size: SIZE_MEDIUM,
        labelSize: SIZE_MEDIUM,
        help: 'Admin_Help_AllowToChangeApproverHelp',
      },
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
            condition: (_, historyValueGetter) =>
              !!historyValueGetter('useOvertimeWorkApply'),
          },
          {
            key: 'requireOvertimeWorkApplyAfter',
            msgkey: 'Admin_Lbl_EndTimeOfAcceptAsWorkingHour',
            type: FIELD_CUSTOM,
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            Component: RequireOvertimeWorkApplyAfter,
            condition: (baseValueGetter, historyValueGetter) =>
              baseValueGetter('workSystem') !== 'JP:Discretion' &&
              !!historyValueGetter('useOvertimeWorkApply') &&
              !!historyValueGetter('requireOvertimeWorkApply'),
            help: 'Admin_Help_EndTimeOfAcceptAsWorkingHour',
          }, // 裁量労働制の場合は必須項目となる
          {
            key: 'requireOvertimeWorkApplyAfter',
            msgkey: 'Admin_Lbl_EndTimeOfAcceptAsWorkingHour',
            type: FIELD_CUSTOM,
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            Component: RequireOvertimeWorkApplyAfter,
            isRequired: true,
            condition: (baseValueGetter, historyValueGetter) =>
              baseValueGetter('workSystem') === 'JP:Discretion' &&
              !!historyValueGetter('useOvertimeWorkApply') &&
              !!historyValueGetter('requireOvertimeWorkApply'),
            help: 'Admin_Help_EndTimeOfAcceptAsWorkingHour',
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
            condition: (_, historyValueGetter) =>
              !!historyValueGetter('useEarlyStartWorkApply'),
          },
          {
            key: 'requireEarlyStartWorkApplyBefore',
            msgkey: 'Admin_Lbl_StartTimeOfAcceptAsWorkingHour',
            type: FIELD_CUSTOM,
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            Component: RequireEarlyStartWorkApplyBefore,
            condition: (baseValueGetter, historyValueGetter) =>
              baseValueGetter('workSystem') !== 'JP:Discretion' &&
              !!historyValueGetter('useEarlyStartWorkApply') &&
              !!historyValueGetter('requireEarlyStartWorkApply'),
            help: 'Admin_Help_StartTimeOfAcceptAsWorkingHour',
          }, // 裁量労働制の場合は必須項目となる
          {
            key: 'requireEarlyStartWorkApplyBefore',
            msgkey: 'Admin_Lbl_StartTimeOfAcceptAsWorkingHour',
            type: FIELD_CUSTOM,
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            Component: RequireEarlyStartWorkApplyBefore,
            isRequired: true,
            condition: (baseValueGetter, historyValueGetter) =>
              baseValueGetter('workSystem') === 'JP:Discretion' &&
              !!historyValueGetter('useEarlyStartWorkApply') &&
              !!historyValueGetter('requireEarlyStartWorkApply'),
            help: 'Admin_Help_StartTimeOfAcceptAsWorkingHour',
          },
        ],
      },
      {
        section: 'LateArrivalRequestOptions',
        msgkey: 'Admin_Lbl_LateArrivalRequest',
        isExpandable: false,
        configList: [
          {
            key: 'useLateArrivalApply',
            msgkey: '',
            type: FIELD_CHECKBOX,
            label: 'Admin_Lbl_Use',
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
          },
        ],
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'JP:Manager' &&
          baseValueGetter('workSystem') !== 'JP:Discretion' &&
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ),
      },
      {
        section: 'EarlyLeaveRequestOptions',
        msgkey: 'Admin_Lbl_EarlyLeaveRequest',
        isExpandable: false,
        configList: [
          {
            key: 'useEarlyLeaveApply',
            msgkey: '',
            type: FIELD_CHECKBOX,
            label: 'Admin_Lbl_Use',
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
          },
        ],
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'JP:Manager' &&
          baseValueGetter('workSystem') !== 'JP:Discretion' &&
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ),
      },
      {
        section: 'HolidayWorkRequestOptions',
        msgkey: 'Admin_Lbl_HolidayWorkRequest',
        isExpandable: false,
        configList: [
          {
            key: 'useSubstituteLeave',
            msgkey:
              'Admin_Lbl_UseSubstituteOfSubstituteLeaveTypeInsteadOfHolidayWork',
            type: FIELD_CHECKBOX,
            label: 'Admin_Lbl_Use',
            display: DISPLAY_DETAIL,
            labelSize: SIZE_MEDIUM,
          },
          {
            key: 'substituteLeaveCode',
            msgkey: 'Admin_Lbl_SubstituteLeaveToUse',
            display: DISPLAY_DETAIL,
            labelSize: SIZE_MEDIUM,
            type: FIELD_SELECT_WITH_PLACEHOLDER,
            props: 'substituteLeaveCode',
            isRequired: true,
            condition: (baseValueGetter, historyValueGetter) =>
              historyValueGetter('useSubstituteLeave'),
          },
          {
            key: 'usePeriodInSubstituteLeave',
            msgkey: 'Admin_Lbl_SubstituteLeaveValidPeriod',
            type: FIELD_CHECKBOX,
            label: 'Admin_Lbl_Restrict',
            display: DISPLAY_DETAIL,
            labelSize: SIZE_MEDIUM,
            condition: (baseValueGetter, historyValueGetter) =>
              historyValueGetter('useSubstituteLeave'),
          },
          {
            key: 'substituteLeaveValidFromPeriod',
            msgkey: 'Admin_Lbl_SubstituteLeaveValidFromPeriod',
            type: FIELD_CUSTOM,
            size: 7,
            Component: (props) => (
              <AttInputableLabeledRadioFields
                recordUnitKey="substituteLeaveValidFromPeriodUnit"
                unitProps={[
                  {
                    name: SUBSTITUTE_LEAVE_VALID_PERIOD_UNIT.Day,
                    embeddedMessageKey:
                      'Admin_Msg_SubstituteLeaveValidFromPeriodUnitDay',
                    min: 1,
                    max: 365,
                  },
                  {
                    name: SUBSTITUTE_LEAVE_VALID_PERIOD_UNIT.Monthly,
                    embeddedMessageKey:
                      'Admin_Msg_SubstituteLeaveValidFromPeriodUnitMonthly',
                    min: 0,
                    max: 11,
                  },
                ]}
                {...props}
              />
            ),
            labelSize: SIZE_MEDIUM,
            display: DISPLAY_DETAIL,
            isRequired: true,
            condition: (baseValueGetter, historyValueGetter) =>
              historyValueGetter('useSubstituteLeave') &&
              historyValueGetter('usePeriodInSubstituteLeave'),
          },
          {
            key: 'substituteLeaveValidFromPeriodUnit',
            type: FIELD_HIDDEN,
            condition: (baseValueGetter, historyValueGetter) =>
              historyValueGetter('useSubstituteLeave') &&
              historyValueGetter('usePeriodInSubstituteLeave'),
          },
          {
            key: 'substituteLeaveValidToPeriod',
            msgkey: 'Admin_Lbl_SubstituteLeaveValidToPeriod',
            type: FIELD_CUSTOM,
            size: 7,
            Component: (props) => (
              <AttInputableLabeledRadioFields
                recordUnitKey="substituteLeaveValidToPeriodUnit"
                unitProps={[
                  {
                    name: SUBSTITUTE_LEAVE_VALID_PERIOD_UNIT.Day,
                    embeddedMessageKey:
                      'Admin_Msg_SubstituteLeaveValidToPeriodUnitDay',
                    min: 1,
                    max: 365,
                  },
                  {
                    name: SUBSTITUTE_LEAVE_VALID_PERIOD_UNIT.Monthly,
                    embeddedMessageKey:
                      'Admin_Msg_SubstituteLeaveValidToPeriodUnitMonthly',
                    min: 0,
                    max: 11,
                  },
                ]}
                {...props}
              />
            ),
            labelSize: SIZE_MEDIUM,
            display: DISPLAY_DETAIL,
            isRequired: true,
            condition: (baseValueGetter, historyValueGetter) =>
              historyValueGetter('useSubstituteLeave') &&
              historyValueGetter('usePeriodInSubstituteLeave'),
          },
          {
            key: 'substituteLeaveValidToPeriodUnit',
            type: FIELD_HIDDEN,
            condition: (baseValueGetter, historyValueGetter) =>
              historyValueGetter('useSubstituteLeave') &&
              historyValueGetter('usePeriodInSubstituteLeave'),
          },
          {
            key: 'useCompensatoryLeave',
            msgkey:
              'Admin_Lbl_UseCompensatoryLeaveOfSubstituteLeaveTypeInsteadOfHolidayWork',
            type: FIELD_CHECKBOX,
            label: 'Admin_Lbl_Use',
            display: DISPLAY_DETAIL,
            labelSize: SIZE_MEDIUM,
            condition: (baseValueGetter) =>
              baseValueGetter('workSystem') !== 'JP:Manager',
          },
          {
            key: 'compensatoryLeaveThresholdAllDay',
            msgkey: 'Admin_Lbl_CompensatoryLeaveThresholdAllDayGranted',
            type: FIELD_CUSTOM,
            Component: CompensatoryLeaveThresholdAllDay,
            isRequired: true,
            labelSize: SIZE_MEDIUM,
            display: DISPLAY_DETAIL,
            condition: (baseValueGetter, historyValueGetter) =>
              baseValueGetter('workSystem') !== 'JP:Manager' &&
              historyValueGetter('useCompensatoryLeave'),
          },
          {
            key: 'compensatoryLeaveThresholdHalfDay',
            msgkey: 'Admin_Lbl_CompensatoryLeaveThresholdHalfDayGranted',
            type: FIELD_CUSTOM,
            Component: (props) => (
              <CompensatoryLeaveThresholdHalfDay
                {...props}
                checkboxKey="useHalfDayCompensatoryLeaveGrant"
              />
            ),
            labelSize: SIZE_MEDIUM,
            display: DISPLAY_DETAIL,
            condition: (baseValueGetter, historyValueGetter) =>
              baseValueGetter('workSystem') !== 'JP:Manager' &&
              historyValueGetter('useCompensatoryLeave'),
          },
          {
            key: 'useHalfDayCompensatoryLeaveGrant',
            type: FIELD_HIDDEN,
            condition: (baseValueGetter, historyValueGetter) =>
              baseValueGetter('workSystem') !== 'JP:Manager' &&
              historyValueGetter('useCompensatoryLeave'),
          },
          {
            key: 'compensatoryLeaveRanges',
            msgkey: 'Admin_Lbl_CompensatoryLeaveRange',
            help: 'Admin_Help_CanSelectMultiple',
            type: FIELD_CUSTOM,
            props: 'compensatoryLeaveRanges',
            Component: (props) => (
              <CompensatoryLeaveRange {...props} configList={history} />
            ),
            isRequired: true,
            labelSize: SIZE_MEDIUM,
            display: DISPLAY_DETAIL,
            condition: (baseValueGetter, historyValueGetter) =>
              baseValueGetter('workSystem') !== 'JP:Manager' &&
              historyValueGetter('useCompensatoryLeave'),
          },
          {
            key: 'compensatoryLeaveValidPeriod',
            msgkey: 'Admin_Lbl_CompensatoryLeaveValidPeriod',
            type: FIELD_CUSTOM,
            size: 7,
            Component: (props) => (
              <AttInputableLabeledRadioFields
                recordUnitKey="compensatoryLeaveValidPeriodUnit"
                unitProps={[
                  {
                    name: SUBSTITUTE_LEAVE_VALID_PERIOD_UNIT.Day,
                    embeddedMessageKey:
                      'Admin_Msg_CompensatoryLeaveValidPeriodUnitDay',
                    min: 1,
                    max: 365,
                  },
                  {
                    name: SUBSTITUTE_LEAVE_VALID_PERIOD_UNIT.Monthly,
                    embeddedMessageKey:
                      'Admin_Msg_CompensatoryLeaveValidPeriodUnitMonthly',
                    min: 0,
                    max: 11,
                  },
                ]}
                {...props}
              />
            ),
            labelSize: SIZE_MEDIUM,
            display: DISPLAY_DETAIL,
            isRequired: true,
            condition: (baseValueGetter, historyValueGetter) =>
              baseValueGetter('workSystem') !== 'JP:Manager' &&
              historyValueGetter('useCompensatoryLeave'),
          },
          {
            key: 'compensatoryLeaveValidPeriodUnit',
            type: FIELD_HIDDEN,
            condition: (baseValueGetter, historyValueGetter) =>
              baseValueGetter('workSystem') !== 'JP:Manager' &&
              historyValueGetter('useCompensatoryLeave'),
          },
          {
            key: 'compensatoryLeavePreRequestDays',
            msgkey: 'Admin_Lbl_CompensatoryLeavePreRequestDaysAcquisition',
            help: 'Admin_Help_CompensatoryLeavePreRequestDays',
            type: FIELD_CUSTOM,
            Component: (props) => (
              <CompensatoryLeavePreRequestDays
                {...props}
                checkboxKey="useCompensatoryLeavePreRequest"
                min={1}
                max={31}
              />
            ),
            labelSize: SIZE_MEDIUM,
            display: DISPLAY_DETAIL,
            condition: (baseValueGetter, historyValueGetter) =>
              baseValueGetter('workSystem') !== 'JP:Manager' &&
              historyValueGetter('useCompensatoryLeave'),
          },
          {
            key: 'useCompensatoryLeavePreRequest',
            type: FIELD_HIDDEN,
            condition: (baseValueGetter, historyValueGetter) =>
              baseValueGetter('workSystem') !== 'JP:Manager' &&
              historyValueGetter('useCompensatoryLeave'),
          },
        ],
      },
      {
        section: 'DirectApplyRequestOptions',
        msgkey: 'Admin_Lbl_DirectApplyRequest',
        isExpandable: false,
        configList: [
          {
            key: 'useDirectApply',
            msgkey: '',
            type: FIELD_CHECKBOX,
            label: 'Admin_Lbl_Use',
            defaultValue: false,
            display: DISPLAY_DETAIL,
            labelSize: SIZE_MEDIUM,
          },
          {
            key: 'directApplyStartTime',
            subkey: 'directApplyEndTime',
            msgkey: 'Admin_Lbl_DirectApplyTime',
            type: FIELD_TIME_START_END,
            display: DISPLAY_DETAIL,
            labelSize: SIZE_MEDIUM,
            condition: (baseValueGetter, historyValueGetter) =>
              !!historyValueGetter('useDirectApply'),
            help: 'Admin_Help_DirectRequestDefaultAttendanceTime',
          },
          { key: 'directApplyEndTime', type: FIELD_HIDDEN },
          {
            key: 'directApplyRest1StartTime',
            subkey: 'directApplyRest1EndTime',
            msgkey: 'Admin_Lbl_DirectApplyRestTime1',
            type: FIELD_TIME_START_END,
            display: DISPLAY_DETAIL,
            labelSize: SIZE_MEDIUM,
            condition: (baseValueGetter, historyValueGetter) =>
              !!historyValueGetter('useDirectApply'),
          },
          { key: 'directApplyRest1EndTime', type: FIELD_HIDDEN },
          {
            key: 'directApplyRest2StartTime',
            subkey: 'directApplyRest2EndTime',
            msgkey: 'Admin_Lbl_DirectApplyRestTime2',
            type: FIELD_TIME_START_END,
            display: DISPLAY_DETAIL,
            labelSize: SIZE_MEDIUM,
            condition: (baseValueGetter, historyValueGetter) =>
              !!historyValueGetter('useDirectApply'),
          },
          { key: 'directApplyRest2EndTime', type: FIELD_HIDDEN },
          {
            key: 'directApplyRest3StartTime',
            subkey: 'directApplyRest3EndTime',
            msgkey: 'Admin_Lbl_DirectApplyRestTime3',
            type: FIELD_TIME_START_END,
            display: DISPLAY_DETAIL,
            labelSize: SIZE_MEDIUM,
            condition: (baseValueGetter, historyValueGetter) =>
              !!historyValueGetter('useDirectApply'),
          },
          { key: 'directApplyRest3EndTime', type: FIELD_HIDDEN },
          {
            key: 'directApplyRest4StartTime',
            subkey: 'directApplyRest4EndTime',
            msgkey: 'Admin_Lbl_DirectApplyRestTime4',
            type: FIELD_TIME_START_END,
            display: DISPLAY_DETAIL,
            labelSize: SIZE_MEDIUM,
            condition: (baseValueGetter, historyValueGetter) =>
              !!historyValueGetter('useDirectApply'),
          },
          { key: 'directApplyRest4EndTime', type: FIELD_HIDDEN },
          {
            key: 'directApplyRest5StartTime',
            subkey: 'directApplyRest5EndTime',
            msgkey: 'Admin_Lbl_DirectApplyRestTime5',
            type: FIELD_TIME_START_END,
            display: DISPLAY_DETAIL,
            labelSize: SIZE_MEDIUM,
            condition: (baseValueGetter, historyValueGetter) =>
              !!historyValueGetter('useDirectApply'),
          },
          { key: 'directApplyRest5EndTime', type: FIELD_HIDDEN },
        ],
      },
      {
        section: 'PatternApplyRequestOptions',
        msgkey: 'Admin_Lbl_AttPatternApplyRequest',
        isExpandable: false,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Modified',
        configList: [
          {
            key: 'usePatternApply',
            msgkey: '',
            type: FIELD_CHECKBOX,
            label: 'Admin_Lbl_Use',
            defaultValue: false,
            display: DISPLAY_DETAIL,
            labelSize: SIZE_MEDIUM,
          },
        ],
      },
      {
        section: 'AbsenceRequestOptions',
        msgkey: 'Admin_Lbl_AbsenceRequest',
        isExpandable: false,
        configList: [
          {
            key: 'useAbsenceApply',
            msgkey: '',
            type: FIELD_CHECKBOX,
            label: 'Admin_Lbl_Use',
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
          },
        ],
      },
    ],
  }, //  { section: 'AppOptions',
  //    msgkey: 'Admin_Lbl_AppOptions',
  //    isExpandable: true,
  //    configList: [
  //      { key: 'addCompensationTimeToWorkHours', msgkey: 'Admin_Lbl_WorkingTypeAddCompensationTimeToWorkHours', type: FIELD_CHECKBOX, size: SIZE_SMALL, display: DISPLAY_DETAIL, labelSize: 6 },
  //      { key: 'permitOvertimeWorkUntilContractedHours', msgkey: 'Admin_Lbl_WorkingTypePermitOvertimeWorkUntilContractedHours', type: FIELD_CHECKBOX, size: SIZE_SMALL, display: DISPLAY_DETAIL, labelSize: 6 },
  //    ],
  //  },
];

const configList: ConfigListMap = { base, history };

export default configList;
