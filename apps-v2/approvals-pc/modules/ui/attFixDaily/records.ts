import getByPath from 'lodash/get';

import { FixDailyRequest } from '@attendance/domain/models/approval/FixDailyRequest';

import ROOT from './actionType';

const ACTION_TYPE_ROOT = `${ROOT}/RECORDS` as const;

export const ACTION_TYPE = {
  INITIALIZE: `${ACTION_TYPE_ROOT}/INITIALIZE`,
  SET_RECORDS: `${ACTION_TYPE_ROOT}/SET_RECORDS`,
  SORT: `${ACTION_TYPE_ROOT}/SORT`,
  FILTER: `${ACTION_TYPE_ROOT}/FILTER`,
} as const;

export type SortKeys = Leaves<FixDailyRequest>;

const LIMIT = 1000;

export type State = {
  originalRecords: FixDailyRequest[];
  sortedRecords: FixDailyRequest[];
  records: FixDailyRequest[];
  searchQuery: {
    employee: string[];
    department: string[];
    targetDate: string;
    requestAndEvent: string[];
  };
  order: {
    key: SortKeys;
    direction: 'asc' | 'desc';
  };
  overLimit: boolean;
};

type InitializeAction = {
  type: typeof ACTION_TYPE.INITIALIZE;
  payload: State['originalRecords'];
};

type SetRecordsAction = {
  type: typeof ACTION_TYPE.SET_RECORDS;
  payload: State['originalRecords'];
};

type SortAction = {
  type: typeof ACTION_TYPE.SORT;
  payload: State['order'];
};

type FilterAction = {
  type: typeof ACTION_TYPE.FILTER;
  payload: State['searchQuery'];
};

type Actions = InitializeAction | SetRecordsAction | SortAction | FilterAction;

export const actions = {
  initialize: (records: State['originalRecords']): InitializeAction => ({
    type: ACTION_TYPE.INITIALIZE,
    payload: records,
  }),
  setRecords: (records: State['originalRecords']): SetRecordsAction => ({
    type: ACTION_TYPE.SET_RECORDS,
    payload: records,
  }),
  sort: (key: SortKeys, direction: 'asc' | 'desc' = 'asc'): SortAction => ({
    type: ACTION_TYPE.SORT,
    payload: {
      key,
      direction,
    },
  }),
  filter: (searchQuery: State['searchQuery']): FilterAction => ({
    type: ACTION_TYPE.FILTER,
    payload: searchQuery,
  }),
};

export const initialState: State = {
  originalRecords: [],
  sortedRecords: [],
  records: [],
  searchQuery: {
    employee: [],
    department: [],
    targetDate: '',
    requestAndEvent: [],
  },
  order: {
    key: 'submitter.employee.code',
    direction: 'asc',
  },
  overLimit: false,
};

const $includes = (text: string | string[], words: string[]) =>
  words
    .map((word) => (word || '').toLowerCase())
    .every((word) =>
      []
        .concat(text)
        .map((t) => (t || '').toLocaleLowerCase())
        .some((t) => t.includes(word))
    );

const $filter = (
  records: FixDailyRequest[],
  searchQuery: State['searchQuery']
) =>
  records.filter(
    (record) =>
      $includes(
        [record.submitter.employee.name, record?.submitter.employee.code],
        searchQuery.employee
      ) &&
      $includes(
        record.submitter.employee.department.name,
        searchQuery.department
      ) &&
      (!searchQuery.targetDate ||
        record.targetDate === searchQuery.targetDate) &&
      $includes(String(record.targetRecord.event), searchQuery.requestAndEvent)
  );

const $sort = (
  records: FixDailyRequest[],
  { key, direction }: State['order']
): FixDailyRequest[] => {
  const $records = records.sort((a, b) => {
    const A = getByPath(a, key);
    const B = getByPath(b, key);
    if (A < B) {
      return -1;
    } else if (A > B) {
      return 1;
    }
    return 0;
  });
  return direction === 'asc' ? $records : $records.reverse();
};

export default function reducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ACTION_TYPE.INITIALIZE: {
      const $originalRecords = action.payload;
      const overLimit = $originalRecords.length > LIMIT;
      const originalRecords = overLimit
        ? $originalRecords.slice(0, LIMIT)
        : $originalRecords;
      const { order, searchQuery } = initialState;
      const sortedRecords = $sort(originalRecords, order);
      const records = $filter(sortedRecords, searchQuery);
      return {
        ...initialState,
        originalRecords,
        sortedRecords,
        records,
        overLimit,
      };
    }
    case ACTION_TYPE.SET_RECORDS: {
      const $originalRecords = action.payload;
      const overLimit = $originalRecords.length > LIMIT;
      const originalRecords = overLimit
        ? $originalRecords.slice(0, LIMIT)
        : $originalRecords;
      const { order, searchQuery } = state;
      const sortedRecords = $sort(originalRecords, order);
      const records = $filter(sortedRecords, searchQuery);
      return {
        ...state,
        originalRecords,
        sortedRecords,
        records,
        overLimit,
      };
    }
    case ACTION_TYPE.SORT: {
      const order = action.payload;
      const { originalRecords, searchQuery } = state;
      const sortedRecords = $sort(originalRecords, order);
      const records = $filter(sortedRecords, searchQuery);
      return {
        ...state,
        sortedRecords,
        records,
        order,
      };
    }
    case ACTION_TYPE.FILTER: {
      const searchQuery = action.payload;
      const { sortedRecords } = state;
      const records = $filter(sortedRecords, searchQuery);
      return {
        ...state,
        records,
        searchQuery,
      };
    }
    default:
      return state;
  }
}
