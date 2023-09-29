import isNumber from 'lodash/isNumber';
import { createSelector } from 'reselect';

import { labelMapping as requestStatusLabel } from '../../../../../commons/constants/requestStatus';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import TimeUtil from '../../../../../commons/utils/TimeUtil';

import {
  AbsenceRequest,
  AttDailyRequestDetail,
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
  Status,
  SUBSTITUTE_LEAVE_TYPE_LABEL,
} from '@attendance/domain/models/approval/AttDailyRequestDetail';
// NOTE 型以外の物をimportすると循環依存関係が起きるて色んな所が壊れるので注意してください。

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
  const fields = [
    {
      label: msg().Appr_Lbl_RequestType,
      value: detail.typeLabel,
    },
    {
      label: msg().Att_Lbl_CustomLeaveType,
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

  if (detail.leaveDetailName) {
    fields.splice(2, 0, {
      label: msg().$Att_Lbl_LeaveDetail,
      value: detail.leaveDetailName,
    });
  }

  return fields;
};

const formatTime = (startTime: number, endTime: number): string => {
  if (isNumber(startTime) && isNumber(endTime)) {
    return TimeUtil.formatTimeRange(startTime, endTime);
  }
  return '';
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
      value: DateUtil.formatDateOrRange(detail.startDate, detail.endDate) || '',
      ...mapObject(original, (o) => ({
        valueType: 'date',
        originalValue: DateUtil.formatDateOrRange(o.startDate, o.endDate) || '',
      })),
    },
  ];
  if (detail.patternName || original?.patternName) {
    fields.push({
      label: msg().Att_Lbl_WorkingPattern,
      value: detail.patternName || '',
      ...mapObject(original, (o) => ({
        valueType: 'text',
        originalValue: o.patternName || '',
      })),
    });
  }
  fields.push({
    label: msg().Att_Lbl_Duration,
    value: formatTime(detail.startTime, detail.endTime),
    ...mapObject(original, (o) => ({
      valueType: 'text',
      originalValue: formatTime(o.startTime, o.endTime),
    })),
  });
  const size =
    detail.dailyRestList?.length || original?.dailyRestList?.length || 0;
  for (let index = 0; index < size; index++) {
    const detailStartTime = detail?.dailyRestList?.[index].restStartTime;
    const detailEndTime = detail?.dailyRestList?.[index].restEndTime;

    const originalStartTime = original?.dailyRestList?.[index].restStartTime;
    const originalEndTime = original?.dailyRestList?.[index].restEndTime;

    if (!detailStartTime && !originalStartTime) {
      continue;
    }
    fields.push({
      label: `${msg().$Att_Lbl_CustomRest}${index + 1}`,
      value: formatTime(detailStartTime, detailEndTime),
      ...mapObject(original, () => ({
        valueType: 'text',
        originalValue: formatTime(originalStartTime, originalEndTime),
      })),
    });
  }
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
  const fields = [
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
  if (detail.useManageLateArrivalPersonalReason && !detail.reasonId) {
    fields.push({
      label: msg().Att_Lbl_PersonalReasonKubun,
      value: detail.personalReason ? msg().Att_Lbl_PersonalReason : '',
    });
  }
  if (detail.reasonId) {
    fields.push({
      label: msg().Att_Lbl_Remarks,
      value: detail.remarks || '',
    });
  }
  return fields;
};

const formatAsEarlyLeaveRequest = (detail: EarlyLeaveRequest) => {
  const fields = [
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
  if (detail.useManageEarlyLeavePersonalReason && !detail.reasonId) {
    fields.push({
      label: msg().Att_Lbl_PersonalReasonKubun,
      value: detail.personalReason ? msg().Att_Lbl_PersonalReason : '',
    });
  }
  if (detail.reasonId) {
    fields.push({
      label: msg().Att_Lbl_Remarks,
      value: detail.remarks || '',
    });
  }
  return fields;
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
    ...detail.restTimes
      .filter(
        ({ restStartTime, restEndTime }) =>
          restStartTime !== null || restEndTime !== null
      )
      .map(({ restStartTime, restEndTime }, idx) => ({
        label: `${msg().$Att_Lbl_CustomRest}${idx + 1}`,
        value: TimeUtil.formatTimeRange(restStartTime, restEndTime),
      })),
    {
      label: msg().Att_Lbl_Remarks,
      value: detail.remarks || '',
    },
  ];
};

