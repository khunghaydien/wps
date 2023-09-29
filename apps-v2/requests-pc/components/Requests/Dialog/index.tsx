import React from 'react';

import last from 'lodash/last';

import { dialogTypes } from '../../../modules/ui/expenses/dialog/activeDialog';

import { OwnProps as ParentProps } from '../../../containers/Requests/DialogContainer';
import Approval from '../../../containers/Requests/Dialogs/ApprovalDialogContainer';
import ApprovalHistory from '../../../containers/Requests/Dialogs/ApprovalHistoryDialogContainer';
import CostCenterSelect from '../../../containers/Requests/Dialogs/CostCenterDialogContainer';
import EditHistoryDialog from '../../../containers/Requests/Dialogs/EditHistoryDialogContainer';
import ExpenseTypeSelect from '../../../containers/Requests/Dialogs/ExpenseTypeDialogContainer';
import EILookupDialog from '../../../containers/Requests/Dialogs/ExtendedItemDialogContainer';
import JobSelect from '../../../containers/Requests/Dialogs/JobDialogContainer';
import PersonalVendorDialog from '../../../containers/Requests/Dialogs/PersonalVendorDialogContainer';
import ReceiptLibrary from '../../../containers/Requests/Dialogs/ReceiptLibraryDialogContainer';
import RecordCloneDateDialog from '../../../containers/Requests/Dialogs/RecordCloneDialogContainer';
import RecordCloneNumberDialog from '../../../containers/Requests/Dialogs/RecordCloneNumberDialogContainer';
import RecordUpdatedDialog from '../../../containers/Requests/Dialogs/RecordUpdateInfoDialogContainer';
import RouteSelect from '../../../containers/Requests/Dialogs/RouteSelectDialogContainer';
import SwitchEmployee from '../../../containers/Requests/Dialogs/SwitchEmployeeDialogContainer';
import SwitchSubRole from '../../../containers/Requests/Dialogs/SwitchSubRoleDialogContainer';
import VendorDetailModal from '../../../containers/Requests/Dialogs/VendorDetailModalContainer';
import VendorLookupDialog from '../../../containers/Requests/Dialogs/VendorDialogContainer';

export type Props = ParentProps & {
  activeDialog: Array<string>;
  clearDialog: () => void;
  hideAllDialogsAndClear: () => void;
  hideDialog: () => void;
  onClickHideDialogButton: () => void;
};

export const getSelectedExpDialogComponent = (
  currentDialog: string,
  props: Props
) => {
  switch (currentDialog) {
    case dialogTypes.APPROVAL:
    case dialogTypes.CANCEL_REQUEST:
      return <Approval {...props} />;
    case dialogTypes.APPROVAL_HISTORY:
      return <ApprovalHistory {...props} isExp />;
    case dialogTypes.COST_CENTER:
      return <CostCenterSelect {...props} />;
    case dialogTypes.EDIT_HISTORY:
      return <EditHistoryDialog {...props} />;
    case dialogTypes.EI_LOOKUP:
      return <EILookupDialog {...props} />;
    case dialogTypes.EXPENSE_TYPE:
    case dialogTypes.EXPENSE_TYPE_CHANGE:
      return <ExpenseTypeSelect {...props} />;
    case dialogTypes.JOB:
      return <JobSelect {...props} />;
    case dialogTypes.RECORD_CLONE_DATE:
      return <RecordCloneDateDialog {...props} />;
    case dialogTypes.RECORD_CLONE_NUMBER:
      return <RecordCloneNumberDialog {...props} />;
    case dialogTypes.RECORD_UPDATED:
      return <RecordUpdatedDialog {...props} />;
    case dialogTypes.RECEIPTS:
      return <ReceiptLibrary {...props} />;
    case dialogTypes.ROUTE_SELECT:
      return <RouteSelect {...props} />;
    case dialogTypes.VENDOR_LOOKUP:
      return <VendorLookupDialog {...props} />;
    case dialogTypes.VENDOR_DETAIL:
      return <VendorDetailModal {...props} />;
    case dialogTypes.VENDOR_CREATE:
    case dialogTypes.VENDOR_EDIT:
      return <PersonalVendorDialog {...props} />;
    case dialogTypes.SWITCH_EMPLOYEE:
      return <SwitchEmployee {...props} />;
    case dialogTypes.SWITCH_SUBROLE:
      return <SwitchSubRole {...props} />;
    default:
      return null;
  }
};

const ExpDialog = (props: Props) => {
  const currentDialog = last(props.activeDialog);
  return getSelectedExpDialogComponent(currentDialog, props);
};

export default ExpDialog;
