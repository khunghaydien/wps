import * as CommuteCount from '@attendance/repositories/models/CommuteCount';

import {
  CODE as ATT_DAILY_ATTENTION_CODE,
  createAttDailyAttentions,
} from '@attendance/domain/models/AttDailyAttention';
import { DayType } from '@attendance/domain/models/AttDailyRecord';
import {
  BaseAttendanceSummary as DomainBaseAttendanceSummary,
  BaseSummaryItem as DomainSummaryItem,
  DailyRecord as DomainDailyRecord,
  SUMMARY_ITEM_NAME,
  SummaryName as DomainSummaryName,
} from '@attendance/domain/models/BaseAttendanceSummary';
import { toCommuteState } from '@attendance/domain/models/CommuteCount';

export {
  SUMMARY_ITEM_NAME,
  SUMMARY_NAME,
  UNIT,
} from '@attendance/domain/models/BaseAttendanceSummary';

export type DailyRecord = {
  recordDate: string;
  dayType: DayType;
  event: string | null;
  shift: string | null;
  allowanceDailyRecordCount: number | null;
  dailyObjectiveEventLog: string | null | undefined;
  commuteCountForward: number | null;
  commuteCountBackward: number | null;
  startTime: number | null;
  endTime: number | null;
  startStampTime: number | null;
  endStampTime: number | null;
  outStartTime: number | null;
  outEndTime: number | null;
  insufficientRestTime: number | null;
  virtualWorkTime: number | null;
  restTime: number | null;
  realWorkTime: number | null;
  holidayWorkTime: number | null;
  overTime: number | null;
  nightTime: number | null;
  lostTime: number | null;
  remarks: string;
  isHolLegalHoliday: boolean;
  outInsufficientMinimumWorkHours: null | number;
};

export type SummaryItem = DomainSummaryItem<
  typeof SUMMARY_ITEM_NAME[keyof typeof SUMMARY_ITEM_NAME]
> & {
  items: DomainSummaryItem<string>[];
};

export type Summary = {
  name: DomainSummaryName;
  items: SummaryItem[];
};

export type DividedSummary = {
  name: string;
  summaryStartDate: string;
  summaryEndDate: string;
  summaries: Summary[];
};

export type BaseAttendanceSummary = {
  startDate: string;
  endDate: string;
  records: DailyRecord[];
  summaries: Summary[];
  dividedSummaries: DividedSummary[];
  employeeInfoList: {
    startDate: string;
    endDate: string;
    departmentName: string;
    workingTypeName: string;
  }[];
  employeeCode: string;
  employeeName: string;
  useRestReason: boolean;
};

/**
 * 勤怠サマリー表示用
 * 通勤回数管理を使わない勤務体系の時、勤怠サマリーの通勤往路回数・通勤復路回数に入れられる数字
 */
export const CAN_NOT_USE_MANEGE_COMMUTE_COUNT = 99 as const;

const isUseManageCommuteCountInRecord = ({
  commuteForwardCount,
  commuteBackwardCount,
}: {
  commuteForwardCount: number;
  commuteBackwardCount: number;
}): boolean =>
  commuteForwardCount !== CAN_NOT_USE_MANEGE_COMMUTE_COUNT ||
  commuteBackwardCount !== CAN_NOT_USE_MANEGE_COMMUTE_COUNT;

const isUseManageCommuteCount = (
  records: BaseAttendanceSummary['records']
): boolean =>
  records.some((attRecord) =>
    isUseManageCommuteCountInRecord({
      commuteForwardCount: attRecord.commuteCountForward,
      commuteBackwardCount: attRecord.commuteCountBackward,
    })
  );

const isUseAllowanceManagement = (
  records: BaseAttendanceSummary['records']
): boolean =>
  records.some(
    ({ allowanceDailyRecordCount }) => allowanceDailyRecordCount !== null
  );

const isUseObjectivelyEventLog = (
  records: BaseAttendanceSummary['records']
): boolean =>
  records.some(({ dailyObjectiveEventLog }) => dailyObjectiveEventLog !== null);

const createClosingDate = (records: DailyRecord[]): string =>
  records.length ? records[records.length - 1].recordDate : '';

const createAttention = (
  records: DomainBaseAttendanceSummary['records']
): DomainBaseAttendanceSummary['attention'] => {
  const ineffectiveWorkingTime = Object.keys(records).reduce((count, key) => {
    count += records[key].attentions.some(
      ({ code }) => code === ATT_DAILY_ATTENTION_CODE.INEFFECTIVE_WORKING_TIME
    )
      ? 1
      : 0;
    return count;
  }, 0);
  const insufficientRestTime = Object.keys(records).reduce((count, key) => {
    count += records[key].attentions.filter(
      ({ code }) => code === ATT_DAILY_ATTENTION_CODE.INSUFFICIENT_REST_TIME
    ).length;
    return count;
  }, 0);

  return {
    ineffectiveWorkingTime,
    insufficientRestTime,
  };
};

