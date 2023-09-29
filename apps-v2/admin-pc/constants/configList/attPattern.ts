import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import {
  ChangedEarlyStartRequiredTimeAmLeaveBefore,
  ChangedEarlyStartRequiredTimeHalfLeaveBefore,
  ChangedEarlyStartRequiredTimePmLeaveBefore,
  ChangedOvertimeRequiredTimeAmLeaveAfter,
  ChangedOvertimeRequiredTimeHalfLeaveAfter,
  ChangedOvertimeRequiredTimePmLeaveAfter,
  RequireEarlyStartWorkApplyBefore,
  RequireOvertimeWorkApplyAfter,
} from '../../presentational-components/AttPattern/RequirePatternApply';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_CHECKBOX,
  FIELD_VALID_DATE,
  FIELD_SELECT,
  FIELD_TIME_START_END,
  FIELD_TIME,
  FIELD_CUSTOM,
} = fieldType;
const { SIZE_SMALL, SIZE_MEDIUM } = fieldSize;
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
    key: 'workSystem',
    msgkey: 'Admin_Lbl_WorkingTypeWorkSystem',
    type: FIELD_SELECT,
    isRequired: true,
    labelSize: SIZE_MEDIUM,
    props: 'workSystem',
    multiLanguageValue: true,
    enableMode: 'new',
  },
  {
    key: 'offsetOvertimeAndDeductionTime',
    msgkey: 'Admin_Lbl_AttPatternOvertimeAndDeductionTime',
    label: 'Admin_Lbl_AttPatternOffset',
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
    key: 'withoutCoreTime',
    msgkey: 'Admin_Lbl_WithoutCoreTime',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
    labelSize: SIZE_MEDIUM,
    props: 'workSystem',
    enableMode: 'new',
    condition: (baseValueGetter) => baseValueGetter('workSystem') === 'JP:Flex',
  },
  {
    key: 'useAMHalfDayLeave',
    msgkey: 'Admin_Lbl_AMHalfDayLeave',
    label: 'Admin_Lbl_Use',
    type: FIELD_CHECKBOX,
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
    size: SIZE_MEDIUM,
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
    size: SIZE_MEDIUM,
    display: DISPLAY_DETAIL,
    labelSize: SIZE_MEDIUM,
    isRequired: true,
    condition: (baseValueGetter) =>
      baseValueGetter('workSystem') === 'JP:Flex' &&
      !!baseValueGetter('withoutCoreTime') &&
      !!baseValueGetter('useHalfDayLeave'),
  },
  {
    key: 'useMinimumWorkHours',
    msgkey: 'Admin_Lbl_MinimumWorkHoursSetting',
    label: 'Admin_Lbl_Use',
    help: 'Admin_Help_MinimumWorkHoursSetting',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
    size: SIZE_SMALL,
    labelSize: SIZE_MEDIUM,
    defaultValue: false,
    condition: (baseValueGetter) =>
      baseValueGetter('workSystem') === 'JP:Flex' &&
      baseValueGetter('withoutCoreTime'),
  },
  {
    key: 'minimumWorkHours',
    msgkey: 'Admin_Lbl_MinimumWorkHours',
    type: FIELD_TIME,
    display: DISPLAY_DETAIL,
    size: SIZE_MEDIUM,
    labelSize: SIZE_MEDIUM,
    isRequired: true,
    condition: (baseValueGetter) =>
      baseValueGetter('workSystem') === 'JP:Flex' &&
      baseValueGetter('withoutCoreTime') &&
      !!baseValueGetter('useMinimumWorkHours'),
  },
  {
    key: 'useEarlyLeaveApply',
    msgkey: 'Admin_Lbl_LessMinimumWorkHoursEarlyLeaveRequest',
    label: 'Admin_Lbl_Use',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
    size: SIZE_SMALL,
    labelSize: SIZE_MEDIUM,
    condition: (baseValueGetter) =>
      baseValueGetter('workSystem') === 'JP:Flex' &&
      baseValueGetter('withoutCoreTime') &&
      !!baseValueGetter('useMinimumWorkHours'),
  },
  {
    key: 'requireEarlyLeaveApply',
    msgkey: '',
    type: FIELD_CHECKBOX,
    label: 'Admin_Lbl_RequireEarlyLeaveApply',
    display: DISPLAY_DETAIL,
    labelSize: SIZE_MEDIUM,
    defaultValue: true,
    condition: (baseValueGetter) =>
      baseValueGetter('workSystem') === 'JP:Flex' &&
      baseValueGetter('withoutCoreTime') &&
      !!baseValueGetter('useMinimumWorkHours') &&
      !!baseValueGetter('useEarlyLeaveApply'),
  },
  {
    key: 'useManageEarlyLeavePersonalReason',
    msgkey: 'Admin_Lbl_UseManageLessMinimumWorkHoursEarlyLeavePersonalReason',
    type: FIELD_CHECKBOX,
    defaultValue: false,
    label: 'Admin_Lbl_Use',
    display: DISPLAY_DETAIL,
    size: SIZE_MEDIUM,
    labelSize: SIZE_MEDIUM,
    condition: (baseValueGetter) =>
      baseValueGetter('workSystem') === 'JP:Flex' &&
      baseValueGetter('withoutCoreTime') &&
      !!baseValueGetter('useMinimumWorkHours') &&
      !!baseValueGetter('useEarlyLeaveApply'),
  },
  {
    key: 'earlyLeaveDeductionRegardlessReason',
    msgkey: 'Admin_Lbl_CompensationSetting',
    type: FIELD_SELECT,
    props: 'deductionSettingsOptionsForMinWorkHours',
    display: DISPLAY_DETAIL,
    size: SIZE_MEDIUM,
    labelSize: SIZE_MEDIUM,
    isRequired: true,
    defaultValue: 'Deducted',
    multiLanguageValue: true,
    condition: (baseValueGetter) =>
      baseValueGetter('workSystem') === 'JP:Flex' &&
      baseValueGetter('withoutCoreTime') &&
      !!baseValueGetter('useMinimumWorkHours') &&
      !baseValueGetter('useManageEarlyLeavePersonalReason') &&
      !!baseValueGetter('useEarlyLeaveApply'),
  },
  {
    key: 'earlyLeaveDeductionPersonalReason',
    msgkey: 'Admin_Lbl_CompensationSettingPersonalReason',
    type: FIELD_SELECT,
    props: 'deductionSettingsOptionsForMinWorkHours',
    display: DISPLAY_DETAIL,
    size: SIZE_MEDIUM,
    labelSize: SIZE_MEDIUM,
    isRequired: true,
    defaultValue: 'Deducted',
    multiLanguageValue: true,
    condition: (baseValueGetter) =>
      baseValueGetter('workSystem') === 'JP:Flex' &&
      baseValueGetter('withoutCoreTime') &&
      !!baseValueGetter('useMinimumWorkHours') &&
      !!baseValueGetter('useManageEarlyLeavePersonalReason') &&
      !!baseValueGetter('useEarlyLeaveApply'),
  },
  {
    key: 'earlyLeaveDeductionObjectiveReason',
    msgkey: 'Admin_Lbl_CompensationSettingObjectiveReason',
    type: FIELD_SELECT,
    props: 'deductionSettingsOptionsForMinWorkHours',
    display: DISPLAY_DETAIL,
    size: SIZE_MEDIUM,
    labelSize: SIZE_MEDIUM,
    isRequired: true,
    defaultValue: 'DeemedByContractedHours',
    multiLanguageValue: true,
    condition: (baseValueGetter) =>
      baseValueGetter('workSystem') === 'JP:Flex' &&
      baseValueGetter('withoutCoreTime') &&
      !!baseValueGetter('useMinimumWorkHours') &&
      !!baseValueGetter('useManageEarlyLeavePersonalReason') &&
      !!baseValueGetter('useEarlyLeaveApply'),
  },
  {
    key: 'allowWorkDuringHalfDayLeave',
    msgkey: 'Admin_Lbl_AllowToWorkOnHalfDayLeaveTime',
    label: 'Admin_Lbl_Admit',
    type: FIELD_CHECKBOX,
    size: SIZE_MEDIUM,
    display: DISPLAY_DETAIL,
    labelSize: SIZE_MEDIUM,
    defaultValue: false,
    condition: (baseValueGetter) =>
      !(
        baseValueGetter('workSystem') === 'JP:Flex' &&
        baseValueGetter('withoutCoreTime')
      ) &&
      (!!baseValueGetter('useAMHalfDayLeave') ||
        !!baseValueGetter('usePMHalfDayLeave')),
  },
  {
    section: 'AttPatternOptions',
    msgkey: 'Admin_Lbl_AttPatternOptions',
    isExpandable: false,
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
        display: DISPLAY_DETAIL,
        isRequired: true,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Fix' ||
          baseValueGetter('workSystem') === 'JP:Modified',
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
        isRequired: true,
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
        display: DISPLAY_DETAIL,
        isRequired: true,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'JP:Discretion' &&
          baseValueGetter('workSystem') !== 'JP:Manager',
      },
      {
        key: 'contractedWorkHours',
        msgkey: 'Admin_Lbl_WorkingTypeWorkHoursCriterion',
        type: FIELD_TIME,
        size: SIZE_MEDIUM,
        isRequired: true,
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
          baseValueGetter('workSystem') !== 'JP:Manager' &&
          !!baseValueGetter('useAMHalfDayLeave'),
      },
      {
        key: 'amStartTime',
        subkey: 'amEndTime',
        msgkey: 'Admin_Lbl_WorkingTypeFlexAm',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter: (arg0: string) => unknown) =>
          baseValueGetter('workSystem') === 'JP:Flex' &&
          !baseValueGetter('withoutCoreTime') &&
          !!baseValueGetter('useAMHalfDayLeave'),
      },
      {
        key: 'amStartTime',
        subkey: 'amEndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmCriterion',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          (baseValueGetter('workSystem') === 'JP:Discretion' ||
            baseValueGetter('workSystem') === 'JP:Manager') &&
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
          baseValueGetter('workSystem') !== 'JP:Discretion' &&
          baseValueGetter('workSystem') !== 'JP:Manager' &&
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) &&
          !!baseValueGetter('useAMHalfDayLeave'),
      },
      {
        key: 'amContractedWorkHours',
        msgkey: 'Admin_Lbl_WorkingTypeAmWorkHoursCriterion',
        type: FIELD_TIME,
        size: SIZE_MEDIUM,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager' &&
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
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) &&
          baseValueGetter('workSystem') !== 'JP:Manager' &&
          !!baseValueGetter('useAMHalfDayLeave'),
      },
      {
        key: 'amRest1StartTime',
        subkey: 'amRest1EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRestCriterion1',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager' &&
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
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) &&
          baseValueGetter('workSystem') !== 'JP:Manager' &&
          !!baseValueGetter('useAMHalfDayLeave'),
      },
      {
        key: 'amRest2StartTime',
        subkey: 'amRest2EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRestCriterion2',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager' &&
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
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) &&
          baseValueGetter('workSystem') !== 'JP:Manager' &&
          !!baseValueGetter('useAMHalfDayLeave'),
      },
      {
        key: 'amRest3StartTime',
        subkey: 'amRest3EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRestCriterion3',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager' &&
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
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) &&
          baseValueGetter('workSystem') !== 'JP:Manager' &&
          !!baseValueGetter('useAMHalfDayLeave'),
      },
      {
        key: 'amRest4StartTime',
        subkey: 'amRest4EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRestCriterion4',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager' &&
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
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) &&
          baseValueGetter('workSystem') !== 'JP:Manager' &&
          !!baseValueGetter('useAMHalfDayLeave'),
      },
      {
        key: 'amRest5StartTime',
        subkey: 'amRest5EndTime',
        msgkey: 'Admin_Lbl_WorkingTypeAmRestCriterion5',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager' &&
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
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'JP:Flex' &&
          baseValueGetter('workSystem') !== 'JP:Discretion' &&
          baseValueGetter('workSystem') !== 'JP:Manager' &&
          !!baseValueGetter('usePMHalfDayLeave'),
      },
      {
        key: 'pmStartTime',
        subkey: 'pmEndTime',
        msgkey: 'Admin_Lbl_WorkingTypeFlexPm',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter: (arg0: string) => unknown) =>
          baseValueGetter('workSystem') === 'JP:Flex' &&
          !baseValueGetter('withoutCoreTime') &&
          !!baseValueGetter('usePMHalfDayLeave'),
      },
      {
        key: 'pmStartTime',
        subkey: 'pmEndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmCriterion',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          (baseValueGetter('workSystem') === 'JP:Discretion' ||
            baseValueGetter('workSystem') === 'JP:Manager') &&
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
          baseValueGetter('workSystem') !== 'JP:Discretion' &&
          baseValueGetter('workSystem') !== 'JP:Manager' &&
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) &&
          !!baseValueGetter('usePMHalfDayLeave'),
      },
      {
        key: 'pmContractedWorkHours',
        msgkey: 'Admin_Lbl_WorkingTypePmWorkHoursCriterion',
        type: FIELD_TIME,
        size: SIZE_MEDIUM,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager' &&
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
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) &&
          baseValueGetter('workSystem') !== 'JP:Manager' &&
          !!baseValueGetter('usePMHalfDayLeave'),
      },
      {
        key: 'pmRest1StartTime',
        subkey: 'pmRest1EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRestCriterion1',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager' &&
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
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) &&
          baseValueGetter('workSystem') !== 'JP:Manager' &&
          !!baseValueGetter('usePMHalfDayLeave'),
      },
      {
        key: 'pmRest2StartTime',
        subkey: 'pmRest2EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRestCriterion2',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager' &&
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
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) &&
          baseValueGetter('workSystem') !== 'JP:Manager' &&
          !!baseValueGetter('usePMHalfDayLeave'),
      },
      {
        key: 'pmRest3StartTime',
        subkey: 'pmRest3EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRestCriterion3',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager' &&
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
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) &&
          baseValueGetter('workSystem') !== 'JP:Manager' &&
          !!baseValueGetter('usePMHalfDayLeave'),
      },
      {
        key: 'pmRest4StartTime',
        subkey: 'pmRest4EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRestCriterion4',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager' &&
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
          !(
            baseValueGetter('workSystem') === 'JP:Flex' &&
            baseValueGetter('withoutCoreTime')
          ) &&
          baseValueGetter('workSystem') !== 'JP:Manager' &&
          !!baseValueGetter('usePMHalfDayLeave'),
      },
      {
        key: 'pmRest5StartTime',
        subkey: 'pmRest5EndTime',
        msgkey: 'Admin_Lbl_WorkingTypePmRestCriterion5',
        type: FIELD_TIME_START_END,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Manager' &&
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
            type: FIELD_CUSTOM,
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            Component: RequireOvertimeWorkApplyAfter,
            condition: (baseValueGetter) =>
              baseValueGetter('workSystem') !== 'JP:Discretion' &&
              !!baseValueGetter('useOvertimeWorkApply') &&
              !!baseValueGetter('requireOvertimeWorkApply'),
            help: 'Admin_Help_EndTimeOfAcceptAsWorkingHourForAttPattern',
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
            condition: (baseValueGetter) =>
              baseValueGetter('workSystem') === 'JP:Discretion' &&
              !!baseValueGetter('useOvertimeWorkApply') &&
              !!baseValueGetter('requireOvertimeWorkApply'),
            help: 'Admin_Help_EndTimeOfAcceptAsWorkingHourForAttPattern',
          },
          {
            key: 'useChangeOvertimeWorkRequiredTimeAmLeave',
            msgkey: '',
            type: FIELD_CHECKBOX,
            label: 'Admin_Lbl_ChangeTimeWhenAMLeave',
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            condition: (baseValueGetter) =>
              !!baseValueGetter('useOvertimeWorkApply') &&
              !(
                baseValueGetter('workSystem') === 'JP:Flex' &&
                !!baseValueGetter('withoutCoreTime')
              ) &&
              !!baseValueGetter('requireOvertimeWorkApply'),
          },
          {
            key: 'changedOvertimeRequiredTimeAmLeaveAfter',
            msgkey: 'Admin_Lbl_EndTimeOfAMLeave',
            isRequired: true,
            type: FIELD_CUSTOM,
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            Component: ChangedOvertimeRequiredTimeAmLeaveAfter,
            condition: (baseValueGetter) =>
              !!baseValueGetter('useOvertimeWorkApply') &&
              !(
                baseValueGetter('workSystem') === 'JP:Flex' &&
                !!baseValueGetter('withoutCoreTime')
              ) &&
              !!baseValueGetter('requireOvertimeWorkApply') &&
              !!baseValueGetter('useChangeOvertimeWorkRequiredTimeAmLeave'),
            help: 'Admin_Help_EndTimeOfAMHalfLeaveAcceptAsWorkingHour',
          },
          {
            key: 'useChangeOvertimeWorkRequiredTimePmLeave',
            msgkey: '',
            type: FIELD_CHECKBOX,
            label: 'Admin_Lbl_ChangeTimeWhenPMLeave',
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            condition: (baseValueGetter) =>
              !!baseValueGetter('useOvertimeWorkApply') &&
              !(
                baseValueGetter('workSystem') === 'JP:Flex' &&
                !!baseValueGetter('withoutCoreTime')
              ) &&
              !!baseValueGetter('requireOvertimeWorkApply'),
          },
          {
            key: 'changedOvertimeRequiredTimePmLeaveAfter',
            msgkey: 'Admin_Lbl_EndTimeOfPMLeave',
            isRequired: true,
            type: FIELD_CUSTOM,
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            Component: ChangedOvertimeRequiredTimePmLeaveAfter,
            condition: (baseValueGetter) =>
              !!baseValueGetter('useOvertimeWorkApply') &&
              !(
                baseValueGetter('workSystem') === 'JP:Flex' &&
                !!baseValueGetter('withoutCoreTime')
              ) &&
              !!baseValueGetter('requireOvertimeWorkApply') &&
              !!baseValueGetter('useChangeOvertimeWorkRequiredTimePmLeave'),
            help: 'Admin_Help_EndTimeOfPMHalfLeaveAcceptAsWorkingHour',
          },
          {
            key: 'useChangeOvertimeWorkRequiredTimeHalfLeave',
            msgkey: '',
            type: FIELD_CHECKBOX,
            label: 'Admin_Lbl_ChangeTimeWhenHalfDayLeave',
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            condition: (baseValueGetter) =>
              !!baseValueGetter('useOvertimeWorkApply') &&
              baseValueGetter('workSystem') === 'JP:Flex' &&
              !!baseValueGetter('withoutCoreTime') &&
              !!baseValueGetter('requireOvertimeWorkApply'),
          },
          {
            key: 'changedOvertimeRequiredTimeHalfLeaveAfter',
            msgkey: 'Admin_Lbl_EndTimeOfHalfDayLeave',
            isRequired: true,
            type: FIELD_CUSTOM,
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            Component: ChangedOvertimeRequiredTimeHalfLeaveAfter,
            condition: (baseValueGetter) =>
              !!baseValueGetter('useOvertimeWorkApply') &&
              baseValueGetter('workSystem') === 'JP:Flex' &&
              !!baseValueGetter('withoutCoreTime') &&
              !!baseValueGetter('requireOvertimeWorkApply') &&
              !!baseValueGetter('useChangeOvertimeWorkRequiredTimeHalfLeave'),
            help: 'Admin_Help_EndTimeOfHalfLeaveAcceptAsWorkingHour',
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
            type: FIELD_CUSTOM,
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            Component: RequireEarlyStartWorkApplyBefore,
            condition: (baseValueGetter) =>
              baseValueGetter('workSystem') !== 'JP:Discretion' &&
              !!baseValueGetter('useEarlyStartWorkApply') &&
              !!baseValueGetter('requireEarlyStartWorkApply'),
            help: 'Admin_Help_StartTimeOfAcceptAsWorkingHourForAttPattern',
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
            condition: (baseValueGetter) =>
              baseValueGetter('workSystem') === 'JP:Discretion' &&
              !!baseValueGetter('useEarlyStartWorkApply') &&
              !!baseValueGetter('requireEarlyStartWorkApply'),
            help: 'Admin_Help_StartTimeOfAcceptAsWorkingHourForAttPattern',
          },
          {
            key: 'useChangeEarlyStartWorkRequiredTimeAmLeave',
            msgkey: '',
            type: FIELD_CHECKBOX,
            label: 'Admin_Lbl_ChangeTimeWhenAMLeave',
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            condition: (baseValueGetter) =>
              !!baseValueGetter('useEarlyStartWorkApply') &&
              !(
                baseValueGetter('workSystem') === 'JP:Flex' &&
                !!baseValueGetter('withoutCoreTime')
              ) &&
              !!baseValueGetter('requireEarlyStartWorkApply'),
          },
          {
            key: 'changedEarlyStartRequiredTimeAmLeaveBefore',
            msgkey: 'Admin_Lbl_StartTimeOfAMLeave',
            isRequired: true,
            type: FIELD_CUSTOM,
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            Component: ChangedEarlyStartRequiredTimeAmLeaveBefore,
            condition: (baseValueGetter) =>
              !!baseValueGetter('useEarlyStartWorkApply') &&
              !(
                baseValueGetter('workSystem') === 'JP:Flex' &&
                !!baseValueGetter('withoutCoreTime')
              ) &&
              !!baseValueGetter('requireEarlyStartWorkApply') &&
              !!baseValueGetter('useChangeEarlyStartWorkRequiredTimeAmLeave'),
            help: 'Admin_Help_StartTimeOfAMHalfLeaveAcceptAsWorkingHour',
          },
          {
            key: 'useChangeEarlyStartWorkRequiredTimePmLeave',
            msgkey: '',
            type: FIELD_CHECKBOX,
            label: 'Admin_Lbl_ChangeTimeWhenPMLeave',
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            condition: (baseValueGetter) =>
              !!baseValueGetter('useEarlyStartWorkApply') &&
              !(
                baseValueGetter('workSystem') === 'JP:Flex' &&
                !!baseValueGetter('withoutCoreTime')
              ) &&
              !!baseValueGetter('requireEarlyStartWorkApply'),
          },
          {
            key: 'changedEarlyStartRequiredTimePmLeaveBefore',
            msgkey: 'Admin_Lbl_StartTimeOfPMLeave',
            isRequired: true,
            type: FIELD_CUSTOM,
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            Component: ChangedEarlyStartRequiredTimePmLeaveBefore,
            condition: (baseValueGetter) =>
              !!baseValueGetter('useEarlyStartWorkApply') &&
              !(
                baseValueGetter('workSystem') === 'JP:Flex' &&
                !!baseValueGetter('withoutCoreTime')
              ) &&
              !!baseValueGetter('requireEarlyStartWorkApply') &&
              !!baseValueGetter('useChangeEarlyStartWorkRequiredTimePmLeave'),
            help: 'Admin_Help_StartTimeOfPMHalfLeaveAcceptAsWorkingHour',
          },
          {
            key: 'useChangeEarlyStartWorkRequiredTimeHalfLeave',
            msgkey: '',
            type: FIELD_CHECKBOX,
            label: 'Admin_Lbl_ChangeTimeWhenHalfDayLeave',
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            condition: (baseValueGetter) =>
              !!baseValueGetter('useEarlyStartWorkApply') &&
              baseValueGetter('workSystem') === 'JP:Flex' &&
              !!baseValueGetter('withoutCoreTime') &&
              !!baseValueGetter('requireEarlyStartWorkApply'),
          },
          {
            key: 'changedEarlyStartRequiredTimeHalfLeaveBefore',
            msgkey: 'Admin_Lbl_StartTimeOfHalfDayRest',
            isRequired: true,
            type: FIELD_CUSTOM,
            display: DISPLAY_DETAIL,
            size: SIZE_MEDIUM,
            labelSize: SIZE_MEDIUM,
            Component: ChangedEarlyStartRequiredTimeHalfLeaveBefore,
            condition: (baseValueGetter) =>
              !!baseValueGetter('useEarlyStartWorkApply') &&
              baseValueGetter('workSystem') === 'JP:Flex' &&
              !!baseValueGetter('withoutCoreTime') &&
              !!baseValueGetter('requireEarlyStartWorkApply') &&
              !!baseValueGetter('useChangeEarlyStartWorkRequiredTimeHalfLeave'),
            help: 'Admin_Help_EndTimeOfHalfLeaveAcceptAsWorkingHour',
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
