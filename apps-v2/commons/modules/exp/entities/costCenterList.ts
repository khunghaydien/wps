import { Dispatch, Reducer } from 'redux';

import { catchApiError } from '@commons/actions/app';
import { Option, OptionList } from '@commons/components/fields/CustomDropdown';

import {
  CostCenterList,
  searchCostCenter,
} from '@apps/domain/models/exp/CostCenter';

export const COST_CENTER_LIST = 'costCenterList';

export const ACTIONS = {
  LIST_SUCCESS: 'COMMONS/EXP/ENTITIES/COST_CENTER/LIST_SUCCESS',
};

const listSuccess = (costCenterList: CostCenterList) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: costCenterList,
});

export const actions = {
  list:
    (
      companyId?: string,
      targetDate?: string,
      detailSelector?: string[],
      limitNumber?: number
    ) =>
    (
      dispatch: Dispatch<any>
    ): Promise<{ payload: CostCenterList; type: string } | void> => {
      const _ = undefined;
      return searchCostCenter(
        companyId,
        _,
        targetDate,
        _,
        'REPORT',
        detailSelector,
        limitNumber
      )
        .then((res: CostCenterList) => dispatch(listSuccess(res)))
        .catch((err) => {
          dispatch(listSuccess([]));
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
};

const convertStyle = (costCenterList: CostCenterList) => {
  const options = costCenterList.map((costCenter) => {
    const costCenterOption: Option = {
      label: costCenter.name,
      value: costCenter.id,
      detail: costCenter.hierarchyParentNameList.reverse().join(' > '),
    };
    return costCenterOption;
  });
  return options;
};

const initialState: OptionList = null;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      return convertStyle(action.payload);
    default:
      return state;
  }
}) as Reducer<OptionList, any>;
