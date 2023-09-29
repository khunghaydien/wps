import { compose } from '../../../../commons/utils/FnUtil';

import { LeaveRange } from '../LeaveRange';
import { SubstituteLeaveType } from '../SubstituteLeaveType';
import {
  $Common,
  defaultValue as $commonDefaultValue,
} from './WorkSystem/$Common';

type WorkingType = {
  startOfNightWork: '1320';
  endOfNightWork: '300';
  legalWorkTypeADay: '480';
  legalWorkTypeAWeek: '2400';
  useAMHalfDayLeave: boolean;
  usePMHalfDayLeave: boolean;
  useHalfDayLeave: boolean;
  halfDayLeaveHours: string;
  allowWorkDuringHalfDayLeave: string;
  patternCodeList: string[];
  isIncludeHolidayWorkInDeemedTime: boolean;
  isIncludeHolidayWorkInPlainTime: boolean;
  useLegalRestCheck1: boolean;
  useLegalRestCheck2: boolean;
  legalRestCheck1WorkTimeThreshold: string;
  legalRestCheck2WorkTimeThreshold: string;
};

type WorkingTime = {
  startTime: string;
  endTime: string;
  deemedWorkHours: string;
  deemedOvertimeHours: string;
  flexStartTime: string;
  flexEndTime: string;
  contractedWorkHours: string;
  rest1StartTime: string;
  rest1EndTime: string;
  rest2StartTime: string;
  rest2EndTime: string;
  rest3StartTime: string;
  rest3EndTime: string;
  rest4StartTime: string;
  rest4EndTime: string;
  rest5StartTime: string;
  rest5EndTime: string;
  amStartTime: string;
  amEndTime: string;
  amContractedWorkHours: string;
  amRest1StartTime: string;
  amRest1EndTime: string;
  amRest2StartTime: string;
  amRest2EndTime: string;
  amRest3StartTime: string;
  amRest3EndTime: string;
  amRest4StartTime: string;
  amRest4EndTime: string;
  amRest5StartTime: string;
  amRest5EndTime: string;
  pmStartTime: string;
  pmEndTime: string;
  pmContractedWorkHours: string;
  pmRest1StartTime: string;
  pmRest1EndTime: string;
  pmRest2StartTime: string;
  pmRest2EndTime: string;
  pmRest3StartTime: string;
  pmRest3EndTime: string;
  pmRest4StartTime: string;
  pmRest4EndTime: string;
  pmRest5StartTime: string;
  pmRest5EndTime: string;
};

type Request = {
  allowToChangeApproverSelf: boolean;
  useEarlyStartWorkApply: boolean;
  requireEarlyStartWorkApply: boolean;
  requireEarlyStartWorkApplyBefore: string;
  useOvertimeWorkApply: boolean;
  requireOvertimeWorkApply: boolean;
  requireOvertimeWorkApplyAfter: string;
  useAbsenceApply: boolean;
  useSubstituteLeaveTypes: SubstituteLeaveType[];
  substituteLeaveCode: string[];
  compensatoryLeaveThresholdAllDay: string;
  useHalfDayCompensatoryLeaveGrant: boolean;
  compensatoryLeaveThresholdHalfDay: string;
  compensatoryLeaveRanges: string;
  compensatoryLeaveValidPeriod: LeaveRange[];
  useCompensatoryLeavePreRequest: boolean;
  compensatoryLeavePreRequestDays: string;
  useDirectApply: boolean;
  directApplyStartTime: string;
  directApplyEndTime: string;
  directApplyRest1StartTime: string;
  directApplyRest1EndTime: string;
  directApplyRest2StartTime: string;
  directApplyRest2EndTime: string;
  directApplyRest3StartTime: string;
  directApplyRest3EndTime: string;
  directApplyRest4StartTime: string;
  directApplyRest4EndTime: string;
  directApplyRest5StartTime: string;
  directApplyRest5EndTime: string;
  usePatternApply: boolean;
};

export type Remote = $Common & WorkingType & WorkingTime & Request;

