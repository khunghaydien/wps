import { Dispatch } from 'redux';

import * as appActions from '../../../../../commons/actions/app';
import Api from '../../../../../commons/api';

import { ApprovalTypeValue } from '../../../../../domain/models/approval/ApprovalType';
import {
  STATUS,
  Status,
} from '@attendance/domain/models/approval/AttDailyRequestDetail';

import * as detailActions from '../detail/actions';

import { constants } from './index';

export type AttDailyRequest = {
  id: string;
  employeeName: string;
  departmentName: string;
  photoUrl: string;
  approverName: string;
  approverDepartmentName: string;
  approverPhotoUrl: string;
  requestDate: string;
  startDate: string;
  endDate: string;
  type: string;
  requestStatus: Status;
  originalRequestStatus?: Status;
};

export type AttDailyRequestMap = {
  [id: string]: AttDailyRequest;
};

type Remote = {
  requestId: string;
  employeeName: string;
  departmentName: string | null;
  photoUrl: string;
  approverName: string;
  approverDepartmentName: string | null;
  approverPhotoUrl: string;
  requestDate: string;
  startDate: string;
  endDate: string;
  requestType: string;
  requestStatus: Status;
  originalRequestStatus?: Status;
};

type FetchResponse = Remote[];

const convertFromRemote = (requestList: FetchResponse): AttDailyRequestMap => {
  return requestList.reduce(
    (acc: AttDailyRequestMap, req: any): AttDailyRequestMap => ({
      [req.requestId]: {
        id: req.requestId || '',
        employeeName: req.employeeName || '',
        departmentName: req.departmentName || '',
        photoUrl: req.photoUrl || '',
        approverName: req.approverName || '',
        approverDepartmentName: req.approverDepartmentName || '',
        approverPhotoUrl: req.approverPhotoUrl || '',
        requestDate: req.requestDate || '',
        startDate: req.startDate || '',
        endDate: req.endDate || '',
        type: req.requestType || '',
        requestStatus: req.requestStatus || STATUS.APPROVAL_IN,
        originalRequestStatus: req.originalRequestStatus || STATUS.APPROVAL_IN,
      } as AttDailyRequest,
      ...acc,
    }),
    {}
  );
};

const extractIds = (requestList: FetchResponse): string[] => {
  return requestList.map((req) => {
    return req.requestId;
  });
};

// eslint-disable-next-line spaced-comment
const fetchSuccess =
  (res: { requestList: FetchResponse }, selectedId?: string | null) =>
  (dispatch: Dispatch<any>): void => {
    const { requestList } = res;

    const allIds = extractIds(requestList);
    const byId = convertFromRemote(requestList);

    if (selectedId !== null) {
      const browsingTargetId =
        selectedId && allIds.includes(selectedId) ? selectedId : allIds[0];

      if (browsingTargetId) {
        dispatch(detailActions.browse(browsingTargetId));
      }
    }

    dispatch({
      type: constants.FETCH_SUCCESS,
      payload: {
        byId,
        allIds,
      },
    });
  };

/* eslint-disable import/prefer-default-export */
export const browse =
  (approvalType: ApprovalTypeValue, selectedId?: string | null) =>
  (dispatch: Dispatch<any>): Promise<any> => {
    const req = {
      path: '/att/request-list/daily/get',
      param: { approvalType },
    };

    dispatch(appActions.loadingStart());
    return Api.invoke(req)
      .then((res) => {
        dispatch(fetchSuccess(res, selectedId));
      })
      .catch((err) =>
        dispatch(appActions.catchApiError(err, { isContinuable: false }))
      )
      .then(() => dispatch(appActions.loadingEnd()));
  };

export const clear = () => ({
  type: constants.CLEAR,
});
