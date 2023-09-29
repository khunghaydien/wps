import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { showToast } from '../../../commons/modules/toast';
import { withLoading } from '../../modules/commons/loading';
import msg from '@apps/commons/languages';

import { AccountingPeriodOptionList } from '../../../domain/models/exp/AccountingPeriod';
import { DefaultCostCenter } from '../../../domain/models/exp/CostCenter';
import { Record } from '../../../domain/models/exp/Record';
import {
  initialStatePreRequest,
  initialStateReport,
  Report,
} from '../../../domain/models/exp/Report';

import { AppDispatch } from '../../modules/expense/AppThunk';
import { actions as approvalHistoryAction } from '../../modules/expense/entities/approvalHistory';
import { actions } from '../../modules/expense/entities/report';

export const initialize =
  (
    accountingPeriodId: string,
    accountingPeriodList: any,
    isFromPreRequest: boolean,
    isClone?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    const selectedAccountingPeriod = find(accountingPeriodList, {
      id: accountingPeriodId,
    });
    // if the report is from approved pre-request, don't update accounting period
    if (isFromPreRequest) {
      return;
    }
    // if selected accounting period is inactive, set first one of active accounting period list as default
    if (
      !selectedAccountingPeriod &&
      !isEmpty(accountingPeriodList) &&
      !isClone
    ) {
      dispatch(
        actions.updateValue(
          'accountingPeriodId',
          accountingPeriodList[0].value || null
        )
      );
      dispatch(
        actions.updateValue(
          'accountingDate',
          accountingPeriodList[0].recordDate
        )
      );
    }
  };

export const createNewReport =
  (
    records: Record[],
    accountingPeriodList: any,
    expReportTypeList: any,
    accountingPeriodId: string | undefined,
    reportTypeId: string | undefined,
    accountingDate: string,
    defaultCostCenter: DefaultCostCenter | { [key: string]: never },
    isRequest?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    const report = {
      ...(isRequest ? initialStatePreRequest : initialStateReport),
    };
    // if selected report type is invalid, set the fist report type as default
    const selectedReportType =
      find(expReportTypeList, ['id', reportTypeId]) ||
      get(expReportTypeList, '0', {});
    report.expReportTypeId = selectedReportType.id;
    report.useFileAttachment = selectedReportType.useFileAttachment;
    if (!isEmpty(defaultCostCenter)) {
      const { costCenterName = '', costCenterHistoryId = null } =
        defaultCostCenter as DefaultCostCenter;
      report.costCenterName = costCenterName;
      report.costCenterHistoryId = costCenterHistoryId;
    }
    // @ts-ignore
    report.accountingPeriodId = accountingPeriodId || null;
    report.accountingDate = accountingDate;
    dispatch(actions.setReport(report));
    dispatch(actions.setRecords(records));
    dispatch(actions.setEI(selectedReportType));
  };

/**
 * Fetch report
 *
 * @param {string} reportId
 */
export const fetch =
  (reportId: string, isApprovedPreRequest: boolean, isRequest?: boolean) =>
  (dispatch: AppDispatch) =>
    dispatch(
      withLoading(actions.fetch(reportId, isApprovedPreRequest, isRequest))
    );

/**
 * Delete report
 *
 * @param {string} reportId
 */
export const remove =
  (reportId: string, isRequest?: boolean) => (dispatch: AppDispatch) =>
    dispatch(withLoading(actions.delete(reportId, isRequest))).catch((err) => {
      throw err;
    });

/**
 * Clone report
 *
 * @param {string} reportId
 */
export const clone =
  (reportId: string, empId: string, isRequest?: boolean) =>
  (dispatch: AppDispatch) =>
    dispatch(withLoading(actions.clone(reportId, empId, isRequest))).catch(
      (err) => {
        dispatch(showToast(err.message || err.event.message));
        throw err;
      }
    );

export const clear = () => (dispatch: AppDispatch) => {
  dispatch(actions.clear());
};

export const submit =
  (reportId: string, comment: string, empId?: string, isRequest?: boolean) =>
  (dispatch: AppDispatch) =>
    dispatch(
      withLoading(actions.submit(reportId, comment, empId, isRequest))
    ).catch((err) => {
      dispatch(showToast(err.message || err.event.message));
      throw err;
    });

export const recall =
  (requestId: string, comment: string, isRequest?: boolean) =>
  (dispatch: AppDispatch) =>
    dispatch(withLoading(actions.recall(requestId, comment, isRequest))).catch(
      (err) => {
        dispatch(showToast(err.message || err.event.message));
        throw err;
      }
    );

export const save = (report: Report) => {
  const saveData = (dispatch: AppDispatch) =>
    dispatch(actions.save(report)).catch((err) => {
      throw err;
    });

  return withLoading(saveData);
};

export const saveRequest = (report: Report) => {
  const saveData = (dispatch: AppDispatch) =>
    dispatch(actions.saveRequest(report, report.empId)).catch((err) => {
      throw err;
    });

  return withLoading(saveData);
};

export const claimReportFromRequest =
  (
    preRequestId: string,
    empId: string,
    accountingPeriodList: AccountingPeriodOptionList
  ) =>
  (dispatch: AppDispatch): Promise<string> =>
    dispatch(
      withLoading(
        actions.createReportFromRequest(
          preRequestId,
          empId,
          accountingPeriodList
        )
      )
    ).catch((err) => {
      dispatch(showToast(err.message || err.event.message));
    });

export const getApprovalHistory =
  (requestId: string) => (dispatch: AppDispatch) =>
    dispatch(approvalHistoryAction.get(requestId));

export const exportToEmail =
  (contentDocumentId: string, contentVersionId: string) =>
  (dispatch: AppDispatch): Promise<string | void> =>
    dispatch(
      withLoading(actions.exportToEmail(contentDocumentId, contentVersionId))
    )
      .then(() => {
        dispatch(showToast(msg().Exp_Msg_ReportEmailSuccess));
      })
      .catch((err) => {
        dispatch(showToast(err.message || err.event.message));
      });

export const generatePdfForPrint =
  (empId: string, reportId: string, reportTypeId: string, endDate: string) =>
  (dispatch: AppDispatch) =>
    dispatch(
      withLoading(
        actions.generatePrintPage(empId, reportId, reportTypeId, endDate)
      )
    ).catch((err) => {
      dispatch(showToast(err.message || err.event.message));
      throw err;
    });
