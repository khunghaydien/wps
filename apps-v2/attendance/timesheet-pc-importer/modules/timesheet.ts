import uuid from 'uuid';
import { ValidationError } from 'yup';

import createSchemas from '@attendance/timesheet-pc-importer/schemas';

import { compose } from '@apps/commons/utils/FnUtil';
import DateUtil from '@commons/utils/DateUtil';

import { DAY_TYPE } from '@attendance/domain/models/AttDailyRecord';
import {
  ContractedWorkTime,
  isWorkDay,
} from '@attendance/domain/models/importer/ContractedWorkTime';

import ROOT from './actionType';

import getWithinRange from '@attendance/libraries/utils/Records/getWithinRange';

import * as DailyRecordViewModel from '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel';

type Schemas = ReturnType<typeof createSchemas>;

export type State = {
  id: string;
  startDate: string;
  endDate: string;
  records: Map<
    DailyRecordViewModel.DailyRecordViewModel['recordDate'],
    DailyRecordViewModel.DailyRecordViewModel
  >;
  contractedWorkTimes: ContractedWorkTime[];
};

const ACTION_TYPE_ROOT = `${ROOT}/DAILY_RECORDS` as const;

export const ACTION_TYPE = {
  CREATE: `${ACTION_TYPE_ROOT}/CREATE`,
  SET_RECORDS: `${ACTION_TYPE_ROOT}/SET_RECORDS`,
  SET_RECORD_VALUE_BY_RANGE: `${ACTION_TYPE_ROOT}/SET_RECORD_VALUE_BY_RANGE`,
  SET_RECORD_VALUE_BY_RECORD_DATE: `${ACTION_TYPE_ROOT}/SET_RECORD_VALUE_BY_RECORD_DATE`,
  SET_SERVER_ERRORS: `${ACTION_TYPE_ROOT}/SET_SERVER_ERRORS`,
  SET_CONTRACTED_WORK_TIMES: `${ACTION_TYPE_ROOT}/SET_CONTRACTED_WORK_TIMES`,
  TOGGLE_CHECKED_ALL: `${ACTION_TYPE_ROOT}/TOGGLE_CHECKED_ALL`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
} as const;

export const actions = {
  create: (startDate: string, endDate: string) => ({
    type: ACTION_TYPE.CREATE,
    payload: {
      startDate,
      endDate,
    },
  }),
  setRecords: (
    records: Map<
      DailyRecordViewModel.DailyRecordViewModel['recordDate'],
      DailyRecordViewModel.DailyRecordViewModel
    >
  ) => ({
    type: ACTION_TYPE.SET_RECORDS,
    payload: records,
  }),
  setRecordValueByRange: (
    targetDate: string,
    key: keyof DailyRecordViewModel.DailyRecordViewModel,
    value: DailyRecordViewModel.DailyRecordViewModel[typeof key]
  ) => ({
    type: ACTION_TYPE.SET_RECORD_VALUE_BY_RANGE,
    payload: {
      targetDate,
      key,
      value,
    },
  }),
  setRecordValueByRecordDate: (
    targetDate: string,
    key: keyof DailyRecordViewModel.DailyRecordViewModel,
    value: DailyRecordViewModel.DailyRecordViewModel[typeof key]
  ) => ({
    type: ACTION_TYPE.SET_RECORD_VALUE_BY_RECORD_DATE,
    payload: {
      targetDate,
      key,
      value,
    },
  }),
  setServerErrors: (payload: {
    startDate: string;
    endDate: string;
    errors: Map<
      DailyRecordViewModel.DailyRecordViewModel['recordDate'],
      string[]
    >;
  }) => ({
    type: ACTION_TYPE.SET_SERVER_ERRORS,
    payload,
  }),
  setContractedWorkTimes: (contractedWorkTimes: ContractedWorkTime[]) => ({
    type: ACTION_TYPE.SET_CONTRACTED_WORK_TIMES,
    payload: contractedWorkTimes,
  }),
  toggleCheckedAll: () => ({
    type: ACTION_TYPE.TOGGLE_CHECKED_ALL,
  }),
  clear: () => ({
    type: ACTION_TYPE.CLEAR,
  }),
};