const showPatternName = (detail: PatternRequest) => {
  if (
    detail.requestDayType === 'Workday' &&
    detail.attPatternName === null &&
    !detail.isDirectInputTimeRequest
  ) {
    return msg().Att_Lbl_WorkPattern;
  } else {
    return detail.attPatternName;
  }
};

const formatAsPatternRequest = (detail: PatternRequest) => {
  const fields = [
    {
      label: msg().Appr_Lbl_RequestType,
      value: detail.typeLabel,
    },
    {
      label: msg().Att_Lbl_Period,
      value: getPeriod(detail),
    },
  ];
  if (detail.requestDayType === 'Workday') {
    fields.push({
      label: msg().Att_Lbl_ChangeDayType,
      value: msg().Att_Lbl_ChangeToWorkday,
    });
  } else if (detail.requestDayType === 'Holiday') {
    fields.push({
      label: msg().Att_Lbl_ChangeDayType,
      value: msg().Att_Lbl_ChangeToHoliday,
    });
  }
  if (detail.requestDayType !== 'Holiday' && !detail.isDirectInputTimeRequest) {
    fields.push(
      {
        label: msg().Att_Lbl_WorkingPattern,
        value: showPatternName(detail),
      },
      {
        label: msg().Admin_Lbl_WorkingHours,
        value: TimeUtil.formatTimeRange(detail.startTime, detail.endTime),
      }
    );
  }
  if (
    detail.isDirectInputTimeRequest &&
    (detail.workSystem === 'JP:Fix' || detail.workSystem === 'JP:Modified')
  ) {
    fields.push(
      {
        label: msg().Att_Lbl_WorkingPattern,
        value: msg().Att_Lbl_DirectInput,
      },
      {
        label: msg().Admin_Lbl_WorkingHours,
        value: TimeUtil.formatTimeRange(detail.startTime, detail.endTime),
      }
    );
  }
  const restTimes = [
    [detail.rest1StartTime, detail.rest1EndTime],
    [detail.rest2StartTime, detail.rest2EndTime],
    [detail.rest3StartTime, detail.rest3EndTime],
    [detail.rest4StartTime, detail.rest4EndTime],
    [detail.rest5StartTime, detail.rest5EndTime],
  ];
  restTimes.forEach(([startTime, endTime], idx) => {
    if (startTime !== null && endTime !== null) {
      fields.push({
        label: `${msg().Admin_Lbl_WorkingTypeRest}${idx + 1}`,
        value: TimeUtil.formatTimeRange(startTime, endTime),
      });
    }
  });
  fields.push({
    label: msg().Att_Lbl_Remarks,
    value: detail.remarks || '',
  });
  return fields;
};

const formatAsPatternFlexRequest = (detail: PatternRequest) => {
  const fields = [
    {
      label: msg().Appr_Lbl_RequestType,
      value: detail.typeLabel,
    },
    {
      label: msg().Att_Lbl_Period,
      value: getPeriod(detail),
    },
  ];
  if (detail.requestDayType === 'Workday') {
    fields.push({
      label: msg().Att_Lbl_ChangeDayType,
      value: msg().Att_Lbl_ChangeToWorkday,
    });
  } else if (detail.requestDayType === 'Holiday') {
    fields.push({
      label: msg().Att_Lbl_ChangeDayType,
      value: msg().Att_Lbl_ChangeToHoliday,
    });
  }
  if (detail.requestDayType !== 'Holiday' && !detail.isDirectInputTimeRequest) {
    fields.push(
      {
        label: msg().Att_Lbl_WorkingPattern,
        value: showPatternName(detail),
      },
      {
        label: msg().Admin_Lbl_FlexHours,
        value: TimeUtil.formatTimeRange(
          detail.flexStartTime,
          detail.flexEndTime
        ),
      },
      {
        label: msg().Admin_Lbl_CoreTime,
        value: TimeUtil.formatTimeRange(detail.startTime, detail.endTime),
      }
    );
  }
  if (detail.isDirectInputTimeRequest && detail.workSystem === 'JP:Flex') {
    fields.push(
      {
        label: msg().Att_Lbl_WorkingPattern,
        value: msg().Att_Lbl_DirectInput,
      },
      {
        label: msg().Admin_Lbl_WorkingHours,
        value: TimeUtil.formatTimeRange(detail.startTime, detail.endTime),
      }
    );
  }
  const restTimes = [
    [detail.rest1StartTime, detail.rest1EndTime],
    [detail.rest2StartTime, detail.rest2EndTime],
    [detail.rest3StartTime, detail.rest3EndTime],
    [detail.rest4StartTime, detail.rest4EndTime],
    [detail.rest5StartTime, detail.rest5EndTime],
  ];
  restTimes.forEach(([startTime, endTime], idx) => {
    if (startTime !== null && endTime !== null) {
      fields.push({
        label: `${msg().Admin_Lbl_WorkingTypeRest}${idx + 1}`,
        value: TimeUtil.formatTimeRange(startTime, endTime),
      });
    }
  });
  fields.push({
    label: msg().Att_Lbl_Remarks,
    value: detail.remarks || '',
  });
  return fields;
};

