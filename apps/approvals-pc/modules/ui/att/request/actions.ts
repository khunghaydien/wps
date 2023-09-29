import { Dispatch } from 'redux';

import * as constants from './constants';

import * as appActions from '../../../../../commons/actions/app';
import Api from '../../../../../commons/api';

import { ApprovalTypeValue } from '../../../../../domain/models/approval/ApprovalType';

import * as listActions from '../../../entities/att/list/actions';

import { getNextId } from '../../../../utils/RequestListUtils';

import { actions as activeDialogActions } from '../../activeDialog';
import { actions as requestCountsActions } from '../../requestCounts';
import { actions as selectedIdsActions } from '../list/selectedIds';

/*
 * Actions
 */
const approveSuccess = () => {
  return {
    type: constants.APPROVE_SUCCESS,
  };
};

const rejectSuccess = () => {
  return {
    type: constants.REJECT_SUCCESS,
  };
};

/**
 * 承認処理
 * @param {array} requestIdList
 * @param {string} comment
 * @param approvalType
 * @param allIds
 * @return {function(Dispatch<*>): Promise<T | never>}
 */
export const approve =
  (
    requestIdList: string[],
    comment = '',
    approvalType: ApprovalTypeValue,
    allIds: string[],
    isBulkApprove?: boolean
  ) =>
  (dispatch: Dispatch<any>) => {
    const nextId = getNextId(requestIdList, allIds, isBulkApprove);

    const req = {
      path: '/approval/request/approve',
      param: {
        requestIdList,
        comment,
      },
    };

    dispatch(appActions.loadingStart());
    return Api.invoke(req)
      .then(() => {
        dispatch(approveSuccess());
        dispatch(listActions.browse(approvalType, nextId));
        dispatch(requestCountsActions.update());
        if (!isBulkApprove) {
          dispatch(selectedIdsActions.remove(requestIdList[0]));
        }
      })
      .catch((err) =>
        dispatch(appActions.catchApiError(err, { isContinuable: true }))
      )
      .then(() => dispatch(appActions.loadingEnd()));
  };

/**
 * 申請却下
 * @param {array} requestIdList
 * @param {string} comment
 * @param approvalType
 * @param allIds
 * @return {function(Dispatch<*>): Promise<T | never>}
 */
export const reject =
  (
    requestIdList: string[],
    comment = '',
    approvalType: ApprovalTypeValue,
    allIds: string[]
  ) =>
  (dispatch: Dispatch<any>) => {
    const nextId = getNextId(requestIdList, allIds);

    const req = {
      path: '/approval/request/reject',
      param: {
        requestIdList,
        comment,
      },
    };

    dispatch(appActions.loadingStart());
    return Api.invoke(req)
      .then(() => {
        dispatch(rejectSuccess());
        dispatch(listActions.browse(approvalType, nextId));
        dispatch(requestCountsActions.update());
        dispatch(selectedIdsActions.remove(requestIdList[0]));
      })
      .catch((err) =>
        dispatch(appActions.catchApiError(err, { isContinuable: true }))
      )
      .then(() => dispatch(appActions.loadingEnd()));
  };

/**
 * 申請コメント編集
 * @param {string} comment
 */
export const editComment = (comment: string) => {
  return {
    type: constants.EDIT_COMMENT,
    payload: comment,
  };
};

/**
 * 承認処理
 * @param {array} requestIdList
 * @param {string} comment
 * @param approvalType
 * @param allIds
 * @return {function(Dispatch<*>): Promise<T | never>}
 */
export const approveAll =
  (
    requestIdList: string[],
    comment = '',
    approvalType: ApprovalTypeValue,
    allIds: string[]
  ) =>
  (dispatch) => {
    return dispatch(
      approve(requestIdList, comment, approvalType, allIds, true)
    ).then(() => {
      dispatch(activeDialogActions.hide());
      dispatch(selectedIdsActions.clear());
    });
  };
