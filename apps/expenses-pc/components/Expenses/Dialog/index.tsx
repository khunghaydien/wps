import React from 'react';

import last from 'lodash/last';

import { dialogTypes } from '../../../modules/ui/expenses/dialog/activeDialog';

import ICCardTransaction from '../../../containers/Expenses/Dialogs/ICCardTransactionDialogContainer';
import TransactionSelection from '../../../containers/Expenses/Dialogs/TransactionSelectionDialogContainer';

import { OwnProps as ParentProps } from '../../../containers/Expenses/DialogContainer';
import Approval from '../../../containers/Expenses/Dialogs/ApprovalDialogContainer';
import ApprovalHistory from '../../../containers/Expenses/Dialogs/ApprovalHistoryDialogContainer';
import CostCenterSelect from '../../../containers/Expenses/Dialogs/CostCenterDialogContainer';
import CustomRequestDialog from '../../../containers/Expenses/Dialogs/CustomRequestDialogContainer';
import EditHistoryDialog from '../../../containers/Expenses/Dialogs/EditHistoryDialogContainer';
import ExpenseTypeSelect from '../../../containers/Expenses/Dialogs/ExpenseTypeDialogContainer';
import EILookupDialog from '../../../containers/Expenses/Dialogs/ExtendedItemDialogContainer';
import JobSelect from '../../../containers/Expenses/Dialogs/JobDialogContainer';
import OCRDetail from '../../../containers/Expenses/Dialogs/OCRDetailContainer';
import PersonalVendorDialog from '../../../containers/Expenses/Dialogs/PersonalVendorDialogContainer';
import ReceiptLibrary from '../../../containers/Expenses/Dialogs/ReceiptLibraryDialogContainer';
import RecordCloneDateDialog from '../../../containers/Expenses/Dialogs/RecordCloneCalendarDialogContainer';
import RecordCloneNumberDialog from '../../../containers/Expenses/Dialogs/RecordCloneNumberDialogContainer';
import RecordItemsDialog from '../../../containers/Expenses/Dialogs/RecordItemsDialogContainer';
import RecordUpdatedDialog from '../../../containers/Expenses/Dialogs/RecordUpdateInfoDialogContainer';
import RouteSelect from '../../../containers/Expenses/Dialogs/RouteSelectDialogContainer';
import SwitchEmployee from '../../../containers/Expenses/Dialogs/SwitchEmployeeDialogContainer';
import VendorDetailModal from '../../../containers/Expenses/Dialogs/VendorDetailModalContainer';
import VendorLookupDialog from '../../../containers/Expenses/Dialogs/VendorDialogContainer';

export type Props = ParentProps & {
  clearDialog: () => Record<string, any>;
  hideAllDialogsAndClear: () => void;
  hideDialog: () => Record<string, any>;
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
    case dialogTypes.RECORD_ITEMS_CREATE:
    case dialogTypes.RECORD_ITEMS_CONFIRM:
    case dialogTypes.RECORD_ITEMS_DELETE:
      return <RecordItemsDialog {...props} />;
    case dialogTypes.CUSTOM_REQUEST:
      return <CustomRequestDialog {...props} />;
    case dialogTypes.RECORD_CLONE_DATE:
      return <RecordCloneDateDialog {...props} />;
    case dialogTypes.RECORD_CLONE_NUMBER:
      return <RecordCloneNumberDialog {...props} />;
    case dialogTypes.RECORD_UPDATED:
      return <RecordUpdatedDialog {...props} />;
    case dialogTypes.RECEIPTS:
    case dialogTypes.OCR_RECEIPTS:
      return <ReceiptLibrary {...props} />;
    case dialogTypes.OCR_RECEIPT_DETAIL:
      return <OCRDetail {...props} />;
    case dialogTypes.ROUTE_SELECT:
      return <RouteSelect {...props} />;
    case dialogTypes.VENDOR_LOOKUP:
      return <VendorLookupDialog {...props} />;
    case dialogTypes.VENDOR_CREATE:
    case dialogTypes.VENDOR_EDIT:
      return <PersonalVendorDialog {...props} />;
    case dialogTypes.VENDOR_DETAIL:
      return <VendorDetailModal {...props} />;
    case dialogTypes.TRANSACTION_SELECTION:
      return <TransactionSelection {...props} />;
    case dialogTypes.IC_CARD_TRANSACTION:
      return <ICCardTransaction {...props} />;
    case dialogTypes.SWITCH_EMPLOYEE:
      return <SwitchEmployee {...props} />;
    default:
      return null;
  }
};

const ExpDialog = (props: Props) => {
  const currentDialog = last(props.activeDialog);
  return getSelectedExpDialogComponent(currentDialog, props);
};

export default ExpDialog;
