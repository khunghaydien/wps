import { Dispatch } from 'redux';

import * as appActions from '../../../../commons/actions/app';
import Api from '../../../../commons/api';

import { ApprovalTypeValue } from '../../../../domain/models/approval/ApprovalType';

import { getNextId } from '../../../utils/RequestListUtils';

import { actions as listActions } from '../../entities/attMonthly/list';
import { actions as activeDialogActions } from '../activeDialog';
import { actions as selectedIdsActions } from './list/selectedIds';

type State = {
  comment: string;
};

/** Define constants */

const EDIT_COMMENT = 'MODULES/UI/ATT_MONTHLY/REQUEST/EDIT_COMMENT';
const PROCESS_SUCCESS = 'MODULES/UI/ATT_MONTHLY/REQUEST/PROCEED_SUCCESS';

export const constants = { PROCESS_SUCCESS, EDIT_COMMENT };

/** Define actions */

const processSuccess = () => ({
  type: PROCESS_SUCCESS,
});

const PROCESS_TYPE_APPROVE = 'approve';
const PROCESS_TYPE_REJECT = 'reject';

const buildProcessRequest = (processType, requestIdList, comment) => {
  switch (processType) {
    case PROCESS_TYPE_APPROVE:
      return {
        path: '/approval/request/approve',
        param: {
          requestIdList,
          comment,
        },
      };
    case PROCESS_TYPE_REJECT:
      return {
        path: '/approval/request/reject',
        param: {
          requestIdList,
          comment,
        },
      };
    default:
      // This line should not be evaluated
      return {};
  }
};

const editComment = (comment: string) => ({
  type: EDIT_COMMENT,
  payload: {
    comment,
  },
});

const proceed =
  (
    processType,
    requestIdList: string[],
    comment = '',
    approvalType: ApprovalTypeValue,
    allIds: string[],
    isBulkApprove?: boolean
  ) =>
  (dispatch: Dispatch<any>) => {
    const nextId = getNextId(requestIdList, allIds, isBulkApprove);

    const req = buildProcessRequest(processType, requestIdList, comment);

    dispatch(appActions.loadingStart());
    return Api.invoke(req)
      .then(() => {
        dispatch(processSuccess());
        dispatch(listActions.browse(approvalType, nextId));
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
 * Approve the approvals.
 * @param {array} requestIdList
 * @param {string} comment
 * @param approvalType
 * @param allIds
 * @return {function(Dispatch<*>): Promise<T | never>}
 */
const approve = (
  requestIdList: string[],
  comment = '',
  approvalType: ApprovalTypeValue,
  allIds: string[],
  isBulkApprove?: boolean
) =>
  proceed(
    PROCESS_TYPE_APPROVE,
    requestIdList,
    comment,
    approvalType,
    allIds,
    isBulkApprove
  );

/**
 * Reject the approvals.
 * @param {array} requestIdList
 * @param {string} comment
 * @param approvalType
 * @param allIds
 * @return {function(Dispatch<*>): Promise<T | never>}
 */
const reject = (
  requestIdList: string[],
  comment = '',
  approvalType: ApprovalTypeValue,
  allIds: string[]
) => proceed(PROCESS_TYPE_REJECT, requestIdList, comment, approvalType, allIds);

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

export const actions = { editComment, approve, reject, approveAll };

/** Define reducer */

const initialState: State = {
  comment: '',
};

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case EDIT_COMMENT:
      return {
        ...state,
        ...action.payload,
      };
    case PROCESS_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
