import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { compose } from 'redux';

import { FormikValues, withFormik } from 'formik';
import { find, get, isEmpty, isNil } from 'lodash';

import { pushHistoryWithPrePage } from '@apps/mobile-app/concerns/routingHistory';
import schema from '@mobile/schema/expenses/ExpensesReport';

import msg from '@apps/commons/languages';
import { showToast } from '@apps/commons/modules/toast';
import DateUtil from '@commons/utils/DateUtil';

import { EmpHistory } from '@apps/domain/models/common/Employee';
import { LatestCostCenter } from '@apps/domain/models/exp/CostCenter';
import {
  FILE_ATTACHMENT_TYPE,
  getDisplayOfCR,
  getDisplayOfVendorCCJob,
} from '@apps/domain/models/exp/Report';

import { State } from '@mobile/modules';
import { actions as fileMetadataActions } from '@mobile/modules/expense/entities/fileMetadata';
import {
  filterMobileCompatibleRT,
  getAPOptionList,
  getReportTypeList,
  getReportTypeOption,
  selectedRecords,
} from '@mobile/modules/expense/selector';
import { actions as customHintUIActions } from '@mobile/modules/expense/ui/customHint/list';
import { actions as employeeHistoryActions } from '@mobile/modules/expense/ui/employeeHistory';
import { actions as recordUpdateInfoActions } from '@mobile/modules/expense/ui/record/recordUpdatedInfo';
import { actions as formValueAction } from '@mobile/modules/expense/ui/report/formValues';

import {
  getCustomRequestTypes,
  getEmployeeList,
  resetSearchCondition,
} from '@apps/mobile-app/action-dispatchers/expense/CustomRequestSearch';
import { getAccountingPeriodList } from '@mobile/action-dispatchers/expense/AccountingPeriod';
import {
  getLatestHistoryCostCenter,
  searchDefaultCoastCenter,
} from '@mobile/action-dispatchers/expense/CostCenter';
import { getCustomHints } from '@mobile/action-dispatchers/expense/CustomHint';
import { getEmpHistory } from '@mobile/action-dispatchers/expense/EmpHistoryList';
import { getExpReportTypeList } from '@mobile/action-dispatchers/expense/ExpReportType';
import {
  getBase64files,
  uploadReceipts,
} from '@mobile/action-dispatchers/expense/Receipt';
import {
  createNewReport,
  initialize,
  save,
} from '@mobile/action-dispatchers/expense/ReportDetail';

import ReportEditPage from '@mobile/components/pages/expense/Report/Edit';

import { backType } from './ReceiptLibraryContainer';
import { LOCATION_STATE } from '@mobile/routes/expenseRoute';

type OwnProps = RouteComponentProps & {
  reportId?: string;
};

