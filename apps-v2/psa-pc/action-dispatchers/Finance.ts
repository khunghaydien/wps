import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import { actions as fetchingLoadingActions } from '@apps/commons/modules/psa/fetchingLoading';

import { JobType } from '@apps/domain/models/psa/BatchJobProject';
import { contractFixedParam } from '@apps/domain/models/psa/ProjectFinance';

import { actions as financeActions } from '@apps/domain/modules/psa/projectFinance';
import { actions as roleActions } from '@apps/domain/modules/psa/role';
import { actions as modeActions } from '@psa/modules/ui/mode';
import { actions as siteRouteActions } from '@psa/modules/ui/siteRoute';

import { AppDispatch } from './AppThunk';

export const getFinanceDetailContractFixed =
  (
    projectId: string,
    financeCategoryId: string,
    intervalType = 'Monthly',
    memo = false
  ) =>
  (dispatch: AppDispatch) => {
    !memo && dispatch(loadingStart());
    dispatch(
      financeActions.getProjectFinanceDetail(
        projectId,
        financeCategoryId,
        intervalType,
        true
      )
    )
      .then(() => {
        dispatch(siteRouteActions.showFinanceDetailContractFixed());
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => {
        !memo && dispatch(loadingEnd());
      });
  };

export const getFinanceDetailContractTnM =
  (
    projectId: string,
    financeCategoryId: string,
    intervalType = 'Monthly',
    memo = false
  ) =>
  (dispatch: AppDispatch) => {
    !memo && dispatch(loadingStart());
    dispatch(
      financeActions.getProjectFinanceDetail(
        projectId,
        financeCategoryId,
        intervalType,
        true
      )
    )
      .then(() => {
        dispatch(siteRouteActions.showFinanceDetailContractTnM());
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => {
        !memo && dispatch(loadingEnd());
      });
  };

export const getWorkDaysFromFinance =
  (projectId: string, intervalType: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(financeActions.getWorkDays(projectId, intervalType))
      .then(() => {
        dispatch(loadingEnd());
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => {
        dispatch(loadingEnd());
      });
  };

export const getFinanceDetailOtherCategory =
  (
    projectId: string,
    financeCategoryId: string,
    intervalType = 'Monthly',
    memo = false
  ) =>
  (dispatch: AppDispatch) => {
    !memo && dispatch(loadingStart());
    dispatch(
      financeActions.getProjectFinanceOtherCategory(
        projectId,
        financeCategoryId,
        intervalType
      )
    )
      .then(() => {
        dispatch(siteRouteActions.showFinanceDetailOtherCategory());
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => {
        !memo && dispatch(loadingEnd());
      });
  };

export const getFinanceDetailOtherExpense =
  (
    projectId: string,
    financeCategoryId: string,
    intervalType = 'Monthly',
    memo = false
  ) =>
  (dispatch: AppDispatch) => {
    !memo && dispatch(loadingStart());
    dispatch(
      financeActions.getProjectFinanceOtherCategory(
        projectId,
        financeCategoryId,
        intervalType
      )
    )
      .then(() => {
        dispatch(siteRouteActions.showFinanceDetailOtherExpense());
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => {
        !memo && dispatch(loadingEnd());
      });
  };

export const openRoleDetailsFromFinance =
  (roleId: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(modeActions.selectRoleFromFinance());
    dispatch(roleActions.get(roleId))
      .then(() => {
        dispatch(siteRouteActions.showRoleDetails());
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const fetchProjectFinanceInfo =
  (projectId: string, intervalType: string, memo = false) =>
  (dispatch: AppDispatch) => {
    !memo && dispatch(loadingStart());
    dispatch(financeActions.getProjectFinance(projectId, intervalType))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => !memo && dispatch(loadingEnd()));
  };

export const saveFinanceContractFixed =
  (params: contractFixedParam) => async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      await dispatch(financeActions.saveContractFixed(params));
      await dispatch(
        financeActions.getProjectFinanceDetail(
          params.projectId,
          params.financeCategoryId,
          'Monthly',
          false
        )
      ).then(() => {
        dispatch(siteRouteActions.showFinanceDetailContractFixed());
      });
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };

export const saveFinanceCategoryOther =
  (params: any, intervalType = 'Monthly') =>
  async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      await dispatch(financeActions.saveCategoryOther(params));
      await dispatch(
        financeActions.getProjectFinanceOtherCategory(
          params.projectId,
          params.financeCategoryId,
          intervalType
        )
      ).then(() => {
        dispatch(siteRouteActions.showFinanceDetailOtherCategory());
        dispatch(financeActions.setEditMode(false));
      });
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };

export const deleteFinanceCategoryOther =
  (params: any, intervalType = 'Monthly') =>
  async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      await dispatch(financeActions.deleteCategoryOther(params));
      await dispatch(
        financeActions.getProjectFinanceOtherCategory(
          params.projectId,
          params.financeCategoryId,
          intervalType
        )
      ).then(() => {
        dispatch(siteRouteActions.showFinanceDetailOtherCategory());
        dispatch(financeActions.setEditMode(false));
      });
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };
export const saveFinanceOtherExpense =
  (params: any, intervalType = 'Monthly') =>
  async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      await dispatch(financeActions.saveCategoryOther(params));
      await dispatch(
        financeActions.getProjectFinanceOtherCategory(
          params.projectId,
          params.financeCategoryId,
          intervalType
        )
      ).then(() => {
        dispatch(siteRouteActions.showFinanceDetailOtherExpense());
      });
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };

export const getFinanceExpenseRecords =
  (breakdownId: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(financeActions.getFinanceExpenseRecords(breakdownId))
      .then(() => {
        dispatch(siteRouteActions.showFinanceDetailOtherExpense());
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => {
        dispatch(loadingEnd());
      });
  };

export const getFinanceMemo = (noteId: string) => (dispatch: AppDispatch) => {
  dispatch(fetchingLoadingActions.fetchingLoadingStart());
  dispatch(financeActions.getFinanceMemo(noteId))
    .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
    .finally(() => dispatch(fetchingLoadingActions.fetchingLoadingEnd()));
};

export const saveFinanceMemo =
  (
    noteId: string,
    note: string,
    lastModifiedDate: string,
    summaryInfo: any,
    detailInfo: any,
    memo = false,
    currentRoute: string
  ) =>
  async (dispatch: AppDispatch) => {
    !memo
      ? dispatch(loadingStart())
      : dispatch(fetchingLoadingActions.fetchingLoadingStart());
    try {
      await dispatch(
        financeActions.saveFinanceMemo(
          noteId,
          note,
          lastModifiedDate,
          summaryInfo,
          detailInfo,
          currentRoute
        )
      );
      await dispatch(financeActions.clearMemo());
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      !memo
        ? dispatch(loadingEnd())
        : dispatch(fetchingLoadingActions.fetchingLoadingEnd());
    }
  };

export const clearMemo = () => (dispatch: AppDispatch) => {
  dispatch(financeActions.clearMemo());
};

export const runBatchJobProject =
  (projectId: string, jobType: JobType) => async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      await dispatch(financeActions.runBatchJobProject({ projectId, jobType }));
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };
