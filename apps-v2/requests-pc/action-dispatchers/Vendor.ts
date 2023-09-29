import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import { actions as vendorListActions } from '@apps/commons/modules/exp/entities/vendorList';

import {
  getRecentlyUsedVendor,
  getVendorDetail,
  getVendorList,
  Vendor,
  VendorItemList,
} from '../../domain/models/exp/Vendor';

import { actions as personalVendorActions } from '../../domain/modules/exp/personalVendor';
import { AppDispatch } from '../modules/AppThunk';
import { actions as activeDialogActions } from '../modules/ui/expenses/dialog/activeDialog';
import { actions as dialogLoadingActions } from '../modules/ui/expenses/dialog/isLoading';
import { actions as personalVendorListActions } from '../modules/ui/expenses/dialog/vendor/personalList';
import { actions as vendorSelectActions } from '../modules/ui/expenses/dialog/vendor/search';

export const getRecentVendors =
  (empId: string, companyId: string, isPersonalVendor?: boolean) =>
  (dispatch: AppDispatch) => {
    return getRecentlyUsedVendor(empId, companyId, isPersonalVendor)
      .then((result) => {
        return result.records;
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
  };

export const searchVendors =
  (companyId?: string, query?: string, empId?: string) =>
  (dispatch: AppDispatch) => {
    return getVendorList(companyId, query, empId)
      .then((result) => {
        return result.records;
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
  };

/**
 * list vendor
 *
 * @param {string} companyId
 */
export const listVendor = (companyId: string) => (dispatch: AppDispatch) => {
  return dispatch(vendorListActions.list(companyId)).catch((err) =>
    dispatch(catchApiError(err, { isContinuable: true }))
  );
};

/**
 * Search vendor by ID
 *
 * @param {?string} vendorId
 */
export const searchVendorDetail =
  (vendorId?: string) => (dispatch: AppDispatch) => {
    return getVendorDetail(vendorId)
      .then((result: VendorItemList) => {
        dispatch(vendorSelectActions.set(result.records[0]));
        return result;
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
  };

/**
 * Search vendor by name or code
 *
 * @param {string} id
 * @param {string} query
 */
export const searchVendorLookup =
  (id: string, query: string) => (dispatch: AppDispatch) => {
    dispatch(dialogLoadingActions.toggle(true));
    return getVendorList(id, query)
      .then((result: VendorItemList) => {
        return result;
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => {
        dispatch(dialogLoadingActions.toggle(false));
      });
  };

/**
 * Get vendor by id
 *
 * @param {string} vendorId
 *  @param {boolean} loadInBackground true -> hide full screen spinner
 */
export const getPersonalVendor =
  (vendorId: string, loadInBackground?: boolean) => (dispatch: AppDispatch) => {
    if (!loadInBackground) {
      dispatch(loadingStart());
    }
    return dispatch(personalVendorActions.get(vendorId))
      .then((res: Vendor) => {
        if (!loadInBackground) {
          dispatch(loadingEnd());
        }
        return res;
      })
      .catch((err) => {
        if (!loadInBackground) {
          dispatch(loadingEnd());
        }
        dispatch(catchApiError(err, { isContinuable: true }));
      });
  };

/**
 * Save personalvendor
 *
 * @param {Vendor} vendor
 * @param empId
 * @param subroleId
 */
export const saveVendor =
  (vendor: Vendor, empId: string, subroleId: string) =>
  (dispatch: AppDispatch): void => {
    dispatch(personalVendorActions.save(vendor, empId, subroleId))
      .then(({ id, name }) => {
        const vendorCopy = { ...vendor };
        vendorCopy.id = id;
        vendorCopy.name = name;
        dispatch(personalVendorListActions.add(vendorCopy));
        dispatch(activeDialogActions.hide());
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      });
  };

/**
 * Update personalvendor
 *
 * @param {Vendor} vendor
 * @param empId
 * @param subroleId
 */
export const updateVendor =
  (vendor: Vendor, empId: string, subroleId: string) =>
  (dispatch: AppDispatch): void => {
    dispatch(personalVendorActions.update(vendor, empId, subroleId))
      .then(({ name }) => {
        const vendorCopy = { ...vendor };
        vendorCopy.name = name;
        dispatch(personalVendorListActions.update(vendorCopy));
        dispatch(activeDialogActions.hide());
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      });
  };

/**
 * Delete personalvendor
 *
 * @param {Vendor} vendor
 */
export const deleteVendor =
  (vendor: Vendor, subroleId?: string) =>
  (dispatch: AppDispatch): void => {
    dispatch(loadingStart());
    dispatch(personalVendorActions.delete(vendor.id, subroleId))
      .then(() => {
        dispatch(personalVendorListActions.remove(vendor));
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => {
        dispatch(loadingEnd());
      });
  };

/**
 * Undo delete personalvendor
 *
 * @param {Vendor} vendor
 */
export const undoVendorDeletion =
  (vendor: Vendor, empHistoryId?: string) =>
  (dispatch: AppDispatch): void => {
    dispatch(personalVendorListActions.revert(vendor));
    dispatch(loadingStart());
    dispatch(personalVendorActions.restore(vendor.id, empHistoryId))
      .then(() => {
        dispatch(personalVendorListActions.add(vendor));
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => {
        dispatch(loadingEnd());
      });
  };
