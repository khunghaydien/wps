import { connect } from 'react-redux';

import { withFormik } from 'formik';
import { cloneDeep, find, get, isEmpty } from 'lodash';

import { recordDateWithCheckWorkingDaysCheck } from '../../../commons/schema/Expense';
import schema from '../../schema/ExpensesRequest';

import { catchApiError, confirm } from '../../../commons/actions/app';
import RequestFormView, {
  Props as FormProps,
  Values as FormikValues,
} from '../../../commons/components/exp/Form';
import withLoadingHOC from '../../../commons/components/withLoading';
import msg from '../../../commons/languages';
import { selectors as appSelectors } from '../../../commons/modules/app';
import { showToastWithType } from '../../../commons/modules/toast';
import subRoleOptionHelper from '@apps/commons/components/exp/SubRole/subRoleOptionCreator';
import DateUtil from '@apps/commons/utils/DateUtil';
import { actions as paymentMethodListActions } from '@commons/modules/exp/entities/paymentMethodList';
import { actions as bulkEditRecordActions } from '@commons/modules/exp/ui/bulkEditRecord';

import { JCT_NUMBER_INVOICE } from '@apps/domain/models/exp/JCTNo';
import {
  isUseWithholdingTax,
  RecordItem,
} from '@apps/domain/models/exp/Record';
import { Report } from '@apps/domain/models/exp/Report';

import { setAvailableExpType } from '../../../domain/modules/exp/expense-type/availableExpType';
import { actions as requestActions } from '../../../domain/modules/exp/request/report';
import { actions as activeDialogActions } from '../../modules/ui/expenses/dialog/activeDialog';
import { actions as commentActions } from '../../modules/ui/expenses/dialog/approval/comment';
import { actions as errorActions } from '../../modules/ui/expenses/dialog/approval/error';
import { actions as modeActions, modes } from '../../modules/ui/expenses/mode';
import { actions as overlapActions } from '../../modules/ui/expenses/overlap';
import { actions as workingDaysActions } from '../../modules/ui/expenses/recordItemPane/workingDays';
import { set as setReportTypeLoading } from '../../modules/ui/expenses/reportTypeLoading';
import { actions as viewAction } from '../../modules/ui/expenses/view';
import { actions as reportActions } from '@apps/domain/modules/exp/expense-report-type/list';
import { updateRecordDate } from '@apps/domain/modules/exp/recordDate';
import { actions as accountingPeriodActions } from '@apps/expenses-pc/modules/ui/expenses/recordListPane/accountingPeriod';

import {
  openApprovalHistoryDialog,
  openEditHistoryDialog,
} from '../../action-dispatchers/Dialog';
import {
  changeListTab,
  createReportFromRequest,
  deleteExpReport,
  discardApprovedRequest,
  fetchExpReport,
  getUserSettings,
  saveBulkRecord,
  saveExpRecord,
  saveExpReport,
  setSelectedSubRole,
} from '../../action-dispatchers/Expenses';
import { getReportTypeWithLinkedExpType } from '../../action-dispatchers/ReportType';

const _ = undefined;
/**
 * Resets the subrole states to set first active role of tab company as selected role
 * @param dispatchProps
 * @param companyId
 * @param companySubroleId First Active Company Subrole Id: Used to set list page settings
 */
async function resetSubroleStates(dispatchProps, companyId, companySubroleId) {
  dispatchProps.setSelectedExpenseSubRole(companySubroleId);
  await dispatchProps.getUserSettings(companySubroleId, true);
  dispatchProps.getAccountingPeriod(companyId);
}

