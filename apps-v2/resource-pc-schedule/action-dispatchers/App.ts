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

import Resource from './Resource';

export default (dispatch: AppDispatch) => ({
  initialize: async () => {
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
          detailSelectors: ['DEPARTMENT', 'MANAGER'],
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
      const resource = Resource(dispatch);
      resource.setView({
        bookedTimePerDay: [role.assignment.bookedTimePerDay],
        nextStartDate: role.assignment.startDate,
      });
    } catch (err) {
      dispatch(
        catchApiError(err, {
          isContinuable: false,
        })
      );
    } finally {
      dispatch(loadingEnd());
    }
  },
});
