import { Reducer } from 'redux';

import _ from 'lodash';

import Api from '@apps/commons/api';

export const ACTIONS = {
  FETCH_SUCCESS: 'MODULES/UI/CAPACITY_EDITOR_WORK_SCHEMES/FETCH_SUCCESS',
};

type workScheme = {
  id: string;
  code: string;
  companyId: string;
  name: string;
  name_L0: string | boolean;
  name_L1: string | boolean;
  name_L2: string | boolean;
  workingDayMON: boolean;
  workingDayTUE: boolean;
  workingDayWED: boolean;
  workingDayTHU: boolean;
  workingDayFRI: boolean;
  workingDaySAT: boolean;
  workingDaySUN: boolean;
  workTimePerDay: number;
};
type workSchemeArray = Array<workScheme>;

export function fetchWorkSchemes(companyId: string): Promise<workSchemeArray> {
  return Api.invoke({
    path: '/psa/work-scheme/search',
    param: { companyId },
  });
}

export const fetchWorkSchemeSuccess = (workSchemeArray: workSchemeArray) => ({
  type: ACTIONS.FETCH_SUCCESS,
  payload: workSchemeArray,
});

const initialState: workSchemeArray = [];

export default ((state: workSchemeArray = initialState, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<any>;
