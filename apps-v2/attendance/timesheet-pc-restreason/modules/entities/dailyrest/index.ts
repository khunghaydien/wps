import { Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../../commons/actions/app';
import Api from '../../../../../commons/api';

import DailyRestReasonRepository from '@apps/attendance/repositories/DailyRestRecordRepository';

import { DailyRestRecordHeader } from '../../../models/DailyRestRecordHeader';
import { DailyRestRecord } from '@apps/attendance/domain/models/DailyRestRecord';
import { OwnerInfo } from '@apps/attendance/domain/models/OwnerInfo';

type ResponseHeaderBody = DailyRestRecordHeader;

type State = {
  readonly period: string;
  readonly employeeInfoList: OwnerInfo[];
  readonly dailyRecordList: DailyRestRecord[];
};

/** Define constants */
export const createOwnerInfos = (
  employee: ResponseHeaderBody['employee'],
  employeeInfoList: ResponseHeaderBody['employeeInfoList']
): OwnerInfo[] =>
  employeeInfoList.map(({ startDate, endDate, department, workingType }) => ({
    startDate,
    endDate,
    employee: {
      code: employee.code,
      name: employee.name,
    },
    department: {
      name: department.name,
    },
    workingType: {
      name: workingType.name,
    },
  }));

export const constants = {
  FETCH_SUCCESS: 'MODULES/ENTITIES/DAILY_REST/FETCH_SUCCESS',
  FETCH_HEADER_SUCCESS: 'MODULES/ENTITIES/DAILY_REST/FETCH_HEADER_SUCCESS',
};

const fetchSuccess = (body: DailyRestRecord[]) => ({
  type: constants.FETCH_SUCCESS,
  payload: {
    dailyRecordList: body,
  },
});

const fetchHeaderSuccess = (body: ResponseHeaderBody) => ({
  type: constants.FETCH_HEADER_SUCCESS,
  payload: {
    period: body.yearMonthly.yearMonthly,
    employee: body.employee,
    employeeInfoList: body.employeeInfoList,
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
    async (dispatch: any) => {
      dispatch(loadingStart());

      try {
        const result = await DailyRestReasonRepository.search({
          startDate,
          endDate,
          employeeId: targetEmployeeId,
        });
        dispatch(fetchSuccess(result));
      } catch (err) {
        dispatch(catchApiError(err, { isContinuable: false }));
      } finally {
        dispatch(loadingEnd());
      }
    },
  fetchHeader:
    (startDate: string, targetEmployeeId: string | null | undefined = null) =>
    (dispatch: any) => {
      dispatch(loadingStart());

      const req = {
        path: '/att/employee/get',
        param: {
          targetDate: startDate,
          empId: targetEmployeeId,
        },
      };

      return Api.invoke(req)
        .then((result) => {
          dispatch(fetchHeaderSuccess(result as ResponseHeaderBody));
        })
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: false }));
        })
        .then(() => {
          dispatch(loadingEnd());
        });
    },
};

/** Define reducer */

const initialState: State = {
  period: '',
  employeeInfoList: [],
  dailyRecordList: [],
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case constants.FETCH_SUCCESS:
      return {
        ...state,
        dailyRestList: action.payload.dailyRecordList,
      };

    case constants.FETCH_HEADER_SUCCESS:
      return {
        ...state,
        period: action.payload.period,
        employeeInfoList: createOwnerInfos(
          action.payload.employee,
          action.payload.employeeInfoList
        ),
      };

    default:
      return state;
  }
}) as Reducer<State, any>;
