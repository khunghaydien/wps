import Api from '../../../commons/api';
import DateUtil from '../../../commons/utils/DateUtil';

import { ShortTimeWorkSetting } from './ShortTimeWorkSetting';

export type ShortTimeWorkPeriodStatus = {
  id?: string;
  shortTimeWorkSettingId: string;
  shortTimeWorkSettingName?: string;
  validDateFrom: string;
  validDateThrough: string;
  comment: string;
};

export type EditingShortTimeWorkPeriodStatus = ShortTimeWorkPeriodStatus & {
  shortTimeWorkSettingList?: ShortTimeWorkSetting[];
};

type FromRemote = {
  id: string;
  shortTimeWorkSettingId: string;
  shortTimeWorkSetting: {
    name: string;
  };
  validDateFrom: string;
  validDateTo: string;
  comment: string;
};

type ToRemote = {
  id?: string;
  shortTimeWorkSettingId: string;
  validDateFrom: string;
  validDateTo: string;
  comment: string;
};

export const create = (): ShortTimeWorkPeriodStatus => ({
  shortTimeWorkSettingId: '',
  validDateFrom: '',
  validDateThrough: '',
  comment: '',
});

const convertFromRemote = (src: FromRemote): ShortTimeWorkPeriodStatus => ({
  id: src.id,
  shortTimeWorkSettingId: src.shortTimeWorkSettingId,
  shortTimeWorkSettingName: src.shortTimeWorkSetting.name,
  validDateFrom: src.validDateFrom,
  validDateThrough: DateUtil.addDays(src.validDateTo, -1),
  comment: src.comment,
});

const convertToRemote = (src: EditingShortTimeWorkPeriodStatus): ToRemote => {
  const result: ToRemote = {
    shortTimeWorkSettingId: src.shortTimeWorkSettingId,
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
  periodStatus: EditingShortTimeWorkPeriodStatus
): Promise<string> =>
  Api.invoke({
    path: '/att/period-status/short-time-work-setting/create',
    param: { employeeId, ...convertToRemote(periodStatus) },
  });

export const update = (
  employeeId: string,
  periodStatus: EditingShortTimeWorkPeriodStatus
): Promise<string> =>
  Api.invoke({
    path: '/att/period-status/short-time-work-setting/update',
    param: { employeeId, ...convertToRemote(periodStatus) },
  });

export const del = (
  periodStatus: EditingShortTimeWorkPeriodStatus
): Promise<string> =>
  Api.invoke({
    path: '/att/period-status/short-time-work-setting/delete',
    param: { id: periodStatus.id },
  });

export const fetchByEmployeeId = (
  employeeId: string
): Promise<ShortTimeWorkPeriodStatus[]> =>
  Api.invoke({
    path: '/att/period-status/short-time-work-setting/list',
    param: { employeeId },
  }).then((res) => res.records.map(convertFromRemote));
