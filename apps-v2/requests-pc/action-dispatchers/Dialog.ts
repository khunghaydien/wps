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
import {
  getRecentlyUsedVendor,
  VendorBackType,
  vendorBackTypes,
  VendorType,
  vendorTypes,
} from '../../domain/models/exp/Vendor';

import { actions as approvalHistoryActions } from '../../domain/modules/exp/approval/request/history';
import { actions as expenseTypeActions } from '../../domain/modules/exp/expense-type/list';
import { actions as receiptLibraryAction } from '../../domain/modules/exp/receiptLibrary/list';
import { AppDispatch } from '../modules/AppThunk';
import { actions as activeDialogActions } from '../modules/ui/expenses/dialog/activeDialog';
import { actions as expenseTypeSelectListActions } from '../modules/ui/expenses/dialog/expenseTypeSelect/list';
import { actions as expenseTypeSelectRecordTypeActions } from '../modules/ui/expenses/dialog/expenseTypeSelect/recordType';
import { actions as eiRecentlyUsedActions } from '../modules/ui/expenses/dialog/extendedItem/recentlyUsed';
import { actions as eiSelectActions } from '../modules/ui/expenses/dialog/extendedItem/search';
import { actions as dialogLoadingActions } from '../modules/ui/expenses/dialog/isLoading';
import { actions as vendorBackTypeActions } from '../modules/ui/expenses/dialog/vendor/backType';
import { actions as vendorRecentlyUsedActions } from '../modules/ui/expenses/dialog/vendor/recentlyUsed';
import { actions as vendorSelectActions } from '../modules/ui/expenses/dialog/vendor/search';
import { actions as vendorTypeAction } from '../modules/ui/expenses/dialog/vendor/type';
import { actions as selectionCountActions } from '../modules/ui/expenses/receiptLibrary/maxSelectionCount';
import { actions as preRequestHistoryActions } from '@apps/domain/modules/exp/financeApprovalPreRequest';

import { getRecentJobs } from './Job';

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

export const openExpenseTypeDialog =
  (
    employeeId: string,
    companyId: string,
    targetDate: string | undefined,
    recordType: string,
    reportTypeId: string | undefined,
    isChange: boolean, // isChange: true->change expense type by search button in item pane. : false->select expense type by new record button
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
        'REQUEST',
        excludedRecordTypes
      )
    )
      .then((result) => {
        dispatch(expenseTypeSelectListActions.setRecentResult(result.payload));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(dialogLoadingActions.toggle(false)));
  };

export const openJobDialog =
  (
    targetDate: string,
    empId: string,
    companyId: string,
    isSkipRecentlyUsed: boolean
  ) =>
  (dispatch: AppDispatch) => {
    if (isSkipRecentlyUsed) {
      return dispatch(activeDialogActions.job());
    } else {
      dispatch(dialogLoadingActions.toggle(true));
      dispatch(activeDialogActions.job());
      return dispatch(getRecentJobs(targetDate, empId, companyId)).then(() => {
        dispatch(dialogLoadingActions.toggle(false));
      });
    }
  };

export const openReceiptLibraryDialog =
  (maxSelectionCount = 1) =>
  (dispatch: AppDispatch) => {
    dispatch(dialogLoadingActions.toggle(true));

    dispatch(selectionCountActions.set(maxSelectionCount));
    dispatch(activeDialogActions.receipts());
    return dispatch(receiptLibraryAction.list(false, false))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => {
        dispatch(dialogLoadingActions.toggle(false));
      });
  };

// Vendor Search
export const openVendorLookupDialog = (
  empId: string,
  companyId: string,
  vendorType: VendorType[],
  isSkipRenctlyUsed?: boolean,
  backType?: VendorBackType
) => {
  return (dispatch: AppDispatch) => {
    dispatch(vendorBackTypeActions.set(backType || vendorBackTypes.REPORT));
    dispatch(vendorTypeAction.set(vendorType[0]));
    // skip recently used or no company vendor used
    if (isSkipRenctlyUsed || vendorType[0] === vendorTypes.PERSONAL) {
      dispatch(activeDialogActions.vendorLookup());
    } else {
      dispatch(vendorSelectActions.clear());
      dispatch(dialogLoadingActions.toggle(true));
      dispatch(activeDialogActions.vendorLookup());
      return getRecentlyUsedVendor(empId, companyId)
        .then((res) => dispatch(vendorRecentlyUsedActions.set(res)))
        .finally(() => dispatch(dialogLoadingActions.toggle(false)));
    }
  };
};

export const openVendorCreateDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.vendorCreate());
};

export const openVendorDetailModal = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.vendorDetail());
};

export const openSubRoleInfoDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.switchSubRole());
};

export const openCostCenterDialog =
  (
    targetDate: string,
    employeeId: string,
    companyId: string,
    isSkipRecentlyUsed: boolean
  ) =>
  (dispatch: AppDispatch) => {
    if (isSkipRecentlyUsed) {
      return dispatch(activeDialogActions.costCenter());
    } else {
      dispatch(dialogLoadingActions.toggle(true));
      dispatch(activeDialogActions.costCenter());
      return dispatch(
        getRecentCostCenters(employeeId, targetDate, companyId)
      ).then(() => {
        dispatch(dialogLoadingActions.toggle(false));
      });
    }
  };

export const openVendorEditDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.vendorEdit());
};

export const openSwitchEmployeeDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.switchEmployee());
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
    return dispatch(preRequestHistoryActions.getHistory(reportId))
      .then(() => dispatch(activeDialogActions.editHistory()))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  };

export const openEILookupDialog =
  (
    item: EISearchObj,
    empId: string,
    companyId: string,
    isSkipRenctlyUsed?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(eiSelectActions.set(item));
    if (isSkipRenctlyUsed) {
      return dispatch(activeDialogActions.eiLookup());
    } else {
      dispatch(activeDialogActions.eiLookup());
      dispatch(dialogLoadingActions.toggle(true));
      return getRecentlyUsedCustomEI(
        empId,
        companyId,
        item.extendedItemLookupId,
        item.extendedItemCustomId
      )
        .then((res) => dispatch(eiRecentlyUsedActions.set(res)))
        .finally(() => dispatch(dialogLoadingActions.toggle(false)));
    }
  };
