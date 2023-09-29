import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import ApprovalDialog from '@commons/components/BulkApproval/ApprovalDialog';
import msg from '@commons/languages';
import { showToast } from '@commons/modules/toast';
import TextUtil from '@commons/utils/TextUtil';

import { status as STATUS } from '@apps/domain/models/exp/Report';

import { State } from '../../../modules';
import { actions as bulkErrorActions } from '../../../modules/ui/FinanceApproval/bulkApproval/error';
import {
  actions as activeDialogActions,
  dialogTypes,
} from '../../../modules/ui/FinanceApproval/dialog/activeDialog';
import { actions as selectedIdsActions } from '../../../modules/ui/FinanceApproval/RequestList/selectedIds';

import {
  bulkApproveForPreRequest,
  bulkApproveForRequest,
  bulkRejectForPreRequest,
  bulkRejectForRequest,
} from '@apps/finance-approval-pc/action-dispatchers/FinanceApproval';

const BulkApprovalDialogContainer = (ownProps: { isRequestTab?: boolean }) => {
  const selectedIds = useSelector(
    (state: State) => state.ui.FinanceApproval.RequestList.selectedIds
  );
  const dialogType = useSelector(
    (state: State) => state.ui.FinanceApproval.dialog.activeDialog[0]
  );
  const requestList = useSelector((state: State) =>
    ownProps.isRequestTab
      ? state.entities.preRequestList
      : state.entities.requestList
  );
  const doableRequestIds = requestList
    .filter(
      ({ requestId, status }) =>
        selectedIds.includes(requestId) && status === STATUS.APPROVED
    )
    .map(({ requestId }) => requestId);
  const doableLength = doableRequestIds.length;
  const disableMainButton = doableLength === 0;

  const dispatch = useDispatch();
  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          onClickHideDialogButton: activeDialogActions.hide,
          showToast,
          clearSelectedIds: selectedIdsActions.clear,
          clearBulkError: bulkErrorActions.clear,
          bulkApproveForRequest,
          bulkApproveForPreRequest,
          bulkRejectForPreRequest,
          bulkRejectForRequest,
        },
        dispatch
      ),
    [dispatch]
  );

  const title = useMemo(() => {
    return dialogType === dialogTypes.BULK_APPROVE_CONFIRM
      ? msg().Appr_Btn_Approval
      : msg().Appr_Btn_Reject;
  }, [dialogType]);

  const additionalMsg = useMemo(() => {
    const isApprovalDialog: boolean =
      dialogType === dialogTypes.BULK_APPROVE_CONFIRM;
    if (selectedIds.length > 0 && doableLength > 0) {
      const originMsg = isApprovalDialog
        ? msg().Appr_Msg_BulkApproveSelected
        : msg().Appr_Msg_BulkRejectSelected;
      return TextUtil.template(originMsg, selectedIds.length, doableLength);
    }
    return isApprovalDialog
      ? msg().Appr_Msg_BulkNoApproveSelected
      : msg().Appr_Msg_BulkNoRejectSelected;
  }, [dialogType, doableLength, selectedIds.length]);

  const onClickMainButton = useCallback(() => {
    Actions.clearBulkError();
    let action;
    switch (dialogType) {
      case dialogTypes.BULK_APPROVE_CONFIRM:
        action = ownProps.isRequestTab
          ? Actions.bulkApproveForPreRequest
          : Actions.bulkApproveForRequest;
        break;
      case dialogTypes.BULK_REJECT_CONFIRM:
        action = ownProps.isRequestTab
          ? Actions.bulkRejectForPreRequest
          : Actions.bulkRejectForRequest;
        break;
    }
    action(doableRequestIds, requestList);
    Actions.onClickHideDialogButton();
    Actions.clearSelectedIds();
  }, [ownProps.isRequestTab, dialogType, doableRequestIds, requestList]);

  return (
    <ApprovalDialog
      mainButtonTitle={title}
      title={title}
      onClickMainButton={onClickMainButton}
      onClickHideDialogButton={Actions.onClickHideDialogButton}
      additionalMsg={additionalMsg}
      isNotShowComment={true}
      disableMainButton={disableMainButton}
    />
  );
};

export default BulkApprovalDialogContainer;
