import Api from '../../../commons/api';
import DateUtil from '../../../commons/utils/DateUtil';

export type LeaveOfAbsencePeriodStatus = {
  id?: string;
  leaveOfAbsenceId: string;
  leaveOfAbsenceName?: string;
  validDateFrom: string;
  validDateThrough: string;
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
  comment: string;
};

type ToRemote = {
  id?: string;
  leaveOfAbsenceId: string;
  validDateFrom: string;
  validDateTo: string;
  comment: string;
};

export const create = (): LeaveOfAbsencePeriodStatus => ({
  leaveOfAbsenceId: '',
  validDateFrom: '',
  validDateThrough: '',
  comment: '',
});

const convertFromRemote = (src: FromRemote): LeaveOfAbsencePeriodStatus => ({
  id: src.id,
  leaveOfAbsenceId: src.leaveOfAbsenceId,
  leaveOfAbsenceName: src.leaveOfAbsence.name,
  validDateFrom: src.validDateFrom,
  validDateThrough: DateUtil.addDays(src.validDateTo, -1),
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
