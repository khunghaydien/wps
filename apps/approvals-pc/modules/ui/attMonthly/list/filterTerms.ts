import { createSelector } from 'reselect';

import DateUtil from '../../../../../commons/utils/DateUtil';

import {
  buildRecordFilter,
  ComplexMatchersType,
  extractUniqueValues,
} from '../../../../utils/FilterUtils';

import { selectors as entitiesSelectors } from '../../../entities/attMonthly/list';

export type State = {
  employeeName: string;
  departmentName: string;
  approverName: string;
  approverDepartmentName: string;
  targetMonth: string;
  requestDate: string;
};

const complexMatchers: ComplexMatchersType = {
  targetMonth: (filterTerms, record) =>
    filterTerms.targetMonth === '' || // FIXME: Now, convert to compare with converted value. (same source...)
    filterTerms.targetMonth === DateUtil.formatYM(record.targetMonth as any),
};
const recordFilterByTerm = buildRecordFilter(complexMatchers);

const extractRecordsByFilter = createSelector(
  (state) => state.ui.attMonthly.list.filterTerms,
  entitiesSelectors.requestListSelector,
  (filterTerms, recordList) => {
    const filter = recordFilterByTerm(filterTerms);
    return recordList.filter(filter);
  }
);

const extractIdsByFilter = createSelector(extractRecordsByFilter, (records) =>
  records.map((record) => record.id)
);

const buildTargetMonthOptions = createSelector(
  entitiesSelectors.requestListSelector,
  (state) => state.ui.attMonthly.list.filterTerms.targetMonth,
  (recordList, targetMonthFilterTerms) => {
    const targetMonths = extractUniqueValues(recordList, 'targetMonth').map(
      DateUtil.formatYM
    );
    if (
      targetMonthFilterTerms !== '' &&
      !targetMonths.includes(targetMonthFilterTerms)
    ) {
      targetMonths.push(targetMonthFilterTerms);
    }
    return targetMonths;
  }
);

export const selectors = {
  extractRecordsByFilter,
  extractIdsByFilter,
  buildTargetMonthOptions,
};

const ACTIONS = {
  UPDATE: 'MODULES/UI/ATT_MONTHLY/LIST/FILTER_TERMS/UPDATE',
  CLEAR: 'MODULES/UI/ATT_MONTHLY/LIST/FILTER_TERMS/CLEAR',
};

type UpdateAction = {
  type: 'MODULES/UI/ATT_MONTHLY/LIST/FILTER_TERMS/UPDATE';
  payload: { key: keyof State; value: string };
};

type ClearAction = {
  type: 'MODULES/UI/ATT_MONTHLY/LIST/FILTER_TERMS/CLEAR';
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
  targetMonth: '',
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
