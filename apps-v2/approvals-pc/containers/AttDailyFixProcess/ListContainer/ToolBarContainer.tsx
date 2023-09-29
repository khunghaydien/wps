import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ApprovalTypeValue } from '@apps/domain/models/approval/ApprovalType';

import { State } from '@apps/approvals-pc/modules';
import {
  actions as activeDialogActions,
  ACTIVE_DIALOG_TYPES,
} from '@apps/approvals-pc/modules/ui/activeDialog';
import { actions as approvalTypeActions } from '@apps/approvals-pc/modules/ui/approvalType';

import ApprovalDialogContainer from '@apps/approvals-pc/containers/BulkApproval/ApprovalDialogContainer';

import Component from '@apps/approvals-pc/components/attendance/AttDailyFixProcess/List/ToolBar';

import LocalEvents from '../events';
import useAccessControl from '@attendance/ui/pc/approval-pc/hooks/useAccessControl';

const ToolBarContainer: React.FC = () => {
  const dispatch = useDispatch();
  const totalCount = useSelector(
    (state: State) => state.ui.attFixDaily.records.originalRecords.length
  );
  const filteredCount = useSelector(
    (state: State) => state.ui.attFixDaily.records.records.length
  );
  const checkedCount = useSelector(
    (state: State) => state.ui.attFixDaily.checked.ids.length
  );
  const overLimit = useSelector(
    (state: State) => state.ui.attFixDaily.records.overLimit
  );
  const approverType = useSelector((state: State) => state.ui.approvalType);
  const openedDialog = useSelector(
    (state: State) =>
      state.ui.activeDialog === ACTIVE_DIALOG_TYPES.BULK_APPROVAL_CONFIRM
  );
  const enabledByDelegate = useAccessControl({
    requireIfByEmployee: ['approveAttRequestByDelegate'],
  });
  const enabledBulkApprove = useAccessControl({
    requireIfByDelegate: ['canBulkApproveAttRequest'],
    requireIfByEmployee: ['canBulkApproveAttRequest'],
  });
  const onSwitchApprovalType = React.useCallback(
    (type: ApprovalTypeValue) => {
      dispatch(approvalTypeActions.switch(type));
      LocalEvents.switchedApprovalType.publish();
    },
    [dispatch]
  );
  const onClickApproveAllButton = React.useCallback(() => {
    dispatch(
      activeDialogActions.set(ACTIVE_DIALOG_TYPES.BULK_APPROVAL_CONFIRM)
    );
  }, [dispatch]);

  return (
    <Component
      totalCount={totalCount}
      filteredCount={filteredCount}
      checkedCount={checkedCount}
      overLimit={overLimit}
      approvalType={approverType}
      enabledByDelegate={enabledByDelegate}
      enabledBulkApprove={enabledBulkApprove}
      onSwitchApprovalType={onSwitchApprovalType}
      onClickApproveAllButton={onClickApproveAllButton}
      ApprovalAllDialog={() =>
        enabledBulkApprove && openedDialog ? (
          <ApprovalDialogContainer allIds={[]} />
        ) : null
      }
    />
  );
};

export default ToolBarContainer;
