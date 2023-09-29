import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import {
  CostCenter,
  CostCenterList,
  DefaultCostCenter,
  LatestCostCenter,
  recordCostCenterArea,
} from '../../domain/models/exp/CostCenter';
import { ExpenseReportTypeList } from '@apps/domain/models/exp/expense-report-type/list';
import { RecordItem } from '@apps/domain/models/exp/Record';
import { Report } from '@apps/domain/models/exp/Report';

import { actions as costCenterActions } from '../../domain/modules/exp/cost-center/list';
import { AppDispatch } from '../modules/AppThunk';
import { actions as costCenterSelectListActions } from '../modules/costCenterDialog/ui/list';
import {
  costCenterArea,
  DefaultCostCenterInfo,
  getDefaultCostCenter,
} from '@apps/domain/modules/exp/cost-center/defaultCostCenter';
import { actions as lastestCostCenterActions } from '@apps/domain/modules/exp/cost-center/latestCostCenter';
import { getEmpHistoryList } from '@apps/domain/modules/exp/empHistoryList';
import { updateRecordDate } from '@apps/domain/modules/exp/recordDate';

import { catchApiError, loadingEnd, loadingStart } from '../actions/app';

import DateUtil from '../utils/DateUtil';

export const getRecentCostCenters =
  (empId: string, targetDate: string, companyId: string) =>
  (dispatch: AppDispatch) => {
    return dispatch(
      costCenterActions.getRecentlyUsed(empId, targetDate, companyId)
    )
      .then((result) => {
        const payload = result.payload.map((x) => {
          return {
            ...x,
            id: x.historyId,
          };
        });
        dispatch(costCenterSelectListActions.setRecentResult(payload));
        return payload;
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
        return [];
      });
  };

export const searchCostCenters =
  (companyId: string, keyword: string, targetDate: string) =>
  (dispatch: AppDispatch) => {
    return dispatch(
      costCenterActions.searchCostCenter(
        companyId,
        keyword,
        targetDate,
        'REPORT'
      )
    )
      .then((result) => {
        const payload = result.payload.map((x) => {
          return {
            ...x,
            id: x.historyId,
            baseId: x.id,
          };
        });
        dispatch(costCenterSelectListActions.setSearchResult(payload));
        return payload;
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
        return [];
      });
  };

