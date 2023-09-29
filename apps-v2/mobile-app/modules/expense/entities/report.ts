import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import { createSelector } from 'reselect';
import { $Keys, $PropertyType } from 'utility-types';
import uuidV4 from 'uuid/v4';

import { AccountingPeriodOptionList } from '../../../../domain/models/exp/AccountingPeriod';
import { Record } from '../../../../domain/models/exp/Record';
import {
  calcTotalAmount,
  cloneReport,
  cloneRequest,
  createReportFromRequest,
  deletePreRequest,
  deleteReport,
  exportToEmail,
  generatePrintPage,
  getApprovedRequestReport,
  getPreRequest,
  getReport,
  initialStateReport,
  Report,
  ReportClaimResponse,
  savePreRequest,
  saveReportMobile,
} from '../../../../domain/models/exp/Report';
import {
  cancelExpRequestReport,
  canExpRequestApproval,
  submitExpPreRequestReport,
  submitExpRequestReport,
} from '../../../../domain/models/exp/request/Report';

import { AppDispatch } from '../AppThunk';
import { actions as recordUpdatedActions } from '../ui/record/recordUpdatedInfo';

// State

type State = Report;

const initialState: State = initialStateReport;

// Selector

const range: string[] = Array.from(Array(10), (_, index) =>
  `${index + 1}`.padStart(2, '0')
);

export const selectors = {
  // $FlowFixMe
  extendedItemTexts: createSelector(
    (state) => state,
    (state: State) => {
      return range.reduce(
        (acc, index) =>
          isNil(state[`extendedItemText${index}Id`])
            ? acc
            : [
                ...acc,
                {
                  name: state[`extendedItemText${index}Info`].name,
                  value: state[`extendedItemText${index}Value`],
                },
              ],
        []
      );
    }
  ),
  // $FlowFixMe
  extendedItemPicklists: createSelector(
    (state) => state,
    (state: State) => {
      return range.reduce(
        (acc, index) =>
          isNil(state[`extendedItemPicklist${index}Id`])
            ? acc
            : [
                ...acc,
                {
                  name: state[`extendedItemPicklist${index}Info`].name,
                  value: state[`extendedItemPicklist${index}Value`],
                  picklist: state[`extendedItemPicklist${index}Info`].picklist,
                },
              ],
        []
      );
    }
  ),
  // $FlowFixMe
  extendedItemLookup: createSelector(
    (state) => state,
    (state: State) => {
      return range.reduce(
        (acc, index) =>
          isNil(state[`extendedItemLookup${index}Id`])
            ? acc
            : [
                ...acc,
                {
                  name: state[`extendedItemLookup${index}Info`].name,
                  value: state[`extendedItemLookup${index}Value`],
                  selectedOptionName:
                    state[`extendedItemLookup${index}SelectedOptionName`],
                },
              ],
        []
      );
    }
  ),
  // $FlowFixMe
  extendedItemDate: createSelector(
    (state) => state,
    (state: State) => {
      return range.reduce(
        (acc, index) =>
          isNil(state[`extendedItemDate${index}Id`])
            ? acc
            : [
                ...acc,
                {
                  name: state[`extendedItemDate${index}Info`].name,
                  value: state[`extendedItemDate${index}Value`],
                },
              ],
        []
      );
    }
  ),
  // $FlowFixMe
  totalAmount: createSelector(
    (state) => state,
    (state: State) => {
      return isNil(state.records) ? 0 : calcTotalAmount(state);
    }
  ),
};

// Actions
type FetchSuccess = {
  type: 'MOBILE-APP/MODULES/EXPENSE/ENTITIES/REPORT/FETCH_SUCCES';
  payload: Report;
};

type SetRecords = {
  type: 'MOBILE-APP/MODULES/EXPENSE/ENTITIES/REPORT/SET_RECORDS';
  payload: Record[];
};

type UpdateValue = {
  type: 'MOBILE-APP/MODULES/EXPENSE/ENTITIES/REPORT/UPDATE_VALUE';
  payload: {
    key: $Keys<Report>;
    value: any;
  };
};

type SetReport = {
  type: 'MOBILE-APP/MODULES/EXPENSE/ENTITIES/REPORT/SET_REPORT';
  payload: Report;
};

type SetEI = {
  type: 'MOBILE-APP/MODULES/EXPENSE/ENTITIES/REPORT/SET_EI';
  payload: any;
};

type Clear = {
  type: 'MOBILE-APP/MODULES/EXPENSE/ENTITIES/REPORT/CLEAR';
  payload: Report;
};

