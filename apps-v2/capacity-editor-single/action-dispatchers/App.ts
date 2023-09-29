import { getUserSetting } from '../../commons/actions/userSetting';
import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import { actions as availabilityActions } from '../modules/ui/capacityEditorResourceAvailabilities';

import { searchPsaWorkScheme } from '@apps/admin-pc/actions/psaWorkScheme';
import { searchWorkArrangement } from '@apps/admin-pc/actions/workArrangement';

import { AppDispatch } from './AppThunk';

export const initialize =
  (availableId: string) => async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      const userSettingResult: any = await dispatch(getUserSetting());
      dispatch(searchPsaWorkScheme({ companyId: userSettingResult.companyId }));
      dispatch(
        searchWorkArrangement({ companyId: userSettingResult.companyId })
      );
      dispatch(availabilityActions.get(availableId.split(',')));
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: false }));
    } finally {
      dispatch(loadingEnd());
    }
  };
