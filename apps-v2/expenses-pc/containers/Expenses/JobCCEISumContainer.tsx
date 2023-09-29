import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import isEmpty from 'lodash/isEmpty';

import {
  getRecentCostCenters,
  searchCostCenters,
} from '@commons/action-dispatchers/CostCenter';
import JobCCEISum, {
  ContainerProps,
} from '@commons/components/exp/Form/RecordItem/JobCCEISum';
import { selectors as appSelectors } from '@commons/modules/app';

import { EISearchObj } from '@apps/domain/models/exp/ExtendedItem';

import { State } from '@apps/expenses-pc/modules';
import { AppDispatch } from '@apps/expenses-pc/modules/AppThunk';

import {
  openCostCenterDialog,
  openEILookupDialog,
  openJobDialog,
} from '@apps/expenses-pc/action-dispatchers/Dialog';
import {
  getRecentJobs,
  searchJobs,
} from '@apps/expenses-pc/action-dispatchers/Job';

const JobCCEISumContainer = (props: ContainerProps) => {
  const dispatch = useDispatch() as AppDispatch;

  const employeeId = useSelector(
    (state: State) => state.userSetting.employeeId
  );
  const selectedCompanyId = useSelector(
    (state: State) => state.userSetting.companyId
  );
  const isSkipRecentlyUsedFetch = useSelector(
    (state: State) =>
      !isEmpty(state.ui.expenses.delegateApplicant.selectedEmployee) ||
      isFinanceApproval
  );
  const subroleId = useSelector(
    (state: State) => state.ui.expenses.subrole.selectedRole
  );
  const loadingAreas = useSelector(
    (state: State) => state.common.app.loadingAreas
  );
  const isLoading = useSelector((state: State) =>
    appSelectors.loadingSelector(state)
  );

  const {
    isFinanceApproval,
    expReport,
    recordIdx,
    recordItemIdx,
    targetRecord,
    onChangeEditingExpReport,
  } = props;

  const itemIdx = recordItemIdx || 0;

  const getRecentCostCenterList = (recordDate: string) => {
    return dispatch(
      getRecentCostCenters(
        expReport.employeeBaseId || employeeId,
        recordDate,
        selectedCompanyId
      )
    );
  };
  const getRecentJobList = (recordDate: string) => {
    return dispatch(
      getRecentJobs(
        recordDate,
        expReport.employeeBaseId || employeeId,
        selectedCompanyId
      )
    );
  };

  const onClickCostCenterBtn = (recordDate: string) => {
    onChangeEditingExpReport('ui.recordItemIdx', itemIdx);
    dispatch(
      openCostCenterDialog(
        recordDate,
        expReport.employeeBaseId || employeeId,
        selectedCompanyId,
        isSkipRecentlyUsedFetch
      )
    );
  };

  const onClickJobBtn = (recordDate: string) => {
    onChangeEditingExpReport('ui.recordItemIdx', itemIdx);
    dispatch(
      openJobDialog(
        recordDate,
        expReport.employeeBaseId || employeeId,
        selectedCompanyId,
        isSkipRecentlyUsedFetch
      )
    );
  };

  const onClickLookupEISearch = (item: EISearchObj) => {
    onChangeEditingExpReport('ui.recordItemIdx', itemIdx);
    return dispatch(
      openEILookupDialog(
        item,
        expReport.employeeBaseId || employeeId,
        selectedCompanyId,
        isSkipRecentlyUsedFetch
      )
    );
  };

  const searchCostCenterList = (keyword: string) => {
    return dispatch(
      searchCostCenters(
        selectedCompanyId,
        keyword,
        expReport.records[recordIdx].recordDate
      )
    );
  };

  const searchJobList = (keyword: string) => {
    const recordDate = expReport.accountingDate;
    return dispatch(
      searchJobs(
        keyword,
        recordDate,
        expReport.employeeBaseId || employeeId,
        selectedCompanyId,
        subroleId
      )
    );
  };

  const updateReport = (
    key: string,
    value: string,
    recalc = false,
    isTouched = true
  ) => {
    onChangeEditingExpReport(`report.${targetRecord}.${key}`, value, isTouched);
    if (recalc) {
      onChangeEditingExpReport(`ui.recalc`, true, undefined, false);
    }
  };

  const compProps = {
    ...props,
    isLoading,
    loadingAreas,
    getRecentCostCenters: getRecentCostCenterList,
    getRecentJobs: getRecentJobList,
    onClickCostCenterBtn,
    onClickJobBtn,
    onClickLookupEISearch,
    searchCostCenters: searchCostCenterList,
    searchJobs: searchJobList,
    updateReport,
  };
  return <JobCCEISum {...compProps} />;
};

export default JobCCEISumContainer;
