import { Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../../commons/actions/app';

import WorkingDaysRepository from '../../../../../repositories/WorkingDaysRepository';

import {
  errorCode,
  workingCheckTypeCode,
  WorkingDays,
} from '../../../../../domain/models/attendance/WorkingDays';

import { AppDispatch } from '../../../AppThunk';

export const ACTIONS = {
  CHECK_SUCCESS: 'MODULES/UI/EXPENSES/RECORDITEMPANE/WORKINGDAYS/CHECK',
  CLEAR: 'MODULES/UI/EXPENSES/RECORDITEMPANE/WORKINGDAYS/CLEAR',
};

const makeIsFlag = (workingDay) => {
  const { isRecordSuccess, attWorkingDayCheck, recordErrors } = workingDay;
  const isWorkDay = isRecordSuccess && attWorkingDayCheck.isWorkDay;
  const isError = !isRecordSuccess;

  const workingCheckType = attWorkingDayCheck
    ? attWorkingDayCheck.workingCheckType
    : '';

  const recordErrorCode = recordErrors ? recordErrors.errorCode : '';

  const isWorkingType = (code: string) =>
    workingCheckTypeCode[code] === workingCheckType;
  const isErrorCode = (code: string) => errorCode[code] === recordErrorCode;

  return {
    isWorkDay,
    isError,
    isLeave: isWorkingType('LEAVE'),
    isHoliday: isWorkingType('HOLIDAY'),
    isLegalHoliday: isWorkingType('LEGAL_HOLIDAY'),
    isLeaveOfAbsence: isWorkingType('LEAVE_OF_ABSENCE'),
    isAbsence: isWorkingType('ABSENCE'),
    isAttRecordNotFound: isErrorCode('ATT_RECORD_NOT_FOUND'),
    isIllegalAttCalculation: isErrorCode('ILLEGAL_ATT_CALCULATION'),
  };
};

const formatter = (body: WorkingDays) => {
  return body.records.reduce(
    (result, workingDay) => ({
      ...result,
      [workingDay.checkDate]: {
        ...makeIsFlag(workingDay),
      },
    }),
    {}
  );
};

const checkSuccess = (body: any) => ({
  type: ACTIONS.CHECK_SUCCESS,
  payload: body,
});

export const actions = {
  check:
    (targetDates: Array<string>, empId?: string) =>
    (dispatch: AppDispatch): void | any => {
      dispatch(loadingStart());
      return WorkingDaysRepository.check(empId, targetDates)
        .then((body: WorkingDays) => {
          dispatch(loadingEnd());
          return dispatch(checkSuccess(formatter(body)));
        })
        .catch((err) => {
          dispatch(loadingEnd());
          dispatch(catchApiError(err, { isContinuable: true }));
          throw err;
        });
    },
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

//
// Reducer
//
const initialState = {};

// example
// {
//    2018/03/33 : {
//      isWorkingDay: false,
//      isError: false,
//      isLeave: true,
//      isHoliday: false,
//      isLegalHoliday: false,
//      isLeaveOfAbsence: false,
//      isAttRecordNotFound: false,
//      isIllegalAttCalculation: false,
//    }
// }
export type Props =
  | {
      string: {
        isError: boolean;
        isWorkDay: boolean;
        messageType: string | null;
      };
    }
  | Record<string, unknown>;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.CHECK_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Props, any>;