export const getCostCenterList =
  (
    parentId: string,
    targetDate: string,
    companyId?: string,
    empId?: string,
    loadInBackground?: boolean,
    empHistoryId?: string
  ) =>
  (dispatch: AppDispatch) => {
    if (!loadInBackground) {
      dispatch(loadingStart());
    }
    return dispatch(
      costCenterActions.list(
        parentId,
        targetDate,
        companyId,
        empId,
        empHistoryId
      )
    )
      .then((result) => {
        dispatch(costCenterSelectListActions.set([result.payload]));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => {
        if (!loadInBackground) {
          dispatch(loadingEnd());
        }
      });
  };

export const getCostCenterSearchResult =
  (
    companyId: string,
    keyword: string,
    targetDate: string,
    loadInBackground?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    if (!loadInBackground) {
      dispatch(loadingStart());
    }
    return dispatch(searchCostCenters(companyId, keyword, targetDate)).then(
      () => {
        if (!loadInBackground) {
          dispatch(loadingEnd());
        }
      }
    );
  };

export const getNextCostCenterList =
  (
    item: CostCenter,
    items: CostCenterList,
    baseId: string,
    targetDate: string,
    companyId?: string,
    empId?: string,
    loadInBackground?: boolean,
    empHistoryId?: string
  ) =>
  (dispatch: AppDispatch) => {
    if (!loadInBackground) {
      dispatch(loadingStart());
    }

    return dispatch(
      costCenterActions.list(baseId, targetDate, companyId, empId, empHistoryId)
    )
      .then((result) => {
        items.push(result.payload);
        dispatch(costCenterSelectListActions.set(items));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => {
        if (!loadInBackground) {
          dispatch(loadingEnd());
        }
      });
  };

export const getLatestCostCenter =
  (historyId: string, targetDate: string, loadInBackground?: boolean) =>
  (dispatch: AppDispatch, getState): Promise<LatestCostCenter | boolean> => {
    if (!loadInBackground) {
      if (!getState().common.app.loadingAreas.includes(costCenterArea))
        dispatch(loadingStart({ areas: costCenterArea }));
    }
    return dispatch(lastestCostCenterActions.get(historyId, targetDate))
      .then((response) => response)
      .catch(() => false)
      .finally(() => {
        if (!loadInBackground) {
          dispatch(loadingEnd(costCenterArea));
        }
      });
  };

/**
 * Fetch latest cost center for items
 */
type ItemPathRes = {
  [key: string]: string;
};
export const getItemLatestCostCenter =
  (
    parentHistoryId: string,
    itemList: RecordItem[],
    selectedDate: string,
    loadInBackground = false
  ) =>
  async (dispatch: AppDispatch): Promise<ItemPathRes> => {
    const updateObj = {};
    const costCenterItemMap = {};

    if (!loadInBackground) {
      dispatch(loadingStart({ areas: recordCostCenterArea }));
    }

    itemList.forEach((item, idx) => {
      const costCenterHistoryId =
        idx === 0
          ? item.costCenterHistoryId || parentHistoryId
          : item.costCenterHistoryId;

      if (costCenterHistoryId && !costCenterItemMap[costCenterHistoryId]) {
        costCenterItemMap[costCenterHistoryId] = [];
      }

      if (costCenterHistoryId) {
        costCenterItemMap[costCenterHistoryId].push({
          costCenterHistoryId,
          idx,
        });
      }
    });

    const promise = Object.keys(costCenterItemMap).map(
      async (costCenterHistoryId) => {
        const latestCC = await dispatch(
          getLatestCostCenter(costCenterHistoryId, selectedDate, true)
        );

        const {
          baseCode = '',
          id = '',
          name = '',
        } = (latestCC || {}) as LatestCostCenter;
        const itemToUpdate = costCenterItemMap[costCenterHistoryId];
        itemToUpdate.forEach(
          (item: { costCenterHistoryId: string; idx: number }) => {
            const { idx } = item;

            Object.assign(updateObj, {
              [`items.${idx}.costCenterCode`]: baseCode,
              [`items.${idx}.costCenterHistoryId`]: id,
              [`items.${idx}.costCenterName`]: name,
            });
          }
        );
      }
    );
    await Promise.all(promise).finally(() => {
      if (!loadInBackground) {
        dispatch(loadingEnd(recordCostCenterArea));
      }
    });
    return updateObj;
  };

export const getCostCenterData =
  (
    date: string,
    defaultCostCenterList: DefaultCostCenterInfo[],
    employeeId: string,
    expReport: Report,
    isFinanceApproval: boolean,
    currLatestCostCenter: LatestCostCenter,
    reportTypeList: ExpenseReportTypeList = [],
    currSubroleId: string
  ) =>
  async (
    dispatch: AppDispatch
  ): Promise<{
    costCenter: DefaultCostCenter;
    isChangedManually: boolean;
  }> => {
    const reportTypeWithCostCenterUsed = reportTypeList.find(
      ({ id, isCostCenterRequired }) =>
        id === expReport.expReportTypeId && isCostCenterRequired !== 'UNUSED'
    );
    if (!reportTypeWithCostCenterUsed || !date) {
      dispatch(updateRecordDate(date));
      return;
    }

    dispatch(loadingStart({ areas: costCenterArea }));
    const empId = isFinanceApproval
      ? get(expReport, 'employeeBaseId')
      : employeeId;
    const empHistoryList = await dispatch(getEmpHistoryList(empId));
    dispatch(updateRecordDate(date));

    // get subroleId based on selected date
    const currEmpHistoryId = isFinanceApproval
      ? get(expReport, 'empHistoryId')
      : currSubroleId;
    const {
      subRoleKey: currSubRoleKey,
      validFrom,
      validTo,
    } = empHistoryList.find(({ id }) => id === currEmpHistoryId) || {};
    const isDateInRange = DateUtil.inRange(date, validFrom, validTo);
    const subroleId = isDateInRange
      ? currEmpHistoryId
      : (
          empHistoryList.find(
            ({ subRoleKey, validFrom, validTo }) =>
              currSubRoleKey === subRoleKey &&
              DateUtil.inRange(date, validFrom, validTo)
          ) || {}
        ).id;

    // check if selected is DCC as DCC can be selected on another date
    const fetchedDefaultCC =
      subroleId &&
      find(defaultCostCenterList, {
        date,
        empHistoryId: subroleId,
      });
    let defaultCostCenter: DefaultCostCenter;
    if (fetchedDefaultCC) {
      dispatch(loadingEnd(costCenterArea));
      defaultCostCenter = fetchedDefaultCC.costCenter;
    } else {
      defaultCostCenter =
        (await dispatch(getDefaultCostCenter(empId, date, subroleId))) || {};
    }
    const currentCC = get(expReport, 'costCenterCode');
    const isUpdateDefaultCC =
      !get(expReport, 'isCostCenterChangedManually') || isEmpty(currentCC);
    if (isUpdateDefaultCC || defaultCostCenter.costCenterCode === currentCC) {
      return {
        costCenter: defaultCostCenter,
        isChangedManually: false,
      };
    }

    // get latest cc if there is an existing cc selected
    const { validDateFrom, validDateTo } = currLatestCostCenter;
    let latestCostCenter = currLatestCostCenter;
    const hasLatestCC = DateUtil.inRange(date, validDateFrom, validDateTo);
    const isDiffFromLatestCC =
      latestCostCenter.baseCode !== expReport.costCenterCode;
    if (!hasLatestCC || isDiffFromLatestCC) {
      const currentHistoryId = get(expReport, 'costCenterHistoryId');
      latestCostCenter = (await dispatch(
        getLatestCostCenter(currentHistoryId, date)
      )) as LatestCostCenter;
    }
    const { baseCode, id, name } = latestCostCenter || ({} as LatestCostCenter);
    const costCenter = {
      costCenterCode: baseCode,
      costCenterHistoryId: id,
      costCenterName: name,
    };
    return {
      costCenter,
      isChangedManually: true,
    };
  };
