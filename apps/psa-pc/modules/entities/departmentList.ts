import { Dispatch, Reducer } from 'redux';

import _ from 'lodash';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import { OptionList } from '@apps/commons/components/fields/CustomDropdown';

import {
  DepartmentList,
  getDepartmentList,
} from '@apps/domain/models/exp/Department';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/ENTITIES/DEPARTMENT_LIST/LIST_SUCCESS',
  UPDATE_SUCCESS: 'MODULES/ENTITIES/DEPARTMENT_LIST/UPDATE_SUCCESS',
};

const listSuccess = (
  departmentList: DepartmentList,
  prevSelectedOptions?: OptionList
) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: { departmentList, prevSelectedOptions },
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
      detailSelector?: string[],
      prevSelectedOptions?: OptionList
    ) =>
    (
      dispatch: Dispatch<any>
    ): Promise<{
      payload: { departmentList: any[]; prevSelectedOptions: any };
      type: string;
    }> => {
      return getDepartmentList(
        companyId,
        targetDate,
        limitNumber,
        detailSelector
      ).then((res: DepartmentList) =>
        dispatch(listSuccess(res, prevSelectedOptions))
      );
    },
  fetchByQuery:
    (
      companyId?: string,
      targetDate?: string,
      limitNumber?: number,
      detailSelector?: string[],
      searchQuery?: string
    ) =>
    (dispatch: Dispatch<any>): Promise<DepartmentList> => {
      dispatch(loadingStart());
      return getDepartmentList(
        companyId,
        targetDate,
        limitNumber,
        detailSelector,
        searchQuery
      )
        .then((res: DepartmentList) => {
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
  departmentList,
  prevSelectedOptions = [],
}: Record<string, any>) => {
  const options = prevSelectedOptions.concat(
    departmentList.map((dept) => {
      const deptOption: any = {
        id: dept.id,
        code: dept.code,
        name: dept.name,
        displayName: `${dept.id} - ${dept.code}`,
      };
      return deptOption;
    })
  );
  return _.uniqBy(options, 'id');
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
