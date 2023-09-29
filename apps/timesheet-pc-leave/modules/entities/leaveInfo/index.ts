import { Reducer } from 'redux';

import { createSelector } from 'reselect';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';
import Api from '../../../../commons/api';

import { DaysManagedLeave, LeaveDetail } from '../../../models/types';

import { State as RootState } from '../../index';

type ResponseBody = {
  period: string;
  departmentName: string | null | undefined;
  workingTypeName: string;
  employeeCode: string;
  employeeName: string;
  leaveDetails: LeaveDetail[];
  annualLeave: DaysManagedLeave;
  managedLeave: DaysManagedLeave[];
  compensatoryLeave: DaysManagedLeave[];
};

type State = {
  readonly period: string;
  readonly departmentName: string;
  readonly workingTypeName: string;
  readonly employeeCode: string;
  readonly employeeName: string;
  readonly leaveDetails: {
    allIds: string[];
    byId: {
      [key: string]: LeaveDetail;
    };
  };
  readonly annualLeave: DaysManagedLeave | null | undefined;
  readonly paidManagedLeave: DaysManagedLeave[] | null | undefined;
  readonly unpaidManagedLeave: DaysManagedLeave[] | null | undefined;
  readonly compensatoryLeave: DaysManagedLeave[] | null | undefined;
};

/** Define constants */

export const constants = {
  FETCH_SUCCESS: 'MODULES/ENTITIES/LEAVE_INFO/FETCH_SUCCESS',
};

/** Define actions */

const convertLeaveDetails = (
  leaveDetails: LeaveDetail[]
): {
  allIds: string[];
  byId: {
    [key: string]: LeaveDetail;
  };
} => ({
  allIds: leaveDetails.map((detail) => detail.requestId),
  byId: Object.assign(
    {},
    ...leaveDetails.map((detail) => ({ [detail.requestId]: detail }))
  ),
});

const classifyManagedLeaves = (
  managedLeaves: DaysManagedLeave[]
): {
  paidManagedLeave: DaysManagedLeave[];
  unpaidManagedLeave: DaysManagedLeave[];
  compensatoryLeave: DaysManagedLeave[];
} => {
  const paidManagedLeave = [];
  const unpaidManagedLeave = [];
  const compensatoryLeave = [];

  managedLeaves.forEach((managedLeave: DaysManagedLeave) => {
    switch (managedLeave.leaveType) {
      case 'Paid':
        paidManagedLeave.push(managedLeave);
        break;

      case 'Unpaid':
        unpaidManagedLeave.push(managedLeave);
        break;

      case 'Compensatory':
        compensatoryLeave.push(managedLeave);
        break;

      default:
    }
  });

  return {
    paidManagedLeave,
    unpaidManagedLeave,
    compensatoryLeave,
  };
};

const fetchSuccess = (body: ResponseBody) => ({
  type: constants.FETCH_SUCCESS,
  payload: {
    period: body.period,
    departmentName: body.departmentName,
    workingTypeName: body.workingTypeName,
    employeeCode: body.employeeCode,
    employeeName: body.employeeName,
    leaveDetails: convertLeaveDetails(body.leaveDetails),
    annualLeave: body.annualLeave,
    ...classifyManagedLeaves(body.managedLeave),
  },
});

export const actions = {
  /**
   * @param targetDate date on the month. Must be formatted ISO-8601.
   * @param [targetEmployeeId=null] The ID of target employee
   */
  fetch:
    (targetDate: string, targetEmployeeId: string | null | undefined = null) =>
    (dispatch: any) => {
      dispatch(loadingStart());

      const req = {
        path: '/att/leave-info/get',
        param: {
          targetDate,
          empId: targetEmployeeId,
        },
      };

      return Api.invoke(req)
        .then((result) => {
          dispatch(fetchSuccess(result as ResponseBody));
        })
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: false }));
        })
        .then(() => {
          dispatch(loadingEnd());
        });
    },
};

/** Define selectors */

export const selectors = {
  leaveDetailsSelector: createSelector(
    (state: RootState) => state.entities.leaveInfo.leaveDetails.allIds,
    (state: RootState) => state.entities.leaveInfo.leaveDetails.byId,
    (allIds, byId) => allIds.map((id) => byId[id])
  ),
};

/** Define reducer */

const initialState: State = {
  period: '',
  departmentName: '',
  workingTypeName: '',
  employeeCode: '',
  employeeName: '',
  leaveDetails: {
    allIds: [],
    byId: {},
  },
  annualLeave: null,
  paidManagedLeave: null,
  unpaidManagedLeave: null,
  compensatoryLeave: null,
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case constants.FETCH_SUCCESS:
      return {
        period: action.payload.period,
        departmentName: action.payload.departmentName,
        workingTypeName: action.payload.workingTypeName,
        employeeCode: action.payload.employeeCode,
        employeeName: action.payload.employeeName,
        leaveDetails: action.payload.leaveDetails,
        annualLeave: action.payload.annualLeave,
        paidManagedLeave: action.payload.paidManagedLeave,
        unpaidManagedLeave: action.payload.unpaidManagedLeave,
        compensatoryLeave: action.payload.compensatoryLeave,
      };

    default:
      return state;
  }
}) as Reducer<State, any>;
