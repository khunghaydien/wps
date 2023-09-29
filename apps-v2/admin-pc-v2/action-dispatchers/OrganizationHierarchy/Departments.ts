import { bindActionCreators } from 'redux';

import { confirm } from '@commons/actions/app';
import msg from '@commons/languages';

import {
  actions as dialogActions,
  DIALOG_STATE,
} from '@admin-pc-v2/modules/departmentManager/ui/dialog';

import { AppDispatch } from '@admin-pc/action-dispatchers/AppThunk';
import { getChildDepartments } from '@admin-pc-v2/action-dispatchers/department/Detail';
import { searchDepartmentByQuery } from '@admin-pc-v2/action-dispatchers/employee/Detail';
import {
  addDepartment,
  removeDepartment,
} from '@apps/admin-pc/actions/organizationHierarchy';

type IgnoreBinding<
  T extends (...args: unknown[]) => (...args: unknown[]) => unknown
> = (...args: Parameters<T>) => ReturnType<ReturnType<T>>;

export default (dispatch: AppDispatch) => ({
  ...bindActionCreators(
    {
      getChildDepartments: getChildDepartments as unknown as IgnoreBinding<
        typeof getChildDepartments
      >,
      searchDepartment: searchDepartmentByQuery,
      addDepartment: addDepartment as unknown as IgnoreBinding<
        typeof addDepartment
      >,
    },
    dispatch
  ),
  openDeptManagerDialog: () =>
    dispatch(dialogActions.set(DIALOG_STATE.DEPT_MANAGER)),
  removeDepartment: async (deptHierarchyId: string) => {
    const result = await dispatch(confirm(msg().Admin_Msg_ConfirmDelete));
    if (result) {
      const removeResponse = await dispatch(
        removeDepartment({ id: deptHierarchyId })
      );
      // in case the node has been removed successfully, it returns true as response resolution
      if (removeResponse === undefined) return Promise.resolve(true);
    } else return Promise.resolve(false);
  },
});