const ReportEditContainer = (
  ownProps: OwnProps & ReturnType<typeof mergeProps> & FormikValues
) => {
  useEffect(() => {
    const { companyId } = ownProps.userSetting;
    if (isEmpty(ownProps.customHints)) {
      ownProps.getCustomHints(companyId);
    }

    const accountingPeriodPromise = ownProps.getAccountingPeriodList();
    /* for existing report, use accountingDate from targetExpReport
    for new report from record list, use accountindDate from report type select context
    for new report from report list, use today date
    */
    const accountingDate =
      ownProps.values.report.accountingDate ||
      ownProps.reportTypeSelection.accountingDate ||
      DateUtil.getToday();
    const expReportTypePromise = ownProps.getExpReportTypeList(accountingDate);
    const defaultCostCenterPromise =
      accountingDate && ownProps.getDefaultCostCenter(accountingDate);

    Promise.all([
      defaultCostCenterPromise,
      accountingPeriodPromise,
      expReportTypePromise,
    ]).then(([ccDefault, apList, rtList]) => {
      const accountingPeriodList = apList[0];
      const expReportTypeList = rtList[0];
      const validReportTypeList = filterMobileCompatibleRT(expReportTypeList);
      const reportTypeId = ownProps.reportId
        ? ownProps.values.report.expReportTypeId
        : ownProps.reportTypeSelection.reportTypeId ||
          validReportTypeList[0].id;
      // set is cost center manually changed
      const reportTypeWithCostCenterUsed = expReportTypeList.find(
        (x) => x.id === reportTypeId && x.isCostCenterRequired !== 'UNUSED'
      );
      let defaultCostCenter = {};
      if (reportTypeWithCostCenterUsed && ccDefault) {
        defaultCostCenter = ccDefault[0];
        const isManuallyChangedPre =
          ownProps.formValues.isCostCenterChangedManually;
        const currentCostCenter = get(ownProps.values.report, 'costCenterName');
        const isManuallyChanged =
          isManuallyChangedPre ||
          (!isEmpty(currentCostCenter) &&
            currentCostCenter !== get(defaultCostCenter, 'costCenterName'));
        ownProps.saveReportFormValues({
          ...ownProps.formValues,
          isCostCenterChangedManually: isManuallyChanged,
        });
      }

      if (isEmpty(ownProps.formValues)) {
        // Initialize an existing report
        if (ownProps.reportId) {
          const isFromPreRequest = !!ownProps.targetExpReport.preRequestId;
          const isClone =
            ownProps.targetExpReport.reportId &&
            ownProps.targetExpReport.accountingPeriodId === null;
          ownProps.initialize(
            ownProps.values.report.accountingPeriodId,
            accountingPeriodList,
            isFromPreRequest,
            isClone
          );
        } // Create a new report
        else {
          const { accountingPeriodId } = ownProps.reportTypeSelection;
          ownProps.createNewReport(
            ownProps.records,
            accountingPeriodList,
            expReportTypeList,
            accountingPeriodId,
            reportTypeId,
            accountingDate,
            defaultCostCenter
          );
        }
      }
    });
  }, []);

  return (
    <ReportEditPage
      accountingPeriodList={ownProps.accountingPeriodList}
      userSetting={ownProps.userSetting}
      expReportTypeList={ownProps.expReportTypeList}
      reportTypeListOption={ownProps.reportTypeListOption}
      targetExpReport={ownProps.targetExpReport}
      values={ownProps.values}
      errors={ownProps.errors}
      touched={ownProps.touched}
      defaultCostCenter={ownProps.defaultCostCenter}
      formValues={ownProps.formValues}
      setValues={ownProps.setValues}
      setTouched={ownProps.setTouched}
      saveReportFormValues={ownProps.saveReportFormValues}
      onClickCancelButton={ownProps.onClickCancelButton}
      handleSubmit={ownProps.handleSubmit}
      onClickSearchCostCenter={ownProps.onClickSearchCostCenter}
      onClickSearchJob={ownProps.onClickSearchJob}
      onClickSearchVendor={ownProps.onClickSearchVendor}
      onClickSearchCustomRequest={ownProps.onClickSearchCustomRequest}
      reportId={ownProps.reportId}
      onClickSearchCustomEI={ownProps.onClickSearchCustomEI}
      getBase64files={ownProps.getBase64files}
      uploadReceipts={ownProps.uploadReceipts}
      saveFileMetadata={ownProps.saveFileMetadata}
      activeHints={ownProps.activeHints}
      customHints={ownProps.customHints}
      onClickHint={ownProps.onClickHint}
      openReceiptLibrary={ownProps.openReceiptLibrary}
      updateReportTypeList={ownProps.updateReportTypeList}
      getLatestHistoryCostCenter={ownProps.getLatestHistoryCostCenter}
      searchDefaultCoastCenter={ownProps.searchDefaultCoastCenter}
      setFieldValue={ownProps.setFieldValue}
      recordUpdateInfo={ownProps.recordUpdateInfo}
      clearRecordUpdateInfo={ownProps.clearRecordUpdateInfo}
    />
  );
};

const mapStateToProps = (state: State) => ({
  reportListType: state.expense.ui.report.listType,
  targetExpReport: state.expense.entities.report,
  records: selectedRecords(state.expense),
  formValues: state.expense.ui.report.formValues,
  reportTypeSelection: state.expense.ui.report.reportTypeSelection,
  accountingPeriodList: getAPOptionList(state.expense),
  empGroupReportTypeObj: state.expense.entities.expReportType,
  expReportTypeList: getReportTypeList(state.expense),
  userSetting: state.userSetting,
  activeHints: state.expense.ui.customHint.list,
  customHints: state.expense.entities.customHint,
  defaultCostCenter: state.expense.entities.defaultCostCenterList,
  recordUpdateInfo: state.expense.ui.record.recordUpdatedInfo,
  reportTypeListOption: getReportTypeOption(state.expense),
  empHistoryList: state.expense.entities.empHistoryList,
  employeeHistory: state.expense.ui.employeeHistory,
});

