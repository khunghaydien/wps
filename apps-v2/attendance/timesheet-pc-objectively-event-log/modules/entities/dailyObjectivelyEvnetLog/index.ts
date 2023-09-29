import { Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../../commons/actions/app';
import Api from '../../../../../commons/api';

import {
  ObjectivelyEventLogDailyRecord,
  ObjectivelyEventLogDailyRecordHeader,
  OwnerInfo,
} from '../../../models/types';

type ResponseHeaderBody = ObjectivelyEventLogDailyRecordHeader;

type ResponseBody = {
  dailyRecordList: ObjectivelyEventLogDailyRecord[];
};

type State = {
  readonly period: string;
  readonly employeeInfoList: OwnerInfo[];
  readonly dailyRecordList: ObjectivelyEventLogDailyRecord[];
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
  FETCH_SUCCESS: 'MODULES/ENTITIES/DAILY_OBJECTIVELYEVENTLOG/FETCH_SUCCESS',
  FETCH_HEADER_SUCCESS:
    'MODULES/ENTITIES/DAILY_OBJECTIVELYEVENTLOG/FETCH_HEADER_SUCCESS',
};

const fetchSuccess = (body: ResponseBody) => ({
  type: constants.FETCH_SUCCESS,
  payload: {
    dailyRecordList: body.dailyRecordList,
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
    (dispatch: any) => {
      dispatch(loadingStart());

      const req = {
        path: '/att/daily-objectively-event-log/get',
        param: {
          startDate,
          endDate,
          empId: targetEmployeeId,
        },
      };

      return Api.invoke(req)
        .then((result) => {
          let inLogList = [];
          let inLogObj1 = {};
          let inLogObj2 = {};
          let inLogObj3 = {};
          let outLogList = [];
          let outLogObj1 = {};
          let outLogObj2 = {};
          let outLogObj3 = {};
          result.dailyRecordList.forEach((item, index) => {
            inLogObj1 = {
              allowingDeviationTime:
                item.attRecord.attSummary.workingType.allowingDeviationTime1,
              enteringEventLogSettingCode: item.enteringEventLogSettingCode1,
              enteringEventLogId: item.enteringEventLogId1,
              enteringTime: item.enteringTime1,
              deviatedEnteringTime: item.deviatedEnteringTime1,
              requireDeviationReason:
                item.attRecord.attSummary.workingType.requireDeviationReason1,
              objectivelyEventLogSettingName:
                item.attRecord.attSummary.workingType
                  .objectivelyEventLogSetting1 !== null
                  ? item.attRecord.attSummary.workingType
                      .objectivelyEventLogSetting1.name
                  : null,
              objectivelyEventLogSettingId:
                item.attRecord.attSummary.workingType
                  .objectivelyEventLogSetting1 !== null
                  ? item.attRecord.attSummary.workingType
                      .objectivelyEventLogSetting1.id
                  : null,
            };
            inLogObj2 = {
              allowingDeviationTime:
                item.attRecord.attSummary.workingType.allowingDeviationTime2,
              enteringEventLogSettingCode: item.enteringEventLogSettingCode2,
              enteringEventLogId: item.enteringEventLogId2,
              enteringTime: item.enteringTime2,
              deviatedEnteringTime: item.deviatedEnteringTime2,
              requireDeviationReason:
                item.attRecord.attSummary.workingType.requireDeviationReason2,
              objectivelyEventLogSettingName:
                item.attRecord.attSummary.workingType
                  .objectivelyEventLogSetting2 !== null
                  ? item.attRecord.attSummary.workingType
                      .objectivelyEventLogSetting2.name
                  : null,
              objectivelyEventLogSettingId:
                item.attRecord.attSummary.workingType
                  .objectivelyEventLogSetting2 !== null
                  ? item.attRecord.attSummary.workingType
                      .objectivelyEventLogSetting2.id
                  : null,
            };
            inLogObj3 = {
              allowingDeviationTime:
                item.attRecord.attSummary.workingType.allowingDeviationTime3,
              enteringEventLogSettingCode: item.enteringEventLogSettingCode3,
              enteringEventLogId: item.enteringEventLogId3,
              enteringTime: item.enteringTime3,
              deviatedEnteringTime: item.deviatedEnteringTime3,
              requireDeviationReason:
                item.attRecord.attSummary.workingType.requireDeviationReason3,
              objectivelyEventLogSettingName:
                item.attRecord.attSummary.workingType
                  .objectivelyEventLogSetting3 !== null
                  ? item.attRecord.attSummary.workingType
                      .objectivelyEventLogSetting3.name
                  : null,
              objectivelyEventLogSettingId:
                item.attRecord.attSummary.workingType
                  .objectivelyEventLogSetting3 !== null
                  ? item.attRecord.attSummary.workingType
                      .objectivelyEventLogSetting3.id
                  : null,
            };
            inLogList = [inLogObj1, inLogObj2, inLogObj3];

            outLogObj1 = {
              allowingDeviationTime:
                item.attRecord.attSummary.workingType.allowingDeviationTime1,
              leavingEventLogSettingCode: item.leavingEventLogSettingCode1,
              leavingEventLogId: item.leavingEventLogId1,
              leavingTime: item.leavingTime1,
              deviatedLeavingTime: item.deviatedLeavingTime1,
              requireDeviationReason:
                item.attRecord.attSummary.workingType.requireDeviationReason1,
              objectivelyEventLogSettingName:
                item.attRecord.attSummary.workingType
                  .objectivelyEventLogSetting1 !== null
                  ? item.attRecord.attSummary.workingType
                      .objectivelyEventLogSetting1.name
                  : null,
              objectivelyEventLogSettingId:
                item.attRecord.attSummary.workingType
                  .objectivelyEventLogSetting1 !== null
                  ? item.attRecord.attSummary.workingType
                      .objectivelyEventLogSetting1.id
                  : null,
            };
            outLogObj2 = {
              allowingDeviationTime:
                item.attRecord.attSummary.workingType.allowingDeviationTime2,
              leavingEventLogSettingCode: item.leavingEventLogSettingCode2,
              leavingEventLogId: item.leavingEventLogId2,
              leavingTime: item.leavingTime2,
              deviatedLeavingTime: item.deviatedLeavingTime2,
              requireDeviationReason:
                item.attRecord.attSummary.workingType.requireDeviationReason2,
              objectivelyEventLogSettingName:
                item.attRecord.attSummary.workingType
                  .objectivelyEventLogSetting2 !== null
                  ? item.attRecord.attSummary.workingType
                      .objectivelyEventLogSetting2.name
                  : null,
              objectivelyEventLogSettingId:
                item.attRecord.attSummary.workingType
                  .objectivelyEventLogSetting2 !== null
                  ? item.attRecord.attSummary.workingType
                      .objectivelyEventLogSetting2.id
                  : null,
            };
            outLogObj3 = {
              allowingDeviationTime:
                item.attRecord.attSummary.workingType.allowingDeviationTime3,
              leavingEventLogSettingCode: item.leavingEventLogSettingCode3,
              leavingEventLogId: item.leavingEventLogId3,
              leavingTime: item.leavingTime3,
              deviatedLeavingTime: item.deviatedLeavingTime3,
              requireDeviationReason:
                item.attRecord.attSummary.workingType.requireDeviationReason3,
              objectivelyEventLogSettingName:
                item.attRecord.attSummary.workingType
                  .objectivelyEventLogSetting3 !== null
                  ? item.attRecord.attSummary.workingType
                      .objectivelyEventLogSetting3.name
                  : null,
              objectivelyEventLogSettingId:
                item.attRecord.attSummary.workingType
                  .objectivelyEventLogSetting3 !== null
                  ? item.attRecord.attSummary.workingType
                      .objectivelyEventLogSetting3.id
                  : null,
            };

            outLogList = [outLogObj1, outLogObj2, outLogObj3];

            result.dailyRecordList[index].inLogList = inLogList;
            result.dailyRecordList[index].outLogList = outLogList;
          });

          dispatch(fetchSuccess(result as ResponseBody));
        })
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: false }));
        })
        .then(() => {
          dispatch(loadingEnd());
        });
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
        dailyRecordList: action.payload.dailyRecordList,
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
