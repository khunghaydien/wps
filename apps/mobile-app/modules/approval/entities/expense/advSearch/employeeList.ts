import { Reducer } from 'redux';

import _ from 'lodash';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../../../commons/actions/app';
import { OptionProps as Option } from '../../../../../../commons/components/fields/SearchableDropdown';

import {
  EmployeeList,
  getEmployeeList,
} from '../../../../../../domain/models/common/Employee';

import { AppDispatch } from '../../../AppThunk';

export type OptionList = Array<Option>;

const ACTIONS = {
  LIST_SUCCESS:
    'MODULES/ENTITIES/APPROVAL/EXPENSE/ADV_SEARCH/EMPLOYEE_LIST/LIST_SUCCESS',
  UPDATE_SUCCESS:
    'MODULES/ENTITIES/APPROVAL/EXPENSE/ADV_SEARCH/EMPLOYEE_LIST/UPDATE_SUCCESS',
};

const listSuccess = (options: OptionList) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: options,
});

const updateSuccess = (options: OptionList) => ({
  type: ACTIONS.UPDATE_SUCCESS,
  payload: options,
});

const convertStyle = (employeeList, prevSelectedOptions = []): OptionList => {
  const options = prevSelectedOptions.concat(
    employeeList.map(({ name, id }) => ({
      label: name,
      value: id,
    }))
  );
  return _.uniqBy(options, 'value');
};

export const actions = {
  updateList:
    (options: OptionList) =>
    (dispatch: AppDispatch): void => {
      const data = _.uniqBy(options, 'value');
      dispatch(updateSuccess(data));
    },
  fetchList:
    (
      companyId?: string,
      targetDate?: string,
      limitNumber?: number,
      prevSelectedOptions?: OptionList
    ) =>
    (dispatch: AppDispatch) => {
      return getEmployeeList(companyId, targetDate, limitNumber).then(
        (res: EmployeeList) => {
          const options = convertStyle(res, prevSelectedOptions);
          dispatch(listSuccess(options));
          return options;
        }
      );
    },
  search:
    (
      companyId?: string,
      targetDate?: string,
      limitNumber?: number,
      searchQuery?: string
    ) =>
    (dispatch: AppDispatch): Promise<OptionList> => {
      dispatch(loadingStart());
      return getEmployeeList(companyId, targetDate, limitNumber, searchQuery)
        .then((res: EmployeeList) => {
          dispatch(loadingEnd());
          return convertStyle(res);
        })
        .catch((err) => {
          dispatch(loadingEnd());
          dispatch(catchApiError(err, { isContinuable: true }));
          throw err;
        });
    },
};

const initialState: OptionList = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
    case ACTIONS.UPDATE_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<OptionList, any>;
