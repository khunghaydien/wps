import _ from 'lodash';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import msg from '@commons/languages';
import { actions as fileMetadataActions } from '@commons/modules/exp/entities/fileMetadata';
import { showToast, showToastWithType } from '@commons/modules/toast';
import TextUtil from '@commons/utils/TextUtil';

import STATUS from '../../domain/models/approval/request/Status';
import {
  ExpRequestList,
  SearchConditions,
} from '../../domain/models/exp/request/Report';
import {
  getVendorDetail,
  VendorItemList,
} from '../../domain/models/exp/Vendor';
import {
  BulkApprovalRes,
  BulkError,
} from '@apps/domain/models/approval/request/Request';

import { actions as approvalActions } from '../../domain/modules/approval/request/approve';
import { actions as rejectActions } from '../../domain/modules/approval/request/reject';
import { actions as expPreApprovalActions } from '../../domain/modules/exp/request/pre-request';
import { actions as expRequestActions } from '../../domain/modules/exp/request/report';
import { actions as bulkErrorActions } from '../modules/ui/bulkApproval/error';
import { actions as companyRequestCountActions } from '../modules/ui/companyRequestCount';
import { actions as commentActions } from '../modules/ui/expenses/detail/comment';
import { actions as vendorSelectActions } from '../modules/ui/expenses/dialog/vendor';
import {
  actions as pageActions,
  PAGE_SIZE,
} from '../modules/ui/expenses/list/page';

import { AppDispatch } from './AppThunk';

const getActions = (isPreApproval: boolean) => {
  return isPreApproval ? expPreApprovalActions : expRequestActions;
};

const formatBulkErrorList = (res: BulkApprovalRes | null) => {
  if (!res) {
    return {
      errorCount: 0,
      hasError: false,
      bulkErrorList: [],
      requestIdErrorList: [],
    };
  }
  const errorCount = res.errorCount;
  const hasError = errorCount > 0;
  const bulkErrorList: Array<BulkError> = res.approvalProcessResults.filter(
    (process) => !process.isSuccess && process.requestId
  );
  const requestIdSuccessList = res.approvalProcessResults
    .filter((process) => process.isSuccess && process.requestId)
    .map((process) => process.requestId);
  return {
    errorCount,
    hasError,
    bulkErrorList,
    requestIdSuccessList,
  };
};

const showToastBulkApproval =
  (
    hasError: boolean,
    errorCount: number,
    requestIdList: string[],
    bulkErrorList: Array<BulkError>,
    isApprove?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    if (hasError) {
      dispatch(
        showToastWithType(
          TextUtil.template(
            isApprove
              ? msg().Appr_Msg_BulkApproveError
              : msg().Appr_Msg_BulkRejectError,
            requestIdList.length,
            errorCount
          ),
          4000,
          'error'
        )
      );
      dispatch(bulkErrorActions.set(bulkErrorList));
    } else {
      dispatch(
        showToast(
          TextUtil.template(
            isApprove
              ? msg().Appr_Msg_BulkApproveSuccess
              : msg().Appr_Msg_BulkRejectSuccess,
            requestIdList.length
          )
        )
      );
    }
  };

const handleBulkApprovalResponse =
  (
    res: BulkApprovalRes,
    requestIdList: string[],
    isPreApproval: boolean,
    requestList: ExpRequestList,
    companyId: string,
    empId: string,
    currRequestId: string,
    isApproval: boolean
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(commentActions.clear());
    const {
      errorCount,
      hasError,
      bulkErrorList,
      requestIdSuccessList: updateRequestIdList,
    } = formatBulkErrorList(res);
    const expActions = getActions(isPreApproval);
    dispatch(
      expActions.setBulkStatus(
        requestList,
        updateRequestIdList,
        isApproval ? STATUS.Approved : STATUS.Rejected
      )
    );
    dispatch(companyRequestCountActions.updateRequestCount(companyId));
    if (
      requestIdList.includes(currRequestId) &&
      updateRequestIdList.includes(currRequestId)
    ) {
      browseDetail(currRequestId, isPreApproval, empId)(dispatch);
    }
    showToastBulkApproval(
      hasError,
      errorCount,
      requestIdList,
      bulkErrorList,
      isApproval
    )(dispatch);
  };