type Actions = Action<typeof actions>;

const initialState: State = {
  id: uuid(),
  startDate: '',
  endDate: '',
  records: null,
  contractedWorkTimes: null,
};

const createRecords = (
  startDate: string,
  endDate: string
): Map<
  DailyRecordViewModel.DailyRecordViewModel['recordDate'],
  DailyRecordViewModel.DailyRecordViewModel
> => {
  const dailyRecords: Map<
    DailyRecordViewModel.DailyRecordViewModel['recordDate'],
    DailyRecordViewModel.DailyRecordViewModel
  > = new Map<string, DailyRecordViewModel.DailyRecordViewModel>();
  if (startDate && endDate && startDate <= endDate) {
    const diff = DateUtil.dayDiff(startDate, endDate);
    const start = startDate;
    for (let i = 0; i <= diff; i++) {
      const recordDate = i ? DateUtil.addDays(start, i) : start;
      dailyRecords.set(
        recordDate,
        DailyRecordViewModel.create({
          recordDate,
        })
      );
    }
  }
  return dailyRecords;
};

const isWorkDayByDate = (
  targetDate: string,
  contractedWorkTime: ContractedWorkTime
) => {
  const time = contractedWorkTime?.records?.get(targetDate);
  return isWorkDay(time);
};

const getRestReason = (
  code: string,
  restTimeReasons: DailyRecordViewModel.DailyRecordViewModel['restTimeReasons']
) => {
  if (code) {
    return restTimeReasons.find(({ code: $code }) => $code === code) || null;
  }
  return null;
};

const getDefaultRestReason = (
  code: string,
  restTimeReasons: DailyRecordViewModel.DailyRecordViewModel['restTimeReasons']
) => {
  if (code) {
    return getRestReason(code, restTimeReasons);
  }
  return restTimeReasons.at(0) || null;
};

export const setDefault =
  (contractedWorkTime: ContractedWorkTime) =>
  (
    key: keyof DailyRecordViewModel.DailyRecordViewModel,
    value: DailyRecordViewModel.DailyRecordViewModel[typeof key]
  ) =>
  (record: DailyRecordViewModel.DailyRecordViewModel) => {
    const $record: Partial<DailyRecordViewModel.DailyRecordViewModel> = {
      [key]: value,
    };
    if (key === 'restTimeReasons') {
      if (
        !contractedWorkTime ||
        isWorkDayByDate(record.recordDate, contractedWorkTime)
      ) {
        const rest1Reason = getDefaultRestReason(
          record.rest1ReasonCode,
          value as DailyRecordViewModel.DailyRecordViewModel['restTimeReasons']
        );
        const rest2Reason = getDefaultRestReason(
          record.rest2ReasonCode,
          value as DailyRecordViewModel.DailyRecordViewModel['restTimeReasons']
        );
        $record.rest1Reason = rest1Reason;
        $record.rest2Reason = rest2Reason;
        $record.rest1ReasonCode = rest1Reason?.code ?? null;
        $record.rest2ReasonCode = rest2Reason?.code ?? null;
      }
    }
    return {
      ...record,
      ...$record,
    };
  };

