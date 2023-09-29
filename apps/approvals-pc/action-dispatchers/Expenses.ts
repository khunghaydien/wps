import _ from 'lodash';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import { actions as fileMetadataActions } from '@commons/modules/exp/entities/fileMetadata';

import STATUS from '../../domain/models/approval/request/Status';
import {
  ExpRequestList,
  SearchConditions,
} from '../../domain/models/exp/request/Report';
import {
  getVendorDetail,
  VendorItemList,
} from '../../domain/models/exp/Vendor';

import { actions as approvalActions } from '../../domain/modules/approval/request/approve';
import { actions as rejectActions } from '../../domain/modules/approval/request/reject';
import { actions as expPreApprovalActions } from '../../domain/modules/exp/request/pre-request';
import { actions as expRequestActions } from '../../domain/modules/exp/request/report';
import { actions as companyRequestCountActions } from '../modules/ui/companyRequestCount';
import { actions as commentActions } from '../modules/ui/expenses/detail/comment';
import { actions as activeDialogActions } from '../modules/ui/expenses/dialog/activeDialog';
import { actions as vendorSelectActions } from '../modules/ui/expenses/dialog/vendor';
import {
  actions as pageActions,
  PAGE_SIZE,
} from '../modules/ui/expenses/list/page';

import { AppDispatch } from './AppThunk';

const getActions = (isPreApproval: boolean) => {
  return isPreApproval ? expPreApprovalActions : expRequestActions;
};