const mapStateToProps = (state) => {
  const reportTypeList = state.entities.exp.expenseReportType.list.active || [];
  const selectedExpReport = state.ui.expenses.selectedExpReport;
  const reportType = find(reportTypeList, {
    id: selectedExpReport.expReportTypeId,
  });
  const alwaysDisplaySettlementAmount = get(
    state,
    'userSetting.alwaysDisplaySettlementAmount'
  );
  const isUseCashAdvance = get(reportType, 'useCashAdvance');
  const subRoleId = get(state, 'ui.expenses.subrole.selectedRole');
  const employeeDetails = state.common.exp.entities.employeeDetails;
  const employHistories = get(employeeDetails, 'details', undefined);
  const subroleIds = get(state, 'ui.expenses.subrole.ids');
  const tabCompanyId = get(state, 'ui.expenses.tab.companyId');
  const selectedDelegator = get(
    state,
    'ui.expenses.delegateApplicant.selectedEmployee'
  );
  const companies = state.common.exp.entities.companyDetails;
  const subrolesMap = subRoleOptionHelper.getSubRoleOptionsCompanyMap(
    employeeDetails.details,
    companies
  );
  const isProxyMode = !isEmpty(selectedDelegator);
  const primaryRole = subRoleOptionHelper.getPrimaryRole(employHistories);
  const isPrimaryCompany =
    isEmpty(employHistories) || primaryRole?.companyId === tabCompanyId;

  return {
    isLoading: appSelectors.loadingSelector(state),
    loadingAreas: state.common.app.loadingAreas,
    loadingHint: state.common.app.loadingHint,
    overlap: state.ui.expenses.overlap,
    reportTypeList,
    selectedExpReport,
    availableExpType: state.entities.exp.expenseType.availableExpType,
    expenseTypeList: state.entities.exp.expenseType.list,
    taxTypeListForSaving: state.ui.expenses.recordItemPane.tax,
    isExpense: true,
    isUseCashAdvance,
    apActive: state.ui.expenses.recordListPane.accountingPeriod.filter(
      (ap) => ap.active
    ),
    mode: state.ui.expenses.mode,
    isUseAttendance: state.userSetting.useAttendance,
    expAttendanceValidation: state.userSetting.expAttendanceValidation,
    expReportList: state.entities.exp.report.expReportList,
    reportIdList: state.entities.reportIdList.reportIdList,
    foreignCurrency: state.ui.expenses.recordItemPane.foreignCurrency.currency,
    employeeId: state.userSetting.employeeId,
    companyId: state.userSetting.companyId,
    isLoaderOverride: true,
    fixedAmountOptionList: state.ui.expenses.recordItemPane.fixedAmountOption,
    selectedTab: state.ui.expenses.tab.tabIdx,
    paymentMethodList: state.common.exp.entities.paymentMethodList,
    subRoleId,
    employHistories,
    subroleIds,
    tabCompanyId,
    isProxyMode,
    isBulkEditMode: state.common.exp.ui.bulkEditRecord.isEnabled,
    bulkEditRemoveIds: state.common.exp.ui.bulkEditRecord.removeIds,
    primaryRole,
    defaultCostCenter: state.entities.exp.costCenter.defaultCostCenter,
    subrolesMap,
    accountingPeriodAll: state.ui.expenses.recordListPane.accountingPeriod,
    isPrimaryCompany,
    alwaysDisplaySettlementAmount,
  };
};

