import Api from '../../../commons/api';

import { MasterEmployeeBase } from '../../../domain/models/organization/MasterEmployeeBase';
import { MasterEmployeeHistory } from '../../../domain/models/organization/MasterEmployeeHistory';

import { convertFromRemoteFormat } from '../../../admin-pc/actions/base';

export default {
  /**
   * Execute to get employee's base record.
   */
  fetchBase: async (id: string): Promise<MasterEmployeeBase> => {
    const result: MasterEmployeeBase = await Api.invoke({
      path: '/employee/base/get',
      param: {
        id,
      },
    });
    return result;
  },

  /**
   * Execute to get employee's histories record.
   */
  fetchHistories: async (baseId: string): Promise<MasterEmployeeHistory[]> => {
    const { records }: { records: MasterEmployeeHistory[] } = await Api.invoke({
      path: '/employee/history/search',
      param: {
        baseId,
      },
    });
    // FIXME: We want to use adapter instead of `convertFromRemoteFormat()`.
    // Because `convertFromRemoteFormat` is depend on `admin-pc`.
    // But we don't have times.(Need change type to something from FIELD_VALID_DATE in `admin-pc/constants/configList/employee.js`)
    return (records || []).map(convertFromRemoteFormat);
  },

  /**
   * Execute to get employee's histories record for V2
   */
  fetchHistoriesV2: async (
    baseId: string,
    includeRetired: boolean
  ): Promise<MasterEmployeeHistory[]> => {
    const { records }: { records: MasterEmployeeHistory[] } = await Api.invoke({
      path: '/employee/history/search',
      param: {
        baseId,
        includeRetired,
      },
    });
    return (records || []).map(convertFromRemoteFormat);
  },
};

export const REVISION_TYPE_V2 = {
  NewlyCreated: 'NewlyCreated',
  Revision: 'Revision',
  Leave: 'Leave',
  Resignation: 'Retirement',
};
