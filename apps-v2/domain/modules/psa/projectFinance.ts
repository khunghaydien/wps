import {
  contractFixedParam,
  deleteCategoryOther,
  getFinanceExpenseRecords,
  getMemo,
  getProjectFinance,
  getProjectFinanceDetail,
  getProjectFinanceOtherCategory,
  getWorkDays,
  initialStateProjectFinance,
  ProjectFinanceData,
  saveCategoryOther,
  saveContractFixed,
  saveMemo,
} from '../../models/psa/ProjectFinance';
import {
  runBatchJobProject,
  runBatchJobProjectParam,
} from '@apps/domain/models/psa/BatchJobProject';

import { AppDispatch } from '../../../psa-pc/action-dispatchers/AppThunk';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/ENTITIES/PSA/PROJECT/FINANCE/GET_SUCCESS',
  GET_SUCCESS_REUSE_ACTIVITY:
    'MODULES/ENTITIES/PSA/PROJECT/FINANCE/GET_SUCCESS_REUSE_ACTIVITY',
  GET_WORKINGDAYS_SUCCESS:
    'MODULES/ENTITIES/PSA/PROJECT/FINANCE/GET_WORKINGDAYS_SUCCESS',
  SET_VALUE: 'MODULES/ENTITIES/PSA/PROJECT/FINANCE/SET_VALUE',
  UPDATE_SUCCESS: 'MODULES/ENTITIES/PSA/PROJECT/FINANCE/UPDATE_SUCCESS',
  GET_MEMO_SUCCESS: 'MODULES/ENTITIES/PSA/PROJECT/FINANCE/GET_MEMO_SUCCESS',
  SAVE_MEMO_SUCCESS: 'MODULES/ENTITIES/PSA/PROJECT/FINANCE/SAVE_MEMO_SUCCESS',
  UPDATE_FINANCE_DETAIL_MEMO:
    'MODULES/ENTITIES/PSA/PROJECT/FINANCE/DETAILS/UPDATE_FINANCE_DETAIL_MEMO',
  UPDATE_FINANCE_OTHER_CATHEGORY_MEMO:
    'MODULES/ENTITIES/PSA/PROJECT/FINANCE/DETAILS/UPDATE_FINANCE_OTHER_CATHEGORY_MEMO',
  UPDATE_FINANCE_OVERVIEW_MEMO:
    'MODULES/ENTITIES/PSA/PROJECT/FINANCE/OVERVIEW/UPDATE_FINANCE_OVERVIEW_MEMO',
  RUN_BATCH_JOB_PROJECT_SUCCESS:
    'MODULES/ENTITIES/PSA/PROJECT/FINANCE/OVERVIEW/RUN_BATCH_JOB_PROJECT_SUCCESS',
};

const updateFinanceDetailMemo = (body: any) => ({
  type: ACTIONS.UPDATE_FINANCE_DETAIL_MEMO,
  payload: body,
});

const updateFinanceOtherCathegoryMemo = (body: any) => ({
  type: ACTIONS.UPDATE_FINANCE_OTHER_CATHEGORY_MEMO,
  payload: body,
});

const updateFinanceOverviewMemo = (body: any) => ({
  type: ACTIONS.UPDATE_FINANCE_OVERVIEW_MEMO,
  payload: body,
});
const getSuccess = (body: any) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

const getSuccessReuseActivity = (body: any) => ({
  type: ACTIONS.GET_SUCCESS_REUSE_ACTIVITY,
  payload: body,
});

const getWorkingDaysSuccess = (body: any) => ({
  type: ACTIONS.GET_WORKINGDAYS_SUCCESS,
  payload: body,
});

const setValue = (body: any) => ({
  type: ACTIONS.SET_VALUE,
  payload: body,
});

const saveMemoSuccess = (body: any) => ({
  type: ACTIONS.SAVE_MEMO_SUCCESS,
  payload: body,
});

const getMemoSuccess = (body: any) => ({
  type: ACTIONS.GET_MEMO_SUCCESS,
  payload: body,
});

const runBatchJobSuccess = (body: any) => ({
  type: ACTIONS.RUN_BATCH_JOB_PROJECT_SUCCESS,
  payload: body,
});

