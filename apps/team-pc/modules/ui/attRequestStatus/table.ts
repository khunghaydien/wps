import DateUtil from '../../../../commons/utils/DateUtil';

import { Status } from '../../../../domain/models/approval/request/Status';
import { AttSummary } from '../../../../domain/models/team/AttSummary';

type Records = AttSummary['records'];

type Record = Records[keyof Records];

type State = {
  records: Records;
  workingTypeNameOptions: string[];
  closingDateOptions: {
    text: string;
    value: string;
  }[];
  filterTerms: {
    employeeName: string;
    employeeCode: string;
    workingTypeName: string;
    endDate: string;
    status: Status | '';
    approverName: string;
  };
};

const ACTION_TYPES = {
  SEARCH_SUCCESS: 'TEAM_PC/UI/TABLE/SEARCH_SUCCESS',
  UPDATE_FILTER_TERM: 'TEAM_PC/TABLE/UPDATE_FILTER_TERM',
  CLEAR: 'TEAM_PC/UI/TABLE/CLEAR',
};

export const actions = {
  searchSuccess: (attSummary: AttSummary) => ({
    type: ACTION_TYPES.SEARCH_SUCCESS,
    payload: {
      attSummary,
    },
  }),
  updateFilterTerm: (key: string, value: string, records: Records[]) => ({
    type: ACTION_TYPES.UPDATE_FILTER_TERM,
    payload: {
      key,
      value,
      records,
    },
  }),
  clear: () => ({
    type: ACTION_TYPES.CLEAR,
  }),
};

const initialState: State = {
  records: [],
  workingTypeNameOptions: [],
  closingDateOptions: [],
  filterTerms: {
    employeeName: '',
    employeeCode: '',
    workingTypeName: '',
    endDate: '',
    status: '',
    approverName: '',
  },
};

const generateOptions = (key: keyof Record, records: Records) =>
  records.map((record) => record[key]).filter((v, i, a) => a.indexOf(v) === i);

const filterRecords = (
  records: Records,
  terms: State['filterTerms']
): Records =>
  records.filter((record) =>
    Object.keys(terms).every((key) => {
      const value = record[key] || '';
      const term = terms[key];
      return term === '' || value.indexOf(term) >= 0;
    })
  );

export default (state: State = initialState, action: any): State => {
  const { type, payload } = action;
  switch (type) {
    case ACTION_TYPES.SEARCH_SUCCESS: {
      const { attSummary } = payload;
      const { records } = attSummary;

      const workingTypeNameOptions = generateOptions(
        'workingTypeName' as keyof Record,
        records
      );
      const closingDateOptions = generateOptions(
        'endDate' as keyof Record,
        records
      ).map((value) => ({
        text: DateUtil.formatYMD(value),
        value,
      }));

      return {
        records: [...records],
        workingTypeNameOptions,
        closingDateOptions,
        filterTerms: {
          employeeName: '',
          employeeCode: '',
          workingTypeName: '',
          endDate: '',
          status: '',
          approverName: '',
        },
      };
    }
    case ACTION_TYPES.UPDATE_FILTER_TERM: {
      const { key, value, records } = payload;
      const filterTerms = {
        ...state.filterTerms,
        [key]: value,
      };
      return {
        ...state,
        filterTerms,
        records: filterRecords(records, filterTerms),
      };
    }
    case ACTION_TYPES.CLEAR:
      return initialState;
    default:
      return state;
  }
};
