import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import { getUserSetting } from '@apps/commons/actions/userSetting';
import msg from '@apps/commons/languages';

import {
  makeInitialRequestListFilterState,
  RoleRequestListFilterState,
} from '@apps/domain/models/psa/Request';
import { UserSetting } from '@apps/domain/models/UserSetting';

import { actions as psaGroupActions } from '@apps/domain/modules/psa/psaGroup';
import { actions as requestActions } from '@apps/domain/modules/psa/request';
import { actions as psaSettingActions } from '@apps/domain/modules/psa/setting';
import { actions as departmentListActions } from '@apps/psa-pc/modules/entities/departmentList';
import { actions as requestSelectionFilterActions } from '@resource/modules/ui/filter/requestSelection';
import { actions as roleRequestFilterActions } from '@resource/modules/ui/filter/roleRequest';

import { searchJobGrade } from '@apps/admin-pc/actions/jobGrade';

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

    // YYYY-MM-DD format
    const today = new Date().toISOString().slice(0, 10);
    dispatch(departmentListActions.list(companyId, today));

    const psaGroupList = await dispatch(psaGroupActions.list(companyId, 'RM'));
    const psaGroupId =
      psaGroupList.payload.groupList.length > 0
        ? psaGroupList.payload.groupList[0].id
        : '';

    const initialFilterState: RoleRequestListFilterState =
      makeInitialRequestListFilterState(userSetting.employeeName);

    if (psaGroupId !== '') {
      const requestList = await dispatch(
        requestActions.list(companyId, 1, psaGroupId, initialFilterState)
      );
      if (requestList.length === 0) {
        dispatch(requestActions.initialize());
      }
      dispatch(searchJobGrade({ companyId, psaGroupId }));
    } else {
      dispatch(requestActions.initialize());
    }
    dispatch(psaSettingActions.get(companyId));
    dispatch(roleRequestFilterActions.update(initialFilterState));
    dispatch(requestSelectionFilterActions.update(initialFilterState));
  } catch (err) {
    dispatch(catchApiError(err, { isContinuable: false }));
  } finally {
    dispatch(loadingEnd());
  }
};
