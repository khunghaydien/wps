import { Dispatch, Reducer } from 'redux';

import { cloneDeep } from 'lodash';

import Api from '../../../commons/api';
import msg from '../../../commons/languages';

import {
  searchConditionInitValue,
  SearchConditions,
} from '../../../domain/models/exp/FinanceApproval';
import {
  getPersonalSetting,
  updatePersonalSetting,
} from '../../models/advSearchCondition';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/ENTITIES/ADVSEARCHCONDITION/GET_SUCCESS',
  SAVE: 'MODULES/UI/EXP/ADVSEARCHCONDITION/SAVE',
  DELETE: 'MODULES/UI/EXP/ADVSEARCHCONDITION/DELETE',
};

// eslint-disable-next-line import/prefer-default-export
export const update = (param: SearchConditions) =>
  Api.invoke({
    path: '/personal-setting/update',
    param,
  });

const getSuccess = (result: Array<SearchConditions>) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: result,
});

export const addInitialValue = (res: Array<SearchConditions>) => {
  const resWithInitVal = cloneDeep(res);
  const initValue = cloneDeep(searchConditionInitValue());
  initValue.name = msg().Exp_Lbl_SearchConditionApprovelreRuestList;
  resWithInitVal.unshift(initValue);
  return resWithInitVal;
};

export const actions = {
  get:
    () =>
    (dispatch: Dispatch<any>): Promise<Array<SearchConditions>> | any => {
      return getPersonalSetting().then((res: Array<SearchConditions>) =>
        dispatch(getSuccess(addInitialValue(res)))
      );
    },
  save: (searchConditionList: Array<SearchConditions>) => () => {
    return updatePersonalSetting(searchConditionList);
  },
  delete: () => () => {
    return updatePersonalSetting(null);
  },
};

function initialState(): Array<SearchConditions> {
  return [searchConditionInitValue()];
}

export default ((state = initialState(), action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<Array<SearchConditions>, any>;
