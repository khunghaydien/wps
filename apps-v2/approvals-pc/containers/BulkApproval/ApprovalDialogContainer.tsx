import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import ApprovalDialog from '@commons/components/BulkApproval/ApprovalDialog';
import msg from '@commons/languages';
import TextUtil from '@commons/utils/TextUtil';

import { State } from '../../modules';
import { actions as activeDialogActions } from '../../modules/ui/activeDialog';
import { approveAll as attDailyApprove } from '../../modules/ui/att/request/actions';
import { approveAll as attMonthlyApprove } from '../../modules/ui/attMonthly/detail';
import { actions as commentActions } from '../../modules/ui/bulkApproval/comment';
import { tabType } from '../../modules/ui/tabs';

import * as attFixDailyActions from '../../action-dispatchers/AttFixDaily';
import * as attlegalAgreementAction from '../../action-dispatchers/AttLegalAgreement';

const BulkApprovalDialogContainer = (ownProps: { allIds: Array<string> }) => {
  const comment = useSelector((state: State) => state.ui.bulkApproval.comment);
  const photoUrl = useSelector((state: State) => state.userSetting.photoUrl);
  const curTab = useSelector((state: State) => state.ui.tabs.selected);
  const approvalType = useSelector((state: State) => state.ui.approvalType);

  const selectedAttDailyIds = useSelector(
    (state: State) => state.ui.att.list.selectedIds
  );
  const selectedAttFixDailyIds = useSelector(
    (state: State) => state.ui.attFixDaily.checked.ids
  );
  const selectedAttFixMonthlyIds = useSelector(
    (state: State) => state.ui.attMonthly.list.selectedIds
  );
  const selectedAttLegalAgreementIds = useSelector(
    (state: State) => state.ui.attLegalAgreement.list.selectedIds
  );

  const dispatch = useDispatch();
  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          onChangeComment: commentActions.set,
          resetComment: commentActions.clear,
          onClickHideDialogButton: activeDialogActions.hide,
          attDailyApprove,
          attMonthlyApprove,
          attFixDailyApprove: attFixDailyActions.approveBulk,
          attlegalAgreementApprove: attlegalAgreementAction.approveAll,
        },
        dispatch
      ),
    [dispatch]
  );
  useEffect(() => {
    Actions.resetComment();
  }, []);

  const [selectedIds, approveAllAction] = useMemo(() => {
    switch (curTab) {
      case tabType.ATT_DAILY: {
        return [selectedAttDailyIds, Actions.attDailyApprove];
      }
      case tabType.ATT_FIX_DAILY: {
        return [selectedAttFixDailyIds, Actions.attFixDailyApprove];
      }
      case tabType.ATT_FIX_MONTHLY: {
        return [selectedAttFixMonthlyIds, Actions.attMonthlyApprove];
      }
      case tabType.ATT_LEGAL_AGREEMENT: {
        return [selectedAttLegalAgreementIds, Actions.attlegalAgreementApprove];
      }
      default:
        return [[], null];
    }
  }, [
    curTab,
    selectedAttDailyIds,
    Actions.attDailyApprove,
    Actions.attFixDailyApprove,
    Actions.attMonthlyApprove,
    Actions.attlegalAgreementApprove,
    selectedAttFixDailyIds,
    selectedAttFixMonthlyIds,
    selectedAttLegalAgreementIds,
  ]);

  const onClickApproveAllButton = useCallback(() => {
    if (approveAllAction) {
      approveAllAction(selectedIds, comment, approvalType, ownProps.allIds);
    }
  }, [approveAllAction, selectedIds, comment, approvalType, ownProps.allIds]);

  return (
    <ApprovalDialog
      photoUrl={photoUrl}
      comment={comment}
      mainButtonTitle={msg().Appr_Btn_Approval}
      title={msg().Appr_Btn_ApprovalAll}
      onClickMainButton={onClickApproveAllButton}
      onChangeComment={Actions.onChangeComment}
      onClickHideDialogButton={Actions.onClickHideDialogButton}
      additionalMsg={TextUtil.template(
        msg().Appr_Msg_ApproveSelected,
        selectedIds.length
      )}
    />
  );
};

export default BulkApprovalDialogContainer;
