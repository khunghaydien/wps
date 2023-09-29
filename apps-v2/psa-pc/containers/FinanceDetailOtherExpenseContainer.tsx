import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { JobType } from '@apps/domain/models/psa/BatchJobProject';

import { State } from '@psa/modules';

import {
  clearMemo,
  getFinanceDetailOtherExpense,
  getFinanceExpenseRecords,
  getFinanceMemo,
  getWorkDaysFromFinance,
  runBatchJobProject,
  saveFinanceMemo,
  saveFinanceOtherExpense,
} from '@psa/action-dispatchers/Finance';

import FinanceDetailOtherExpense from '@psa/components/FinanceDetails/OtherExpense';

const FinanceDetailOtherExpenseContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const isFetching = useSelector((state: State) => state.ui.isLoading);
  const categoryOtherData = useSelector(
    (state: State) => state.entities.psa.projectFinance.projectFinanceDetail
  );
  const currentRoute = useSelector((state: State) => state.ui.siteRoute);
  const expenseRecords = useSelector(
    (state: State) => state.entities.psa.projectFinance.expenseRecords
  );
  const currencyDecimal = useSelector(
    (state: State) => state.userSetting.currencyDecimalPlaces
  );
  const currencySymbol = useSelector(
    (state: State) => state.userSetting.currencySymbol
  );
  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );

  const workingDays = useSelector(
    (state: State) => state.entities.psa.projectFinance.workingDays
  );

  const onSelectWeeklyMonthlyView = (intervalType: string) => {
    const { projectId } = selectedProject;
    const financeCategoryId = categoryOtherData.summary.financeCategoryId;
    dispatch(getWorkDaysFromFinance(projectId, intervalType));
    dispatch(
      getFinanceDetailOtherExpense(projectId, financeCategoryId, intervalType)
    );
  };

  useEffect(() => {
    const { projectId } = selectedProject;
    dispatch(getWorkDaysFromFinance(projectId, 'Monthly'));
  }, []);

  const updateDetailOthersData = (param: any, intervalType: string) => {
    dispatch(saveFinanceOtherExpense(param, intervalType));
  };

  const fetchExpenseRecords = (breakdownId: string) => {
    dispatch(getFinanceExpenseRecords(breakdownId));
  };
  const lastModifiedDate = useSelector(
    (state: State) => state.entities.psa.projectFinance.lastModifiedDate
  );
  const memoValue = useSelector(
    (state: State) => state.entities.psa.projectFinance.note
  );
  const getMemo = (noteId: string) => {
    dispatch(getFinanceMemo(noteId));
  };
  const saveMemo = async (
    projectId: string,
    intervalType: string,
    noteId: string,
    note: string,
    summaryInfo?: object,
    detailInfo?: object
  ) => {
    if (note !== '' && memoValue !== note) {
      await dispatch(
        saveFinanceMemo(
          noteId,
          note,
          lastModifiedDate,
          summaryInfo,
          detailInfo,
          true,
          currentRoute
        )
      );
    }
    dispatch(clearMemo());
  };
  const execBatchJobProject = (jobType: JobType) => {
    const { projectId } = selectedProject;
    dispatch(runBatchJobProject(projectId, jobType));
  };

  return (
    <FinanceDetailOtherExpense
      currencyDecimal={currencyDecimal}
      currencySymbol={currencySymbol}
      otherExpenseData={categoryOtherData}
      workingDays={workingDays}
      selectedProject={selectedProject}
      onSelectWeeklyMonthlyView={onSelectWeeklyMonthlyView}
      onSaveChanges={updateDetailOthersData}
      onFetchExpenseRecords={fetchExpenseRecords}
      breakDown={expenseRecords}
      getFinanceMemo={getMemo}
      saveFinanceMemo={saveMemo}
      memo={memoValue}
      isFetching={isFetching}
      execBatchJobProject={execBatchJobProject}
    />
  );
};

export default FinanceDetailOtherExpenseContainer;
