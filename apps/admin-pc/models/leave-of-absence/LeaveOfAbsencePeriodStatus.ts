import Api from '../../../commons/api';
import DateUtil from '../../../commons/utils/DateUtil';

export type LeaveOfAbsencePeriodStatus = {
  id?: string;
  leaveOfAbsenceId: string;
  leaveOfAbsenceName?: string;
  validDateFrom: string;
  validDateThrough: string;
  validDateFrom2?: string;
  validDateThrough2?: string;
  validDateThroughMax?: string;
  comment: string;
};

type FromRemote = {
  id: string;
  leaveOfAbsenceId: string;
  leaveOfAbsence: {
    name: string;
  };
  validDateFrom: string;
  validDateTo: string;
  validDateFrom2?: string;
  validDateTo2?: string;
  comment: string;
};

type ToRemote = {
  id?: string;
  leaveOfAbsenceId: string;
  validDateFrom: string;
  validDateTo: string;
  validDateFrom2?: string;
  validDateTo2?: string;
  comment: string;
};

export const create = (): LeaveOfAbsencePeriodStatus => ({
  leaveOfAbsenceId: '',
  validDateFrom: '',
  validDateThrough: '',
  validDateFrom2: '',
  validDateThrough2: '',
  comment: '',
});

const convertFromRemote = (src: FromRemote): LeaveOfAbsencePeriodStatus => ({
  id: src.id,
  leaveOfAbsenceId: src.leaveOfAbsenceId,
  leaveOfAbsenceName: src.leaveOfAbsence.name,
  validDateFrom: src.validDateFrom,
  validDateThrough: DateUtil.addDays(src.validDateTo, -1),
  validDateFrom2: src.validDateFrom2,
  validDateThrough2: DateUtil.addDays(src.validDateTo2, -1),
  validDateThroughMax:
    DateUtil.addDays(src.validDateTo2, -1) !== ''
      ? DateUtil.addDays(src.validDateTo2, -1)
      : DateUtil.addDays(src.validDateTo, -1),
  comment: src.comment,
});

const convertToRemote = (src: LeaveOfAbsencePeriodStatus): ToRemote => {
  const result: ToRemote = {
    leaveOfAbsenceId: src.leaveOfAbsenceId,
    validDateFrom: src.validDateFrom,
    validDateTo: DateUtil.addDays(src.validDateThrough, 1),
    comment: src.comment,
  };

  if (src.id !== null && src.id !== undefined && src.id !== '') {
    result.id = src.id;
  }

  if (
    DateUtil.formatISO8601Date(src.validDateFrom2) !== '' &&
    DateUtil.addDays(src.validDateThrough2, 1) !== ''
  ) {
    result.validDateFrom2 = DateUtil.formatISO8601Date(src.validDateFrom2);
    result.validDateTo2 = DateUtil.addDays(src.validDateThrough2, 1);
  }

  return result;
};

export const save = (
  employeeId: string,
  periodStatus: LeaveOfAbsencePeriodStatus
): Promise<string> =>
  Api.invoke({
    path: '/att/period-status/leave-of-absence/create',
    param: { employeeId, ...convertToRemote(periodStatus) },
  });

export const update = (
  employeeId: string,
  periodStatus: LeaveOfAbsencePeriodStatus
): Promise<string> =>
  Api.invoke({
    path: '/att/period-status/leave-of-absence/update',
    param: { employeeId, ...convertToRemote(periodStatus) },
  });

export const del = (
  periodStatus: LeaveOfAbsencePeriodStatus
): Promise<string> =>
  Api.invoke({
    path: '/att/period-status/leave-of-absence/delete',
    param: { id: periodStatus.id },
  });

export const fetchByEmployeeId = (
  employeeId: string
): Promise<LeaveOfAbsencePeriodStatus[]> =>
  Api.invoke({
    path: '/att/period-status/leave-of-absence/list',
    param: { employeeId },
  }).then((res) => res.records.map(convertFromRemote));
