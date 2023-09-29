import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import { getUserSetting } from '../../commons/actions/userSetting';
import msg from '../../commons/languages';
import UrlUtil from '../../commons/utils/UrlUtil';

import { AppDispatch } from '../modules/AppThunk';
import { actions as roleActions } from '../modules/entities/role';
import { actions as siteRouteActions } from '../modules/ui/siteRoute';
import { actions as psaGroupActions } from '@apps/domain/modules/psa/psaGroup';

import setScheduleView from './Resource';

export const initialize = () => async (dispatch: AppDispatch) => {
  const params = UrlUtil.getUrlQuery();
  const roleId = params && params.roleId;

  if (!roleId) {
    // @ts-ignore
    throw new Error({
      errorCode: '',
      message: msg().Psa_Err_AssignmentInformationNotFound,
      stackTrace: null,
    });
  }

  dispatch(loadingStart());

  try {
    const userSetting = await dispatch(
      getUserSetting({
        detailSelectors: ['DEPARTMENT'],
      })
    );

    // @ts-ignore
    // FIXME: userSetting is nullable. Write userSetting && userSetting.employeeId
    if (userSetting.employeeId === '') {
      // @ts-ignore
      throw new Error({
        errorCode: '',
        message: msg().Psa_Lbl_InitEmpSettingNotCompleted,
        stackTrace: null,
      });
    }
    // @ts-ignore
    // FIXME: userSetting is nullable. Write userSetting && userSetting.usePsa
    if (!userSetting.usePsa) {
      const error = {
        errorCode: 'PSA_CANNOT_USE',
        message: msg().Psa_Msg_CantUsePsa,
        stackTrace: null,
      };
      throw error;
    }

    const role = await dispatch(roleActions.get(roleId));
    await dispatch(
      setScheduleView({
        page: 0,
        bookedTimePerDay: [role.assignment.bookedTimePerDay],
        view: 'day',
        nextStartDate: role.assignment.startDate,
        roleStartDate: role.startDate,
      })
    );

    const psaGroupList = await dispatch(
      psaGroupActions.listByPsaGroupId(
        // @ts-ignore
        userSetting.companyId,
        'PM',
        role.psaGroupId,
        // @ts-ignore
        userSetting.employeeId
      )
    );
    if (
      psaGroupList.payload.selectedGroup &&
      psaGroupList.payload.selectedGroup.allowSelfReschedule &&
      (role.status === 'Confirmed' || role.status === 'InProgress')
    ) {
      dispatch(siteRouteActions.showSelfReschedule());
    } else {
      dispatch(siteRouteActions.showScheduleDetails());
    }
  } catch (err) {
    dispatch(
      catchApiError(err, {
        isContinuable: false,
      })
    );
  } finally {
    dispatch(loadingEnd());
  }
};
