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

import { actions as calendarActions } from '@apps/admin-pc/modules/calendar/entities/calendarList';
import { actions as psaAccessSettingActions } from '@apps/domain/modules/psa/access';
import { actions as projectActions } from '@apps/domain/modules/psa/project';
import { actions as psaSettingActions } from '@apps/domain/modules/psa/setting';
import { actions as customHintActions } from '@psa/modules/entities/customHint';
import { actions as departmentListActions } from '@psa/modules/entities/departmentList';
import { actions as filterActions } from '@psa/modules/ui/filter/project';

import { SEARCH_EMPLOYEE } from '@apps/admin-pc/actions/employee';
import { fetchProjectFromUrl } from '@psa/action-dispatchers/Project';

import { AppDispatch } from './AppThunk';

// eslint-disable-next-line import/prefer-default-export
export const initialize =
  (projectId?: string) => async (dispatch: AppDispatch) => {
    dispatch(loadingStart());

    try {
      // @ts-ignore
      // Cast (void | UserSetting) to UserSetting
      const userSetting: UserSetting = await dispatch(
        getUserSetting({ detailSelectors: ['DEPARTMENT', 'MANAGER'] })
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
      if (projectId && projectId !== '' && userSetting.isPM) {
        dispatch(fetchProjectFromUrl(projectId));
      }

      const employeeFullName = userSetting.employeeName;
      searchEmployeeList(companyId, employeeFullName).then((response) => {
        dispatch({
          type: SEARCH_EMPLOYEE,
          payload: response.records,
        });
      });

      // YYYY-MM-DD format
      const today = new Date().toISOString().slice(0, 10);
      dispatch(departmentListActions.list(companyId, today));

      const psaPermissions: Array<PsaPermissionType> = [
        'CONFIRM_PROJECT_ROLES',
        'UPLOAD_PROJECT_ROLES',
        'ASSIGN_PROJECT_ROLES',
        'CANCEL_PROJECT_ROLES',
        'RESCHEDULE_PROJECT_ROLES',
        'WITHDRAW_PROJECT_ROLES',
      ];
      dispatch(psaAccessSettingActions.get(employeeId, psaPermissions));
      dispatch(psaSettingActions.get(companyId));

      dispatch(calendarActions.fetch(companyId));
      dispatch(
        filterActions.update(initialProjectListFilterState(employeeFullName))
      );
      dispatch(customHintActions.get(companyId));

      const projectList = await dispatch(
        projectActions.list(
          companyId,
          1,
          initialProjectListFilterState(employeeFullName)
        )
      );

      if (projectList.payload.length === 0) {
        dispatch(projectActions.initialize());
      }
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: false }));
    } finally {
      dispatch(loadingEnd());
    }
  };
