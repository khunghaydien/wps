import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import { actions as capabilityInfoAction } from '@apps/domain/modules/psa/capabilityInfo';

import { AppDispatch } from './AppThunk';

const getCapabilityInfo =
  (empId: string, psaGroupId: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(capabilityInfoAction.get(empId, psaGroupId))
      .then((res) => res)
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export default getCapabilityInfo;
