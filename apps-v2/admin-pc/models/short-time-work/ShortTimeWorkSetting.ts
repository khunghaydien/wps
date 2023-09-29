import Api from '../../../commons/api';

export type ShortTimeWorkSetting = {
  id: string;
  name: string;
  workSystem: 'JP:Fix' | 'JP:Flex' | 'JP:Modified';
};

export type FetchQuery = {
  id?: string;
  companyId?: string;
  targetDate?: string;
  employeeId?: string;
};

export const fetch = (param: FetchQuery): Promise<ShortTimeWorkSetting[]> =>
  Api.invoke({
    path: '/att/short-time-work-setting/search',
    param,
  }).then((res) => res.records);

export default { fetch };
