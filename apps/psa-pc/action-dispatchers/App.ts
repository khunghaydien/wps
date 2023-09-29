import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import { getUserSetting } from '@apps/commons/actions/userSetting';
import msg from '@apps/commons/languages';

import {
  initialProjectListFilterState,
  searchEmployeeList,
} from '@apps/domain/models/psa/Project';
import { PsaPermissionType } from '@apps/domain/models/psa/PsaAccess';
import { UserSetting } from '@apps/domain/models/UserSetting';

import { actions as departmentListActions } from '../modules/entities/departmentList';
import { actions as calendarActions } from '@apps/admin-pc/modules/calendar/entities/calendarList';
import { actions as psaAccessSettingActions } from '@apps/domain/modules/psa/access';
import { actions as projectActions } from '@apps/domain/modules/psa/project';
import { actions as psaGroupActions } from '@apps/domain/modules/psa/psaGroup';
import { actions as psaSettingActions } from '@apps/domain/modules/psa/setting';
import { actions as filterActions } from '@psa/modules/ui/filter/project';

import { SEARCH_EMPLOYEE } from '@apps/admin-pc/actions/employee';

import { AppDispatch } from './AppThunk';

// eslint-disable-next-line import/prefer-default-export
export const initialize = () => async (dispatch: AppDispatch) => {
  dispatch(loadingStart());

  try {
    // @ts-ignore
    // Cast (void | UserSetting) to UserSetting
    const userSetting: UserSetting = await dispatch(
      getUserSetting({ detailSelectors: ['DEPARTMENT'] })
    );
    const { companyId = '', employeeId = '' } = userSetting;
    if (employeeId === '') {
      // @ts-ignore
      throw new Error({
        errorCode: '',
        message: msg().Psa_Lbl_InitEmpSettingNotCompleted,
        stackTrace: null,
      });
    }

    if (userSetting.usePsa === false) {
      const error = {
        errorCode: 'PSA_CANNOT_USE',
        message: msg().Psa_Msg_CantUsePsa,
        stackTrace: null,
      };
      throw error;
    }
    const psaGroupList = await dispatch(psaGroupActions.list(companyId, 'PM'));
    const psaGroupId =
      psaGroupList.payload.groupList.length > 0
        ? psaGroupList.payload.groupList[0].id
        : '';
    if (psaGroupId !== '') {
      const employeeFullName = userSetting.employeeName;
      searchEmployeeList(companyId, employeeFullName, psaGroupId).then(
        (response) => {
          dispatch({
            type: SEARCH_EMPLOYEE,
            payload: response.records,
          });
        }
      );

      // YYYY-MM-DD format
      const today = new Date().toISOString().slice(0, 10);
      dispatch(departmentListActions.list(companyId, today));

      const psaPermissions: Array<PsaPermissionType> = [
        'CONFIRM_PROJECT_ROLES',
        'UPLOAD_PROJECT_ROLES',
      ];
      dispatch(
        psaAccessSettingActions.get(employeeId, psaPermissions, psaGroupId)
      );
      dispatch(psaSettingActions.get(companyId));
      dispatch(calendarActions.fetch(companyId));
      dispatch(
        filterActions.update(initialProjectListFilterState(employeeFullName))
      );
      const projectList = await dispatch(
        projectActions.list(
          companyId,
          1,
          psaGroupId,
          initialProjectListFilterState(employeeFullName)
        )
      );
      if (projectList.payload.length === 0) {
        dispatch(projectActions.initialize());
      }
    } else {
      dispatch(projectActions.initialize());
    }
  } catch (err) {
    dispatch(catchApiError(err, { isContinuable: false }));
  } finally {
    dispatch(loadingEnd());
  }
};
