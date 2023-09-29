import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';

import { AppDispatch } from '../modules/AppThunk';
import { actions as talentProfileActions } from '@apps/domain/modules/psa/capabilityInfo';

import { updateTalentProfile } from '@apps/admin-pc/actions/talentProfile';

export const saveProfile =
  (talentProfile: any) => async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      await dispatch(updateTalentProfile(talentProfile));
      await dispatch(talentProfileActions.get(talentProfile.empId));
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };
