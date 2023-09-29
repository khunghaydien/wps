import { createSelector } from 'reselect';

import {
  buildRecordFilter,
  ComplexMatchersType,
  dateInPeriodMatcher,
  extractUniqueValues,
} from '../../../../utils/FilterUtils';

import { requestListSelector } from '../../../entities/att/list';

export type State = {
  employeeName: string;
  departmentName: string;
  approverName: string;
  approverDepartmentName: string;
  requestPeriod: string;
  type: string;
  requestDate: string;
};

const complexMatchers: ComplexMatchersType = {
  requestPeriod: (filterTerms, record: any) =>
    dateInPeriodMatcher(
      record.startDate,
      record.endDate,
      filterTerms.requestPeriod
    ),
  type: (filterTerms, record: any) =>
    filterTerms.type === '' || filterTerms.type === record.type,
};
type RecordFilter = (
  filterTerms: Record<string, any>
) => (a: Record<string, any>) => boolean;
const recordFilterByTerm: RecordFilter = buildRecordFilter(complexMatchers);

const extractRecordsByFilter = createSelector(
  (state) => state.ui.att.list.filterTerms,
  requestListSelector,
  (filterTerms, recordList) => {
    const filter = recordFilterByTerm(filterTerms);
    return recordList.filter(filter);
  }
);

const extractIdsByFilter = createSelector(extractRecordsByFilter, (records) =>
  records.map((record) => record.id)
);

const buildRequestTypesOptions = createSelector(
  requestListSelector,
  (state) => state.ui.att.list.filterTerms.type,
  (recordList, typeFilterTerms) => {
    const types = extractUniqueValues(recordList, 'type');
    if (typeFilterTerms !== '' && !types.includes(typeFilterTerms)) {
      types.push(typeFilterTerms);
    }
    return types;
  }
);

export const selectors = {
  extractRecordsByFilter,
  extractIdsByFilter,
  buildRequestTypesOptions,
};

const ACTIONS = {
  UPDATE: 'MODULES/UI/ATT/LIST/FILTER_TERMS/UPDATE',
  CLEAR: 'MODULES/UI/ATT/LIST/FILTER_TERMS/CLEAR',
};

type UpdateAction = {
  type: 'MODULES/UI/ATT/LIST/FILTER_TERMS/UPDATE';
  payload: { key: keyof State; value: string };
};

type ClearAction = {
  type: 'MODULES/UI/ATT/LIST/FILTER_TERMS/CLEAR';
};

export const actions = {
  update: (key: keyof State, value: string) => ({
    type: ACTIONS.UPDATE,
    payload: { key, value },
  }),

  clear() {
    return { type: ACTIONS.CLEAR };
  },
};

type Action = UpdateAction | ClearAction;

const initialState: State = {
  employeeName: '',
  departmentName: '',
  approverName: '',
  approverDepartmentName: '',
  requestPeriod: '',
  type: '',
  requestDate: '',
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTIONS.UPDATE: {
      const { payload } = action as UpdateAction;
      return {
        ...state,
        [payload.key]: payload.value,
      };
    }

    case ACTIONS.CLEAR:
      return initialState;

    default:
      return state;
  }
};
