import * as React from 'react';

import { CODE as ATT_DAILY_ATTENTION_CODE } from '@attendance/domain/models/AttDailyAttention';
import { DAY_TYPE, DayType } from '@attendance/domain/models/AttDailyRecord';
import { COMMUTE_STATE } from '@attendance/domain/models/CommuteCount';
import {
  LAYOUT_ITEM_TYPE,
  LAYOUT_ITEM_VIEW_TYPE,
} from '@attendance/domain/models/DailyRecordDisplayFieldLayout';

import Component from '../../RecordTable';
import { time } from '@attendance/__tests__/helpers';

type Summary = React.ComponentProps<typeof Component>['summary'];

const records: Summary['records'] = [...new Array(7).keys()].map((idx) => {
  const i = idx + 1;
  const recordDate = `2022-02-${String(i).padStart(2, '0')}`;
  const dayType: DayType =
    i % 6 === 0
      ? DAY_TYPE.Holiday
      : i % 7 === 0
      ? DAY_TYPE.LegalHoliday
      : DAY_TYPE.Workday;
  switch (dayType) {
    case DAY_TYPE.Holiday:
      return {
        recordDate,
        dayType,
        event: '',
        shift: '',
        commuteState: null,
        dailyObjectiveEventLog: '',
        allowanceDailyRecordCount: null,
        startTime: null,
        endTime: null,
        startStampTime: null,
        endStampTime: null,
        outStartTime: null,
        outEndTime: null,
        insufficientRestTime: null,
        virtualWorkTime: null,
        restTime: null,
        realWorkTime: null,
        holidayWorkTime: null,
        overTime: null,
        nightTime: null,
        lostTime: null,
        remarks: '',
        attentions: [],
        startTimeModified: false,
        endTimeModified: false,
        isHolLegalHoliday: false,
      };
    case DAY_TYPE.LegalHoliday:
      return {
        recordDate,
        dayType,
        event: '',
        shift: '',
        commuteState: null,
        dailyObjectiveEventLog: '',
        allowanceDailyRecordCount: null,
        startTime: null,
        endTime: null,
        startStampTime: null,
        endStampTime: null,
        outStartTime: null,
        outEndTime: null,
        insufficientRestTime: null,
        virtualWorkTime: null,
        restTime: null,
        realWorkTime: null,
        holidayWorkTime: null,
        overTime: null,
        nightTime: null,
        lostTime: null,
        remarks: '',
        attentions: [],
        startTimeModified: false,
        endTimeModified: false,
        isHolLegalHoliday: false,
      };
    default:
      return {
        recordDate,
        dayType,
        event: 'Early Start Work, Direct',
        shift: 'Shift',
        commuteState: COMMUTE_STATE.BOTH_WAYS,
        dailyObjectiveEventLog: 'ObjectivelyEventLog',
        allowanceDailyRecordCount: 3,
        startTime: time(7, 0),
        endTime: time(16, 0),
        startStampTime: time(7, 0),
        endStampTime: time(16, 0),
        outStartTime: time(7, 0),
        outEndTime: time(16, 0),
        insufficientRestTime: 10,
        virtualWorkTime: time(9),
        restTime: time(1),
        realWorkTime: time(8),
        holidayWorkTime: time(1, 1),
        overTime: time(1, 2),
        nightTime: time(1, 3),
        lostTime: time(1, 4),
        remarks: 'remarks',
        attentions: [],
        startTimeModified: true,
        endTimeModified: true,
        isHolLegalHoliday: false,
      };
  }
});

records[0] = {
  recordDate: '2022-02-01',
  dayType: DAY_TYPE.Workday,
  event: 'Early Start Work, Direct',
  shift: 'Shift',
  commuteState: COMMUTE_STATE.BOTH_WAYS,
  dailyObjectiveEventLog: 'ObjectivelyEventLog',
  allowanceDailyRecordCount: 3,
  startTime: time(7, 0),
  endTime: time(16, 0),
  startStampTime: time(7, 0),
  endStampTime: time(16, 0),
  outStartTime: time(7, 0),
  outEndTime: time(16, 0),
  insufficientRestTime: 10,
  virtualWorkTime: time(9),
  restTime: time(1),
  realWorkTime: time(8),
  holidayWorkTime: time(1, 1),
  overTime: time(1, 2),
  nightTime: time(1, 3),
  lostTime: time(1, 4),
  remarks: 'remarks',
  isHolLegalHoliday: false,
  attentions: [
    {
      code: ATT_DAILY_ATTENTION_CODE.INEFFECTIVE_WORKING_TIME,
      value: {
        fromTime: time(1),
        toTime: time(2),
      },
    },
    {
      code: ATT_DAILY_ATTENTION_CODE.INSUFFICIENT_REST_TIME,
      value: 10,
    },
    {
      code: ATT_DAILY_ATTENTION_CODE.OVER_ALLOWING_DEVIATION_TIME,
    },
  ],
  startTimeModified: true,
  endTimeModified: true,
};

