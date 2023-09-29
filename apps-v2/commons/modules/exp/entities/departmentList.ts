import { Dispatch, Reducer } from 'redux';

import _ from 'lodash';

import { catchApiError, loadingEnd, loadingStart } from '@commons/actions/app';
import { Option, OptionList } from '@commons/components/fields/CustomDropdown';

import {
  DepartmentList,
  getDepartmentList,
} from '@apps/domain/models/exp/Department';

export const ACTIONS = {
  LIST_SUCCESS: 'COMMONS/EXP/ENTITIES/DEPARTMENT_LIST/LIST_SUCCESS',
  UPDATE_SUCCESS: 'COMMONS/EXP/ENTITIES/DEPARTMENT_LIST/UPDATE_SUCCESS',
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
      prevSelectedOptions?: OptionList,
      idList?: string[]
    ) =>
    (
      dispatch: Dispatch<any>
    ): Promise<void | {
      payload: { departmentList: any[]; prevSelectedOptions: any };
      type: string;
    }> => {
      return getDepartmentList(
        companyId,
        targetDate,
        limitNumber,
        detailSelector
      )
        .then((res: DepartmentList) => {
          if (idList?.length > 0) {
            const idListRes = res.map((dep) => dep.id);
            const depNotInList = idList.filter(
              (dep) => !idListRes.includes(dep)
            );
            if (depNotInList.length > 0) {
              return getDepartmentList(
                companyId,
                targetDate,
                limitNumber,
                detailSelector,
                undefined,
                depNotInList
              ).then((extraRes: DepartmentList) => {
                return res.concat(extraRes);
              });
            }
          }
          return res;
        })
        .then((res: DepartmentList) =>
          dispatch(listSuccess(res, prevSelectedOptions))
        )
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: true }));
        });
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
    departmentList.map((department) => {
      const departmentOption: Option = {
        label: department.name,
        value: department.id,
      };
      return departmentOption;
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
