import { Dispatch } from 'redux';

import * as constants from './constants';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../../commons/actions/app';
import Api from '../../../../../commons/api';

import { actions as historyListActions } from '../../../../../../widgets/dialogs/ApprovalHistoryDialog/modules/entities/historyList';

const open = (requestId: string) => (dispatch: Dispatch) => {
  dispatch({ type: constants.OPEN });

  const req = {
    path: '/approval/request/history/get',
    param: {
      requestId,
    },
  };

  dispatch(loadingStart());

  return Api.invoke(req)
    .then((res) => {
      dispatch(historyListActions.set(res.historyList));
    })
    .catch((err) => dispatch(catchApiError(err)))
    .then(() => {
      dispatch(loadingEnd());
    });
};

const close = () => (dispatch: Dispatch) => {
  dispatch(historyListActions.unset());
  dispatch({ type: constants.CLOSE });
};

export { open, close };
