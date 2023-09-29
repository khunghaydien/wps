import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { confirm } from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';

import { contractFixedParam } from '@apps/domain/models/psa/ProjectFinance';

import { State } from '@psa/modules';
import { actions as modeActions } from '@psa/modules/ui/mode';

import {
  clearMemo,
  getFinanceDetailContractFixed,
  getFinanceMemo,
  getWorkDaysFromFinance,
  openRoleDetailsFromFinance,
  saveFinanceContractFixed,
  saveFinanceMemo,
} from '@psa/action-dispatchers/Finance';

import FinanceDetailContractFixed from '@psa/components/FinanceDetails/ContractFixed';

const ProjectFinanceContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;
  const isFetching = useSelector((state: State) => state.ui.isLoading);
  const currentRoute = useSelector((state: State) => state.ui.siteRoute);
  const projectFinanceInfo = useSelector(
    (state: State) => state.entities.psa.projectFinance.projectInfo
  );
  const projectFinanceDetail = useSelector(
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

  const onSaveFinanceContractFixed = (params: contractFixedParam) => {
    let total = 0;
    params.summaries.forEach((col) => {
      total += col.fixedContract;
    });
    if (total !== projectFinanceDetail.finances.totalFixedContract) {
      dispatch(
        confirm(msg().Psa_Msg_ConfirmContractFixedPlan, (yes) => {
          if (yes) {
            dispatch(saveFinanceContractFixed(params));
            dispatch(modeActions.saveContract());
          }
        })
      );
    } else {
      dispatch(saveFinanceContractFixed(params));
      dispatch(modeActions.saveContract());
    }
    dispatch(modeActions.initialize());
  };
  const uiMode = useSelector((state: State) => state.ui.mode);

  const workingDays = useSelector(
    (state: State) => state.entities.psa.projectFinance.workingDays
  );

  useEffect(() => {
    const { projectId } = selectedProject;
    dispatch(getWorkDaysFromFinance(projectId, 'Monthly'));
  }, []);

  const onSelectWeeklyMonthlyView = (intervalType: string) => {
    const { projectId } = selectedProject;
    const { financeCategoryId } = projectFinanceDetail;
    dispatch(getWorkDaysFromFinance(projectId, intervalType));
    dispatch(
      getFinanceDetailContractFixed(projectId, financeCategoryId, intervalType)
    );
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
      console.log('finacnce Info', {
        noteId,
        summaryInfo,
        detailInfo,
        intervalType,
      });
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
    <FinanceDetailContractFixed
      projectDetail={projectFinanceInfo}
      currencyDecimal={currencyDecimal}
      currencySymbol={currencySymbol}
      projectFinanceDetail={projectFinanceDetail}
      onRoleClick={getRoleDetails}
      workingDays={workingDays}
      onSaveContractFixed={onSaveFinanceContractFixed}
      onSelectWeeklyMonthlyView={onSelectWeeklyMonthlyView}
      selectedProject={selectedProject}
      mode={uiMode}
      getFinanceMemo={getMemo}
      saveFinanceMemo={saveMemo}
      memo={memoValue}
      isFetching={isFetching}
    />
  );
};

export default ProjectFinanceContainer;
