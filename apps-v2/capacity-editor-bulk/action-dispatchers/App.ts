import { fetchUserSetting } from '../../commons/actions/userSetting';
import { actions as toast } from '../../commons/modules/toast';
import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import Api from '@apps/commons/api';
import msg from '@apps/commons/languages';

import { fetchSuccessAction } from '../modules/entities/capacityEditorCompanyInfo';
import {
  fetchCapacityAction,
  fetchCapacityActionSuccess,
} from '../modules/ui/capacityEditorActions';
import {
  fetchWorkArrangement,
  fetchWorkArrangementSuccess,
} from '../modules/ui/capacityEditorWorkArrangements';
import {
  fetchWorkSchemes,
  fetchWorkSchemeSuccess,
} from '../modules/ui/capacityEditorWorkSchemes';

import { AppDispatch } from './AppThunk';

export const initialize = () => async (dispatch: AppDispatch) => {
  dispatch(loadingStart());
  try {
    const userSettingResult = await fetchUserSetting();
    dispatch(fetchSuccessAction(userSettingResult.companyId));
    const [capacityActions, workArrangementResults, workSchemeResults] =
      await Promise.all([
        fetchCapacityAction(userSettingResult.companyId),
        fetchWorkArrangement(userSettingResult.companyId),
        fetchWorkSchemes(userSettingResult.companyId),
      ]);
    dispatch(fetchWorkSchemeSuccess(workSchemeResults));
    dispatch(fetchWorkArrangementSuccess(workArrangementResults));
    dispatch(fetchCapacityActionSuccess(capacityActions));
  } catch (err) {
    dispatch(catchApiError(err, { isContinuable: true }));
  } finally {
    dispatch(loadingEnd());
  }
};

export const saveRows = (param) => async (dispatch: AppDispatch) => {
  dispatch(loadingStart());
  try {
    await Api.invoke({
      path: '/psa/capacity/bulk/save',
      param,
    });
    dispatch(toast.show(msg().Psa_Lbl_SaveSuccess));
  } catch (err) {
    dispatch(catchApiError(err, { isContinuable: true }));
  } finally {
    dispatch(loadingEnd());
  }
};