const handleBulkApprovalError =
  (err, requestIdList: string[], isApproval?: boolean) =>
  (dispatch: AppDispatch) => {
    if (requestIdList.length === 1) {
      const errMsg = isApproval
        ? msg().Appr_Err_CannotApproveRequest
        : msg().Appr_Err_CannotRejectRequest;
      const error = [
        {
          requestId: requestIdList[0],
          isSuccess: false,
          errors: [
            {
              message: errMsg,
              code: '',
            },
          ],
        },
      ];
      dispatch(showToastWithType(errMsg, 4000, 'error'));
      dispatch(bulkErrorActions.set(error));
      return;
    }
    dispatch(catchApiError(err, { isContinuable: true }));
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
        const receiptIds: Array<string> = [];
        records.forEach((record) => {
          const { receiptId, receiptList } = record;
          if (receiptId) receiptIds.push(receiptId);
          if (!_.isEmpty(receiptList)) {
            receiptList.forEach((receipt) => {
              receiptIds.push(receipt.receiptId);
            });
          }
        });
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
      .then((res: BulkApprovalRes) => {
        if (res.errorCount > 0 && requestIdList.length === 1) {
          handleBulkApprovalError(undefined, requestIdList, true)(dispatch);
          return;
        }
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
      .then((res: BulkApprovalRes) => {
        if (res.errorCount > 0 && requestIdList.length === 1) {
          handleBulkApprovalError(undefined, requestIdList)(dispatch);
          return;
        }
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
      .then((res: BulkApprovalRes) => {
        if (res.errorCount > 0 && requestIdList.length === 1) {
          handleBulkApprovalError(undefined, requestIdList, true)(dispatch);
          return;
        }
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

const bulkApprove = (
  requestIdList: Array<string>,
  isPreApproval: boolean,
  requestList: ExpRequestList,
  companyId: string,
  empId: string,
  currRequestId: string
) => {
  return (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(approvalActions.approve(requestIdList, ''))
      .then((res: BulkApprovalRes) => {
        handleBulkApprovalResponse(
          res,
          requestIdList,
          isPreApproval,
          requestList,
          companyId,
          empId,
          currRequestId,
          true
        )(dispatch);
      })
      .catch((err) => {
        handleBulkApprovalError(err, requestIdList, true)(dispatch);
      })
      .finally(() => dispatch(loadingEnd()));
  };
};

export const bulkApprovalForReport = (
  requestIdList: Array<string>,
  requestList: ExpRequestList,
  companyId: string,
  isPreApproval: boolean,
  empId: string,
  currRequestId: string
) =>
  bulkApprove(
    requestIdList,
    isPreApproval,
    requestList,
    companyId,
    empId,
    currRequestId
  );

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
      .then((res: BulkApprovalRes) => {
        if (res.errorCount > 0 && requestIdList.length === 1) {
          handleBulkApprovalError(undefined, requestIdList)(dispatch);
          return;
        }
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

const bulkReject = (
  requestIdList: Array<string>,
  isPreApproval: boolean,
  requestList: ExpRequestList,
  companyId: string,
  empId: string,
  currRequestId: string
) => {
  return (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(rejectActions.reject(requestIdList, ''))
      .then((res: BulkApprovalRes) => {
        handleBulkApprovalResponse(
          res,
          requestIdList,
          isPreApproval,
          requestList,
          companyId,
          empId,
          currRequestId,
          false
        )(dispatch);
      })
      .catch((err) => {
        handleBulkApprovalError(err, requestIdList)(dispatch);
      })
      .finally(() => dispatch(loadingEnd()));
  };
};

export const bulkRejectForReport = (
  requestIdList: Array<string>,
  requestList: ExpRequestList,
  companyId: string,
  isPreApproval: boolean,
  empId: string,
  currRequestId: string
) =>
  bulkReject(
    requestIdList,
    isPreApproval,
    requestList,
    companyId,
    empId,
    currRequestId
  );

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
