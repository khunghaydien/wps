import * as constants from './constants';

import * as appActions from '../../../../../commons/actions/app';

import AttDailyRequestRepository from '@apps/repositories/approval/AttDailyRequestRepository';

const fetchSuccess = (res) => ({
  type: constants.FETCH_SUCCESS,
  payload: res,
});

// eslint-disable-next-line import/prefer-default-export
export const browse = (id: string) => (dispatch) => {
  dispatch(appActions.loadingStart());

  return AttDailyRequestRepository.fetch(id)
    .then((res) => {
      dispatch(fetchSuccess(res));
    })
    .catch((err) =>
      dispatch(appActions.catchApiError(err, { isContinuable: false }))
    )
    .then(() => dispatch(appActions.loadingEnd()));
};
