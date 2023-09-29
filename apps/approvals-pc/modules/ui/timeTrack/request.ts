import * as appActions from '../../../../commons/actions/app';
import Api from '../../../../commons/api';

import { constants as detailConstants } from '../../entities/timeTrack/detail';
import { actions as listActions } from '../../entities/timeTrack/list';

// CONSTANS
const APPROVE_SUCCESS = 'modules/ui/timeTrack/request/APPROVE_SUCCESS';
const REJECT_SUCCESS = 'modules/ui/timeTrack/request/REJECT_SUCCESS';
const EDIT_COMMENT = 'modules/ui/timeTrack/request/EDIT_COMMENT';

export const constants = {
  APPROVE_SUCCESS,
  REJECT_SUCCESS,
  EDIT_COMMENT,
};

// ACTIONS

/**
 * 承認 / 却下後に選択状態になるべきリストのindexをかかえす
 * @param {string} id
 * @param {array} idList
 * @return {number}
 */
const lastArrayIndex = (array) => {
  if (array.length === 0) {
    return 0;
  }
  return array.length - 1;
};

const getNextIndex = (requestIdList, allIds) => {
  // 複数選択時はリストの最初を表示する
  if (requestIdList.length !== 1) {
    return 0;
  }

  const index = allIds.indexOf(requestIdList[0]);

  if (index === lastArrayIndex(allIds)) {
    return index - 1;
  }

  return index;
};

const approveSuccess = () => {
  return {
    type: APPROVE_SUCCESS,
  };
};

const rejectSuccess = () => {
  return {
    type: REJECT_SUCCESS,
  };
};

/**
 * 承認処理
 * @param {array} requestIdList 承認ID
 * @param {string} comment コメント
 */
const approve =
  (requestIdList, comment = '') =>
  (dispatch, getState) => {
    const state = getState();
    const { allIds } = state.entities.timeTrack.list;

    const nextIndex = getNextIndex(requestIdList, allIds);

    dispatch(appActions.loadingStart());
    const req = {
      path: '/approval/request/approve',
      param: {
        requestIdList,
        comment,
      },
    };

    return Api.invoke(req)
      .then(() => {
        dispatch(approveSuccess());
        dispatch(listActions.browse(nextIndex));
      })
      .catch((err) => dispatch(appActions.catchApiError(err)))
      .then(() => dispatch(appActions.loadingEnd()));
  };

const reject = (requestIdList, comment) => (dispatch, getState) => {
  const state = getState();
  const { allIds } = state.entities.timeTrack.list;

  const nextIndex = getNextIndex(requestIdList, allIds);

  dispatch(appActions.loadingStart());
  const req = {
    path: '/approval/request/reject',
    param: {
      requestIdList,
      comment,
    },
  };

  return Api.invoke(req)
    .then(() => {
      dispatch(rejectSuccess());
      dispatch(listActions.browse(nextIndex));
    })
    .catch((err) => dispatch(appActions.catchApiError(err)))
    .then(() => dispatch(appActions.loadingEnd()));
};

const editComment = (comment) => {
  return {
    type: EDIT_COMMENT,
    payload: comment,
  };
};

// eslint-disable-next-line import/prefer-default-export
export const actions = {
  approve,
  reject,
  editComment,
};

// Reducer
const initialState = {
  comment: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case EDIT_COMMENT:
      return Object.assign({}, state, { comment: action.payload });
    case APPROVE_SUCCESS:
    case REJECT_SUCCESS:
    case detailConstants.FETCH_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