type UpdateRecord = {
  type: 'MOBILE-APP/MODULES/EXPENSE/ENTITIES/REPORT/UPDATE_RECORD';
  payload: Record;
};

type Action =
  | FetchSuccess
  | SetRecords
  | UpdateValue
  | SetReport
  | SetEI
  | Clear
  | UpdateRecord;

const FETCH_SUCCES: $PropertyType<FetchSuccess, 'type'> =
  'MOBILE-APP/MODULES/EXPENSE/ENTITIES/REPORT/FETCH_SUCCES';
const SET_RECORDS: $PropertyType<SetRecords, 'type'> =
  'MOBILE-APP/MODULES/EXPENSE/ENTITIES/REPORT/SET_RECORDS';
const UPDATE_VALUE: $PropertyType<UpdateValue, 'type'> =
  'MOBILE-APP/MODULES/EXPENSE/ENTITIES/REPORT/UPDATE_VALUE';
const SET_REPORT: $PropertyType<SetReport, 'type'> =
  'MOBILE-APP/MODULES/EXPENSE/ENTITIES/REPORT/SET_REPORT';
const SET_EI: $PropertyType<any, 'type'> =
  'MOBILE-APP/MODULES/EXPENSE/ENTITIES/REPORT/SET_EI';
const CLEAR: $PropertyType<Clear, 'type'> =
  'MOBILE-APP/MODULES/EXPENSE/ENTITIES/REPORT/CLEAR';
const UPDATE_RECORD: $PropertyType<UpdateRecord, 'type'> =
  'MOBILE-APP/MODULES/EXPENSE/ENTITIES/REPORT/UPDATE_RECORD';

export const fetchSuccess = (report: Report): FetchSuccess => ({
  type: FETCH_SUCCES,
  payload: report,
});

export const actions = {
  setRecords: (records: Record[]): SetRecords => ({
    type: SET_RECORDS,
    payload: records,
  }),

  updateRecord: (record: Record): UpdateRecord => ({
    type: UPDATE_RECORD,
    payload: record,
  }),

  updateValue: (key: $Keys<Report>, value: any): UpdateValue => ({
    type: UPDATE_VALUE,
    payload: { key, value },
  }),

  setReport: (report: Report): SetReport => ({
    type: SET_REPORT,
    payload: report,
  }),

  setEI: (eis: any): any => ({
    type: SET_EI,
    payload: eis,
  }),

  fetch:
    (reportId: string, isApprovedPreRequest: boolean, isRequest?: boolean) =>
    (dispatch: AppDispatch): Promise<void> => {
      const promise = isApprovedPreRequest
        ? getApprovedRequestReport(reportId)
        : isRequest
        ? getPreRequest(reportId, 'REQUEST')
        : getReport(reportId, 'REPORT');
      return promise.then((result) => {
        if (isApprovedPreRequest) {
          // for mobile, create FE temperary record uuid for record detail page navigation
          const recordsWithUuid = cloneDeep(result.records);
          recordsWithUuid.forEach((record) => {
            const uuid = uuidV4();
            record.recordId = uuid;
          });
          result.records = recordsWithUuid;
        }
        dispatch(fetchSuccess(result));
      });
    },

  clone:
    (reportId: string, empId: string, isRequest?: boolean) =>
    (_dispatch: AppDispatch): Promise<void> => {
      if (isRequest) return cloneRequest(reportId, empId);
      return cloneReport(reportId, empId);
    },

  delete:
    (reportId: string, isRequest?: boolean) =>
    (_dispatch: AppDispatch): Promise<void> => {
      if (isRequest) return deletePreRequest(reportId);
      return deleteReport(reportId);
    },

  submit:
    (reportId: string, comment: string, empId?: string, isRequest?: boolean) =>
    (_dispatch: AppDispatch): Promise<void> => {
      if (isRequest) return submitExpPreRequestReport(reportId, comment, empId);
      return submitExpRequestReport(reportId, comment);
    },

  recall:
    (requestId: string, comment: string, isRequest?: boolean) =>
    (_dispatch: AppDispatch): Promise<void> => {
      if (isRequest) return canExpRequestApproval(requestId, comment);
      return cancelExpRequestReport(requestId, comment);
    },

  save:
    (report: Report) =>
    (_dispatch: AppDispatch): Promise<void> => {
      return saveReportMobile(report);
    },

  saveRequest:
    (report: Report, empId: string) =>
    (_dispatch: AppDispatch): Promise<void> => {
      return savePreRequest(report, empId);
    },

  createReportFromRequest:
    (
      preRequestId: string,
      empId: string,
      accountingPeriodList: AccountingPeriodOptionList
    ) =>
    (dispatch: AppDispatch): Promise<string> => {
      return createReportFromRequest(preRequestId, empId).then(
        ({ updatedRecords, reportId }: ReportClaimResponse) => {
          if (updatedRecords.length > 0) {
            dispatch(recordUpdatedActions.setUpdateInfo(updatedRecords));
          }
          return getReport(reportId, 'REPORT').then((report) => {
            if (!isEmpty(accountingPeriodList)) {
              // $FlowFixMe
              report.accountingDate = null;
            }
            dispatch(fetchSuccess(report));
            return reportId;
          });
        }
      );
    },

  exportToEmail:
    (contentDocumentId: string, contentVersionId: string) =>
    (_dispatch: AppDispatch): Promise<void> => {
      return exportToEmail(contentDocumentId, contentVersionId);
    },

  generatePrintPage:
    (
      empId: string,
      reportId: string,
      reportTypeId: string,
      endDate: string,
      isRequest: boolean,
      empHistoryId: string
    ) =>
    (_dispatch: AppDispatch): Promise<{ fileId: string }> => {
      return generatePrintPage(
        empId,
        reportId,
        reportTypeId,
        endDate,
        isRequest,
        empHistoryId
      );
    },

  clear: () => ({
    type: CLEAR,
  }),
};