const mapDispatchToProps = {
  saveReportFormValues: formValueAction.save,
  clearFormValues: formValueAction.clear,
  getAccountingPeriodList,
  getExpReportTypeList,
  getEmpHistory,
  save,
  createNewReport,
  initialize,
  onClickHint: customHintUIActions.set,
  resetCustomHint: customHintUIActions.clear,
  getCustomHints,
  getBase64files,
  uploadReceipts,
  searchDefaultCoastCenter,
  showToast,
  saveFileMetadata: fileMetadataActions.save,
  clearRecordUpdateInfo: recordUpdateInfoActions.reset,
  setEmployeeHistoryInfo: employeeHistoryActions.set,
  // link custom request
  getEmployeeList,
  getCustomRequestTypes,
  getLatestHistoryCostCenter,
  resetSearchCondition,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onClickCancelButton: () => {
    if (ownProps.reportId && ownProps.reportId !== 'null') {
      dispatchProps.clearFormValues();
      ownProps.history.push(
        `../../../expense/report/detail/${ownProps.reportId}`,
        {
          action: LOCATION_STATE.CANCEL_EDIT,
        }
      );
    } else if (isEmpty(stateProps.targetExpReport.records)) {
      // create report header
      dispatchProps.clearFormValues();
      ownProps.history.replace(`/expense/report/list`);
    }
  },
  onClickSearchCostCenter: (accountingDate: string) => {
    const reportId = ownProps.reportId || 'null';
    const path = `/expense/cost-center/list/backType=report/targetDate=${accountingDate}/reportId=${reportId}`;
    pushHistoryWithPrePage(ownProps.history, path);
  },
  onClickSearchJob: (accountingDate: string) => {
    const reportId = ownProps.reportId || 'null';
    pushHistoryWithPrePage(
      ownProps.history,
      `/expense/job/list/backType=report/targetDate=${accountingDate}/reportId=${reportId}`
    );
  },
  onClickSearchVendor: () => {
    const reportId = ownProps.reportId || 'null';
    pushHistoryWithPrePage(
      ownProps.history,
      `/expense/vendor/search/reportId=${reportId}`
    );
  },
  onClickSearchCustomRequest: () => {
    dispatchProps.getEmployeeList();
    dispatchProps.getCustomRequestTypes();
    dispatchProps.resetSearchCondition();

    const reportId = ownProps.reportId || 'null';
    pushHistoryWithPrePage(
      ownProps.history,
      `/expense/custom-request/list/reportId=${reportId}`
    );
  },
  openReceiptLibrary: (attachedIds) => {
    const path = `/expense/receipt-library/list/backType=${backType.REPORT}`;
    pushHistoryWithPrePage(ownProps.history, path, { attachedIds });
  },
  onClickSearchCustomEI: (
    customExtendedItemLookupId: string,
    customExtendedItemId: string,
    customExtendedItemName: string,
    index: string
  ) => {
    const reportId = ownProps.reportId || 'null';
    pushHistoryWithPrePage(
      ownProps.history,
      `/expense/customExtendedItem/list/backType=report/reportId=${reportId}/recordId=null/itemIdx=null/index=${index}/customExtendedItemLookupId=${customExtendedItemLookupId}/customExtendedItemId=${customExtendedItemId}/customExtendedItemName=${customExtendedItemName}`
    );
  },
  updateReportTypeList: async (targetedDate: string) => {
    const {
      employeeHistory: { empGroupId, validFrom, validTo },
      userSetting: { employeeId, companyId },
      empGroupReportTypeObj,
    } = stateProps;
    // Check target date with emp history group, fetch report type list if emp group has changed
    const isCrossHistory = !DateUtil.inRange(targetedDate, validFrom, validTo);
    let empHistoryGroupList = stateProps.empHistoryList;
    let targetGroupId = empGroupId;
    let targetFrom = validFrom;
    let targetTo = validTo;
    if (isCrossHistory) {
      if (isEmpty(empHistoryGroupList)) {
        const res = await dispatchProps.getEmpHistory(employeeId);
        empHistoryGroupList = res[0];
      }
      const targetHistory = find(
        empHistoryGroupList,
        ({ validFrom, validTo }) =>
          DateUtil.inRange(targetedDate, validFrom, validTo)
      ) as EmpHistory;
      if (targetHistory) {
        targetGroupId = targetHistory.empGroupId;
        targetFrom = targetHistory.validFrom;
        targetTo = targetHistory.validTo;
        dispatchProps.setEmployeeHistoryInfo(targetHistory);
      }
    }
    let targetedRTList = get(empGroupReportTypeObj, `${targetGroupId}`);
    if (isNil(targetedRTList)) {
      const res = await dispatchProps.getExpReportTypeList(
        targetGroupId,
        companyId,
        true,
        employeeId,
        false,
        targetFrom,
        targetTo
      );
      targetedRTList = res[0];
    }
    return targetedRTList;
  },
  getAccountingPeriodList: () => {
    const {
      accountingPeriodList,
      userSetting: { companyId },
    } = stateProps;
    let accountingPeriodPromise = new Promise((resolve) =>
      resolve([accountingPeriodList])
    );
    if (accountingPeriodList === null) {
      accountingPeriodPromise =
        // @ts-ignore
        dispatchProps.getAccountingPeriodList(companyId);
    }
    return accountingPeriodPromise;
  },
  // get report type list based on employee group config
  getExpReportTypeList: async (targetDate) => {
    const {
      empGroupReportTypeObj,
      userSetting: { companyId, employeeId },
      employeeHistory: { empGroupId, validFrom, validTo },
    } = stateProps;
    const isCrossHistory = !DateUtil.inRange(targetDate, validFrom, validTo);
    let targetGroupId = empGroupId;
    let targetFrom = validFrom;
    let targetTo = validTo;
    let empHistoryGroupList = stateProps.empHistoryList;
    if (isCrossHistory) {
      if (isEmpty(empHistoryGroupList)) {
        const res = await dispatchProps.getEmpHistory(employeeId);
        empHistoryGroupList = res[0];
      }
      const targetHistory = find(
        empHistoryGroupList,
        ({ validFrom, validTo }) =>
          DateUtil.inRange(targetDate, validFrom, validTo)
      ) as EmpHistory;
      targetFrom = targetHistory.validFrom;
      targetTo = targetHistory.validTo;
      targetGroupId = targetHistory.empGroupId;
      dispatchProps.setEmployeeHistoryInfo(targetHistory);
    }
    const targetedRTList = get(empGroupReportTypeObj, `${targetGroupId}`);
    let expReportTypePromise = new Promise((resolve) =>
      resolve([targetedRTList])
    );
    if (isNil(targetedRTList)) {
      // @ts-ignore
      expReportTypePromise = dispatchProps.getExpReportTypeList(
        targetGroupId,
        companyId,
        true,
        employeeId,
        false,
        targetFrom,
        targetTo
      );
    }
    return expReportTypePromise;
  },
  getDefaultCostCenter: (date) => {
    const defaultCostCenter = find(stateProps.defaultCostCenter, [
      'date',
      date,
    ]);
    let defaultCostCenterPromise;
    if (!defaultCostCenter) {
      defaultCostCenterPromise = dispatchProps.searchDefaultCoastCenter(
        stateProps.userSetting.employeeId,
        date
      );
    } else {
      defaultCostCenterPromise = new Promise((resolve) =>
        resolve([defaultCostCenter.costCenter])
      );
    }
    return defaultCostCenterPromise;
  },
  getLatestHistoryCostCenter: (historyId: string, targetDate: string) =>
    dispatchProps
      .getLatestHistoryCostCenter(historyId, targetDate)
      // @ts-ignore
      .then((res: LatestCostCenter | boolean) => res[0]),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  withFormik({
    enableReinitialize: true,
    validationSchema: schema,

    mapPropsToValues: (props: ReturnType<typeof mergeProps>) => {
      const { formValues, targetExpReport } = props;
      // if report type in form has been updated, should use the latest value
      const reportTypeId =
        formValues.expReportTypeId || targetExpReport.expReportTypeId;
      const selectedReportType = find(props.expReportTypeList, {
        id: reportTypeId,
      });
      const { isCostCenterRequired, isJobRequired, isVendorRequired } =
        getDisplayOfVendorCCJob(selectedReportType);
      const { isCustomRequestRequired } = getDisplayOfCR(selectedReportType);

      const isFileAttachmentRequired =
        selectedReportType &&
        selectedReportType.fileAttachment === FILE_ATTACHMENT_TYPE.Required;
      const { records, totalAmount } = targetExpReport;
      return {
        ui: {
          checkboxes: [],
          recordIdx: -1,
          recalc: false,
          saveMode: false,
          existActiveAp: !isEmpty(props.accountingPeriodList),
        },
        report: {
          ...targetExpReport,
          ...formValues,
          totalAmount,
          records,
          isCostCenterRequired,
          isJobRequired,
          isCustomRequestRequired,
          isVendorRequired,
          isFileAttachmentRequired,
        },
      };
    },
    handleSubmit: (values, { props }) => {
      props
        .save(values.report)
        // @ts-ignore
        .then(([{ reportId }, ..._rest]) => {
          props.clearFormValues();
          props.resetCustomHint();
          props.history.replace(`/expense/report/detail/${reportId}`);
        })
        .catch((err) => {
          const errMsg =
            (err.message && ` (${err.message})`) ||
            (err.event && ` (${err.event.message})`) ||
            '';
          props.showToast(`${msg().Exp_Lbl_ReportSaveFailed}${errMsg}`);
        });
    },
  })
)(ReportEditContainer) as React.ComponentType<Record<string, any>>;
