import { loadingEnd, loadingStart } from './app';

export const FETCH_APPROVAL_HISTORY_LIST = 'FETCH_APPROVAL_HISTORY_LIST';

/**
 * 承認履歴を取得
 */
function fetchApprovalHistoryListSuccess(result) {
  return {
    type: FETCH_APPROVAL_HISTORY_LIST,
    payload: result,
  };
}

export function fetchExpReportApprovalHistoryList(expReportId) {
  return (dispatch, getState) => {
    dispatch(loadingStart());
    const state = getState();
    return state.env.api.common.approvalHistoryList.fetchExpReportApprovalHistoryList(
      state,
      expReportId,
      (result) => {
        dispatch(loadingEnd());
        dispatch(fetchApprovalHistoryListSuccess(result));
      }
    );
  };
}

export function fetchTepApprovalApprovalHistoryList(tepApprovalId) {
  return (dispatch, getState) => {
    dispatch(loadingStart());
    const state = getState();
    return state.env.api.common.approvalHistoryList.fetchTepApprovalApprovalHistoryList(
      state,
      tepApprovalId,
      (result) => {
        dispatch(loadingEnd());
        dispatch(fetchApprovalHistoryListSuccess(result));
      }
    );
  };
}