export const actions = {
  getProjectFinance:
    (projectId: string, intervalType: string) =>
    (dispatch: AppDispatch): void | any =>
      getProjectFinance(projectId, intervalType)
        .then((res: any) =>
          dispatch(getSuccess({ projectFinanceOverview: res.projectFinance }))
        )
        .catch((err) => {
          throw err;
        }),
  getProjectFinanceDetail:
    (
      projectId: string,
      financeCategoryId: string,
      intervalType: string,
      needActivityInfo: boolean
    ) =>
    (dispatch: AppDispatch): void | any =>
      getProjectFinanceDetail(
        projectId,
        financeCategoryId,
        intervalType,
        needActivityInfo
      )
        .then((res: any) => {
          if (needActivityInfo) {
            dispatch(getSuccess({ projectFinanceDetail: res.projectFinance }));
          } else {
            dispatch(
              getSuccessReuseActivity({
                projectFinanceDetail: res.projectFinance,
              })
            );
          }
        })
        .catch((err) => {
          throw err;
        }),
  getProjectFinanceOtherCategory:
    (projectId: string, financeCategoryId: string, intervalType: string) =>
    (dispatch: AppDispatch): void | any =>
      getProjectFinanceOtherCategory(projectId, financeCategoryId, intervalType)
        .then((res: any) =>
          dispatch(
            getSuccess({
              projectFinanceDetail: {
                ...res,
                financeCategoryName: res.summary.financeCategoryName,
              },
            })
          )
        )
        .catch((err) => {
          throw err;
        }),
  getFinanceExpenseRecords:
    (breakdownId: string) =>
    (dispatch: AppDispatch): void | any =>
      getFinanceExpenseRecords(breakdownId)
        .then((res: any) =>
          dispatch(
            getSuccess({
              expenseRecords: res.breakdown,
            })
          )
        )
        .catch((err) => {
          throw err;
        }),
  getWorkDays:
    (projectId: string, intervalType: string) =>
    (dispatch: AppDispatch): void | any =>
      getWorkDays(projectId, intervalType)
        .then((res: any) => dispatch(getWorkingDaysSuccess(res)))
        .catch((err) => {
          throw err;
        }),
  saveContractFixed:
    (params: contractFixedParam) =>
    (dispatch: AppDispatch): void | any =>
      saveContractFixed(params)
        .then((res: any) => dispatch(getSuccess(res)))
        .catch((err) => {
          throw err;
        }),
  saveCategoryOther:
    (params: any) =>
    (dispatch: AppDispatch): void | any =>
      saveCategoryOther(params)
        .then((res: any) => dispatch(getSuccess(res)))
        .catch((err) => {
          throw err;
        }),
  deleteCategoryOther:
    (params: any) =>
    (dispatch: AppDispatch): void | any =>
      deleteCategoryOther(params)
        .then((res: any) => dispatch(getSuccess(res)))
        .catch((err) => {
          throw err;
        }),
  setEditMode:
    (isEdit: boolean) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(setValue({ editMode: isEdit })),
  getFinanceMemo:
    (noteId: string) =>
    (dispatch: AppDispatch): void | any =>
      getMemo(noteId).then((res: any) => dispatch(getMemoSuccess(res))),
  saveFinanceMemo:
    (
      noteId: string,
      note: string,
      lastModifiedDate: string,
      summaryInfo,
      detailInfo,
      currentRoute: string
    ) =>
    (dispatch: AppDispatch): void | any =>
      saveMemo(noteId, note, lastModifiedDate, summaryInfo, detailInfo)
        .then((response) => {
          const noteIdToUpdate = response.noteId;
          const mapRouteToDispatch = {
            FINANCE_DETAIL_CONTRACT_TNM: updateFinanceDetailMemo,
            FINANCE_DETAIL_CONTRACT_FIXED: updateFinanceDetailMemo,
            FINANCE_DETAIL_OTHER_CATEGORY: updateFinanceOtherCathegoryMemo,
            FINANCE_DETAIL_OTHER_EXPENSE: updateFinanceOtherCathegoryMemo,
            VIEW_PROJECT: updateFinanceOverviewMemo,
          };

          dispatch(saveMemoSuccess(note));
          dispatch(
            mapRouteToDispatch[currentRoute]({
              noteIdToUpdate,
              detailInfo,
              summaryInfo,
              currentRoute,
            })
          );
        })
        .catch((err) => {
          throw err;
        }),
  clearMemo:
    () =>
    (dispatch: AppDispatch): void | any =>
      dispatch(saveMemoSuccess({ note: '', lastModifiedDate: '' })),
  runBatchJobProject:
    (param: runBatchJobProjectParam) =>
    (dispatch: AppDispatch): void | any =>
      runBatchJobProject(param)
        .then((res: any) => dispatch(runBatchJobSuccess(res)))
        .catch((err) => {
          throw err;
        }),
};

const initialState = {
  ...initialStateProjectFinance,
};

