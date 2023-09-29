import { createSelector } from 'reselect';

import { LegalAgreementRequestSummary } from '@attendance/domain/models/approval/LegalAgreementRequest';
import { Code } from '@attendance/domain/models/LegalAgreementRequestType';

import ROOT from './actionType';

import {
  buildRecordFilter,
  ComplexMatchersType,
  extractUniqueValues,
} from '../../../../utils/FilterUtils';

import { selectors as entitiesSelectors } from '../../../entities/attLegalAgreement/list';

export type State = {
  employeeName: LegalAgreementRequestSummary['employeeName'];
  departmentName: LegalAgreementRequestSummary['departmentName'];
  approverName: LegalAgreementRequestSummary['approverName'];
  approverDepartmentName: LegalAgreementRequestSummary['approverDepartmentName'];
  targetMonth: LegalAgreementRequestSummary['targetMonth'];
  type: LegalAgreementRequestSummary['requestType'] | '';
  requestDate: LegalAgreementRequestSummary['requestDate'];
};

const complexMatchers: ComplexMatchersType = {
  targetMonth: (filterTerms, record: LegalAgreementRequestSummary) =>
    filterTerms.targetMonth === '' ||
    filterTerms.targetMonth === record.targetMonth,
  type: (filterTerms, record: LegalAgreementRequestSummary) =>
    filterTerms.type === '' || filterTerms.type === record.requestType,
};
type RecordFilter = (filterTerms: State) => (a: State) => boolean;
const recordFilterByTerm: RecordFilter = buildRecordFilter(complexMatchers);

const extractRecordsByFilter = createSelector(
  (state) => state.ui.attLegalAgreement.list.filterTerms,
  entitiesSelectors.requestListSelector,
  (filterTerms, recordList) => {
    const filter = recordFilterByTerm(filterTerms);
    return recordList.filter(filter);
  }
);

const extractIdsByFilter = createSelector(extractRecordsByFilter, (records) =>
  records.map((record) => record.id)
);

const buildRequestTypesOptions = createSelector(
  entitiesSelectors.requestListSelector,
  (state) => state.ui.attLegalAgreement.list.filterTerms.type,
  (recordList, typeFilterTerms): Code[] => {
    const types = extractUniqueValues(recordList, 'requestType');
    const newTypes = [...types];
    if (typeFilterTerms !== '' && !newTypes.includes(typeFilterTerms)) {
      newTypes.push(typeFilterTerms);
    }
    return newTypes as Code[];
  }
);

const buildTargetMonthOptions = createSelector(
  entitiesSelectors.requestListSelector,
  (state) => state.ui.attLegalAgreement.list.filterTerms.targetMonth,
  (recordList, targetMonthFilterTerms) => {
    const targetMonths = extractUniqueValues(recordList, 'targetMonth');
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
  buildRequestTypesOptions,
  buildTargetMonthOptions,
};

const ACTION_TYPE_ROOT = `${ROOT}/FILTER_TERMS` as const;

const ACTION_TYPE = {
  UPDATE: `${ACTION_TYPE_ROOT}/UPDATE`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
} as const;

type UpdateAction = {
  type: typeof ACTION_TYPE.UPDATE;
  payload: { key: keyof State; value: string };
};

type ClearAction = {
  type: typeof ACTION_TYPE.CLEAR;
};

export const actions = {
  update: (key: keyof State, value: string) => ({
    type: ACTION_TYPE.UPDATE,
    payload: { key, value },
  }),

  clear() {
    return { type: ACTION_TYPE.CLEAR };
  },
};

type Action = UpdateAction | ClearAction;

const initialState: State = {
  employeeName: '',
  departmentName: '',
  approverName: '',
  approverDepartmentName: '',
  targetMonth: '',
  type: '',
  requestDate: '',
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPE.UPDATE: {
      const { payload } = action as UpdateAction;
      return {
        ...state,
        [payload.key]: payload.value,
      };
    }

    case ACTION_TYPE.CLEAR:
      return initialState;

    default:
      return state;
  }
};