export const defaultValue: Summary = {
  records,
  recordTotal: {
    restTime: 1,
    realWorkTime: 2,
    overTime: 3,
    nightTime: 4,
    lostTime: 5,
    virtualWorkTime: 6,
    holidayWorkTime: 7,
  },
  workingType: {
    useAllowanceManagement: true,
    useManageCommuteCount: true,
    useObjectivelyEventLog: true,
    useRestReason: true,
  },
  displayFieldLayout: {
    layoutRow: [
      {
        id: 'I0001',
        objectName: 'objectName',
        objectItemName: 'objectItemName',
        name: '通常文字列',
        type: LAYOUT_ITEM_TYPE.STRING,
        viewType: null,
        editable: false,
        order: 1,
      },
      {
        id: 'I0002',
        objectName: 'objectName',
        objectItemName: 'objectItemName',
        name: '長文字列',
        type: LAYOUT_ITEM_TYPE.STRING,
        viewType: null,
        editable: false,
        order: 1,
      },
      {
        id: 'I0003',
        objectName: 'objectName',
        objectItemName: 'objectItemName',
        name: '日付',
        type: LAYOUT_ITEM_TYPE.DATE,
        viewType: null,
        editable: false,
        order: 1,
      },
      {
        id: 'I0004',
        objectName: 'objectName',
        objectItemName: 'objectItemName',
        name: '数値（整数）',
        type: LAYOUT_ITEM_TYPE.NUMBER,
        viewType: null,
        editable: false,
        order: 1,
      },
      {
        id: 'I0005',
        objectName: 'objectName',
        objectItemName: 'objectItemName',
        name: '数値（少数）',
        type: LAYOUT_ITEM_TYPE.NUMBER,
        viewType: null,
        editable: false,
        order: 1,
      },
      {
        id: 'I0006',
        objectName: 'objectName',
        objectItemName: 'objectItemName',
        name: '勤怠時間',
        type: LAYOUT_ITEM_TYPE.NUMBER,
        viewType: LAYOUT_ITEM_VIEW_TYPE.ATT_TIME,
        editable: false,
        order: 1,
      },
      {
        id: 'I0007',
        objectName: 'objectName',
        objectItemName: 'objectItemName',
        name: '真偽 true',
        type: LAYOUT_ITEM_TYPE.BOOLEAN,
        viewType: null,
        editable: false,
        order: 1,
      },
      {
        id: 'I0008',
        objectName: 'objectName',
        objectItemName: 'objectItemName',
        name: '真偽 false',
        type: LAYOUT_ITEM_TYPE.BOOLEAN,
        viewType: null,
        editable: false,
        order: 1,
      },
      {
        id: 'I0009',
        objectName: 'objectName',
        objectItemName: 'objectItemName',
        name: '時間',
        type: LAYOUT_ITEM_TYPE.TIME,
        viewType: null,
        editable: false,
        order: 1,
      },
      {
        id: 'I0010',
        objectName: 'objectName',
        objectItemName: 'objectItemName',
        name: '日付時間',
        type: LAYOUT_ITEM_TYPE.DATE_TIME,
        viewType: null,
        editable: false,
        order: 1,
      },
    ],
    layoutValues: {
      '2022-02-01': {
        I0001: {
          existing: true,
          value: {
            type: LAYOUT_ITEM_TYPE.STRING,
            value: 'TEXT',
          },
        },
        I0002: {
          existing: true,
          value: {
            type: LAYOUT_ITEM_TYPE.STRING,
            value:
              'ABC EFG HIG KLM NOP QRS TUV WXY Z ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUV',
          },
        },
        I0003: {
          existing: true,
          value: {
            type: LAYOUT_ITEM_TYPE.DATE,
            value: '2023-01-01',
          },
        },
        I0004: {
          existing: true,
          value: {
            type: LAYOUT_ITEM_TYPE.NUMBER,
            value: 1,
            textValue: '1',
            decimalPlaces: 0,
          },
        },
        I0005: {
          existing: true,
          value: {
            type: LAYOUT_ITEM_TYPE.NUMBER,
            value: 1,
            textValue: '1.00',
            decimalPlaces: 2,
          },
        },
        I0006: {
          existing: true,
          value: {
            type: LAYOUT_ITEM_TYPE.NUMBER,
            value: 540,
            textValue: '540',
            decimalPlaces: 0,
          },
        },
        I0007: {
          existing: true,
          value: {
            type: LAYOUT_ITEM_TYPE.BOOLEAN,
            value: true,
          },
        },
        I0008: {
          existing: true,
          value: {
            type: LAYOUT_ITEM_TYPE.BOOLEAN,
            value: false,
          },
        },
        I0009: {
          existing: true,
          value: {
            type: LAYOUT_ITEM_TYPE.TIME,
            value: '00:00:00.00',
          },
        },
        I0010: {
          existing: true,
          value: {
            type: LAYOUT_ITEM_TYPE.DATE_TIME,
            value: '2023-01-01T00:00:00.00',
          },
        },
      },
    },
  },
};