export const defaultValue: Remote = {
  ...$commonDefaultValue,
  startOfNightWork: '1320',
  endOfNightWork: '300',
  legalWorkTypeADay: '480',
  legalWorkTypeAWeek: '2400',
  useAMHalfDayLeave: false,
  usePMHalfDayLeave: false,
  useHalfDayLeave: false,
  halfDayLeaveHours: '',
  allowWorkDuringHalfDayLeave: '',
  patternCodeList: [],
  isIncludeHolidayWorkInDeemedTime: false,
  isIncludeHolidayWorkInPlainTime: false,
  useLegalRestCheck1: false,
  useLegalRestCheck2: false,
  legalRestCheck1WorkTimeThreshold: '',
  legalRestCheck2WorkTimeThreshold: '',
  startTime: '',
  endTime: '',
  flexStartTime: '',
  flexEndTime: '',
  deemedWorkHours: '',
  deemedOvertimeHours: '',
  contractedWorkHours: '',
  rest1StartTime: '',
  rest1EndTime: '',
  rest2StartTime: '',
  rest2EndTime: '',
  rest3StartTime: '',
  rest3EndTime: '',
  rest4StartTime: '',
  rest4EndTime: '',
  rest5StartTime: '',
  rest5EndTime: '',
  amStartTime: '',
  amEndTime: '',
  amContractedWorkHours: '',
  amRest1StartTime: '',
  amRest1EndTime: '',
  amRest2StartTime: '',
  amRest2EndTime: '',
  amRest3StartTime: '',
  amRest3EndTime: '',
  amRest4StartTime: '',
  amRest4EndTime: '',
  amRest5StartTime: '',
  amRest5EndTime: '',
  pmStartTime: '',
  pmEndTime: '',
  pmContractedWorkHours: '',
  pmRest1StartTime: '',
  pmRest1EndTime: '',
  pmRest2StartTime: '',
  pmRest2EndTime: '',
  pmRest3StartTime: '',
  pmRest3EndTime: '',
  pmRest4StartTime: '',
  pmRest4EndTime: '',
  pmRest5StartTime: '',
  pmRest5EndTime: '',
  allowToChangeApproverSelf: false,
  useEarlyStartWorkApply: false,
  requireEarlyStartWorkApply: false,
  requireEarlyStartWorkApplyBefore: '',
  useOvertimeWorkApply: false,
  requireOvertimeWorkApply: false,
  requireOvertimeWorkApplyAfter: '',
  useAbsenceApply: false,
  useSubstituteLeaveTypes: [],
  substituteLeaveCode: [],
  compensatoryLeaveThresholdAllDay: '',
  useHalfDayCompensatoryLeaveGrant: false,
  compensatoryLeaveThresholdHalfDay: '',
  compensatoryLeaveRanges: '',
  compensatoryLeaveValidPeriod: [],
  useCompensatoryLeavePreRequest: false,
  compensatoryLeavePreRequestDays: '',
  useDirectApply: false,
  directApplyStartTime: '',
  directApplyEndTime: '',
  directApplyRest1StartTime: '',
  directApplyRest1EndTime: '',
  directApplyRest2StartTime: '',
  directApplyRest2EndTime: '',
  directApplyRest3StartTime: '',
  directApplyRest3EndTime: '',
  directApplyRest4StartTime: '',
  directApplyRest4EndTime: '',
  directApplyRest5StartTime: '',
  directApplyRest5EndTime: '',
  usePatternApply: false,
};

const convertNumberToString = <T extends Record<string, unknown>>(
  params: T
): Record<string, unknown> =>
  Object.keys(params).reduce(
    (obj: Record<string, unknown>, key) => {
      const value = obj[key];
      if (typeof value === 'number') {
        obj[key] = String(value);
      }
      return obj;
    },
    {
      ...params,
    }
  );

const convertNullToString = <T extends Record<string, unknown>>(
  params: T
): Record<string, unknown> =>
  Object.keys(params).reduce(
    (obj: Record<string, unknown>, key) => {
      if (obj[key] === null) {
        obj[key] = '';
      }
      return obj;
    },
    {
      ...params,
    }
  );

export const createByWorkSystem = <T extends Record<string, unknown>>(
  params: T
): Remote => {
  const {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    workSystem,
    ...$params
  } = params;

  // @ts-ignore
  const $$params: Remote = compose(
    convertNullToString,
    // @ts-ignore
    convertNumberToString
  )($params);

  return {
    ...defaultValue,
    ...$$params,
  };
};
