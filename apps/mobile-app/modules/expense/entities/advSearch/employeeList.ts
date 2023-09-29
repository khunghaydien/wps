import { Reducer } from 'redux';

import { uniqBy } from 'lodash';

import { catchApiError } from '../../../../../commons/actions/app';
import { OptionProps as Option } from '../../../../../commons/components/fields/SearchableDropdown';

import {
  EmployeeList,
  getEmployeeList,
} from '../../../../../domain/models/common/Employee';

import { AppDispatch } from '../../AppThunk';

export type EmployeeOptionList = Array<Option>;

export const DEFAULT_LIMIT_NUMBER = 100;

const ACTIONS = {
  LIST_SUCCESS:
    'MODULES/EXPENSE/ENTITIES/ADV_SEARCH/EMPLOYEE_LIST/LIST_SUCCESS',
  UPDATE_SUCCESS:
    'MODULES/EXPENSE/ENTITIES/ADV_SEARCH/EMPLOYEE_LIST/UPDATE_SUCCESS',
};

const listSuccess = (options: EmployeeOptionList) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: options,
});

const updateSuccess = (options: EmployeeOptionList) => ({
  type: ACTIONS.UPDATE_SUCCESS,
  payload: options,
});

const convertStyle = (
  employeeList: EmployeeList,
  prevSelectedOptions = []
): EmployeeOptionList => {
  const options = prevSelectedOptions.concat(
    employeeList.map(({ name, id }) => ({
      label: name,
      value: id,
    }))
  );
  return uniqBy(options, 'value');
};

export const actions = {
  updateList:
    (options: EmployeeOptionList) =>
    (dispatch: AppDispatch): void => {
      const data = uniqBy(options, 'value');
      dispatch(updateSuccess(data));
    },
  fetchList:
    (
      companyId?: string,
      targetDate?: string,
      limitNumber?: number,
      prevSelectedOptions?: EmployeeOptionList
    ) =>
    (dispatch: AppDispatch): Promise<EmployeeOptionList> => {
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
    (dispatch: AppDispatch): Promise<EmployeeOptionList> => {
      return getEmployeeList(companyId, targetDate, limitNumber, searchQuery)
        .then((res: EmployeeList) => {
          return convertStyle(res);
        })
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: true }));
          throw err;
        });
    },
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
    case ACTIONS.UPDATE_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<EmployeeOptionList, any>;
