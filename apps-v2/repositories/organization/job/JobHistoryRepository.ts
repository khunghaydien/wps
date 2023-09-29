import Api from '../../../commons/api';
import DateUtil from '@apps/commons/utils/DateUtil';

type JobHistory = {
  records: Array<{
    id: string;
    baseId: string;
    jobTypeId: string;
    jobType: {
      id: string;
      name: string;
      code: string;
    };
    validDateFrom: string;
    validDateTo: string;
    isDirectCharged: boolean;
    isScopedAssignment: boolean;
    comment: string;
  }>;
};

export default {
  create: async (param: {
    baseId: string;
    comment?: string;
    validDateFrom?: string;
    validDateTo?: string;
    jobTypeId?: string;
    isScopedAssignment?: boolean;
  }): Promise<{ id: string }> => {
    const param_ =
      'validDateTo' in param
        ? {
            ...param,
            validDateTo: DateUtil.addDays(param.validDateTo, 1) || null,
          }
        : param;

    const response = await Api.invoke({
      path: '/job/history/create',
      param: param_,
    });

    return response as { id: string };
  },
  search: async (param: {
    id?: string;
    baseId?: string;
  }): Promise<JobHistory> => {
    const response = await Api.invoke({
      path: '/job/history/search',
      param,
    });

    return {
      records: (response.records || []).map((record) =>
        'validDateTo' in record
          ? {
              ...record,
              validDateTo: DateUtil.addDays(record.validDateTo, -1),
            }
          : record
      ),
    } as JobHistory;
  },
  delete: async (param: { id: string }): Promise<void> => {
    await Api.invoke({
      path: '/job/history/delete',
      param,
    });
  },
};
