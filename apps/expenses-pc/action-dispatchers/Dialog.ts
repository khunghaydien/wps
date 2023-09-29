import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { getRecentCostCenters } from '../../commons/action-dispatchers/CostCenter';
import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';

import {
  EISearchObj,
  getRecentlyUsedCustomEI,
} from '../../domain/models/exp/ExtendedItem';
import { OCR_STATUS } from '../../domain/models/exp/Receipt';
import {
  getRecentlyUsedVendor,
  VendorType,
  vendorTypes,
} from '../../domain/models/exp/Vendor';

import { actions as approvalHistoryActions } from '../../domain/modules/exp/approval/request/history';
import { actions as expenseTypeActions } from '../../domain/modules/exp/expense-type/list';
import { actions as expHistoryActions } from '../../domain/modules/exp/finance-approval';
import { actions as receiptLibraryAction } from '../../domain/modules/exp/receiptLibrary/list';
import { AppDispatch } from '../modules/AppThunk';
import { actions as activeDialogActions } from '../modules/ui/expenses/dialog/activeDialog';
import { actions as expenseTypeSelectListActions } from '../modules/ui/expenses/dialog/expenseTypeSelect/list';
import { actions as expenseTypeSelectRecordTypeActions } from '../modules/ui/expenses/dialog/expenseTypeSelect/recordType';
import { actions as eiRecentlyUsedActions } from '../modules/ui/expenses/dialog/extendedItem/recentlyUsed';
import { actions as eiSelectActions } from '../modules/ui/expenses/dialog/extendedItem/search';
import { actions as dialogLoadingActions } from '../modules/ui/expenses/dialog/isLoading';
import { actions as vendorRecentlyUsedActions } from '../modules/ui/expenses/dialog/vendor/recentlyUsed';
import { actions as vendorSelectActions } from '../modules/ui/expenses/dialog/vendor/search';
import { actions as vendorTypeAction } from '../modules/ui/expenses/dialog/vendor/type';
import { actions as selectionCountActions } from '../modules/ui/expenses/receiptLibrary/maxSelectionCount';

import { getRecentJobs } from './Job';
import { keepGettingStatus } from './Receipt';

export const withSkeletonLoading =
  <T>(...processes: Array<(arg0: any) => Promise<T | any> | any>) =>
  (dispatch: AppDispatch): Promise<T | any> => {
    dispatch(dialogLoadingActions.toggle(true));
    return processes
      .reduce((acc, process) => acc.then(process), Promise.resolve())
      .then((result) => {
        dispatch(dialogLoadingActions.toggle(false));
        return result;
      })
      .catch((err) => {
        dispatch(dialogLoadingActions.toggle(false));
        throw err;
      });
  };

export const openApprovalHistoryDialog =
  (requestId: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    return dispatch(approvalHistoryActions.get(requestId))
      .then(() => dispatch(activeDialogActions.approvalHistory()))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  };

export const openEditHistoryDialog =
  (reportId: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    return dispatch(expHistoryActions.getHistory(reportId))
      .then(() => dispatch(activeDialogActions.editHistory()))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  };

/**
 * Open Credit Card Transaction dialog
 *
 */
export const openTransactionSelectionDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.transactionSelection());
};

/**
 * Open IC Card Transaction dialog
 *
 */
export const openIcTransactionDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.icCardTransaction());
};

/**
 * Open Delegate Employee Selection dialog
 *
 */
export const openSwitchEmployeeDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.switchEmployee());
};

export const openCostCenterDialog =
  (targetDate: string, employeeId: string, isSkipRenctlyUsed?: boolean) =>
  (dispatch: AppDispatch) => {
    if (isSkipRenctlyUsed) {
      return dispatch(activeDialogActions.costCenter());
    } else {
      dispatch(activeDialogActions.costCenter());
      dispatch(dialogLoadingActions.toggle(true));
      return dispatch(getRecentCostCenters(employeeId, targetDate)).then(() => {
        dispatch(dialogLoadingActions.toggle(false));
      });
    }
  };

