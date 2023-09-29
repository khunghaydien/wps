import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { find, get, isEmpty } from 'lodash';

import { goBack } from '@mobile/concerns/routingHistory';

import {
  customRequestFilterField,
  filterType,
} from '@apps/mobile-app/constants/advSearch';

import { DateRangeOption } from '@apps/commons/components/fields/DropdownDateRange';
import { OptionProps as Option } from '@apps/commons/components/fields/SearchableDropdown';
import msg from '@apps/commons/languages';
import FilterDetail from '@apps/mobile-app/components/pages/commons/FilterDetail';

import { STATUS_MAP } from '@apps/domain/models/exp/CustomRequest';
import { OPTION_LIMIT } from '@apps/domain/models/exp/request/Report';

import { State } from '@apps/mobile-app/modules';
import {
  actions as empListActions,
  EmployeeOptionList,
} from '@apps/mobile-app/modules/expense/entities/advSearch/employeeList';
import {
  actions as customRequestTypeActions,
  initialState as initialCustomRequestTypes,
} from '@apps/mobile-app/modules/expense/ui/advSearch/customRequestTypeList';
import { actions as empBaseIdActions } from '@apps/mobile-app/modules/expense/ui/advSearch/empBaseIdList';
import { actions as requestDateRangeActions } from '@apps/mobile-app/modules/expense/ui/advSearch/requestDateRange';
import {
  actions as statusActions,
  initialState as initialStatus,
} from '@apps/mobile-app/modules/expense/ui/advSearch/statusList';
import {
  actions as titleActions,
  initialState as initialTitle,
} from '@apps/mobile-app/modules/expense/ui/advSearch/title';

import {
  getEmployeeList,
  getInitialRequestDateRange,
  searchEmpList,
} from '@apps/mobile-app/action-dispatchers/expense/CustomRequestSearch';

export const filterOptionConfig = {
  [customRequestFilterField.STATUS]: {
    label: msg().Exp_Lbl_Status,
    type: filterType.SELECTION,
  },
  [customRequestFilterField.REQUEST_TYPE]: {
    label: msg().Exp_Lbl_RequestType,
    type: filterType.SELECTION,
  },
  [customRequestFilterField.TITLE]: {
    label: msg().Exp_Lbl_Title,
    type: filterType.TEXT,
  },
  [customRequestFilterField.EMPLOYEE]: {
    label: msg().Exp_Btn_SearchConditionEmployee,
    type: filterType.SEARCH,
  },
  [customRequestFilterField.REQUEST_DATE]: {
    label: msg().Exp_Lbl_RequestedDate,
    type: filterType.DATE_RANGE,
  },
};

const FilterDetailContainer = (
  props: RouteComponentProps
): React.ReactElement => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const employeeId = useSelector(
    (state: State) => state.userSetting.employeeId
  );
  const { accountingPeriodId } = useSelector(
    (state: State) => state.expense.ui.report.formValues
  );
  const accountingPeriodAll = useSelector(
    (state: State) => state.expense.entities.accountingPeriod
  );
  // selected filter values
  const advSearch = useSelector((state: State) => state.expense.ui.advSearch);
  // filter options
  const empOptions = useSelector(
    (state: State) => state.expense.entities.advSearch.employeeList
  );
  const requestTypeOptions = useSelector(
    (state: State) => state.expense.entities.advSearch.customRequestTypeList
  );
  const statusOptions = Object.keys(STATUS_MAP).map((key) => {
    const msgKey = STATUS_MAP[key];
    const label = msg()[msgKey];
    return { value: key, label };
  });

  const filterKey = get(props.history.location.state, 'key');
  const filterLabel = filterOptionConfig[filterKey].label;
  const filterType = filterOptionConfig[filterKey].type;

  const getFilterOptions = () => {
    switch (filterKey) {
      case customRequestFilterField.STATUS:
        return {
          options: statusOptions,
          type: filterType,
          selected: advSearch.statusList,
          initial: initialStatus,
          onClickOption: (selectedValue: Array<string>) => {
            dispatch(statusActions.set(selectedValue));
            onClickBack();
          },
        };
      case customRequestFilterField.REQUEST_TYPE:
        return {
          options: requestTypeOptions,
          type: filterType,
          selected: advSearch.customRequestTypeList,
          initial: initialCustomRequestTypes,
          onClickOption: (selectedValue: string) => {
            dispatch(customRequestTypeActions.set(selectedValue));
            onClickBack();
          },
        };
      case customRequestFilterField.TITLE:
        return {
          type: filterType,
          selected: advSearch.title,
          initial: initialTitle,
          onClickOption: (selectedValue: string) => {
            dispatch(titleActions.set(selectedValue));
            onClickBack();
          },
        };
      case customRequestFilterField.EMPLOYEE:
        return {
          options: empOptions,
          type: filterType,
          selected: advSearch.empBaseIdList,
          initial: [employeeId],
          onClickOption: (
            selectedValue: Array<string>,
            selectedOption: Option
          ) => {
            if (!isEmpty(selectedOption)) {
              dispatch(
                empListActions.updateList(
                  getUpdatedEmpOptions(empOptions, selectedOption)
                )
              );
            }
            dispatch(empBaseIdActions.set(selectedValue));
            onClickBack();
          },
        };
      case customRequestFilterField.REQUEST_DATE:
        return {
          type: filterType,
          selected: advSearch.requestDateRange,
          initial: getInitialRequestDateRange(
            accountingPeriodId,
            accountingPeriodAll
          ),
          onClickOption: (selectedValue: DateRangeOption) =>
            onClickRequestDateFilter(selectedValue),
        };
      default:
        return null;
    }
  };

  const updateOptions = (options: Array<Option>) => {
    if (filterKey === customRequestFilterField.EMPLOYEE) {
      return dispatch(empListActions.updateList(options));
    }
  };

  const onClickRequestDateFilter = (selectedValue: DateRangeOption) => {
    // refetch employee options since employee may be invalid at the selected start date
    const targetDate = selectedValue.startDate;
    const selectedEmp = empOptions.filter(({ value }) =>
      advSearch.empBaseIdList.includes(value)
    );
    dispatch(getEmployeeList(targetDate, OPTION_LIMIT + 1, selectedEmp))
      // @ts-ignore
      .then(() => {
        onClickBack();
      });
    dispatch(requestDateRangeActions.set(selectedValue));
  };

  const onClickSearch = (query = null) => {
    const targetDate = advSearch.requestDateRange.startDate;
    if (filterKey === customRequestFilterField.EMPLOYEE) {
      return (
        dispatch(searchEmpList(companyId, targetDate, OPTION_LIMIT + 1, query))
          // @ts-ignore
          .then((res: Promise<EmployeeOptionList>) => res[0])
      );
    }
    return null;
  };

  const getUpdatedEmpOptions = (
    options: Array<Option>,
    selectedOption: Option
  ): Array<Option> => {
    // add selected value to option list if it does not exist
    const isSelectedIncluded =
      selectedOption && find(options, ['value', selectedOption.value]);
    const newDataList = isSelectedIncluded
      ? options
      : [selectedOption].concat(options);
    return newDataList;
  };

  const onClickBack = () => {
    goBack(props.history);
  };

  return (
    <FilterDetail
      content={getFilterOptions()}
      title={filterLabel}
      onClickBack={onClickBack}
      onClickSearch={onClickSearch}
      updateOptions={updateOptions}
    />
  );
};

export default FilterDetailContainer;