type State = ProjectFinanceData;

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.UPDATE_FINANCE_OVERVIEW_MEMO: {
      const newNoteId: string = action.payload.noteIdToUpdate;
      const isFinances: boolean = action.payload.summaryInfo.isFinances;
      const fieldType: string = action.payload.summaryInfo.fieldType;
      const detailType: string = action.payload.summaryInfo.detailType;
      const projectPeriodId: string = !isFinances
        ? action.payload.summaryInfo.projectPeriodId
        : null;
      const financeCode: string = isFinances
        ? action.payload.summaryInfo.financeCode
        : null;
      const summaryId: string = isFinances
        ? action.payload.summaryInfo.summaryId
        : null;

      const noteTypes = {
        Planned: 'plannedNoteId',
        Actual: 'actualNoteId',
        CostPlan: 'plannedNoteId',
        CostActual: 'actualNoteId',
        RevenueActual: 'actualNoteId',
        RevenuePlan: 'plannedNoteId',
        MarginPlan: 'plannedNoteId',
        MarginActual: 'actualNoteId',
      };

      if (!isFinances) {
        const newIntervalTotal = state.projectFinanceOverview[
          detailType
        ].intervalTotals.map((interval) =>
          interval.projectPeriodId === projectPeriodId
            ? { ...interval, [noteTypes[fieldType]]: newNoteId }
            : interval
        );
        return {
          ...state,
          projectFinanceOverview: {
            ...state.projectFinanceOverview,
            [detailType]: {
              ...state.projectFinanceOverview[detailType],
              intervalTotals: newIntervalTotal,
            },
          },
        };
      } else {
        const newFinances = state.projectFinanceOverview[
          detailType
        ].finances.map((finance) => {
          if (finance.code === financeCode) {
            return {
              ...finance,
              intervals: finance.intervals.map((interval) => {
                if (interval.summaryId === summaryId) {
                  return { ...interval, [noteTypes[fieldType]]: newNoteId };
                } else {
                  return interval;
                }
              }),
            };
          } else {
            return finance;
          }
        });
        return {
          ...state,
          projectFinanceOverview: {
            ...state.projectFinanceOverview,
            [detailType]: {
              ...state.projectFinanceOverview[detailType],
              finances: newFinances,
            },
          },
        };
      }
    }
    case ACTIONS.UPDATE_FINANCE_OTHER_CATHEGORY_MEMO: {
      const newNoteId: string = action.payload.noteIdToUpdate;
      const isDetails: boolean =
        action.payload.detailInfo !== undefined
          ? action.payload.detailInfo.isDetails
          : action.payload.summaryInfo.isDetails;
      const fieldType: string = isDetails
        ? action.payload.detailInfo.fieldType
        : action.payload.summaryInfo.fieldType;

      const breakDownId: string = isDetails
        ? action.payload.detailInfo.breakdownId
        : null;

      const detailId: string = isDetails
        ? action.payload.detailInfo.detailId
        : null;

      const summaryId: string = isDetails
        ? action.payload.detailInfo.summaryId
        : action.payload.summaryInfo.summaryId;

      const noteTypes = {
        Planned: 'plannedAmtNoteId',
        Actual: 'actualAmtNoteId',
        ActualAmt: 'actualAmtNoteId',
      };

      if (!isDetails) {
        const newIntervalTotal =
          state.projectFinanceDetail.summary.intervalTotals.map((interval) =>
            interval.summaryId === summaryId
              ? { ...interval, [noteTypes[fieldType]]: newNoteId }
              : interval
          );
        return {
          ...state,
          projectFinanceDetail: {
            ...state.projectFinanceDetail,
            summary: {
              ...state.projectFinanceDetail.summary,
              intervalTotals: newIntervalTotal,
            },
          },
        };
      } else {
        const newFinanceDetails = state.projectFinanceDetail.financeDetails.map(
          (detail) => {
            if (detail.detailId === detailId) {
              return {
                ...detail,
                breakdowns: detail.breakdowns.map((breakdown) => {
                  if (breakdown.breakDownId === breakDownId) {
                    return {
                      ...breakdown,
                      [noteTypes[fieldType]]: newNoteId,
                    };
                  } else {
                    return breakdown;
                  }
                }),
              };
            } else {
              return detail;
            }
          }
        );

        return {
          ...state,
          projectFinanceDetail: {
            ...state.projectFinanceDetail,
            financeDetails: newFinanceDetails,
          },
        };
      }
    }
    case ACTIONS.UPDATE_FINANCE_DETAIL_MEMO:
      const newNoteId: string = action.payload.noteIdToUpdate;
      const currentRoute: string = action.payload.currentRoute;
      const isActivity: boolean =
        currentRoute !== 'FINANCE_DETAIL_CONTRACT_TNM' ||
        action.payload.detailInfo !== undefined
          ? action.payload.detailInfo.isActivity
          : action.payload.summaryInfo.isActivity;
      const fieldType: string =
        currentRoute !== 'FINANCE_DETAIL_CONTRACT_TNM' ||
        action.payload.detailInfo !== undefined
          ? action.payload.detailInfo.fieldType
          : action.payload.summaryInfo.fieldType;

      const noteTypes = {
        totalContract: 'fixedContractNoteId',
        totalActual: 'fixedActualNoteId',
        totalEstSales: 'estSalesNoteId',
        totalDiscountAmt: 'discountAmtNoteId',
        totalDiscountPercent: 'discountPercentNoteId',
        PlannedAmt: 'plannedAmtNoteId',
        PlannedTime: 'plannedHoursNoteId',
        ActualAmt: 'actualAmtNoteId',
        ActualTime: 'actualHoursNoteId',
        Planned: 'plannedTnMAmtNoteId',
        Actual: 'actualTnMAmtNoteId',
      };

      if (!isActivity) {
        const summaryId: string =
          currentRoute !== 'FINANCE_DETAIL_CONTRACT_TNM' ||
          action.payload.detailInfo !== undefined
            ? action.payload.detailInfo.summaryId
            : action.payload.summaryInfo.summaryId;

        const newIntervalTotal =
          state.projectFinanceDetail.finances.intervalTotals.map((interval) =>
            interval.summaryId === summaryId
              ? { ...interval, [noteTypes[fieldType]]: newNoteId }
              : interval
          );
        return {
          ...state,
          projectFinanceDetail: {
            ...state.projectFinanceDetail,
            finances: {
              ...state.projectFinanceDetail.finances,
              intervalTotals: newIntervalTotal,
            },
          },
        };
      } else {
        const breakdownId: string =
          currentRoute !== 'FINANCE_DETAIL_CONTRACT_TNM' ||
          action.payload.detailInfo !== undefined
            ? action.payload.detailInfo.breakdownId
            : action.payload.summaryInfo.breakdownId;

        const activityId: string =
          currentRoute !== 'FINANCE_DETAIL_CONTRACT_TNM' ||
          action.payload.detailInfo !== undefined
            ? action.payload.detailInfo.activityId
            : action.payload.summaryInfo.activityId;

        const roleId: string =
          currentRoute !== 'FINANCE_DETAIL_CONTRACT_TNM' ||
          action.payload.detailInfo !== undefined
            ? action.payload.detailInfo.roleId
            : action.payload.summaryInfo.roleId;

        const newActivities: Array<Record<string, unknown>> =
          state.projectFinanceDetail.finances.activities.map((activity) => {
            if (activity.activityId === activityId) {
              return {
                ...activity,
                roles: activity.roles.map((role) => {
                  if (role.roleId === roleId) {
                    return {
                      ...role,
                      intervals: role.intervals.map((interval) => {
                        if (interval.breakdownId === breakdownId) {
                          return {
                            ...interval,
                            [noteTypes[fieldType]]: newNoteId,
                          };
                        } else {
                          return interval;
                        }
                      }),
                    };
                  } else {
                    return role;
                  }
                }),
              };
            } else {
              return activity;
            }
          });
        return {
          ...state,
          projectFinanceDetail: {
            ...state.projectFinanceDetail,
            finances: {
              ...state.projectFinanceDetail.finances,
              activities: newActivities,
            },
          },
        };
      }

    case ACTIONS.GET_SUCCESS:
    case ACTIONS.SET_VALUE:
      return {
        ...state,
        ...action.payload,
      };
    case ACTIONS.GET_SUCCESS_REUSE_ACTIVITY:
      action.payload.projectFinanceDetail.finances.activities =
        state.projectFinanceDetail.finances.activities;
      return {
        ...state,
        ...action.payload,
      };
    case ACTIONS.GET_WORKINGDAYS_SUCCESS:
      return {
        ...state,
        workingDays: action.payload,
      };
    case ACTIONS.SAVE_MEMO_SUCCESS:
    case ACTIONS.GET_MEMO_SUCCESS:
      return {
        ...state,
        note: action.payload.note,
        lastModifiedDate: action.payload.lastModifiedDate,
      };
    case ACTIONS.RUN_BATCH_JOB_PROJECT_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
