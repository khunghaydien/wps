import { Dispatch, Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../../commons/actions/tab';

import {
  EmployeePersonalInfo,
  fetch as fetchEmployees,
  FetchQuery,
} from '../../../../models/common/EmployeePersonalInfo';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../../base/menu-pane/ui';

type State = {
  list: EmployeePersonalInfo[];
  isOverLimit: boolean;
};

const KEY = 'MODULES/ADMIN_COMMON/EMPLOYEE_SELECTION/UI/SEARCH_QUERY';
const ACTIONS = {
  SET: `${KEY}/SET`,
  UNSET: `${KEY}/UNSET`,
};

const setEmployeeList = (
  employeeList: EmployeePersonalInfo[],
  limitNumber: number
) => ({
  type: ACTIONS.SET,
  payload: { employeeList, limitNumber },
});

export const actions = {
  clear: () => ({
    type: ACTIONS.UNSET,
  }),

  fetch:
    (param: FetchQuery, onSuccess: () => void = () => {}) =>
    (dispatch: Dispatch<any>) => {
      dispatch(loadingStart());
      return fetchEmployees({
        ...param,
        limitNumber: param.limitNumber + 1,
      })
        .then((employeesList) =>
          dispatch(setEmployeeList(employeesList, param.limitNumber))
        )
        .then(onSuccess)
        .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
        .then(() => dispatch(loadingEnd()));
    },
};

const initialState: State = {
  list: [],
  isOverLimit: false,
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      const { employeeList, limitNumber } = action.payload;
      return {
        list: employeeList.slice(0, limitNumber),
        isOverLimit: employeeList.length > limitNumber,
      };

    case SELECT_TAB:
    case CHANGE_COMPANY:
    case SELECT_MENU_ITEM:
    case ACTIONS.UNSET:
      return initialState;

    default:
      return state;
  }
}) as Reducer<State, any>;
