import {
  isWithDeduction,
  isWithPayment,
  LeaveType,
} from '@attendance/domain/models/LeaveType';
import AttRecordModel from '@attendance/timesheet-pc/models/AttRecord';

export default (classParam: {
  ROOT: string;
  record: AttRecordModel;
  effectualAllDayLeaveType: LeaveType | null;
  isManHoursGraphOpened: boolean;
  isApprovedAbsence: boolean;
  isAllowWorkDuringLeaveOfAbsence: boolean;
}) => {
  const {
    ROOT,
    record,
    effectualAllDayLeaveType,
    isManHoursGraphOpened,
    isApprovedAbsence,
    isAllowWorkDuringLeaveOfAbsence,
  } = classParam;

  return {
    [`${ROOT}--man-hours-graph-opened`]: isManHoursGraphOpened,

    [`${ROOT}--day-type-legal-holiday`]:
      record.dayType === AttRecordModel.DAY_TYPE.LEGAL_HOLIDAY ||
      record.isHolLegalHoliday === true,
    [`${ROOT}--day-type-workday`]:
      record.dayType === AttRecordModel.DAY_TYPE.WORKDAY,
    [`${ROOT}--day-type-holiday`]:
      record.dayType === AttRecordModel.DAY_TYPE.HOLIDAY ||
      record.dayType === AttRecordModel.DAY_TYPE.PREFERRED_LEGAL_HOLIDAY,

    [`${ROOT}--leave-with-payment`]:
      effectualAllDayLeaveType !== null &&
      isWithPayment(effectualAllDayLeaveType),
    [`${ROOT}--leave-with-deduction`]:
      effectualAllDayLeaveType !== null &&
      isWithDeduction(effectualAllDayLeaveType),

    [`${ROOT}--leave-of-absence`]: record.isLeaveOfAbsence,

    [`${ROOT}--absence`]: isApprovedAbsence,

    [`${ROOT}--work-during-leave-of-absence`]: isAllowWorkDuringLeaveOfAbsence,
    [`${ROOT}--work-during-leave-of-absence-with-payment`]:
      effectualAllDayLeaveType !== null &&
      isWithPayment(effectualAllDayLeaveType),
    [`${ROOT}--work-during-leave-of-absence-with-deduction`]:
      effectualAllDayLeaveType !== null &&
      isWithDeduction(effectualAllDayLeaveType),
  };
};
