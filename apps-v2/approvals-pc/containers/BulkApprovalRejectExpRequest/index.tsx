import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import ApprovalDialog from '@commons/components/BulkApproval/ApprovalDialog';
import msg from '@commons/languages';
import { showToast } from '@commons/modules/toast';
import TextUtil from '@commons/utils/TextUtil';

import STATUS from '@apps/domain/models/approval/request/Status';

import { State } from '../../modules';
import {
  actions as activeDialogActions,
  ACTIVE_DIALOG_TYPES,
} from '../../modules/ui/activeDialog';
import { actions as bulkErrorActions } from '../../modules/ui/bulkApproval/error';
import { actions as selectedIdsActions } from '../../modules/ui/expenses/list/selectedIds';

import {
  bulkApprovalForReport,
  bulkRejectForReport,
} from '@apps/approvals-pc/action-dispatchers/Expenses';

const BulkApprovalDialogContainer = (ownProps: { isPreRequest?: boolean }) => {
  const selectedIds = useSelector(
    (state: State) => state.ui.expenses.list.selectedIds
  );
  const dialogType = useSelector((state: State) => state.ui.activeDialog);
  const requestList = useSelector((state: State) =>
    ownProps.isPreRequest
      ? state.entities.exp.request.preRequest.expRequestList
      : state.entities.exp.request.report.expRequestList
  );
  const userSetting = useSelector((state: State) => state.userSetting);
  const expRequest = useSelector((state: State) =>
    ownProps.isPreRequest
      ? state.entities.exp.request.preRequest.expRequest
      : state.entities.exp.request.report.expRequest
  );
  const proxyEmployeeId = useSelector(
    (state: State) => state.common.proxyEmployeeInfo.id
  );
  const isProxyMode = useSelector(
    (state: State) => state.common.proxyEmployeeInfo.isProxyMode
  );
  const doableLength = requestList.filter(
    (item) =>
      selectedIds.includes(item.requestId) && item.status === STATUS.Pending
  ).length;
  const selectedCompanyId = useSelector(
    (state: State) =>
      state.ui.companyRequestCount.selectedComId || state.userSetting.companyId
  );
  const empId = isProxyMode ? proxyEmployeeId : userSetting.employeeId;
  const disableMainButton = doableLength === 0;

  const dispatch = useDispatch();
  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          showToast,
          bulkApprovalForReport,
          bulkRejectForReport,
          onClickHideDialogButton: activeDialogActions.hide,
          clearSelectedIds: selectedIdsActions.clear,
          clearBulkError: bulkErrorActions.clear,
        },
        dispatch
      ),
    [dispatch]
  );

  const title = useMemo(() => {
    return dialogType === ACTIVE_DIALOG_TYPES.BULK_APPROVAL_CONFIRM
      ? msg().Appr_Btn_Approval
      : msg().Appr_Btn_Reject;
  }, [dialogType]);

  const additionalMsg = useMemo(() => {
    const isApprovalDialog: boolean =
      dialogType === ACTIVE_DIALOG_TYPES.BULK_APPROVAL_CONFIRM;
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
      case ACTIVE_DIALOG_TYPES.BULK_APPROVAL_CONFIRM:
        action = Actions.bulkApprovalForReport;
        break;
      case ACTIVE_DIALOG_TYPES.BULK_REJECT_CONFIRM:
        action = Actions.bulkRejectForReport;
        break;
    }
    action(
      selectedIds,
      requestList,
      selectedCompanyId,
      ownProps.isPreRequest,
      empId,
      expRequest.requestId
    );
    Actions.onClickHideDialogButton();
    Actions.clearSelectedIds();
  }, [
    dialogType,
    selectedIds,
    empId,
    selectedCompanyId,
    ownProps.isPreRequest,
    requestList,
    expRequest.requestId,
  ]);

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
