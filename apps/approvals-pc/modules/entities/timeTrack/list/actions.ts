import * as appActions from '../../../../../commons/actions/app';
import Api from '../../../../../commons/api';

import TimeTracking from '../../../../action-dispatchers/TimeTracking';

import { constants } from './index';

const convertTracking = (requestList) => {
  let obj = {};
  requestList.forEach((req) => {
    obj = {
      [req.requestId]: {
        id: req.requestId,
        employeeName: req.employeeName,
        photoUrl: req.photoUrl,
        departmentName: req.departmentName,
        date: req.requestDate,
        startDate: req.startDate,
        endDate: req.endDate,
      },
      ...obj,
    };
  });

  return obj;
};

const convertToIds = (requestList) => {
  return requestList.map((req) => {
    return req.requestId;
  });
};

const fetchSuccess =
  (res, selectIndex = 0) =>
  (dispatch) => {
    const { requestList } = res;

    const byId = convertTracking(requestList);
    const allIds = convertToIds(requestList);

    if (allIds.length > 0) {
      TimeTracking(dispatch).fetch(allIds[selectIndex]);
    }

    dispatch({
      type: constants.FETCH_SUCCESS,
      payload: {
        byId,
        allIds,
      },
    });
  };

/* eslint-disable import/prefer-default-export */
export const browse =
  (selectIndex = 0) =>
  (dispatch) => {
    dispatch(appActions.loadingStart());
    const req = { path: '/time-track/request-list/get' };

    return Api.invoke(req)
      .then((res) => {
        dispatch(fetchSuccess(res, selectIndex));
      })
      .catch((err) =>
        dispatch(appActions.catchApiError(err, { isContinuable: false }))
      )
      .then(() => dispatch(appActions.loadingEnd()));
  };
