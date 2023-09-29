import { Reducer } from 'redux';

import { createSelector } from 'reselect';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../../commons/actions/app';
import Api from '../../../../../commons/api';

import { AllowanceDailyRecord, OwnerInfo } from '../../../models/types';

import { State as RootState } from '../../index';

type ResponseBody = {
  period: string;
  employeeInfoList: {
    startDate: string;
    endDate: string;
    departmentName: string;
    workingTypeName: string;
  }[];
  employeeCode: string;
  employeeName: string;
  dailyRecordList: AllowanceDailyRecord[];
};

type State = {
  readonly period: string;
  readonly employeeInfoList: OwnerInfo[];
  readonly dailyRecordList: {
    allIds: string[];
    byId: {
      [key: string]: AllowanceDailyRecord;
    };
  };
};

/** Define constants */
export const createOwnerInfos = (
  employeeCode: ResponseBody['employeeCode'],
  employeeName: ResponseBody['employeeName'],
  employeeInfoList: ResponseBody['employeeInfoList']
): OwnerInfo[] =>
  employeeInfoList.map(
    ({ startDate, endDate, departmentName, workingTypeName }) => ({
      startDate,
      endDate,
      employee: {
        code: employeeCode,
        name: employeeName,
      },
      department: {
        name: departmentName,
      },
      workingType: {
        name: workingTypeName,
      },
    })
  );

export const constants = {
  FETCH_SUCCESS: 'MODULES/ENTITIES/DAILY_ALLOWANCE/FETCH_SUCCESS',
};

/** Define actions */

const convertDailyRecordList = (
  dailyRecordList: AllowanceDailyRecord[]
): {
  allIds: string[];
  byId: {
    [key: string]: AllowanceDailyRecord;
  };
} => ({
  allIds: dailyRecordList.map((detail) => detail.recordDate),
  byId: Object.assign(
    {},
    ...dailyRecordList.map((detail) => ({ [detail.recordDate]: detail }))
  ),
});

const fetchSuccess = (body: ResponseBody) => ({
  type: constants.FETCH_SUCCESS,
  payload: {
    period: body.period,
    employeeInfoList: createOwnerInfos(
      body.employeeCode,
      body.employeeName,
      body.employeeInfoList
    ),
    dailyRecordList: convertDailyRecordList(body.dailyRecordList),
  },
});

export const actions = {
  /**
   * @param startDate date on the month. Must be formatted ISO-8601.
   * @param endDate date on the month. Must be formatted ISO-8601.
   * @param [targetEmployeeId=null] The ID of target employee
   */
  fetch:
    (
      startDate: string,
      endDate: string,
      targetEmployeeId: string | null | undefined = null
    ) =>
    (dispatch: any) => {
      dispatch(loadingStart());

      const req = {
        path: '/att/daily-allowance/get',
        param: {
          startDate,
          endDate,
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
  dailyRecordListSelector: createSelector(
    (state: RootState) => state.entities.dailyallowance.dailyRecordList.allIds,
    (state: RootState) => state.entities.dailyallowance.dailyRecordList.byId,
    (allIds, byId) => allIds.map((id) => byId[id])
  ),
};

/** Define reducer */

const initialState: State = {
  period: '',
  employeeInfoList: [],
  dailyRecordList: {
    allIds: [],
    byId: {},
  },
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case constants.FETCH_SUCCESS:
      return {
        period: action.payload.period,
        employeeInfoList: action.payload.employeeInfoList,
        dailyRecordList: action.payload.dailyRecordList,
      };

    default:
      return state;
  }
}) as Reducer<State, any>;