export const openExpenseTypeDialog =
  (
    employeeId: string,
    companyId: string,
    targetDate: string,
    recordType: string,
    reportTypeId: string,
    isChange: boolean,
    excludedRecordTypes?: string[]
  ) =>
  (dispatch: AppDispatch) => {
    if (isChange) {
      dispatch(activeDialogActions.expenseTypeChange());
    } else {
      dispatch(activeDialogActions.expenseType());
    }
    dispatch(dialogLoadingActions.toggle(true));
    dispatch(expenseTypeSelectRecordTypeActions.set(recordType));
    return dispatch(
      expenseTypeActions.getRecentlyUsed(
        employeeId,
        companyId,
        targetDate,
        recordType,
        reportTypeId,
        'REPORT',
        excludedRecordTypes
      )
    )
      .then((result) => {
        dispatch(expenseTypeSelectListActions.setRecentResult(result.payload));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(dialogLoadingActions.toggle(false)));
  };

/**
 * Open itemization dialog
 * First dialog when create hotel fee child items
 */
export const openRecordItemsCreateDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.recordItemsCreate());
};

/**
 * Open itemization dialog
 * Second dialog when create hotel fee child items
 */
export const openRecordItemsConfirmDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.recordItemsConfirm());
};

/**
 * @deprecated
 * Confirm dialog when delete child items
 * Should refactor to use the common confirm dialog
 *
 */
export const openRecordItemsDeleteDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.recordItemsDelete());
};

export const openJobDialog =
  (targetDate: string, empId: string, isSkipRenctlyUsed?: boolean) =>
  (dispatch: AppDispatch) => {
    if (isSkipRenctlyUsed) {
      return dispatch(activeDialogActions.job());
    } else {
      dispatch(dialogLoadingActions.toggle(true));
      dispatch(activeDialogActions.job());
      return dispatch(getRecentJobs(targetDate, empId)).then(() => {
        dispatch(dialogLoadingActions.toggle(false));
      });
    }
  };

export const openCustomRequestDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.customRequest());
};

export const openOCRReceiptLibraryDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.ocrReceipts());
  dispatch(dialogLoadingActions.toggle(true));

  return dispatch(receiptLibraryAction.list(true, false, false))
    .then((data) => {
      const { result: res } = data.payload;
      if (!isEmpty(res)) {
        res.forEach((x) => {
          const status = get(x, 'ocrInfo.status');
          if (status === OCR_STATUS.IN_PROGRESS) {
            dispatch(keepGettingStatus(x.ocrInfo.taskId, x.contentVersionId));
          }
        });
      }
    })
    .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
    .then(() => dispatch(dialogLoadingActions.toggle(false)));
};

export const openEILookupDialog =
  (item: EISearchObj, empId: string, isSkipRenctlyUsed?: boolean) =>
  (dispatch: AppDispatch) => {
    dispatch(eiSelectActions.set(item));
    if (isSkipRenctlyUsed) {
      return dispatch(activeDialogActions.eiLookup());
    } else {
      dispatch(activeDialogActions.eiLookup());
      dispatch(dialogLoadingActions.toggle(true));
      return getRecentlyUsedCustomEI(
        empId,
        item.extendedItemLookupId,
        item.extendedItemCustomId
      )
        .then((res) => dispatch(eiRecentlyUsedActions.set(res)))
        .finally(() => dispatch(dialogLoadingActions.toggle(false)));
    }
  };

// Vendor Search
export const openVendorLookupDialog = (
  empId: string,
  vendorType: VendorType[],
  isSkipRenctlyUsed?: boolean
) => {
  return (dispatch: AppDispatch) => {
    dispatch(vendorSelectActions.clear());
    dispatch(vendorTypeAction.set(vendorType[0]));
    // skip recently used or no company vendor used
    if (isSkipRenctlyUsed || vendorType[0] === vendorTypes.PERSONAL) {
      return dispatch(activeDialogActions.vendorLookup());
    } else {
      dispatch(dialogLoadingActions.toggle(true));
      dispatch(activeDialogActions.vendorLookup());
      return getRecentlyUsedVendor(empId, false)
        .then((res) => dispatch(vendorRecentlyUsedActions.set(res)))
        .finally(() => dispatch(dialogLoadingActions.toggle(false)));
    }
  };
};

export const openVendorCreateDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.vendorCreate());
};

export const openVendorEditDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.vendorEdit());
};

export const openVendorDetailModal = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.vendorDetail());
};

export const openReceiptLibraryDialog =
  (useOCR: boolean, maxSelectionCount = 1) =>
  (dispatch: AppDispatch) => {
    dispatch(dialogLoadingActions.toggle(true));
    dispatch(selectionCountActions.set(maxSelectionCount));
    dispatch(activeDialogActions.receipts());

    const withOcrInfo = useOCR === true || false;
    return dispatch(receiptLibraryAction.list(withOcrInfo, false))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(dialogLoadingActions.toggle(false)));
  };

export const openOCRDetailDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.ocrReceiptDetail());
};
