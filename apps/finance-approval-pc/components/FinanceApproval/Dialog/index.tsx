import React from 'react';

import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';

import { dialogTypes } from '../../../modules/ui/FinanceApproval/dialog/activeDialog';

import ApprovalReject from '../../../containers/FinanceApproval/Dialogs/ApprovalRejectDialogContainer';
import CloneConfirm from '../../../containers/FinanceApproval/Dialogs/CloneConfirmationDialogContainer';
import DeleteSearchCondition from '../../../containers/FinanceApproval/Dialogs/DeleteSearchConditionContainer';
import SearchCondition from '../../../containers/FinanceApproval/Dialogs/SearchConditionDialogContainer';

import {
  getSelectedExpDialogComponent,
  Props as ExpDialogProps,
} from '../../../../expenses-pc/components/Expenses/Dialog';

export type Props = ExpDialogProps & {
  expActiveDialog: Array<string>;
};

const getSelectedFADialogComponent = (currentDialog: string, props: Props) => {
  switch (currentDialog) {
    case dialogTypes.REJECT_FINANCE_APPROVAL:
    case dialogTypes.CONFIRM_APPROVAL:
      return <ApprovalReject {...props} />;
    case dialogTypes.DELETE_SEARCH_CONDITION:
      return <DeleteSearchCondition {...props} />;
    case dialogTypes.SEARCH_CONDITION:
      return <SearchCondition {...props} />;
    case dialogTypes.CLONE_CONFIRM:
      return <CloneConfirm {...props} />;
    default:
      return null;
  }
};

const FADialog = (props: Props) => {
  const topDialog = !isEmpty(props.activeDialog)
    ? props.activeDialog
    : props.expActiveDialog;
  const currentDialog = last(topDialog);

  const expDialog = getSelectedExpDialogComponent(currentDialog, {
    ...props,
    isFinanceApproval: true,
  });
  return expDialog || getSelectedFADialogComponent(currentDialog, props);
};

export default FADialog;