const mapDispatchToProps = {
  catchApiError,
  clearComments: commentActions.clear,
  confirm,
  moveBackToReport: overlapActions.nonOverlapReport,
  onClickDeleteButton: deleteExpReport,
  openApprovalDialog: activeDialogActions.approval,
  openApprovalHistoryDialog,
  openCancelDialog: activeDialogActions.cancelRequest,
  openEditHistoryDialog,
  bulkRecordEdit: modeActions.bulkRecordEdit,
  reportEdit: modeActions.reportEdit,
  reportSelect: modeActions.reportSelect,
  saveExpReport,
  saveExpRecord,
  saveBulkRecord,
  showToastWithType,
  createReportFromRequest,
  discardApprovedRequest,
  checkWorkingDays: workingDaysActions.check,
  fixFiles: requestActions.fixFiles,
  preProcess: requestActions.preProcess,
  setListView: viewAction.setListView,
  setApprovalError: errorActions.set,
  setAvailableExpType,
  setReportTypeLoading,
  getReportTypeWithLinkedExpType,
  updateRecordDate,
  setSelectedExpenseSubRole: setSelectedSubRole,
  getAccountingPeriod: accountingPeriodActions.search,
  getUserSettings,
  clearList: reportActions.clearList,
  searchPaymentMethodList: paymentMethodListActions.search,
  fetchExpReport,
  changeListTab,
  clearBulkEditRemoveIds: bulkEditRecordActions.clearRemove,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onClickSubmitButton: async (values) => {
    const isNoRecord = values.report.records.length === 0;
    if (!stateProps.isUseCashAdvance && isNoRecord) {
      dispatchProps.catchApiError(
        {
          errorCode: 'INVALID_PARAMETER',
          message: msg().Exp_Err_SubmitReportNoRecords,
          stackTrace: null,
        },
        { isContinuable: true }
      );
    } else {
      await dispatchProps.fixFiles(stateProps.selectedExpReport.reportId);

      const preProcessResult = await dispatchProps.preProcess(
        stateProps.selectedExpReport.reportId
      );
      if (preProcessResult) {
        dispatchProps.catchApiError(
          {
            errorCode: preProcessResult.errorCode,
            message: preProcessResult.message,
            stackTrace: null,
          },
          { isContinuable: true }
        );
      } else {
        dispatchProps.openApprovalDialog();
        if (stateProps.isUseAttendance) {
          const recordDates = stateProps.selectedExpReport.records.map(
            (record) => record.recordDate
          );
          const workingDays = recordDates.filter(
            (x, i, self) => self.indexOf(x) === i
          );
          if (!isNoRecord && stateProps.expAttendanceValidation) {
            dispatchProps
              .checkWorkingDays(workingDays, stateProps.employeeId)
              .then(({ payload }) => {
                const errors = recordDateWithCheckWorkingDaysCheck(
                  values,
                  payload
                );
                dispatchProps.setApprovalError({ records: errors });
              });
          }
        }
      }
    }
  },
  onClickDeleteButton: () => {
    const {
      isProxyMode,
      subroleIds,
      employeeId,
      selectedExpReport,
      employHistories,
      isPrimaryCompany,
      companyId,
    } = stateProps;
    dispatchProps.confirm(msg().Exp_Msg_RequestConfirmRemove, (yes) => {
      if (yes) {
        dispatchProps
          .onClickDeleteButton(
            selectedExpReport.reportId,
            employeeId,
            subroleIds
          )
          .then(() => {
            if (!isProxyMode) {
              resetSubroleStates(
                dispatchProps,
                companyId,
                subRoleOptionHelper.getFirstActiveRole(
                  subroleIds,
                  employHistories,
                  isPrimaryCompany
                )
              );
            }
          });
      }
    });
  },
  onClickDiscardButton: () => {
    dispatchProps.confirm(msg().Exp_Msg_ConfirmDiscardRequest, (yes) => {
      if (yes) {
        dispatchProps.discardApprovedRequest(
          stateProps.selectedExpReport.preRequestId,
          stateProps.employeeId
        );
      }
    });
  },
  onClickCancelRequestButton: () => {
    dispatchProps.clearComments();
    dispatchProps.openCancelDialog();
  },
  onClickApprovalHistoryButton: () =>
    dispatchProps.openApprovalHistoryDialog(
      stateProps.selectedExpReport.requestId
    ),
  onClickEditHistoryButton: () =>
    dispatchProps.openEditHistoryDialog(stateProps.selectedExpReport.requestId),
  onClickBackButton: () => {
    const {
      companyId,
      selectedExpReport,
      isProxyMode,
      subroleIds,
      employHistories,
      subrolesMap,
      isPrimaryCompany,
    } = stateProps;
    let toUseSubroleIds = subroleIds;
    if (isEmpty(toUseSubroleIds)) {
      const subroles = get(subrolesMap, `${companyId}`, []);
      if (!isEmpty(subroles))
        toUseSubroleIds = subroles
          .filter((s) => s !== undefined && s.value)
          .map((s) => s.value);
    }

    const hasReportId = selectedExpReport.reportId;
    const hasPreRequestId = selectedExpReport.preRequestId;
    const isNewPreRequest = hasPreRequestId && !hasReportId;

    dispatchProps.updateRecordDate(DateUtil.getToday());
    if (
      [modes.REPORT_EDIT, modes.BULK_RECORD_EDIT].includes(stateProps.mode) &&
      !isNewPreRequest
    ) {
      dispatchProps.confirm(msg().Common_Confirm_DiscardEdits, (yes) => {
        if (yes) {
          dispatchProps.moveBackToReport();
          dispatchProps.setListView();
          dispatchProps.reportSelect();
          if (!isProxyMode)
            resetSubroleStates(
              dispatchProps,
              companyId,
              subRoleOptionHelper.getFirstActiveRole(
                toUseSubroleIds,
                employHistories,
                isPrimaryCompany
              )
            );
        }
      });
    } else {
      dispatchProps.moveBackToReport();
      dispatchProps.setListView();
      dispatchProps.reportSelect();
      if (!isProxyMode)
        resetSubroleStates(
          dispatchProps,
          companyId,
          subRoleOptionHelper.getFirstActiveRole(
            toUseSubroleIds,
            employHistories,
            isPrimaryCompany
          )
        );
    }
  },
  onClickSaveButton: (expReport, reportTypeList, defaultTaxType) => {
    const { isProxyMode } = stateProps;
    const { costCenterHistoryId, jobId } = expReport;
    const selectedExpReportType = reportTypeList.find(
      (rt) => rt.id === expReport.expReportTypeId
    );

    if (!selectedExpReportType) {
      return Promise.reject(new Error(msg().Exp_Msg_ReportTypeCannotUse));
    }
    expReport.expReportTypeName = selectedExpReportType.name;
    // if cost center is unused, remove the default cost center
    const isCostCenterUsed = selectedExpReportType.isCostCenterRequired;
    if (isCostCenterUsed === 'UNUSED') {
      expReport.costCenterName = null;
      expReport.costCenterCode = '';
      expReport.costCenterHistoryId = null;
    }
    expReport.records.forEach((record) => {
      if (record.items[0].taxTypeBaseId === 'noIdSelected') {
        const selectedTaxType = get(
          defaultTaxType,
          `${record.items[0].expTypeId}.${record.recordDate}.0`
        );
        if (selectedTaxType) {
          record.items[0].taxTypeBaseId = selectedTaxType.baseId;
          record.items[0].taxTypeHistoryId = selectedTaxType.historyId;
          record.items[0].taxTypeName = selectedTaxType.name;
        }
      }
      // if report cleared cc/job or sync to record's value, reset record's cc/job so that record will follow report
      if (
        !costCenterHistoryId ||
        record.items[0].costCenterHistoryId === costCenterHistoryId
      ) {
        record.items[0].costCenterHistoryId = null;
        record.items[0].costCenterCode = '';
        record.items[0].costCenterName = '';
      }
      if (!jobId || record.items[0].jobId === jobId) {
        record.items[0].jobId = null;
        record.items[0].jobName = '';
        record.items[0].jobCode = '';
      }

      const [_, ...childItemList] = record.items;
      childItemList.forEach((item: RecordItem) => {
        if (!costCenterHistoryId) {
          item.costCenterHistoryId = null;
          item.costCenterCode = '';
          item.costCenterName = '';
        }
        if (!jobId) {
          item.jobId = null;
          item.jobName = '';
          item.jobCode = '';
        }
      });
    });

    const isReportFromRequest = !expReport.reportId && expReport.preRequestId;
    const { subRoleId, employeeId, companyId, tabCompanyId, subroleIds } =
      stateProps;
    if (subRoleId) expReport.empHistoryId = subRoleId;

    if (isReportFromRequest) {
      return dispatchProps.createReportFromRequest(
        expReport,
        reportTypeList,
        employeeId,
        { ...(!isEmpty(subroleIds) ? { empHistoryIds: subroleIds } : {}) },
        subRoleId
      );
    } else {
      const isApproval = stateProps.selectedTab % 2 === 1;
      // if tabCompanyId and companyId is different
      // means subrole from different company was used to create the report
      const isTabAndReportSameCompany =
        (tabCompanyId === companyId || isProxyMode) && !isApproval;
      return dispatchProps
        .saveExpReport(
          expReport,
          reportTypeList,
          stateProps.expReportList,
          stateProps.reportIdList,
          employeeId,
          isTabAndReportSameCompany
        )
        .then((res) => {
          if (!isTabAndReportSameCompany)
            dispatchProps.changeListTab(undefined, companyId, true);
          return res;
        });
    }
  },
  updateLinkedExpTypeIds: (report) => {
    // if report type or record date changed, search the report type to get linked expense type
    const {
      apActive,
      companyId,
      selectedExpReport: { accountingDate, expReportTypeId },
    } = stateProps;
    if (
      accountingDate !== report.accountingDate ||
      expReportTypeId !== report.expReportTypeId
    ) {
      dispatchProps.setReportTypeLoading(true);
      dispatchProps
        .getReportTypeWithLinkedExpType(
          report,
          apActive,
          companyId,
          stateProps.subRoleId
        )
        .then((res) => {
          dispatchProps.setAvailableExpType(res.expTypeIds || []);
          dispatchProps.setReportTypeLoading(false);
        });
    }
  },
  saveRecord: (selectedRecord, reportTypeList, defaultTaxType, report) => {
    const record = cloneDeep(selectedRecord);
    if (record.items[0].taxTypeBaseId === 'noIdSelected') {
      const selectedTaxType = get(
        defaultTaxType,
        `${record.items[0].expTypeId}.${record.recordDate}.0`,
        {}
      );
      record.items[0].taxTypeBaseId = selectedTaxType.baseId;
      record.items[0].taxTypeHistoryId = selectedTaxType.historyId;
      record.items[0].taxTypeName = selectedTaxType.name;
      record.items[0].taxRate = selectedTaxType.rate;
    }

    if (record.items[0].useForeignCurrency) {
      const targetCurrency = find(stateProps.foreignCurrency, [
        'id',
        record.items[0].currencyId,
      ]);
      const currencyCode = get(targetCurrency, 'isoCurrencyCode');
      if (record.items[0].currencyInfo) {
        record.items[0].currencyInfo.code = currencyCode;
      }
    }
    // record using multiple fixed amount record type
    const selectedFixedAmountId = record.items[0].fixedAllowanceOptionId;
    if (selectedFixedAmountId) {
      const amountOption = get(
        stateProps.fixedAmountOptionList,
        `${record.items[0].expTypeId}`
      );
      const selectedAmount = find(amountOption, ['id', selectedFixedAmountId]);
      record.items[0].fixedAllowanceOptionLabel = get(
        selectedAmount,
        'label_L0'
      );
    }

    const expType =
      stateProps.expenseTypeList.find(
        (x) => x.id === record.items[0].expTypeId
      ) || {};
    record.items[0].expTypeDescription = expType.description;

    // When sync record's cc job to report value, reset record's value so that follow report
    const { costCenterHistoryId: reportCCId, jobId: reportJobId } = report;

    if (reportCCId && record.items[0].costCenterHistoryId === reportCCId) {
      record.items[0].costCenterHistoryId = null;
      record.items[0].costCenterCode = '';
      record.items[0].costCenterName = '';
    }
    if (reportJobId && record.items[0].jobId === reportJobId) {
      record.items[0].jobId = null;
      record.items[0].jobName = '';
      record.items[0].jobCode = '';
    }

    // sync child item's cc job to parent value, reset child item's value so that follow parent
    const [_, ...childItemList] = record.items;
    childItemList.forEach((item: RecordItem) => {
      const parentItemCCHistoryId =
        record.items[0].costCenterHistoryId || reportCCId;
      const parentItemJobId = record.items[0].jobId || reportJobId;

      if (item.costCenterHistoryId === parentItemCCHistoryId) {
        item.costCenterHistoryId = null;
        item.costCenterCode = '';
        item.costCenterName = '';
      }
      if (item.jobId === parentItemJobId) {
        item.jobId = null;
        item.jobName = '';
        item.jobCode = '';
      }
      delete item.tempUUID;
    });

    // reset values if witholding tax usage is changed to NotUsed
    if (!isUseWithholdingTax(record.withholdingTaxUsage)) {
      record.items[0].amountPayable = null;
      record.items[0].withholdingTaxAmount = null;
    }

    // reset jct values if invoice option is not Invoice
    if (
      record.items[0].jctInvoiceOption &&
      record.items[0].jctInvoiceOption !== JCT_NUMBER_INVOICE.Invoice &&
      record.items[0].jctRegistrationNumber
    ) {
      record.items[0].jctRegistrationNumber = null;
    }

    dispatchProps.saveExpRecord(
      record,
      reportTypeList,
      report,
      stateProps.employeeId,
      false,
      stateProps.subRoleId,
      stateProps.alwaysDisplaySettlementAmount
    );
  },
  searchPaymentMethodList: (currExpReportTypeId: string) => {
    const { companyId, reportTypeList, selectedExpReport } = stateProps;
    const { expReportTypeId: prevExpReportTypeId, reportId } =
      selectedExpReport;
    const isNewReport = !reportId;
    if (isNewReport || prevExpReportTypeId !== currExpReportTypeId) {
      const { paymentMethodIds } =
        reportTypeList.find(({ id }) => id === currExpReportTypeId) || {};
      dispatchProps.searchPaymentMethodList(
        paymentMethodIds || [],
        companyId,
        true
      );
    }
  },
  saveMultiRecord: async (report: Report, isUseCashAdvance = false) => {
    const { bulkEditRemoveIds, selectedExpReport } = stateProps;
    await dispatchProps.saveBulkRecord(
      bulkEditRemoveIds,
      selectedExpReport.records,
      report,
      isUseCashAdvance || stateProps.alwaysDisplaySettlementAmount
    );
  },
});

