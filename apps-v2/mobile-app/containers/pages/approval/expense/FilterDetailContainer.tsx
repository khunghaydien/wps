import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import get from 'lodash/get';

import { filterField, filterType } from '@apps/mobile-app/constants/advSearch';

import { OptionProps as Option } from '@apps/commons/components/fields/SearchableDropdown';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import FilterDetail from '@apps/mobile-app/components/pages/commons/FilterDetail';

import { DEPARTMENT_LIST } from '@apps/domain/models/exp/Department';
import {
  mobileInitialSearchCondition,
  OPTION_LIMIT,
} from '@apps/domain/models/exp/request/Report';

import { State } from '@apps/mobile-app/modules';
import { actions as depEntitiesActions } from '@apps/mobile-app/modules/approval/entities/expense/advSearch/departmentList';
import { actions as empEntitiesActions } from '@apps/mobile-app/modules/approval/entities/expense/advSearch/employeeList';
import {
  actions as departmentActions,
  DepartmentHistoryIds,
} from '@apps/mobile-app/modules/approval/ui/expense/advSearch/departmentBaseIds';
import {
  actions as employeeActions,
  EmployeeHistoryIds,
} from '@apps/mobile-app/modules/approval/ui/expense/advSearch/empBaseIdList';
import {
  actions as requestDateActions,
  initialState as requestDateInitial,
  requestDateConverter,
  requestDateOptions,
} from '@apps/mobile-app/modules/approval/ui/expense/advSearch/requestDateRange';
import {
  actions as statusActions,
  statusOption,
} from '@apps/mobile-app/modules/approval/ui/expense/advSearch/statusList';

import {
  fetchDeprtmentList,
  fetchEmpList,
  searchDepartment,
  searchEmployee,
} from '@apps/mobile-app/action-dispatchers/approval/List';

import {
  departmentSelector,
  depEntitiesSelector,
  empEntitiesSelector,
  empSelector,
  requestDateSelector,
  statusSelector,
} from './ExpListContainer';

type EmpDepOptionList = Array<Option>;

const filterFieldsConfig = {
  status: {
    label: msg().Exp_Btn_SearchConditionStatus,
    type: filterType.SELECTION,
  },
  employee: {
    label: msg().Exp_Btn_SearchConditionEmployee,
    type: filterType.SEARCH,
  },
  department: {
    label: msg().Exp_Btn_SearchConditionDepartment,
    type: filterType.SEARCH,
  },
  requestDate: {
    label: msg().Exp_Btn_SearchConditionRequestDate,
    type: filterType.DATE,
  },
};

