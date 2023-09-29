import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { JobType } from '@apps/domain/models/psa/BatchJobProject';

import { State } from '@psa/modules';

import {
  clearMemo,
  fetchProjectFinanceInfo,
  getFinanceDetailContractFixed,
  getFinanceDetailContractTnM,
  getFinanceDetailOtherCategory,
  getFinanceDetailOtherExpense,
  getFinanceMemo,
  getWorkDaysFromFinance,
  runBatchJobProject,
  saveFinanceMemo,
} from '@psa/action-dispatchers/Finance';

import ProjectFinancePage from '@psa/components/ProjectScreen/Finance';

const ProjectFinanceContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const isFetching = useSelector((state: State) => state.ui.isLoading);
  const currentRoute = useSelector((state: State) => state.ui.siteRoute);
  const projectFinanceOverview = useSelector(
    (state: State) => state.entities.psa.projectFinance.projectFinanceOverview
  );
  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );
  const currencyDecimal = useSelector(
    (state: State) => state.userSetting.currencyDecimalPlaces
  );
  const currencySymbol = useSelector(
    (state: State) => state.userSetting.currencySymbol
  );
  const workingDays = useSelector(
    (state: State) => state.entities.psa.projectFinance.workingDays
  );
  const memoValue = useSelector(
    (state: State) => state.entities.psa.projectFinance.note
  );
  const lastModifiedDate = useSelector(
    (state: State) => state.entities.psa.projectFinance.lastModifiedDate
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

  const fetchWorkingDays = (intervalType: string) => {
    const { projectId } = selectedProject;
    dispatch(getWorkDaysFromFinance(projectId, intervalType));
  };

  const fetchFinanceDetailContractFixed = (financeCategoryId: string) => {
    dispatch(
      getFinanceDetailContractFixed(
        selectedProject.projectId,
        financeCategoryId
      )
    );
  };

  const fetchFinanceDetailContractTnM = (financeCategoryId: string) => {
    dispatch(
      getFinanceDetailContractTnM(selectedProject.projectId, financeCategoryId)
    );
  };

  const fetchFinanceDetailOtherCategory = (financeCategoryId: string) => {
    const { projectId } = selectedProject;
    dispatch(getFinanceDetailOtherCategory(projectId, financeCategoryId));
  };

  const fetchFinanceDetailOtherExpense = (financeCategoryId: string) => {
    const { projectId } = selectedProject;
    dispatch(getFinanceDetailOtherExpense(projectId, financeCategoryId));
  };

  const selectWeeklyMonthlyView = (intervalType: string) => {
    const { projectId } = selectedProject;
    dispatch(fetchProjectFinanceInfo(projectId, intervalType));
    dispatch(getWorkDaysFromFinance(projectId, intervalType));
  };

  const execBatchJobProject = (jobType: JobType) => {
    const { projectId } = selectedProject;
    dispatch(runBatchJobProject(projectId, jobType));
  };

  return (
    <ProjectFinancePage
      currencyDecimal={currencyDecimal}
      currencySymbol={currencySymbol}
      financeOverviewData={projectFinanceOverview}
      selectedProject={selectedProject}
      fetchFinanceDetailContractFixed={fetchFinanceDetailContractFixed}
      fetchFinanceDetailContractTnM={fetchFinanceDetailContractTnM}
      onSelectWeeklyMonthlyView={selectWeeklyMonthlyView}
      fetchFinanceDetailOtherCategory={fetchFinanceDetailOtherCategory}
      fetchFinanceDetailOtherExpense={fetchFinanceDetailOtherExpense}
      onFetchWorkingDays={fetchWorkingDays}
      workingDays={workingDays}
      getFinanceMemo={getMemo}
      saveFinanceMemo={saveMemo}
      memo={memoValue}
      isFetching={isFetching}
      execBatchJobProject={execBatchJobProject}
    />
  );
};

export default ProjectFinanceContainer;
