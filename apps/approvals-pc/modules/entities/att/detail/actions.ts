import * as constants from './constants';

import * as appActions from '../../../../../commons/actions/app';
import Api from '../../../../../commons/api';

const fetchSuccess = (res) => ({
  type: constants.FETCH_SUCCESS,
  payload: res,
});

// eslint-disable-next-line import/prefer-default-export
export const browse = (id) => (dispatch) => {
  dispatch(appActions.loadingStart());
  const req = {
    path: '/att/request/daily/get',
    param: { requestId: id },
  };

  return Api.invoke(req)
    .then((res) => {
      dispatch(fetchSuccess(res));
    })
    .catch((err) =>
      dispatch(appActions.catchApiError(err, { isContinuable: false }))
    )
    .then(() => dispatch(appActions.loadingEnd()));
};
