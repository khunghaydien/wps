import Api from '../../../commons/api';

export type LeaveOfAbsence = {
  id: string;
  name: string;
};

export type FetchQuery = {
  id?: string;
  companyId?: string;
};

export const fetch = (param: FetchQuery): Promise<LeaveOfAbsence[]> =>
  Api.invoke({
    path: '/att/leave-of-absence/search',
    param,
  }).then((res) => res.records);

export default { fetch };
