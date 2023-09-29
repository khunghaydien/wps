import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { State } from '@psa/modules';

import {
  clearMemo,
  getFinanceDetailContractTnM,
  getFinanceMemo,
  getWorkDaysFromFinance,
  openRoleDetailsFromFinance,
  saveFinanceMemo,
} from '@psa/action-dispatchers/Finance';

import FinanceDetailContractTnM from '@psa/components/FinanceDetails/ContractTnM';

const FinanceContractTnMContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const isFetching = useSelector((state: State) => state.ui.isLoading);
  const currentRoute = useSelector((state: State) => state.ui.siteRoute);
  const projectFinanceInfo = useSelector(
    (state: State) => state.entities.psa.projectFinance.projectInfo
  );
  const contractTnMData = useSelector(
    (state: State) => state.entities.psa.projectFinance.projectFinanceDetail
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

  const getRoleDetails = (roleId: string) => {
    dispatch(openRoleDetailsFromFinance(roleId));
  };

  const workingDays = useSelector(
    (state: State) => state.entities.psa.projectFinance.workingDays
  );

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

  useEffect(() => {
    const { projectId } = selectedProject;
    dispatch(getWorkDaysFromFinance(projectId, 'Monthly'));
  }, []);

  const onSelectWeeklyMonthlyView = (intervalType: string) => {
    const { projectId } = selectedProject;
    const { financeCategoryId } = contractTnMData;
    dispatch(getWorkDaysFromFinance(projectId, intervalType));
    dispatch(
      getFinanceDetailContractTnM(projectId, financeCategoryId, intervalType)
    );
  };

  return (
    <FinanceDetailContractTnM
      projectDetail={projectFinanceInfo}
      currencyDecimal={currencyDecimal}
      currencySymbol={currencySymbol}
      contractTnMData={contractTnMData}
      onRoleClick={getRoleDetails}
      workingDays={workingDays}
      onSelectWeeklyMonthlyView={onSelectWeeklyMonthlyView}
      selectedProject={selectedProject}
      getFinanceMemo={getMemo}
      saveFinanceMemo={saveMemo}
      memo={memoValue}
      isFetching={isFetching}
    />
  );
};

export default FinanceContractTnMContainer;