const formatAsPatternFlexWithoutCoreTimeRequest = (detail: PatternRequest) => {
  const fields = [
    {
      label: msg().Appr_Lbl_RequestType,
      value: detail.typeLabel,
    },
    {
      label: msg().Att_Lbl_Period,
      value: getPeriod(detail),
    },
  ];
  if (detail.requestDayType === 'Workday') {
    fields.push({
      label: msg().Att_Lbl_ChangeDayType,
      value: msg().Att_Lbl_ChangeToWorkday,
    });
  } else if (detail.requestDayType === 'Holiday') {
    fields.push({
      label: msg().Att_Lbl_ChangeDayType,
      value: msg().Att_Lbl_ChangeToHoliday,
    });
  }
  if (detail.requestDayType !== 'Holiday' && !detail.isDirectInputTimeRequest) {
    fields.push(
      {
        label: msg().Att_Lbl_WorkingPattern,
        value: showPatternName(detail),
      },
      {
        label: msg().Admin_Lbl_FlexHours,
        value: TimeUtil.formatTimeRange(
          detail.flexStartTime,
          detail.flexEndTime
        ),
      }
    );
  }
  if (detail.isDirectInputTimeRequest && detail.workSystem === 'JP:Flex') {
    fields.push(
      {
        label: msg().Att_Lbl_WorkingPattern,
        value: msg().Att_Lbl_DirectInput,
      },
      {
        label: msg().Admin_Lbl_WorkingHours,
        value: TimeUtil.formatTimeRange(detail.startTime, detail.endTime),
      }
    );
  }
  const restTimes = [
    [detail.rest1StartTime, detail.rest1EndTime],
    [detail.rest2StartTime, detail.rest2EndTime],
    [detail.rest3StartTime, detail.rest3EndTime],
    [detail.rest4StartTime, detail.rest4EndTime],
    [detail.rest5StartTime, detail.rest5EndTime],
  ];
  restTimes.forEach(([startTime, endTime], idx) => {
    if (startTime !== null && endTime !== null) {
      fields.push({
        label: `${msg().Admin_Lbl_WorkingTypeRest}${idx + 1}`,
        value: TimeUtil.formatTimeRange(startTime, endTime),
      });
    }
  });
  fields.push({
    label: msg().Att_Lbl_Remarks,
    value: detail.remarks || '',
  });
  return fields;
};

const formatAsPatternDiscretionRequest = (detail: PatternRequest) => {
  const fields = [
    {
      label: msg().Appr_Lbl_RequestType,
      value: detail.typeLabel,
    },
    {
      label: msg().Att_Lbl_Period,
      value: getPeriod(detail),
    },
  ];
  if (detail.requestDayType === 'Workday') {
    fields.push({
      label: msg().Att_Lbl_ChangeDayType,
      value: msg().Att_Lbl_ChangeToWorkday,
    });
  } else if (detail.requestDayType === 'Holiday') {
    fields.push({
      label: msg().Att_Lbl_ChangeDayType,
      value: msg().Att_Lbl_ChangeToHoliday,
    });
  }
  if (detail.requestDayType !== 'Holiday') {
    fields.push(
      {
        label: msg().Att_Lbl_WorkingPattern,
        value: showPatternName(detail),
      },
      {
        label: msg().Admin_Lbl_WorkingHoursCriterion,
        value: TimeUtil.formatTimeRange(detail.startTime, detail.endTime),
      }
    );
  }
  const restTimes = [
    [detail.rest1StartTime, detail.rest1EndTime],
    [detail.rest2StartTime, detail.rest2EndTime],
    [detail.rest3StartTime, detail.rest3EndTime],
    [detail.rest4StartTime, detail.rest4EndTime],
    [detail.rest5StartTime, detail.rest5EndTime],
  ];
  restTimes.forEach(([startTime, endTime], idx) => {
    if (startTime !== null && endTime !== null) {
      fields.push({
        label: `${msg().Admin_Lbl_WorkingTypeRest}${idx + 1}`,
        value: TimeUtil.formatTimeRange(startTime, endTime),
      });
    }
  });
  fields.push({
    label: msg().Att_Lbl_Remarks,
    value: detail.remarks || '',
  });
  return fields;
};

