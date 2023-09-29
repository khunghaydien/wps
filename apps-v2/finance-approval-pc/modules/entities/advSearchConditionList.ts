import { Dispatch, Reducer } from 'redux';

import { cloneDeep } from 'lodash';

import Api from '../../../commons/api';
import msg from '../../../commons/languages';

import {
  FAPersonalSettingResponse,
  FAExpSearchConditionList,
  FAReqSearchConditionList,
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

const getSuccess = (result: FAPersonalSettingResponse) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: result,
});

const createInitialValue = (label: string): SearchConditions => {
  const initialValues = cloneDeep(searchConditionInitValue());
  initialValues.name = label;
  return initialValues;
};

export const addInitialValue = (res: FAPersonalSettingResponse) => {
  const resWithInitVal = cloneDeep(res);
  const expenseInitValue = createInitialValue(
    msg().Exp_Lbl_SearchConditionApprovelreRuestList
  );
  const requestInitValue = createInitialValue(
    msg().Exp_Lbl_SearchConditionApprovedRequestList
  );
  resWithInitVal.expReportSearchConditionList.unshift(expenseInitValue);
  resWithInitVal.expRequestSearchConditionList.unshift(requestInitValue);
  return resWithInitVal;
};

export const actions = {
  get:
    () =>
    (dispatch: Dispatch<any>): Promise<Array<SearchConditions>> | any => {
      return getPersonalSetting().then((res: FAPersonalSettingResponse) =>
        dispatch(getSuccess(addInitialValue(res)))
      );
    },
  save:
    (
      searchConditionList: FAReqSearchConditionList | FAExpSearchConditionList
    ) =>
    () => {
      return updatePersonalSetting(searchConditionList);
    },
  delete: () => () => {
    return updatePersonalSetting(null);
  },
};

function initialState(): FAPersonalSettingResponse {
  const expenseInitValue = createInitialValue(
    msg().Exp_Lbl_SearchConditionApprovelreRuestList
  );
  const requestInitValue = createInitialValue(
    msg().Exp_Lbl_SearchConditionApprovedRequestList
  );
  return {
    expReportSearchConditionList: [expenseInitValue],
    expRequestSearchConditionList: [requestInitValue],
  };
}

export default ((state = initialState(), action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<FAPersonalSettingResponse, any>;
