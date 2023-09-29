import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { cloneDeep, get } from 'lodash';

import {
  goBack,
  pushHistoryWithPrePage,
} from '@mobile/concerns/routingHistory';

import { customRequestFilterField } from '@apps/mobile-app/constants/advSearch';

import { OptionProps } from '@apps/commons/components/fields/SearchableDropdown';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import CustomRequestList from '@apps/mobile-app/components/pages/expense/commons/CustomRequestList';

import {
  DEFAULT_LIMIT_NUMBER,
  STATUS_MAP,
} from '@apps/domain/models/exp/CustomRequest';

import { State } from '../../../modules';
import { actions as formValueReportAction } from '../../../modules/expense/ui/report/formValues';

import {
  getEmployeeList,
  resetSearchCondition,
  searchCustomRequest,
} from '@apps/mobile-app/action-dispatchers/expense/CustomRequestSearch';

export type FilterList = Array<{
  key: string;
  label: string;
  value: string;
  count: number;
}>;

type Props = RouteComponentProps & {
  reportId?: string;
};

const CustomRequestContainer = (props: Props): React.ReactElement => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const formValuesReport = useSelector(
    (state: State) => state.expense.ui.report.formValues
  );
  const employeeList = useSelector(
    (state: State) => state.expense.entities.advSearch.employeeList
  );
  const requestTypeList = useSelector(
    (state: State) => state.expense.entities.advSearch.customRequestTypeList
  );
  const customRequestList = useSelector(
    (state: State) => state.expense.entities.customRequestList
  );

  // selected filter values
  const statusList = useSelector(
    (state: State) => state.expense.ui.advSearch.statusList
  );
  const requestTypeIdList = useSelector(
    (state: State) => state.expense.ui.advSearch.customRequestTypeList
  );
  const title = useSelector((state: State) => state.expense.ui.advSearch.title);
  const empBaseIdList = useSelector(
    (state: State) => state.expense.ui.advSearch.empBaseIdList
  );
  const requestDateRange = useSelector(
    (state: State) => state.expense.ui.advSearch.requestDateRange
  );

  useEffect(() => {
    const searchCondition = {
      statusList,
      recordTypeIds: requestTypeIdList,
      empBaseIds: empBaseIdList,
      title,
      requestDateRange,
    };
    dispatch(searchCustomRequest(searchCondition));
  }, [
    statusList,
    requestTypeIdList,
    empBaseIdList,
    title,
    requestDateRange,
    dispatch,
  ]);

  const onClickCustomRequestItem = (id: string, title: string) => {
    const newFormValues = cloneDeep(formValuesReport);
    newFormValues.customRequestId = id;
    newFormValues.customRequestName = title;
    dispatch(formValueReportAction.save(newFormValues));

    const url =
      props.reportId && props.reportId !== 'null'
        ? `/expense/report/edit/${props.reportId}`
        : '/expense/report/new';

    props.history.push(url, {
      target: get(props.history, 'location.state.target'),
    });
  };

  const onClickBack = () => {
    goBack(props.history);
  };

  const onClickFilterItem = (key: string) => {
    pushHistoryWithPrePage(
      props.history,
      '/expense/custom-request/advance-search/detail',
      {
        key,
      }
    );
  };

  const onClickResetSearchCondition = () => {
    dispatch(resetSearchCondition());
    dispatch(getEmployeeList());
  };

  const getEmpFilterValueAndCount = () => {
    const selectedEmpOptions = employeeList.filter((empOption: OptionProps) =>
      empBaseIdList.includes(empOption.value)
    );
    const selectedLabels = selectedEmpOptions.map(
      (empOption: OptionProps) => empOption.label
    );
    return { value: selectedLabels.join(', '), count: selectedLabels.length };
  };

  const getRequestTypeValue = () => {
    const selectedRequestTypeOptions = requestTypeList.filter(
      (requestTypeOption: OptionProps) =>
        requestTypeIdList.includes(requestTypeOption.value)
    );
    const selectedLabels = selectedRequestTypeOptions.map(
      (requestTypeOption: OptionProps) => requestTypeOption.label
    );
    return selectedLabels;
  };

  const filterList = [
    {
      key: customRequestFilterField.STATUS,
      label: msg().Exp_Lbl_Status,
      value: statusList
        .map((status: string) => msg()[STATUS_MAP[status]])
        .join(', '),
      count: statusList.length,
    },
    {
      key: customRequestFilterField.REQUEST_TYPE,
      label: msg().Exp_Lbl_RequestType,
      value: getRequestTypeValue(),
      count: requestTypeIdList.length,
    },
    {
      key: customRequestFilterField.TITLE,
      label: msg().Exp_Lbl_Title,
      value: title,
      count: title.length ? 1 : 0,
    },
    {
      key: customRequestFilterField.EMPLOYEE,
      label: msg().Exp_Btn_SearchConditionEmployee,
      ...getEmpFilterValueAndCount(),
    },
    {
      key: customRequestFilterField.REQUEST_DATE,
      label: msg().Exp_Lbl_RequestedDate,
      value: `${DateUtil.format(
        requestDateRange.startDate
      )} - ${DateUtil.format(requestDateRange.endDate)}`,
      count: 1,
    },
  ];

  return (
    <CustomRequestList
      customRequestList={customRequestList}
      filterList={filterList}
      limitNumber={DEFAULT_LIMIT_NUMBER}
      onClickFilterItem={onClickFilterItem}
      onClickCustomRequestItem={onClickCustomRequestItem}
      onClickBack={onClickBack}
      onClickResetSearchCondition={onClickResetSearchCondition}
    />
  );
};

export default CustomRequestContainer;
