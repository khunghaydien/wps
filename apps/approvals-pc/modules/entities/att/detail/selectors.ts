import { createSelector } from 'reselect';

import { labelMapping as requestStatusLabel } from '../../../../../commons/constants/requestStatus';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import TimeUtil from '../../../../../commons/utils/TimeUtil';

import {
  AbsenceRequest,
  AttDailyDetailForStore,
  DirectRequest,
  EarlyLeaveRequest,
  EarlyStartWorkRequest,
  getPeriod,
  HolidayWorkRequest,
  LateArrivalRequest,
  LEAVE_RANGE_LABEL,
  LeaveRequest,
  OvertimeWorkRequest,
  PatternRequest,
  REQUEST_TYPE,
  SUBSTITUTE_LEAVE_TYPE_LABEL,
} from '../../../../../domain/models/approval/AttDailyDetail';
// NOTE 型以外の物をimportすると循環依存関係が起きるて色んな所が壊れるので注意してください。
import { Status } from '../../../../../domain/models/approval/request/Status';

const mapObject = <T>(
  obj: T | null | undefined,
  f: (arg0: T) => Record<string, any>
) => {
  return obj ? f(obj) : {};
};

const formatAsLeaveRequest = (
  detail: LeaveRequest,
  original?: LeaveRequest
) => {
  return [
    {
      label: msg().Appr_Lbl_RequestType,
      value: detail.typeLabel,
    },
    {
      label: msg().Att_Lbl_LeaveType,
      value: detail.leaveName,
    },
    {
      label: msg().Att_Lbl_Range,
      value: msg()[LEAVE_RANGE_LABEL[detail.leaveRange]],
    },
    {
      label: msg().Att_Lbl_Period,
      value: getPeriod(detail),
      ...mapObject(original, (o) => ({
        valueType: 'datetime',
        originalValue: getPeriod(o),
      })),
    },
    detail.requireReason
      ? {
          label: msg().Att_Lbl_Reason,
          value: detail.reason || '',
          ...mapObject(original, (o) => ({
            valueType: 'longtext',
            originalValue: o.reason || '',
          })),
        }
      : {
          label: msg().Att_Lbl_Remarks,
          value: detail.remarks || '',
          ...mapObject(original, (o) => ({
            valueType: 'longtext',
            originalValue: o.remarks || '',
          })),
        },
  ];
};

const formatAsHolidayWorkRequest = (
  detail: HolidayWorkRequest,
  original?: HolidayWorkRequest
) => {
  const fields = [
    {
      label: msg().Appr_Lbl_RequestType,
      value: detail.typeLabel,
    },
    {
      label: msg().Att_Lbl_Period,
      value: getPeriod(detail),
      ...mapObject(original, (o) => ({
        valueType: 'datetime',
        originalValue: getPeriod(o),
      })),
    },
  ];

  if (original) {
    fields.push({
      label: msg().Att_Lbl_ReplacementDayOff,
      value: detail.substituteLeaveType
        ? msg()[SUBSTITUTE_LEAVE_TYPE_LABEL[detail.substituteLeaveType || '']]
        : '',
      ...mapObject(original, (o) => ({
        valueType: 'text',
        originalValue:
          msg()[SUBSTITUTE_LEAVE_TYPE_LABEL[o.substituteLeaveType || ''] || ''],
      })),
    });
  } else {
    fields.push({
      label: msg().Att_Lbl_ReplacementDayOff,
      value:
        msg()[
          SUBSTITUTE_LEAVE_TYPE_LABEL[detail.substituteLeaveType || ''] ||
            'Com_Lbl_None'
        ],
    });
  }

  if (detail.substituteDate) {
    fields.push({
      label: msg().Att_Lbl_ScheduledDateOfSubstitute,
      value: detail.substituteDate
        ? DateUtil.formatYMD(detail.substituteDate)
        : '',
      ...mapObject(original, (o) => ({
        valueType: 'date',
        originalValue: o.substituteDate
          ? DateUtil.formatYMD(o.substituteDate)
          : '',
      })),
    });
  }

  fields.push({
    label: msg().Att_Lbl_Remarks,
    value: detail.remarks || '',
    ...mapObject(original, (o) => ({
      valueType: 'longtext',
      originalValue: o.remarks || '',
    })),
  });

  return fields;
};

const formatAsEarlyStartWorkRequest = (detail: EarlyStartWorkRequest) => {
  return [
    {
      label: msg().Appr_Lbl_RequestType,
      value: detail.typeLabel,
    },
    {
      label: msg().Att_Lbl_Period,
      value: getPeriod(detail),
    },
    {
      label: msg().Att_Lbl_Remarks,
      value: detail.remarks || '',
    },
  ];
};

const formatAsOvertimeWorkRequest = (detail: OvertimeWorkRequest) => {
  return [
    {
      label: msg().Appr_Lbl_RequestType,
      value: detail.typeLabel,
    },
    {
      label: msg().Att_Lbl_Period,
      value: getPeriod(detail),
    },
    {
      label: msg().Att_Lbl_Remarks,
      value: detail.remarks || '',
    },
  ];
};

const formatAsLateArrivalRequest = (detail: LateArrivalRequest) => {
  return [
    {
      label: msg().Appr_Lbl_RequestType,
      value: detail.typeLabel,
    },
    {
      label: msg().Appr_Lbl_Date,
      value: getPeriod(detail),
    },
    {
      label: msg().Att_Lbl_ContractedStartTime,
      value: TimeUtil.toHHmm(detail.startTime),
    },
    {
      label: msg().Att_Lbl_LateArrivalStartTime,
      value: TimeUtil.toHHmm(detail.endTime),
    },
    {
      label: msg().Att_Lbl_Reason,
      value: detail.reason || '',
    },
  ];
};