// Reducer

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case FETCH_SUCCES: {
      return {
        ...action.payload,
      };
    }

    case SET_RECORDS: {
      const records = (action as SetRecords).payload;
      const totalAmount = calcTotalAmount({
        ...state,
        records,
      });
      return {
        ...state,
        totalAmount,
        records,
      };
    }

    case UPDATE_VALUE: {
      const payload = (action as UpdateValue).payload;
      return {
        ...state,
        [payload.key]: payload.value,
      };
    }

    case UPDATE_RECORD: {
      const res = cloneDeep(state);
      const idx = findIndex(state.records, [
        'recordId',
        action.payload.recordId,
      ]);
      if (idx !== -1) {
        res.records[idx] = action.payload;
      } else {
        res.records.push(action.payload);
      }
      return res;
    }

    case SET_REPORT: {
      return {
        ...action.payload,
      };
    }

    case SET_EI: {
      const payload = action.payload;
      return {
        ...state,
        extendedItemText01Id: payload.extendedItemText01Id,
        extendedItemText01Info: payload.extendedItemText01Info,
        extendedItemText01Value:
          payload.extendedItemText01Info &&
          payload.extendedItemText01Info.defaultValueText,
        extendedItemText02Id: payload.extendedItemText02Id,
        extendedItemText02Info: payload.extendedItemText02Info,
        extendedItemText02Value:
          payload.extendedItemText02Info &&
          payload.extendedItemText02Info.defaultValueText,
        extendedItemText03Id: payload.extendedItemText03Id,
        extendedItemText03Info: payload.extendedItemText03Info,
        extendedItemText03Value:
          payload.extendedItemText03Info &&
          payload.extendedItemText03Info.defaultValueText,
        extendedItemText04Id: payload.extendedItemText04Id,
        extendedItemText04Info: payload.extendedItemText04Info,
        extendedItemText04Value:
          payload.extendedItemText04Info &&
          payload.extendedItemText04Info.defaultValueText,
        extendedItemText05Id: payload.extendedItemText05Id,
        extendedItemText05Info: payload.extendedItemText05Info,
        extendedItemText05Value:
          payload.extendedItemText05Info &&
          payload.extendedItemText05Info.defaultValueText,
        extendedItemText06Id: payload.extendedItemText06Id,
        extendedItemText06Info: payload.extendedItemText06Info,
        extendedItemText06Value:
          payload.extendedItemText06Info &&
          payload.extendedItemText06Info.defaultValueText,
        extendedItemText07Id: payload.extendedItemText07Id,
        extendedItemText07Info: payload.extendedItemText07Info,
        extendedItemText07Value:
          payload.extendedItemText07Info &&
          payload.extendedItemText07Info.defaultValueText,
        extendedItemText08Id: payload.extendedItemText08Id,
        extendedItemText08Info: payload.extendedItemText08Info,
        extendedItemText08Value:
          payload.extendedItemText08Info &&
          payload.extendedItemText08Info.defaultValueText,
        extendedItemText09Id: payload.extendedItemText09Id,
        extendedItemText09Info: payload.extendedItemText09Info,
        extendedItemText09Value:
          payload.extendedItemText09Info &&
          payload.extendedItemText09Info.defaultValueText,
        extendedItemText10Id: payload.extendedItemText10Id,
        extendedItemText10Info: payload.extendedItemText10Info,
        extendedItemText10Value:
          payload.extendedItemText10Info &&
          payload.extendedItemText10Info.defaultValueText,
        extendedItemPicklist01Id: payload.extendedItemPicklist01Id,
        extendedItemPicklist01Info: payload.extendedItemPicklist01Info,
        extendedItemPicklist02Id: payload.extendedItemPicklist02Id,
        extendedItemPicklist02Info: payload.extendedItemPicklist02Info,
        extendedItemPicklist03Id: payload.extendedItemPicklist03Id,
        extendedItemPicklist03Info: payload.extendedItemPicklist03Info,
        extendedItemPicklist04Id: payload.extendedItemPicklist04Id,
        extendedItemPicklist04Info: payload.extendedItemPicklist04Info,
        extendedItemPicklist05Id: payload.extendedItemPicklist05Id,
        extendedItemPicklist05Info: payload.extendedItemPicklist05Info,
        extendedItemPicklist06Id: payload.extendedItemPicklist06Id,
        extendedItemPicklist06Info: payload.extendedItemPicklist06Info,
        extendedItemPicklist07Id: payload.extendedItemPicklist07Id,
        extendedItemPicklist07Info: payload.extendedItemPicklist07Info,
        extendedItemPicklist08Id: payload.extendedItemPicklist08Id,
        extendedItemPicklist08Info: payload.extendedItemPicklist08Info,
        extendedItemPicklist09Id: payload.extendedItemPicklist09Id,
        extendedItemPicklist09Info: payload.extendedItemPicklist09Info,
        extendedItemPicklist10Id: payload.extendedItemPicklist10Id,
        extendedItemPicklist10Info: payload.extendedItemPicklist10Info,
        extendedItemLookup01Id: payload.extendedItemLookup01Id,
        extendedItemLookup01Info: payload.extendedItemLookup01Info,
        extendedItemLookup02Id: payload.extendedItemLookup02Id,
        extendedItemLookup02Info: payload.extendedItemLookup02Info,
        extendedItemLookup03Id: payload.extendedItemLookup03Id,
        extendedItemLookup03Info: payload.extendedItemLookup03Info,
        extendedItemLookup04Id: payload.extendedItemLookup04Id,
        extendedItemLookup04Info: payload.extendedItemLookup04Info,
        extendedItemLookup05Id: payload.extendedItemLookup05Id,
        extendedItemLookup05Info: payload.extendedItemLookup05Info,
        extendedItemLookup06Id: payload.extendedItemLookup06Id,
        extendedItemLookup06Info: payload.extendedItemLookup06Info,
        extendedItemLookup07Id: payload.extendedItemLookup07Id,
        extendedItemLookup07Info: payload.extendedItemLookup07Info,
        extendedItemLookup08Id: payload.extendedItemLookup08Id,
        extendedItemLookup08Info: payload.extendedItemLookup08Info,
        extendedItemLookup09Id: payload.extendedItemLookup09Id,
        extendedItemLookup09Info: payload.extendedItemLookup09Info,
        extendedItemLookup10Id: payload.extendedItemLookup10Id,
        extendedItemLookup10Info: payload.extendedItemLookup10Info,
        extendedItemDate01Id: payload.extendedItemDate01Id,
        extendedItemDate01Info: payload.extendedItemDate01Info,
        extendedItemDate02Id: payload.extendedItemDate02Id,
        extendedItemDate02Info: payload.extendedItemDate02Info,
        extendedItemDate03Id: payload.extendedItemDate03Id,
        extendedItemDate03Info: payload.extendedItemDate03Info,
        extendedItemDate04Id: payload.extendedItemDate04Id,
        extendedItemDate04Info: payload.extendedItemDate04Info,
        extendedItemDate05Id: payload.extendedItemDate05Id,
        extendedItemDate05Info: payload.extendedItemDate05Info,
        extendedItemDate06Id: payload.extendedItemDate06Id,
        extendedItemDate06Info: payload.extendedItemDate06Info,
        extendedItemDate07Id: payload.extendedItemDate07Id,
        extendedItemDate07Info: payload.extendedItemDate07Info,
        extendedItemDate08Id: payload.extendedItemDate08Id,
        extendedItemDate08Info: payload.extendedItemDate08Info,
        extendedItemDate09Id: payload.extendedItemDate09Id,
        extendedItemDate09Info: payload.extendedItemDate09Info,
        extendedItemDate10Id: payload.extendedItemDate10Id,
        extendedItemDate10Info: payload.extendedItemDate10Info,
      };
    }
    case CLEAR: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};