const browseDetail = (
  requestId: string,
  isPreApproval: boolean,
  empId: string
) => {
  const expActions = getActions(isPreApproval);
  return (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(expActions.get(requestId, empId))
      .then((res) => {
        const records = _.get(res, 'payload.records', []);
        const receiptIds = records
          .filter(({ receiptId }) => receiptId)
          .map(({ receiptId }) => receiptId);
        if (!_.isEmpty(receiptIds)) {
          dispatch(fileMetadataActions.fetch(receiptIds));
        }
        dispatch(commentActions.clear());
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => {
        dispatch(loadingEnd());
      });
  };
};

export const browseDetailForExpApproval = (requestId: string, empId: string) =>
  browseDetail(requestId, false, empId);

export const browseDetailForPreApproval = (requestId: string, empId: string) =>
  browseDetail(requestId, true, empId);

const fetchExpList = (
  isPreApproval: boolean,
  requestIdList: string[],
  pageNum: number,
  empId: string,
  isEmpty?: boolean
) => {
  return (dispatch: AppDispatch) => {
    const expActions = getActions(isPreApproval);
    const idsCurrentPage = requestIdList.slice(
      PAGE_SIZE * (pageNum - 1),
      PAGE_SIZE * pageNum
    );
    dispatch(loadingStart());
    dispatch(expActions.list(idsCurrentPage, empId, isEmpty))
      .then((res) => {
        dispatch(pageActions.set(pageNum));
        const firstId = res.payload[0].requestId;
        browseDetail(firstId, isPreApproval, empId)(dispatch);
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };
};

export const fetchExpListForExpApproval = (
  requestIdList: string[],
  pageNum: number,
  empId: string,
  isEmpty?: boolean
) => fetchExpList(false, requestIdList, pageNum, empId, isEmpty);

export const fetchExpListForPreApproval = (
  requestIdList: string[],
  pageNum: number,
  empId: string,
  isEmpty?: boolean
) => fetchExpList(true, requestIdList, pageNum, empId, isEmpty);

const fetchAllIds = (
  isPreApproval: boolean,
  searchCondition: SearchConditions,
  empId: string,
  isEmpty?: boolean
) => {
  const expActions = getActions(isPreApproval);
  return (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    const empBaseIds = (searchCondition as any).empBaseIds;
    // TODO make BE api accept empBaseIds instead of empBaseIdList, so that consistent with other pages
    if (empBaseIds) {
      searchCondition.empBaseIdList = empBaseIds;
      delete (searchCondition as any).empBaseIds;
    }
    dispatch(expActions.listIds(searchCondition, empId, isEmpty))
      .then((ret) => {
        const ids = ret.payload.requestIdList;
        if (ids.length > 0) {
          fetchExpList(isPreApproval, ids, 1, empId, isEmpty)(dispatch);
        } else if (ids.length === 0) {
          dispatch(expActions.clear());
        }
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };
};
export const fetchAllIdsForExpApproval = (
  searchCondition: SearchConditions,
  empId: string,
  isEmpty?: boolean
) => fetchAllIds(false, searchCondition, empId, isEmpty);

export const fetchAllIdsForPreApproval = (
  searchCondition: SearchConditions,
  empId: string,
  isEmpty?: boolean
) => fetchAllIds(true, searchCondition, empId, isEmpty);

export const approveSingle = (
  requestIdList: Array<string>,
  comment: string,
  isPreApproval: boolean,
  empId: string
) => {
  return (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(approvalActions.approve(requestIdList, comment))
      .then(() => {
        browseDetail(requestIdList[0], isPreApproval, empId)(dispatch);
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .then(() => dispatch(loadingEnd()));
  };
};

export const rejectSingle = (
  requestIdList: Array<string>,
  comment: string,
  isPreApproval: boolean,
  empId: string
) => {
  return (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(rejectActions.reject(requestIdList, comment))
      .then(() => {
        browseDetail(requestIdList[0], isPreApproval, empId)(dispatch);
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .then(() => dispatch(loadingEnd()));
  };
};

const approve = (
  requestIdList: Array<string>,
  comment: string,
  isPreApproval: boolean,
  allIds: Array<string>,
  pageNum: number,
  requestList: ExpRequestList,
  empId: string,
  companyId: string
) => {
  return (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(approvalActions.approve(requestIdList, comment))
      .then(() => {
        dispatch(commentActions.clear());
        const currentId = requestIdList[0];
        const index = _.indexOf(allIds, currentId);
        const isLastOne = index >= allIds.length - 1;
        const isLastOneInCurrentPage = index === pageNum * PAGE_SIZE - 1;
        const expActions = getActions(isPreApproval);
        dispatch(expActions.setStatus(requestList, currentId, STATUS.Approved));
        // update number here if applying bulk approval
        dispatch(companyRequestCountActions.updateRequestCount(companyId));
        if (isLastOne) {
          browseDetail(allIds[index], isPreApproval, empId)(dispatch);
        } else if (isLastOneInCurrentPage) {
          fetchExpList(isPreApproval, allIds, pageNum + 1, empId)(dispatch);
        } else {
          browseDetail(allIds[index + 1], isPreApproval, empId)(dispatch);
        }
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => {
        dispatch(loadingEnd());
      });
  };
};

export const approvalForExpApproval = (
  requestIdList: Array<string>,
  comment: string,
  allIds: Array<string>,
  pageNum: number,
  requestList: ExpRequestList,
  empId: string,
  companyId: string
) =>
  approve(
    requestIdList,
    comment,
    false,
    allIds,
    pageNum,
    requestList,
    empId,
    companyId
  );

export const approvalForPreApproval = (
  requestIdList: Array<string>,
  comment: string,
  allIds: Array<string>,
  pageNum: number,
  requestList: ExpRequestList,
  empId: string,
  companyId: string
) =>
  approve(
    requestIdList,
    comment,
    true,
    allIds,
    pageNum,
    requestList,
    empId,
    companyId
  );

const reject = (
  requestIdList: Array<string>,
  comment: string,
  isPreApproval: boolean,
  allIds: Array<string>,
  pageNum: number,
  requestList: ExpRequestList,
  empId: string,
  companyId: string
) => {
  return (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(rejectActions.reject(requestIdList, comment))
      .then(() => {
        dispatch(commentActions.clear());
        const currentId = requestIdList[0];
        const index = _.indexOf(allIds, currentId);
        const isLastOne = index >= allIds.length - 1;
        const isLastOneInCurrentPage = index === pageNum * PAGE_SIZE - 1;
        const expActions = getActions(isPreApproval);
        dispatch(expActions.setStatus(requestList, currentId, STATUS.Rejected));
        dispatch(companyRequestCountActions.updateRequestCount(companyId));
        if (isLastOne) {
          browseDetail(allIds[index], isPreApproval, empId)(dispatch);
        } else if (isLastOneInCurrentPage) {
          fetchExpList(isPreApproval, allIds, pageNum + 1, empId)(dispatch);
        } else {
          browseDetail(allIds[index + 1], isPreApproval, empId)(dispatch);
        }
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => {
        dispatch(loadingEnd());
      });
  };
};

export const rejectForExpApproval = (
  requestIdList: Array<string>,
  comment: string,
  allIds: Array<string>,
  pageNum: number,
  requestList: ExpRequestList,
  empId: string,
  companyId: string
) =>
  reject(
    requestIdList,
    comment,
    false,
    allIds,
    pageNum,
    requestList,
    empId,
    companyId
  );

export const rejectForPreApproval = (
  requestIdList: Array<string>,
  comment: string,
  allIds: Array<string>,
  pageNum: number,
  requestList: ExpRequestList,
  empId: string,
  companyId: string
) =>
  reject(
    requestIdList,
    comment,
    true,
    allIds,
    pageNum,
    requestList,
    empId,
    companyId
  );

export const openRecordItemsConfirmDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.recordItemsConfirm());
};

/**
 * Search vendor by ID
 *
 * @param {?string} vendorId
 */
export const searchVendorDetail =
  (vendorId?: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    return getVendorDetail(vendorId)
      .then((result: VendorItemList) => {
        dispatch(vendorSelectActions.set(result.records[0]));
        dispatch(loadingEnd());
        return result;
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
  };
