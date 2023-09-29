import { Dispatch, Reducer } from 'redux';

import _ from 'lodash';

import { catchApiError, loadingEnd, loadingStart } from '@commons/actions/app';
import { Option, OptionList } from '@commons/components/fields/CustomDropdown';

import {
  EmployeeList,
  getEmployeeList,
} from '@apps/domain/models/common/Employee';

export const ACTIONS = {
  LIST_SUCCESS: 'COMMONS/EXP/ENTITIES/EMPLOYEE_LIST/LIST_SUCCESS',
  UPDATE_SUCCESS: 'COMMONS/EXP/ENTITIES/EMPLOYEE_LIST/UPDATE_SUCCESS',
};

const listSuccess = (
  employeeList: EmployeeList,
  prevSelectedOptions?: OptionList
) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: { employeeList, prevSelectedOptions },
});

const updateSuccess = (departmentOptions: OptionList) => ({
  type: ACTIONS.UPDATE_SUCCESS,
  payload: departmentOptions,
});

export const actions = {
  updateData:
    (options: OptionList) =>
    (dispatch: Dispatch<any>): void => {
      const data = _.uniqBy(options, 'value');
      dispatch(updateSuccess(data));
    },
  list:
    (
      companyId?: string,
      targetDate?: string,
      limitNumber?: number,
      searchQuery?: string,
      prevSelectedOptions?: OptionList,
      idList?: string[]
    ) =>
    (
      dispatch: Dispatch<any>
    ): Promise<void | {
      payload: { employeeList: any[]; prevSelectedOptions: any };
      type: string;
    }> => {
      const detailSelectorList = [];
      return getEmployeeList(
        companyId,
        targetDate,
        limitNumber,
        searchQuery,
        detailSelectorList
      )
        .then((res: EmployeeList) => {
          if (idList?.length > 0) {
            const idListRes = res.map((item) => item.id);
            const empNotInList = idList.filter(
              (emp) => !idListRes.includes(emp)
            );
            if (empNotInList.length > 0) {
              return getEmployeeList(
                companyId,
                targetDate,
                limitNumber,
                searchQuery,
                detailSelectorList,
                empNotInList
              ).then((extraRes: EmployeeList) => {
                return res.concat(extraRes);
              });
            }
          }
          return res;
        })
        .then((res: EmployeeList) => {
          dispatch(listSuccess(res, prevSelectedOptions));
        })
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
  fetch:
    (
      companyId?: string,
      targetDate?: string,
      limitNumber?: number,
      searchQuery?: string
    ) =>
    (dispatch: Dispatch<any>): Promise<EmployeeList> => {
      dispatch(loadingStart());
      return getEmployeeList(companyId, targetDate, limitNumber, searchQuery)
        .then((res: EmployeeList) => {
          dispatch(loadingEnd());
          return res;
        })
        .catch((err) => {
          dispatch(loadingEnd());
          dispatch(catchApiError(err, { isContinuable: true }));
          throw err;
        });
    },
};

const convertStyle = ({
  employeeList,
  prevSelectedOptions = [],
}: Record<string, any>) => {
  const options = prevSelectedOptions.concat(
    employeeList.map((employee) => {
      const employeeOption: Option = {
        label: employee.name,
        value: employee.id,
      };
      return employeeOption;
    })
  );
  return _.uniqBy(options, 'value');
};

const initialState: OptionList = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      return convertStyle(action.payload);
    case ACTIONS.UPDATE_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<OptionList, any>;