const FilterDetailContainer = (
  props: RouteComponentProps
): React.ReactElement => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const activeModule = useSelector(
    (state: State) => state.approval.ui.requestModule
  );
  // selected options
  const selectedStatus = useSelector((state: State) => statusSelector(state));
  const selectedEmpBaseIds = useSelector((state: State) => empSelector(state));
  const selectedDepBaseIds = useSelector((state: State) =>
    departmentSelector(state)
  );
  const selectedDateRange = useSelector((state: State) =>
    requestDateSelector(state)
  );
  // filter options
  const empOptions = useSelector((state: State) => empEntitiesSelector(state));
  const depOptions = useSelector((state: State) => depEntitiesSelector(state));

  const targetDateRange = requestDateConverter(selectedDateRange);
  const targetDate = get(targetDateRange, 'startDate') || DateUtil.getToday();
  const filterKey = get(props.history.location.state, 'key');
  const filterName = filterFieldsConfig[filterKey].label;
  const filterType = filterFieldsConfig[filterKey].type;

  const getFilterOptions = () => {
    switch (filterKey) {
      case filterField.STATUS:
        return {
          options: statusOption(),
          type: filterType,
          selected: selectedStatus,
          initial: mobileInitialSearchCondition.statusList,
          onClickOption: (selectedValue: Array<string>) => {
            dispatch(statusActions.set(selectedValue));
            onClickBack();
          },
        };
      case filterField.EMPLOYEE:
        return {
          options: empOptions,
          type: filterType,
          selected: selectedEmpBaseIds,
          initial: mobileInitialSearchCondition.empBaseIdList,
          onClickOption: (selectedValue: Array<string>) => {
            dispatch(employeeActions.set(selectedValue));
            onClickBack();
          },
        };
      case filterField.DEPARTMENT:
        return {
          options: depOptions,
          type: filterType,
          selected: selectedDepBaseIds,
          initial: mobileInitialSearchCondition.departmentBaseIds,
          onClickOption: (selectedValue: Array<string>) => {
            dispatch(departmentActions.set(selectedValue));
            onClickBack();
          },
        };
      case filterField.REQUEST_DATE:
        return {
          options: requestDateOptions(),
          type: filterType,
          selected: selectedDateRange,
          initial: requestDateInitial,
          onClickOption: (selectedValue: string) => {
            onClickRequestDateFilter(selectedValue);
          },
        };
      default:
        return null;
    }
  };

  const onClickRequestDateFilter = (selectedValue: string) => {
    // refetch employee and department options
    // employee or epartment may be invalid at the selected start date
    const targetDateRange = requestDateConverter(selectedValue);
    const targetDate = get(targetDateRange, 'startDate') || DateUtil.getToday();
    const selectedEmp = getSelectedOptions(selectedEmpBaseIds, empOptions);
    const selectedDept = getSelectedOptions(selectedDepBaseIds, depOptions);

    Promise.all([
      dispatch(
        fetchEmpList(companyId, targetDate, OPTION_LIMIT + 1, selectedEmp, true)
      ),
      dispatch(
        fetchDeprtmentList(
          companyId,
          targetDate,
          OPTION_LIMIT + 1,
          [DEPARTMENT_LIST],
          selectedDept,
          true
        )
      ),
    ]).then(() => {
      onClickBack();
    });
    dispatch(requestDateActions.set(selectedValue));
  };

  const getSelectedOptions = (selectedIds: Array<string>, options = []) =>
    options.filter(({ value }) => selectedIds.includes(value));

  const onClickBack = () => {
    props.history.replace(`/approval/${activeModule}/list`);
  };

  const searchOptions = (query = null) => {
    switch (filterKey) {
      case filterField.EMPLOYEE:
        return (
          dispatch(
            searchEmployee(companyId, targetDate, OPTION_LIMIT + 1, query, true)
          )
            // @ts-ignore
            .then((res: Promise<EmployeeHistoryIds>) => res[0])
        );
      case filterField.DEPARTMENT:
        return (
          dispatch(
            searchDepartment(
              companyId,
              targetDate,
              OPTION_LIMIT + 1,
              [DEPARTMENT_LIST],
              query,
              true
            )
          )
            // @ts-ignore
            .then((res: Promise<DepartmentHistoryIds>) => res[0])
        );
      default:
        return null;
    }
  };

  const updateOptions = (options: Array<Option>) => {
    switch (filterKey) {
      case filterField.EMPLOYEE:
        dispatch(empEntitiesActions.updateList(options));
        break;
      case filterField.DEPARTMENT:
        dispatch(depEntitiesActions.updateList(options));
        break;
      default:
    }
  };

  const fetchEmpDepOptions = () => {
    const _ = undefined;
    switch (filterKey) {
      case filterField.EMPLOYEE:
        return (
          dispatch(
            fetchEmpList(companyId, targetDate, OPTION_LIMIT + 1, _, true)
          )
            // @ts-ignore
            .then((res: [EmpDepOptionList]) => res[0])
        );
      case filterField.DEPARTMENT:
        return (
          dispatch(
            fetchDeprtmentList(
              companyId,
              targetDate,
              OPTION_LIMIT + 1,
              [DEPARTMENT_LIST],
              _,
              true
            )
          )
            // @ts-ignore
            .then((res: [EmpDepOptionList]) => res[0])
        );
      default:
        return null;
    }
  };

  return (
    <FilterDetail
      content={getFilterOptions()}
      title={filterName}
      onClickBack={onClickBack}
      onClickSearch={searchOptions}
      updateOptions={updateOptions}
      fetchOptions={fetchEmpDepOptions}
    />
  );
};

export default FilterDetailContainer;
