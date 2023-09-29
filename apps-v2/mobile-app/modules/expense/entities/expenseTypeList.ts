import { Reducer } from 'redux';

import cloneDeep from 'lodash/cloneDeep';
import includes from 'lodash/includes';

import {
  ExpenseType,
  ExpenseTypeList,
  ExpenseTypeListResult,
  getExpenseTypeById,
  getExpenseTypeList,
  searchExpenseType,
  searchExpenseTypeWithRecord,
} from '../../../../domain/models/exp/ExpenseType';
import {
  isValidRecordType,
  RECORD_TYPE,
  RECORD_TYPE_CATEGORY,
} from '../../../../domain/models/exp/Record';

import { AppDispatch } from '../AppThunk';
import { actions as expTypeUiActions } from '../ui/selectedExpType';

const isJorudanExcluded = (recordType?: string) =>
  recordType === RECORD_TYPE_CATEGORY.noJorudan;

const MOBILE_SUPPORTED_GENERAL_RECORD_TYPES = [
  RECORD_TYPE.General,
  RECORD_TYPE.FixedAllowanceSingle,
  RECORD_TYPE.FixedAllowanceMulti,
  RECORD_TYPE.Mileage,
];

const MOBILE_SUPPORTED_REQUEST_RECORD_TYPES = [RECORD_TYPE.TransportICCardJP];

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/EXPENSE/ENTITIES/EXPENSES_TYPE/GET_SUCESS',
  SEARCH_SUCCESS: 'MODULES/EXPENSE/ENTITIES/EXPENSES_TYPE/SEARCH_SUCESS',
  SEARCH_WITH_TYPE_SUCCESS:
    'MODULES/EXPENSE/ENTITIES/EXPENSES_TYPE/SEARCH_WITH_TYPE_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/EXPENSE/ENTITIES/EXPENSES_TYPE/CLEAR_SUCESS',
};

const getSuccess = (body: ExpenseTypeList) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

const searchSuccess = (body: ExpenseTypeListResult) => ({
  type: ACTIONS.SEARCH_SUCCESS,
  payload: body,
});

const searchWithTypeSuccess = (body: ExpenseTypeList) => ({
  type: ACTIONS.SEARCH_WITH_TYPE_SUCCESS,
  payload: body,
});

const clearExpenseTypeList = () => ({
  type: ACTIONS.CLEAR_SUCCESS,
});

// All record types are supported in mobile app
// IC record type only available when this record type is specified
// Transit record types are also searchable after addition of creating record inside report
const filterExpenseTypeForMobile = (
  res: ExpenseTypeList,
  recordType?: string,
  isRequest?: boolean
) => {
  if (isValidRecordType(recordType)) {
    return res;
  }
  const visibleRecordTypes = [
    ...MOBILE_SUPPORTED_GENERAL_RECORD_TYPES,
    ...(isRequest ? MOBILE_SUPPORTED_REQUEST_RECORD_TYPES : []),
    ...(isJorudanExcluded(recordType) ? [] : [RECORD_TYPE.TransitJorudanJP]),
  ];
  return res.filter(
    (e) => e.hasChildren || includes(visibleRecordTypes, e.recordType)
  );
};

type Action = { payload: ExpenseTypeList; type: string };

export const actions = {
  get:
    (
      empId?: string,
      parentGroupId?: string,
      targetDate?: string,
      recordType?: string,
      expReportTypeId?: string,
      isRequest?: boolean,
      empHistoryId?: string,
      excludedRecordTypes?: string[]
    ) =>
    (dispatch: AppDispatch): Promise<Action> => {
      return getExpenseTypeList(
        empId,
        parentGroupId,
        targetDate,
        isValidRecordType(recordType) ? recordType : '',
        isRequest ? 'REQUEST' : 'REPORT',
        expReportTypeId,
        true,
        excludedRecordTypes,
        empHistoryId
      )
        .then((res: ExpenseTypeList) =>
          dispatch(
            getSuccess(filterExpenseTypeForMobile(res, recordType, isRequest))
          )
        )
        .catch((err) => {
          dispatch(clearExpenseTypeList());
          throw err;
        });
    },
  search:
    (
      companyId: string,
      name: string,
      targetDate: string,
      recordType: string | undefined,
      expReportTypeId: string,
      isRequest?: boolean,
      excludedRecordTypes?: string[]
    ) =>
    (dispatch: AppDispatch): Promise<void> => {
      const _ = undefined;
      return searchExpenseType(
        companyId,
        name,
        targetDate,
        isRequest ? 'REQUEST' : 'REPORT',
        expReportTypeId,
        _,
        isValidRecordType(recordType) ? recordType : '',
        true,
        _,
        100,
        excludedRecordTypes
      )
        .then((res: ExpenseTypeListResult) => {
          const result = cloneDeep(res);
          result.records = filterExpenseTypeForMobile(
            res.records,
            recordType,
            isRequest
          );
          dispatch(searchSuccess(result));
        })
        .catch((err) => {
          dispatch(clearExpenseTypeList());
          throw err;
        });
    },
  searchWithType:
    (
      companyId: string,
      targetDate: string,
      recordType: string,
      withExtendedItems: boolean | undefined,
      expReportTypeId?: string,
      isRequest?: boolean
    ) =>
    (dispatch: AppDispatch): Promise<Action> => {
      return searchExpenseTypeWithRecord(
        companyId,
        targetDate,
        isValidRecordType(recordType) ? recordType : '',
        isRequest ? 'REQUEST' : 'REPORT',
        true,
        withExtendedItems,
        100,
        expReportTypeId
      )
        .then((res: ExpenseTypeList) => dispatch(searchWithTypeSuccess(res)))
        .catch((err) => {
          dispatch(clearExpenseTypeList());
          throw err;
        });
    },
  getExpenseTypeById:
    (expTypeId: string, usedIn: string) =>
    (dispatch: AppDispatch): Promise<ExpenseType> => {
      return getExpenseTypeById(expTypeId, usedIn)
        .then((res: ExpenseType) => {
          dispatch(expTypeUiActions.set(res[0]));
          return res[0];
        })
        .catch((err) => {
          throw err;
        });
    },
};

type State = ExpenseTypeListResult;

const initialState = {
  records: [],
  hasMore: false,
};

export default ((state: State = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return {
        ...state,
        records: action.payload,
      };
    case ACTIONS.SEARCH_SUCCESS:
      return action.payload;
    case ACTIONS.SEARCH_WITH_TYPE_SUCCESS:
      return {
        ...state,
        records: action.payload,
      };
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
}) as Reducer<ExpenseTypeListResult, any>;
