import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import msg from '../../../commons/languages';
import TextUtil from '../../../commons/utils/TextUtil';

import { State } from '../../modules';
import { actions as activeDialogActions } from '../../modules/ui/activeDialog';
import { approveAll as attDailyApprove } from '../../modules/ui/att/request/actions';
import { approveAll as attMonthlyApprove } from '../../modules/ui/attMonthly/detail';
import { actions as commentActions } from '../../modules/ui/bulkApproval/comment';
import { tabType } from '../../modules/ui/tabs';

import ApprovalDialog from '../../components/BulkApproval/ApprovalDialog';

const BulkApprovalDialogContainer = (ownProps: { allIds: Array<string> }) => {
  const comment = useSelector((state: State) => state.ui.bulkApproval.comment);
  const photoUrl = useSelector((state: State) => state.userSetting.photoUrl);
  const curTab = useSelector((state: State) => state.ui.tabs.selected);
  const approvalType = useSelector((state: State) => state.ui.approvalType);

  const selectedAttDailyIds = useSelector(
    (state: State) => state.ui.att.list.selectedIds
  );
  const selectedAttMonthlyIds = useSelector(
    (state: State) => state.ui.attMonthly.list.selectedIds
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
      case tabType.ATT_MONTHLY: {
        return [selectedAttMonthlyIds, Actions.attMonthlyApprove];
      }
      default:
        return [[], null];
    }
  }, [
    curTab,
    selectedAttDailyIds,
    selectedAttMonthlyIds,
    Actions.attDailyApprove,
    Actions.attMonthlyApprove,
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
