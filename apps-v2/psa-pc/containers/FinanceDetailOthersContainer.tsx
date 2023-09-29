import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { State } from '@psa/modules';

import {
  clearMemo,
  deleteFinanceCategoryOther,
  getFinanceDetailOtherCategory,
  getFinanceMemo,
  getWorkDaysFromFinance,
  saveFinanceCategoryOther,
  saveFinanceMemo,
} from '@psa/action-dispatchers/Finance';

import FinanceDetailOtherCategory from '@psa/components/FinanceDetails/OtherCategory';

const FinanceDetailOthersContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;
  const categoryOtherData = useSelector(
    (state: State) => state.entities.psa.projectFinance.projectFinanceDetail
  );
  const currencyDecimal = useSelector(
    (state: State) => state.userSetting.currencyDecimalPlaces
  );
  const currencySymbol = useSelector(
    (state: State) => state.userSetting.currencySymbol
  );
  const currentRoute = useSelector((state: State) => state.ui.siteRoute);
  const isFetching = useSelector((state: State) => state.ui.isLoading);
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
      getFinanceDetailOtherCategory(projectId, financeCategoryId, intervalType)
    );
  };

  useEffect(() => {
    const { projectId } = selectedProject;
    dispatch(getWorkDaysFromFinance(projectId, 'Monthly'));
  }, []);

  const updateDetailOthersData = (param: any, intervalType: string) => {
    dispatch(saveFinanceCategoryOther(param, intervalType));
  };

  const deleteDetailOthersData = (param: any, intervalType: string) => {
    dispatch(deleteFinanceCategoryOther(param, intervalType));
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

  return (
    <FinanceDetailOtherCategory
      currencyDecimal={currencyDecimal}
      currencySymbol={currencySymbol}
      otherCategoryData={categoryOtherData}
      workingDays={workingDays}
      selectedProject={selectedProject}
      onSelectWeeklyMonthlyView={onSelectWeeklyMonthlyView}
      onSaveChanges={updateDetailOthersData}
      onDeleteDetails={deleteDetailOthersData}
      getFinanceMemo={getMemo}
      saveFinanceMemo={saveMemo}
      memo={memoValue}
      isFetching={isFetching}
    />
  );
};

export default FinanceDetailOthersContainer;