const formatAsPatternManagerRequest = (detail: PatternRequest) => {
  const fields = [
    {
      label: msg().Appr_Lbl_RequestType,
      value: detail.typeLabel,
    },
    {
      label: msg().Att_Lbl_Period,
      value: getPeriod(detail),
    },
  ];
  if (detail.requestDayType === 'Workday') {
    fields.push({
      label: msg().Att_Lbl_ChangeDayType,
      value: msg().Att_Lbl_ChangeToWorkday,
    });
  } else if (detail.requestDayType === 'Holiday') {
    fields.push({
      label: msg().Att_Lbl_ChangeDayType,
      value: msg().Att_Lbl_ChangeToHoliday,
    });
  }
  if (detail.requestDayType !== 'Holiday' && !detail.isDirectInputTimeRequest) {
    fields.push(
      {
        label: msg().Att_Lbl_WorkingPattern,
        value: showPatternName(detail),
      },
      {
        label: msg().Admin_Lbl_WorkingHoursCriterion,
        value: TimeUtil.formatTimeRange(detail.startTime, detail.endTime),
      }
    );
  }
  const restTimes = [
    [detail.rest1StartTime, detail.rest1EndTime],
    [detail.rest2StartTime, detail.rest2EndTime],
    [detail.rest3StartTime, detail.rest3EndTime],
    [detail.rest4StartTime, detail.rest4EndTime],
    [detail.rest5StartTime, detail.rest5EndTime],
  ];
  restTimes.forEach(([startTime, endTime], idx) => {
    if (startTime !== null && endTime !== null) {
      fields.push({
        label: `${msg().Admin_Lbl_WorkingTypeRestCriterion}${idx + 1}`,
        value: TimeUtil.formatTimeRange(startTime, endTime),
      });
    }
  });
  fields.push({
    label: msg().Att_Lbl_Remarks,
    value: detail.remarks || '',
  });
  return fields;
};

const workSystemForCheck = (patternUse: PatternRequest) => {
  if (
    patternUse.workSystem === 'JP:Modified' ||
    patternUse.workSystem === 'JP:Fix'
  ) {
    return formatAsPatternRequest(patternUse);
  } else if (
    patternUse.workSystem === 'JP:Flex' &&
    patternUse.withoutCoreTime === false
  ) {
    return formatAsPatternFlexRequest(patternUse);
  } else if (
    patternUse.workSystem === 'JP:Flex' &&
    patternUse.withoutCoreTime === true
  ) {
    return formatAsPatternFlexWithoutCoreTimeRequest(patternUse);
  } else if (patternUse.workSystem === 'JP:Discretion') {
    return formatAsPatternDiscretionRequest(patternUse);
  } else {
    return formatAsPatternManagerRequest(patternUse);
  }
};

export const detailListSelector = createSelector(
  (state): AttDailyRequestDetail => state as AttDailyRequestDetail,
  (detail: AttDailyRequestDetail) => {
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
      T extends AttDailyRequestDetail['originalRequest']
    >(
      r: any
    ): T => {
      return r as T;
    };

    const request = detail.request;
    switch (request.type) {
      case REQUEST_TYPE.Leave:
        return formatAsLeaveRequest(
          request as LeaveRequest,
          refineOrigianlRequest(detail.originalRequest)
        );
      case REQUEST_TYPE.HolidayWork:
        return formatAsHolidayWorkRequest(
          request as HolidayWorkRequest,
          refineOrigianlRequest(detail.originalRequest)
        );
      case REQUEST_TYPE.EarlyStartWork:
        return formatAsEarlyStartWorkRequest(request as EarlyStartWorkRequest);
      case REQUEST_TYPE.OvertimeWork:
        return formatAsOvertimeWorkRequest(request as OvertimeWorkRequest);
      case REQUEST_TYPE.LateArrival:
        return formatAsLateArrivalRequest(request as LateArrivalRequest);
      case REQUEST_TYPE.EarlyLeave:
        return formatAsEarlyLeaveRequest(request as EarlyLeaveRequest);
      case REQUEST_TYPE.Absence:
        return formatAsAbsenceRequest(request as AbsenceRequest);
      case REQUEST_TYPE.Direct:
        return formatAsDirectRequest(request as DirectRequest);
      case REQUEST_TYPE.Pattern:
        return workSystemForCheck(request as PatternRequest);
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
