import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import msg from '../../commons/languages';
import { getUserSetting } from '@apps/commons/actions/userSetting';

import { AppDispatch } from '../modules/AppThunk';
import { actions as talentProfileActions } from '@apps/domain/modules/psa/capabilityInfo';

import { listCategory } from '@apps/admin-pc/actions/category';

export default (dispatch: AppDispatch) => ({
  initialize: async () => {
    dispatch(loadingStart());

    try {
      const userSetting = await dispatch(
        getUserSetting({
          detailSelectors: ['DEPARTMENT', 'MANAGER'],
        })
      );

      const empId =
        userSetting && userSetting.employeeId ? userSetting.employeeId : '';
      const companyId =
        userSetting && userSetting.companyId ? userSetting.companyId : '';
      if (empId === '') {
        // @ts-ignore
        throw new Error({
          errorCode: '',
          message: msg().Psa_Lbl_InitEmpSettingNotCompleted,
          stackTrace: null,
        });
      }

      if (userSetting && !userSetting.usePsa) {
        const error = {
          errorCode: 'PSA_CANNOT_USE',
          message: msg().Psa_Msg_CantUsePsa,
          stackTrace: null,
        };
        throw error;
      }
      dispatch(listCategory({ companyId }));
      dispatch(talentProfileActions.get(empId));
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