export const normalize = (
  record: DailyRecordViewModel.DailyRecordViewModel
) => {
  const $record = {
    ...record,
  };
  // 遅延代入を許可するため配列が初期化されていなければ何もしない
  if ($record.leaveRequestLeaves) {
    const leave1 = record.appliedLeaveRequest1
      ? $record.leaveRequestLeaves.find(
          ({ code }) => code === record.leaveRequest1Code
        ) ?? null
      : null;
    $record.leaveRequest1Leave = leave1;
    $record.leaveRequest1Code = leave1?.code ?? null;
    $record.leaveRequest1Range =
      leave1?.ranges?.find((range) => range === $record.leaveRequest1Range) ??
      null;
  }
  // 遅延代入を許可するため配列が初期化されていなければ何もしない
  if ($record.lateArrivalReasons) {
    const lateArrival = record.appliedLateArrivalRequest
      ? $record.lateArrivalReasons.find(
          ({ code }) => code === record.lateArrivalRequestReasonCode
        ) ?? null
      : null;
    $record.lateArrivalRequestReason = lateArrival;
    $record.lateArrivalRequestReasonCode = lateArrival?.code ?? null;
  }
  // 遅延代入を許可するため配列が初期化されていなければ何もしない
  if ($record.earlyLeaveReasons) {
    const earlyLeave = record.appliedEarlyLeaveRequest
      ? $record.earlyLeaveReasons.find(
          ({ code }) => code === record.earlyLeaveRequestReasonCode
        ) ?? null
      : null;
    $record.earlyLeaveRequestReason = earlyLeave;
    $record.earlyLeaveRequestReasonCode = earlyLeave?.code ?? null;
  }
  // 遅延代入を許可するため配列が初期化されていなければ何もしない
  if ($record.restTimeReasons) {
    const rest1Reason = getRestReason(
      $record.rest1ReasonCode,
      $record.restTimeReasons
    );
    const rest2Reason = getRestReason(
      $record.rest2ReasonCode,
      $record.restTimeReasons
    );
    $record.rest1Reason = rest1Reason;
    $record.rest2Reason = rest2Reason;
    $record.rest1ReasonCode = rest1Reason?.code ?? null;
    $record.rest2ReasonCode = rest2Reason?.code ?? null;
  }
  return $record;
};

export const setErrors = (
  record: DailyRecordViewModel.DailyRecordViewModel
): DailyRecordViewModel.DailyRecordViewModel => ({
  ...record,
  errors: [].concat(
    record.serverErrors || [],
    ...[...(record.validationErrors?.values() || [])]
  ),
});

export const validate =
  (schemas: Schemas) =>
  (
    record: DailyRecordViewModel.DailyRecordViewModel
  ): DailyRecordViewModel.DailyRecordViewModel => {
    const $record = { ...record };
    $record.validationErrors = null;
    try {
      schemas.validateSync($record, { abortEarly: false });
    } catch (error) {
      const result = error as ValidationError;
      const validationErrors = new Map<
        keyof DailyRecordViewModel.DailyRecordViewModel,
        string[]
      >();
      result.inner.forEach((err: ValidationError) => {
        validationErrors.set(
          err.path as keyof DailyRecordViewModel.DailyRecordViewModel,
          err.errors
        );
      });
      $record.validationErrors = validationErrors;
    }
    return $record;
  };

export const createUpdater = (contractedWorkTime: ContractedWorkTime) =>
  compose(setErrors, validate(createSchemas(contractedWorkTime)), normalize);

export const createKeyValueUpdater =
  (contractedWorkTime: ContractedWorkTime) =>
  (
    key: keyof DailyRecordViewModel.DailyRecordViewModel,
    value: DailyRecordViewModel.DailyRecordViewModel[typeof key]
  ) =>
    compose(
      createUpdater(contractedWorkTime),
      setDefault(contractedWorkTime)(key, value)
    );