const formatAsEarlyLeaveRequest = (detail: EarlyLeaveRequest) => {
  return [
    {
      label: msg().Appr_Lbl_RequestType,
      value: detail.typeLabel,
    },
    {
      label: msg().Appr_Lbl_Date,
      value: getPeriod(detail),
    },
    {
      label: msg().Att_Lbl_ContractedEndTime,
      value: TimeUtil.toHHmm(detail.endTime),
    },
    {
      label: msg().Att_Lbl_EarlyLeaveStartTime,
      value: TimeUtil.toHHmm(detail.startTime),
    },
    {
      label: msg().Att_Lbl_Reason,
      value: detail.reason || '',
    },
  ];
};

const formatAsAbsenceRequest = (detail: AbsenceRequest) => {
  return [
    {
      label: msg().Appr_Lbl_RequestType,
      value: detail.typeLabel,
    },
    {
      label: msg().Att_Lbl_Period,
      value: getPeriod(detail),
    },
    {
      label: msg().Att_Lbl_Reason,
      value: detail.reason || '',
    },
  ];
};

const formatAsDirectRequest = (detail: DirectRequest) => {
  return [
    {
      label: msg().Appr_Lbl_RequestType,
      value: detail.typeLabel,
    },
    {
      label: msg().Att_Lbl_Period,
      value: getPeriod(detail),
    },
    {
      label: msg().Att_Lbl_WorkTime,
      value: TimeUtil.formatTimeRange(detail.startTime, detail.endTime),
    },
    ...[
      [detail.rest1StartTime, detail.rest1EndTime],
      [detail.rest2StartTime, detail.rest2EndTime],
      [detail.rest3StartTime, detail.rest3EndTime],
      [detail.rest4StartTime, detail.rest4EndTime],
      [detail.rest5StartTime, detail.rest5EndTime],
    ]
      .filter(([startTime, endTime]) => startTime !== null || endTime !== null)
      .map(([startTime, endTime], idx) => ({
        label: `${msg().Att_Lbl_Rest}${idx + 1}`,
        value: TimeUtil.formatTimeRange(startTime, endTime),
      })),
    {
      label: msg().Att_Lbl_Remarks,
      value: detail.remarks || '',
    },
  ];
};

const formatAsPatternRequest = (detail: PatternRequest) => [
  {
    label: msg().Appr_Lbl_RequestType,
    value: detail.typeLabel,
  },
  {
    label: msg().Att_Lbl_Period,
    value: getPeriod(detail),
  },
  {
    label: msg().Att_Lbl_AttPattern,
    value: detail.attPatternName,
  },
  {
    label: msg().Admin_Lbl_WorkingHours,
    value: TimeUtil.formatTimeRange(detail.startTime, detail.endTime),
  },
  ...[
    [detail.rest1StartTime, detail.rest1EndTime],
    [detail.rest2StartTime, detail.rest2EndTime],
    [detail.rest3StartTime, detail.rest3EndTime],
    [detail.rest4StartTime, detail.rest4EndTime],
    [detail.rest5StartTime, detail.rest5EndTime],
  ]
    .filter(([startTime, endTime]) => startTime !== null || endTime !== null)
    .map(([startTime, endTime], idx) => ({
      label: `${msg().Admin_Lbl_WorkingTypeRest}${idx + 1}`,
      value: TimeUtil.formatTimeRange(startTime, endTime),
    })),
  {
    label: msg().Att_Lbl_Remarks,
    value: detail.remarks || '',
  },
];

export const detailListSelector = createSelector(
  (state): AttDailyDetailForStore => state as AttDailyDetailForStore,
  (detail: AttDailyDetailForStore) => {
    const initialDetailList = [
      {
        label: '',
        value: '',
      },
    ];

    if (!detail) {
      return initialDetailList;
    }

    if (!detail.request.id) {
      return initialDetailList;
    }

    const refineOrigianlRequest = <
      T extends AttDailyDetailForStore['originalRequest']
    >(
      r: any
    ): T => {
      return r as T;
    };

    const request = detail.request;
    switch (request.type) {
      case REQUEST_TYPE.LEAVE:
        return formatAsLeaveRequest(
          request as LeaveRequest,
          refineOrigianlRequest(detail.originalRequest)
        );
      case REQUEST_TYPE.HOLIDAY_WORK:
        return formatAsHolidayWorkRequest(
          request as HolidayWorkRequest,
          refineOrigianlRequest(detail.originalRequest)
        );
      case REQUEST_TYPE.EARLY_START_WORK:
        return formatAsEarlyStartWorkRequest(request as EarlyStartWorkRequest);
      case REQUEST_TYPE.OVERTIME_WORK:
        return formatAsOvertimeWorkRequest(request as OvertimeWorkRequest);
      case REQUEST_TYPE.LATE_ARRIVAL:
        return formatAsLateArrivalRequest(request as LateArrivalRequest);
      case REQUEST_TYPE.EARLY_LEAVE:
        return formatAsEarlyLeaveRequest(request as EarlyLeaveRequest);
      case REQUEST_TYPE.ABSENCE:
        return formatAsAbsenceRequest(request as AbsenceRequest);
      case REQUEST_TYPE.DIRECT:
        return formatAsDirectRequest(request as DirectRequest);
      case REQUEST_TYPE.PATTERN:
        return formatAsPatternRequest(request as PatternRequest);
      default:
        return initialDetailList;
    }
  }
);

export const statusSelector = createSelector(
  (state: Status | ''): Status | '' => state,
  (status: Status | '') => {
    if (!status) {
      return '';
    }

    const key = requestStatusLabel[status];

    if (!key) {
      return '';
    }

    return msg()[key];
  }
);
