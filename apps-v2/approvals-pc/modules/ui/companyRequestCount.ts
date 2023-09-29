import { Reducer } from 'redux';

import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';

import { CompanyCountOption } from '../../../commons/components/exp/CompanySwitch';

const ACTIONS = {
  SET_COMPANY: 'MODULES/UI/COMPANY_REQUEST_COUNT/SET_COMPANY',
  SET_COUNT_OPTIONS: 'MODILES/UI/COMPANY_REQUEST_COUNT/SET_COUNT_OPTIONS',
  RESET_COUNT_OPTIONS: 'MODILES/UI/COMPANY_REQUEST_COUNT/RESET_COUNT_OPTIONS',
  SET_IS_LOADING: 'MODILES/UI/COMPANY_REQUEST_COUNT/SET_IS_LOADING',
  UPDATE_COUNT: 'MODILES/UI/COMPANY_REQUEST_COUNT/UPDATE_COUNT',
};

export const actions = {
  setCompanyId: (id: string) => ({
    type: ACTIONS.SET_COMPANY,
    payload: id,
  }),
  setOptions: (options: Array<CompanyCountOption>) => ({
    type: ACTIONS.SET_COUNT_OPTIONS,
    payload: options,
  }),
  resetOption: () => ({
    type: ACTIONS.RESET_COUNT_OPTIONS,
  }),
  updateRequestCount: (companyId: string, approvedNum = 1) => ({
    type: ACTIONS.UPDATE_COUNT,
    payload: { companyId, approvedNum },
  }),
  setRequstCountLoading: (isloading: boolean) => ({
    type: ACTIONS.SET_IS_LOADING,
    payload: isloading,
  }),
};

type State = {
  selectedComId: string;
  countOptions: Array<CompanyCountOption>;
  isloading: boolean;
};
const initialState = { selectedComId: '', countOptions: [], isloading: false };

export default ((state: State = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_COMPANY:
      return { ...state, selectedComId: action.payload };
    case ACTIONS.SET_COUNT_OPTIONS:
      return { ...state, countOptions: action.payload };
    case ACTIONS.RESET_COUNT_OPTIONS:
      return { ...state, countOptions: [], selectedComId: '' };
    case ACTIONS.SET_IS_LOADING:
      return {
        ...state,
        isloading: action.payload,
      };
    case ACTIONS.UPDATE_COUNT:
      const { companyId, approvedNum } = action.payload;
      const updateOptions = cloneDeep(state.countOptions);
      const idx = findIndex(state.countOptions, ['value', companyId]);
      const updateOption: any =
        state.countOptions.find(({ value }) => value === companyId) || {};
      let newCount = get(updateOption, 'count') - approvedNum;
      newCount = Math.max(newCount, 0);
      updateOption.count = newCount;
      updateOptions.splice(idx, 1, updateOption);
      return { ...state, countOptions: updateOptions };
    default:
      return state;
  }
}) as Reducer<State, any>;