const expensesRequestForm = withFormik<FormProps, FormikValues>({
  // permission for change by props update (when initialised by reducer)
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const selectedAccountingPeriod = find(props.accountingPeriodAll, {
      id: props.selectedExpReport.accountingPeriodId,
    });
    return {
      ui: {
        checkboxes: [],
        bulkRecordIdx: -1,
        recordIdx: -1,
        recalc: false,
        saveMode: false,
        isBulkEditMode: props.isBulkEditMode,
        isRecordBulkSave: false,
        isRecordSave: false,
        existActiveAp: !isEmpty(props.apActive),
        selectedAccountingPeriod,
      },
      report: props.selectedExpReport,
    };
  },
  validationSchema: schema,
  handleSubmit: (values, { props, setFieldValue, validateForm }) => {
    const { ui, report } = values;
    const { saveMode, isRecordBulkSave, isRecordSave, recordIdx } = ui;
    if (saveMode) {
      if (isRecordBulkSave) {
        props.saveMultiRecord(report, props.isUseCashAdvance);
      } else if (isRecordSave) {
        const currentRecord = {
          ...report.records[recordIdx],
          useCashAdvance: props.isUseCashAdvance,
        };
        // save single Record
        props.saveRecord(
          currentRecord,
          props.reportTypeList,
          props.taxTypeListForSaving,
          report
        );
      } else {
        // get linked expense type by report type
        props.updateLinkedExpTypeIds(report);
        // save whole report without records
        props
          .onClickSaveButton(
            report,
            props.reportTypeList,
            props.taxTypeListForSaving
          )
          .then(() => {
            validateForm();
            const isChangeReportType =
              props.selectedExpReport.expReportTypeId !==
              values.report.expReportTypeId;
            const originalReportType = find(props.reportTypeList, [
              'id',
              props.selectedExpReport.expReportTypeId,
            ]);
            const hasPaymentMethodInOriginal =
              get(originalReportType, 'paymentMethodIds', []).length > 0;
            if (
              values.report.reportId &&
              isChangeReportType &&
              hasPaymentMethodInOriginal
            ) {
              props.fetchExpReport(
                status,
                report.reportId,
                props.reportTypeList,
                props.employeeId,
                props.defaultCostCenter,
                props.tabCompanyId,
                props.apActive
              );
            } else {
              props.searchPaymentMethodList(report.expReportTypeId);
            }
          })
          .catch((err) => {
            props.showToastWithType(err.message, 4000, 'error');
          });
      }
    } else if (report.records.length === 0) {
      props.catchApiError(
        {
          errorCode: 'INVALID_PARAMETER',
          message: msg().Exp_Err_SubmitReportNoRecords,
          stackTrace: null,
        },
        { isContinuable: true }
      );
    }
    setFieldValue('ui', {
      ...ui,
      saveMode: false,
      isRecordSave: false,
      submitMode: false,
    });
  },
})(withLoadingHOC(RequestFormView));

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(expensesRequestForm) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
