import * as appActions from '@apps/commons/actions/app';

import RequestRepository from '@apps/repositories/approval/RequestRepository';
import LegalAgreementRequestRepository from '@attendance/repositories/approval/LegalAgreementRepository';

import ApprovalType, {
  ApprovalTypeValue,
} from '@apps/domain/models/approval/ApprovalType';

import { actions as detailActions } from '../modules/entities/attLegalAgreement/detail';
import { actions as entitiesListActions } from '../modules/entities/attLegalAgreement/list';
import { actions as activeDialogActions } from '../modules/ui/activeDialog';
import { actions as uiApprovalTypeActions } from '../modules/ui/approvalType';
import { actions as uiDetailAction } from '../modules/ui/attLegalAgreement/detail';
import { actions as uiFilterTermActions } from '../modules/ui/attLegalAgreement/list/filterTerms';
import { actions as maxSelectionActions } from '../modules/ui/attLegalAgreement/list/maxSelection';
import { actions as uiSelectedIdAction } from '../modules/ui/attLegalAgreement/list/selectedIds';

import { getNextId } from '@apps/approvals-pc/utils/RequestListUtils';

import { AppDispatch } from './AppThunk';

const PROCESS_TYPE_APPROVE = 'approve';
const PROCESS_TYPE_REJECT = 'reject';

export const initialize = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(maxSelectionActions.clear());
    dispatch(uiFilterTermActions.clear());
    dispatch(uiSelectedIdAction.clear());
    dispatch(detailActions.clear());
    dispatch(appActions.loadingStart());
    const response = await LegalAgreementRequestRepository.fetchList(
      ApprovalType.ByEmployee,
      null
    );
    await dispatch(getDetailInfo(response?.at(0)?.id));
    dispatch(entitiesListActions.fetchSuccess(response));
  } catch (e) {
    dispatch(appActions.catchApiError(e));
  } finally {
    dispatch(appActions.loadingEnd());
  }
};

export const switchApprovalType =
  (type: ApprovalTypeValue) => async (dispatch: AppDispatch) => {
    try {
      dispatch(uiApprovalTypeActions.switch(type));
      dispatch(uiFilterTermActions.clear());
      dispatch(entitiesListActions.clear());
      dispatch(uiSelectedIdAction.clear());
      dispatch(detailActions.clear());
      dispatch(appActions.loadingStart());
      const response = await LegalAgreementRequestRepository.fetchList(
        type,
        null
      );
      await dispatch(getDetailInfo(response?.at(0)?.id));
      dispatch(entitiesListActions.fetchSuccess(response));
    } catch (e) {
      dispatch(appActions.catchApiError(e));
    } finally {
      dispatch(appActions.loadingEnd());
    }
  };

export const getDetailInfo = (requestId: string) => async (dispatch) => {
  dispatch(detailActions.clear());
  if (requestId) {
    try {
      dispatch(appActions.loadingStart());
      await LegalAgreementRequestRepository.fetch(requestId).then((res) => {
        dispatch(detailActions.fetchSuccess(res));
      });
    } catch (e) {
      dispatch(appActions.catchApiError(e));
    } finally {
      dispatch(appActions.loadingEnd());
    }
  }
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
      dispatch(uiSelectedIdAction.clear());
    });
  };

/**
 * Approve the approvals.
 * @param {array} requestIdList
 * @param {string} comment
 * @param approvalType
 * @param allIds
 * @return {function(Dispatch<*>): Promise<T | never>}
 */
export const approve = (
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
export const reject = (
  requestIdList: string[],
  comment = '',
  approvalType: ApprovalTypeValue,
  allIds: string[]
) => proceed(PROCESS_TYPE_REJECT, requestIdList, comment, approvalType, allIds);

const proceed =
  (
    processType,
    requestIdList: string[],
    comment = '',
    approvalType: ApprovalTypeValue,
    allIds: string[],
    isBulkApprove?: boolean
  ) =>
  async (dispatch: AppDispatch) => {
    const nextId = getNextId(requestIdList, allIds, isBulkApprove);
    try {
      dispatch(appActions.loadingStart());
      if (processType === PROCESS_TYPE_APPROVE) {
        await RequestRepository.approve({
          ids: requestIdList,
          comment,
        });
      } else {
        await RequestRepository.reject({
          ids: requestIdList,
          comment,
        });
      }
      dispatch(uiDetailAction.processSuccess());
      dispatch(detailActions.clear());
      const response = await LegalAgreementRequestRepository.fetchList(
        approvalType,
        null
      );
      await dispatch(
        getDetailInfo(
          response?.find(({ id }) => id === nextId)?.id || response?.at(0)?.id
        )
      );
      dispatch(entitiesListActions.fetchSuccess(response));
      if (!isBulkApprove) {
        dispatch(uiSelectedIdAction.remove(requestIdList[0]));
      }
    } catch (e) {
      dispatch(appActions.catchApiError(e));
    } finally {
      dispatch(appActions.loadingEnd());
    }
  };
