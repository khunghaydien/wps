import { Dispatch } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import { getUserSetting } from '@apps/commons/actions/userSetting';
import msg from '@apps/commons/languages';

import { PsaPermissionType } from '@apps/domain/models/psa/PsaAccess';
import {
  makeInitialRequestListFilterState,
  RoleRequestListFilterState,
} from '@apps/domain/models/psa/Request';
import { UserSetting } from '@apps/domain/models/UserSetting';

import { actions as psaAccessSettingActions } from '@apps/domain/modules/psa/access';
import { actions as requestActions } from '@apps/domain/modules/psa/request';
import { actions as departmentListActions } from '@apps/psa-pc/modules/entities/departmentList';
import { actions as requestSelectionFilterActions } from '@resource/modules/ui/filter/requestSelection';
import { actions as roleRequestFilterActions } from '@resource/modules/ui/filter/roleRequest';

import { searchJobGrade } from '@apps/admin-pc/actions/jobGrade';

// eslint-disable-next-line import/prefer-default-export
export const initialize = () => async (dispatch: Dispatch<any>) => {
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

    const initialFilterState: RoleRequestListFilterState =
      makeInitialRequestListFilterState(userSetting.employeeName);

    const requestList = await dispatch(
      requestActions.list(companyId, 1, initialFilterState)
    );
    dispatch(searchJobGrade({ companyId }));
    dispatch(roleRequestFilterActions.update(initialFilterState));
    dispatch(requestSelectionFilterActions.update(initialFilterState));

    if (requestList.length === 0) {
      dispatch(requestActions.initialize());
    }
  } catch (err) {
    dispatch(catchApiError(err, { isContinuable: false }));
  } finally {
    dispatch(loadingEnd());
  }
};
