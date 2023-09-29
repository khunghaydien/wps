import Api from '@commons/api';
import DateUtil from '@commons/utils/DateUtil';

import { OrganizationHierarchyHistory } from '@apps/domain/models/organization/OrganizationHierarchy';

// @see https://teamspiritdev.atlassian.net/l/cp/BSSQtinz
type FetchHistoriesAPI = (arg0: {
  path: '/department/hierarchy/history/list';
  param: { hierarchyPtnId: string };
}) => Promise<{
  records: Array<{
    id: string;
    hierarchyPatternId: string;
    validFrom: string;
    validTo: string;
    comment: string;
  }>;
}>;

// @see https://teamspiritdev.atlassian.net/l/cp/9YiwPDej
type CreateHistoryAPI = (arg0: {
  path: '/department/hierarchy/history/create';
  param: {
    hierarchyPtnId: string;
    validFrom: string;
    comment?: string;
  };
}) => Promise<{
  id: string;
  rootDepartment: {
    id: string;
    parentChildId: string;
    name: string;
    nameL0: string;
    nameL1: string;
    nameL2: string;
    companyId: string;
    code: string;
    validFrom: string;
    validTo: string;
    hasChildren: boolean;
  } | null;
}>;

// @see https://teamspiritdev.atlassian.net/l/cp/Ag4S81Z0
type DeleteHistoryAPI = (arg0: {
  path: '/department/hierarchy/history/delete';
  param: { id: string };
}) => Promise<void>;

const Repository = {
  fetchHistories: async (param: {
    hierarchyPtnId: string;
  }): Promise<OrganizationHierarchyHistory[]> => {
    const response = await (Api.invoke as FetchHistoriesAPI)({
      path: '/department/hierarchy/history/list',
      param,
    });
    return response.records.map((record) => ({
      ...record,
      comment: record.comment || '',
      validDateFrom: record.validFrom,
      validDateTo: DateUtil.addDays(record.validTo, -1),
    }));
  },

  createHistory: async (param: {
    hierarchyPtnId: string;
    validFrom: string;
    comment: string;
  }) => {
    const { id, rootDepartment } = await (Api.invoke as CreateHistoryAPI)({
      path: '/department/hierarchy/history/create',
      param,
    });
    return {
      id,
      rootDepartment: rootDepartment && {
        ...rootDepartment,
        validTo: DateUtil.addDays(rootDepartment.validTo, -1),
      },
    };
  },

  deleteHistory: async (param: { id: string }) =>
    (Api.invoke as DeleteHistoryAPI)({
      path: '/department/hierarchy/history/delete',
      param,
    }),
};

export default Repository;