const createSummaryItems = (
  items: Summary['items'],
  { closingDate }: { closingDate: string }
): DomainBaseAttendanceSummary['summaries'][number]['items'] =>
  items.map((item) => {
    switch (item.name) {
      case SUMMARY_ITEM_NAME.ANNUAL_PAID_LEAVE_DAYS:
        return {
          name: item.name,
          value: item.value,
          daysAndHours: item.daysAndHours,
          unit: item.unit,
          closingDate,
        };
      case SUMMARY_ITEM_NAME.GENERAL_PAID_LEAVE_DAYS:
      case SUMMARY_ITEM_NAME.UNPAID_LEAVE_DAYS:
        return {
          name: item.name,
          value: item.value,
          daysAndHours: item.daysAndHours,
          unit: item.unit,
          items: item.items,
        };
      default:
        return {
          name: item.name,
          value: item.value,
          daysAndHours: item.daysAndHours,
          unit: item.unit,
        };
    }
  });

export const createSummaries = <
  Response extends {
    records: BaseAttendanceSummary['records'];
  }
>(
  summaries: BaseAttendanceSummary['summaries'],
  response: Response
): DomainBaseAttendanceSummary['summaries'] =>
  summaries.map((summary) => ({
    ...summary,
    items: createSummaryItems(summary.items, {
      closingDate: createClosingDate(response.records),
    }),
  }));

export const createDividedSummaries = <
  Response extends {
    records: BaseAttendanceSummary['records'];
  }
>(
  dividedSummaries: BaseAttendanceSummary['dividedSummaries'],
  response: Response
): DomainBaseAttendanceSummary['dividedSummaries'] =>
  dividedSummaries?.map((summary) => ({
    name: summary.name,
    startDate: summary.summaryStartDate,
    endDate: summary.summaryEndDate,
    summaries: createSummaries(summary.summaries, response),
  }));

export const createRecord = (record: DailyRecord): DomainDailyRecord => {
  const { commuteCountForward, commuteCountBackward, ...$record } = record;
  const commuteCount = {
    commuteForwardCount: commuteCountForward,
    commuteBackwardCount: commuteCountBackward,
  };

  return {
    ...$record,
    startTimeModified:
      record.startTime !== null && record.startTime !== record.startStampTime,
    endTimeModified:
      record.endTime !== null && record.endTime !== record.endStampTime,
    commuteState: isUseManageCommuteCountInRecord(commuteCount)
      ? toCommuteState(CommuteCount.convert(commuteCount))
      : undefined,
    attentions: createAttDailyAttentions(record),
  };
};

export const createRecords = <Response extends BaseAttendanceSummary>(
  records: Response['records']
): DomainBaseAttendanceSummary['records'] => records.map(createRecord);

export const createOwnerInfos = ({
  employeeCode,
  employeeName,
  employeeInfoList,
}: {
  employeeCode: BaseAttendanceSummary['employeeCode'];
  employeeName: BaseAttendanceSummary['employeeName'];
  employeeInfoList?: BaseAttendanceSummary['employeeInfoList'];
}): DomainBaseAttendanceSummary['ownerInfos'] =>
  employeeInfoList?.map(
    ({ startDate, endDate, departmentName, workingTypeName }) => ({
      startDate,
      endDate,
      employee: {
        code: employeeCode,
        name: employeeName,
      },
      department: {
        name: departmentName,
      },
      workingType: {
        name: workingTypeName,
      },
    })
  ) || [];

const total = (records: (number | null)[]): number =>
  records.reduce((sum, value) => sum + value, 0);

export const createWorkingType = ({
  records,
  useRestReason,
}: {
  records: BaseAttendanceSummary['records'];
  useRestReason: BaseAttendanceSummary['useRestReason'];
}): DomainBaseAttendanceSummary['workingType'] => ({
  useManageCommuteCount: isUseManageCommuteCount(records),
  useAllowanceManagement: isUseAllowanceManagement(records),
  useObjectivelyEventLog: isUseObjectivelyEventLog(records),
  useRestReason,
});

export const convert = <Response extends BaseAttendanceSummary>(
  response: Response
): DomainBaseAttendanceSummary => {
  const records = createRecords(response.records);

  return {
    ownerInfos: createOwnerInfos(response),
    startDate: response.startDate,
    endDate: response.endDate,
    records,
    recordTotal: {
      restTime: total(records.map(({ restTime }) => restTime)),
      realWorkTime: total(records.map(({ realWorkTime }) => realWorkTime)),
      overTime: total(records.map(({ overTime }) => overTime)),
      nightTime: total(records.map(({ nightTime }) => nightTime)),
      lostTime: total(records.map(({ lostTime }) => lostTime)),
      virtualWorkTime: total(
        records.map(({ virtualWorkTime }) => virtualWorkTime)
      ),
      holidayWorkTime: total(
        records.map(({ holidayWorkTime }) => holidayWorkTime)
      ),
    },
    summaries: createSummaries(response.summaries, response),
    dividedSummaries: createDividedSummaries(
      response.dividedSummaries,
      response
    ),
    attention: createAttention(records),
    workingType: createWorkingType({
      records: response.records,
      useRestReason: response.useRestReason,
    }),
  };
};