export default (state = initialState, action: Actions): State => {
  switch (action.type) {
    case ACTION_TYPE.CREATE: {
      const { startDate, endDate: inputEndDate } = action.payload;
      const maxDate = DailyRecordViewModel.getMaxDate(startDate);
      const endDate =
        maxDate < inputEndDate || inputEndDate < startDate
          ? maxDate
          : inputEndDate;

      const dailyRecords = createRecords(startDate, endDate);

      return {
        id: uuid(),
        startDate,
        endDate,
        records: dailyRecords,
        contractedWorkTimes: null,
      };
    }

    case ACTION_TYPE.SET_RECORD_VALUE_BY_RANGE: {
      const { records, contractedWorkTimes } = state;
      if (!records) {
        return state;
      }

      const { targetDate, key, value } = action.payload;
      const contractedWorkTime = getWithinRange(
        targetDate,
        contractedWorkTimes
      );
      const workingType = getWithinRange(
        targetDate,
        contractedWorkTime?.workingTypes
      );
      const targetDates = workingType
        ? DateUtil.getRangeDays(workingType.startDate, workingType.endDate)
        : [targetDate];
      const newRecords = new Map(records);
      const update = createKeyValueUpdater(contractedWorkTime)(key, value);

      targetDates.forEach((targetDate) => {
        const record = records.get(targetDate);
        if (!record) {
          return;
        }
        newRecords.set(targetDate, update(record));
      });

      return {
        ...state,
        records: newRecords,
      };
    }

    case ACTION_TYPE.SET_RECORD_VALUE_BY_RECORD_DATE: {
      if (!state.records) {
        return state;
      }

      const { targetDate, key, value } = action.payload;
      const record = state.records.get(targetDate);

      if (!record) {
        return state;
      }

      const newRecords = new Map(state.records);
      const update = createKeyValueUpdater(
        getWithinRange(targetDate, state.contractedWorkTimes)
      )(key, value);

      newRecords.set(targetDate, update(record));

      return {
        ...state,
        records: newRecords,
      };
    }

    case ACTION_TYPE.SET_RECORDS: {
      if (!state.records) {
        return state;
      }

      const records = new Map(state.records);
      const recordsForUpdating = action.payload;

      recordsForUpdating.forEach((value, targetDate) => {
        const record = records.get(targetDate);
        if (!record) {
          return;
        }
        const update = createUpdater(
          getWithinRange(targetDate, state.contractedWorkTimes)
        );
        records.set(
          targetDate,
          update({
            ...record,
            ...value,
          })
        );
      });

      return {
        ...state,
        records,
      };
    }

    case ACTION_TYPE.SET_SERVER_ERRORS: {
      const { startDate, endDate, errors } = action.payload;
      const records = new Map(state.records);
      DateUtil.getRangeDays(startDate, endDate)?.forEach((key) => {
        const record = records.get(key);
        if (!record) {
          return;
        }
        records.set(
          key,
          setErrors({
            ...record,
            serverErrors: errors?.get(key) ?? null,
          })
        );
      });

      return {
        ...state,
        records,
      };
    }

    case ACTION_TYPE.SET_CONTRACTED_WORK_TIMES: {
      const { startDate, endDate } = state;
      const contractedWorkTimes = action.payload;
      const records = createRecords(startDate, endDate);

      records.forEach((record, key) => {
        const summary = getWithinRange(key, contractedWorkTimes);
        if (!summary) {
          return;
        }
        const update = createUpdater(summary);
        const time = summary.records.get(key);
        if (!time) {
          return;
        }
        const rest1 = time.restTimes?.at(0);
        const rest2 = time.restTimes?.at(1);
        const checked = time.dayType === DAY_TYPE.Workday;
        records.set(
          key,
          update({
            ...record,
            startTime: time.startTime ?? null,
            endTime: time.endTime ?? null,
            rest1StartTime: rest1?.startTime ?? null,
            rest1EndTime: rest1?.endTime ?? null,
            rest2StartTime: rest2?.startTime ?? null,
            rest2EndTime: rest2?.endTime ?? null,
            dayType: time.dayType ?? null,
            checked,
          })
        );
      });

      return {
        ...state,
        records,
        contractedWorkTimes,
      };
    }

    case ACTION_TYPE.TOGGLE_CHECKED_ALL: {
      if (!state.records) {
        return state;
      }

      const records = new Map(state.records);

      const checked = [...records?.values()].every(({ checked }) => checked);

      records.forEach((record, key) => {
        records.set(key, {
          ...record,
          checked: !checked,
        });
      });

      return {
        ...state,
        records,
      };
    }

    case ACTION_TYPE.CLEAR: {
      return initialState;
    }
    default:
      return state;
  }
};
