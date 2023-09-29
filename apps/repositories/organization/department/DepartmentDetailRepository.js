// @flow

import Api from '../../../commons/api';

import { type MasterDepartmentBase } from '../../../domain/models/organization/MasterDepartmentBase';
import {
  type HierarchyDisplayObject,
  type MasterDepartmentHistory,
} from '../../../domain/models/organization/MasterDepartmentHistory';

import { convertFromRemoteFormat } from '../../../admin-pc/actions/base';

export default {
  /**
   * Execute to get department's base record.
   */
  fetchBase: async (id: string): Promise<MasterDepartmentBase> => {
    const result: MasterDepartmentBase = await Api.invoke({
      path: '/department/base/get',
      param: {
        id,
      },
    });
    return result;
  },
  /**
   * Execute to get department's histories record.
   */
  fetchHistories: async (
    baseId: string
  ): Promise<MasterDepartmentHistory[]> => {
    const { records }: { records: MasterDepartmentHistory[] } =
      await Api.invoke({
        path: '/department/history/search',
        param: {
          baseId,
        },
      });
    return (records || {}).map(convertFromRemoteFormat);
  },

  /**
   * Execute to get department's child list.
   */
  getChildDepartments: async (
    orgPatternId: string,
    targetDate: string,
    deptId: ?string
  ): Promise<HierarchyDisplayObject[]> => {
    const { departmentList } = await Api.invoke({
      path: '/department/hierarchy/child/search',
      param: {
        hierarchyPtnId: orgPatternId,
        targetDate,
        deptId,
      },
    });
    return (departmentList || []).map(
      ({ id, parentChildId, name, hasChildren, validFrom, validTo }) => ({
        id,
        parentChildId,
        name,
        hasChildren,
        validFrom,
        validTo,
      })
    );
  },
};
