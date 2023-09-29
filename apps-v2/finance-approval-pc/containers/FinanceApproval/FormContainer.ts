import { connect } from 'react-redux';

import { withFormik } from 'formik';
import { cloneDeep, get, isNil } from 'lodash';

import { recordDateWithCheckWorkingDaysCheck } from '../../../commons/schema/Expense';
import expenseSchema from '@apps/expenses-pc/schema/ExpensesRequest';
import requestSchema from '@apps/requests-pc/schema/ExpensesRequest';

import { confirm } from '../../../commons/actions/app';
import RequestFormView, {
  Props as FormProps,
  Values as FormikValues,
} from '../../../commons/components/exp/Form';
import msg from '../../../commons/languages';
import MileageFormContainer from '@apps/commons/containers/exp/MileageFormContainer';
import { selectors as appSelectors } from '@commons/modules/app';

import { JCT_NUMBER_INVOICE } from '@apps/domain/models/exp/JCTNo';
import { MileageUnit } from '@apps/domain/models/exp/Mileage';
import { isUseWithholdingTax } from '@apps/domain/models/exp/Record';

import { actions as commentActions } from '../../../expenses-pc/modules/ui/expenses/dialog/approval/comment';
import { actions as errorActions } from '../../../expenses-pc/modules/ui/expenses/dialog/approval/error';
import {
  actions as modeActions,
  modes,
} from '../../../expenses-pc/modules/ui/expenses/mode';
import { actions as overlapActions } from '../../../expenses-pc/modules/ui/expenses/overlap';
import { actions as workingDaysActions } from '../../../expenses-pc/modules/ui/expenses/recordItemPane/workingDays';
import { actions as activeDialogActions } from '../../modules/ui/FinanceApproval/dialog/activeDialog';
import { actions as nameActions } from '../../modules/ui/FinanceApproval/dialog/searchCondition/name';
import { isRequestTab } from '@apps/finance-approval-pc/modules/ui/FinanceApproval/tabs';
import { actions as requestModeActions } from '@apps/requests-pc/modules/ui/expenses/mode';

import {
  openApprovalHistoryDialog,
  openEditHistoryDialog,
} from '../../../expenses-pc/action-dispatchers/Dialog';
import { deleteExpReport } from '../../../expenses-pc/action-dispatchers/Expenses';
import {
  approve as approveFA,
  fetchExpRequest,
  reject as rejectFA,
  saveExpRecord,
  saveExpReport,
  savePreRequestRecord,
  savePreRequestReport,
} from '../../action-dispatchers/FinanceApproval';
import {
  openApprovalHistoryDialog as openApprovalRequestHistoryDialog,
  openEditHistoryDialog as openEditRequestHistoryDialog,
} from '@apps/requests-pc/action-dispatchers/Dialog';

import {
  BaseCurrencyContainer,
  ForeignCurrencyContainer,
  RecordItemContainer,
  RecordListContainer,
  ReportSummaryContainer,
  RouteFormContainer,
  SuggestContainer,
} from '../../../expenses-pc/containers/Expenses';
import DialogContainer from '../../containers/FinanceApproval/DialogContainer';
import {
  BaseCurrencyContainer as RequestBaseCurrencyContainer,
  ForeignCurrencyContainer as RequestForeignCurrencyContainer,
  RecordItemContainer as RequestRecordItemContainer,
  RecordListContainer as RequestRecordListContainer,
  ReportSummaryContainer as RequestReportSummaryContainer,
  RouteFormContainer as RequestRouteFormContainer,
  SuggestContainer as RequestSuggestContainer,
} from '@apps/requests-pc/containers/Requests';

const mapStateToProps = (state) => {
  const requestIdList = state.entities.requestIdList;
  const selectedRequestId = state.ui.expenses.selectedExpReport.requestId;
  const currentRequestIdx = selectedRequestId
    ? requestIdList && requestIdList.requestIdList.indexOf(selectedRequestId)
    : -1;
  const companyList = state.entities.companyList;
  const selectedCompanyId =
    state.ui.FinanceApproval.companySwitch || state.userSetting.companyId;
  const selectedComIndex = companyList.findIndex(
    ({ value }) => value === selectedCompanyId
  );
  const {
    currencyCode = '',
    currencySymbol = '',
    currencyDecimalPlaces = null,
    expMileageUnit = MileageUnit.KILOMETER,
  } = selectedComIndex > -1 ? companyList[selectedComIndex] : {};

  const selectedTab = state.ui.FinanceApproval.tabs.selected;
  const isFAExpenseTab = !isRequestTab(selectedTab);
  const { preRequestId } = state.ui.expenses.selectedExpReport;
  const { reportId } = state.entities.exp.preRequest.expReport;

  const isHighlightSetting =
    state.userSetting.highlightExpReqRepDiff &&
    preRequestId &&
    preRequestId === reportId && // hide highlight when navigating between reports
    isFAExpenseTab && // hide highlight for request tab
    !(
      state.ui.expenses.mode === modes.REPORT_EDIT ||
      state.ui.expenses.mode === modes.FINANCE_REPORT_EDITED
    );

  return {
    availableExpType: state.entities.exp.expenseType.availableExpType,
    currencyCode,
    currencySymbol,
    expMileageUnit,
    currencyDecimalPlaces,
    selectedCompanyId,
    currentRequestIdx,
    isFinanceApproval: true,
    isFAExpenseTab,
    mode: state.ui.expenses.mode,
    overlap: state.ui.expenses.overlap,
    requestList: state.entities.requestList,
    selectedRequestId,
    requestIdList,
    selectedExpReport: state.ui.expenses.selectedExpReport,
    selectedExpPreRequest: state.entities.exp.preRequest.expReport,
    reportTypeList: state.entities.exp.expenseReportType.list.active,
    reportTypeListInactive: state.entities.exp.expenseReportType.list.inactive,
    taxTypeListForSaving: state.ui.expenses.recordItemPane.tax,
    orderBy: state.ui.FinanceApproval.RequestList.orderBy,
    sortBy: state.ui.FinanceApproval.RequestList.sortBy,
    apActive: state.ui.expenses.recordListPane.accountingPeriod.filter(
      (ap) => ap.active
    ),
    isUseAttendance: state.userSetting.useAttendance,
    loadingHint: state.common.app.loadingHint,
    employeeId: state.userSetting.employeeId,
    expAttendanceValidation: state.userSetting.expAttendanceValidation,
    isHighlightSetting,
    paymentMethodList: state.common.exp.entities.paymentMethodList,
    isApexView: state.ui.FinanceApproval.isApexView,
    showLoading: appSelectors.loadingSelector(state),
  };
};

const mapDispatchToProps = {
  approveFA,
  changeModetoSelect: modeActions.reportSelect,
  requestChangeModetoSelect: requestModeActions.reportSelect,
  clearComments: commentActions.clear,
  confirm,
  fetchExpRequest,
  moveBackToReport: overlapActions.nonOverlapReport,
  onChangeComment: nameActions.set,
  onClickDeleteButton: deleteExpReport,
  onClickSubmitButton: activeDialogActions.approval,
  openConfirmApprovalDialog: activeDialogActions.confirmApproval,
  openApprovalHistoryDialog,
  openApprovalRequestHistoryDialog,
  openCancelDialog: activeDialogActions.cancelRequest,
  openEditHistoryDialog,
  openEditRequestHistoryDialog,
  openRejectFADialog: activeDialogActions.rejectFADialog,
  rejectFA,
  reportEdit: modeActions.reportEdit,
  requestReportEdit: requestModeActions.reportEdit,
  setFinanceReportEdited: modeActions.setFinanceReportEdited,
  requestSetFinanceReportEdited: requestModeActions.setFinanceReportEdited,
  saveExpReport,
  savePreRequestReport,
  saveExpRecord,
  savePreRequestRecord,
  checkWorkingDays: workingDaysActions.check,
  setApprovalError: errorActions.set,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  recordList: stateProps.isFAExpenseTab
    ? RecordListContainer
    : RequestRecordListContainer,
  recordItem: stateProps.isFAExpenseTab
    ? RecordItemContainer
    : RequestRecordItemContainer,
  reportSummary: stateProps.isFAExpenseTab
    ? ReportSummaryContainer
    : RequestReportSummaryContainer,
  baseCurrency: stateProps.isFAExpenseTab
    ? BaseCurrencyContainer
    : RequestBaseCurrencyContainer,
  foreignCurrency: stateProps.isFAExpenseTab
    ? ForeignCurrencyContainer
    : RequestForeignCurrencyContainer,
  routeForm: stateProps.isFAExpenseTab
    ? RouteFormContainer
    : RequestRouteFormContainer,
  mileageForm: MileageFormContainer,
  dialog: DialogContainer,
  suggest: stateProps.isFAExpenseTab
    ? SuggestContainer
    : RequestSuggestContainer,

  onClickRejectButton: () => {
    dispatchProps.openRejectFADialog();
  },
  onClickApproveButton: () => {
    dispatchProps.openConfirmApprovalDialog();
    const {
      selectedExpReport,
      isUseAttendance,
      isFAExpenseTab,
      expAttendanceValidation,
    } = stateProps;

    const isUseCashAdvance =
      !isNil(selectedExpReport.settAmount) &&
      !isNil(selectedExpReport.settResult);

    if (isUseAttendance && !isUseCashAdvance && isFAExpenseTab) {
      const recordDates = selectedExpReport.records.map(
        (record) => record.recordDate
      );
      const workingDays = recordDates.filter(
        (x, i, self) => self.indexOf(x) === i
      );

      if (expAttendanceValidation) {
        dispatchProps
          .checkWorkingDays(workingDays, selectedExpReport.employeeBaseId)
          .then(({ payload }) => {
            const errors = recordDateWithCheckWorkingDaysCheck(
              { report: selectedExpReport },
              payload
            );
            dispatchProps.setApprovalError({ records: errors });
          });
      }
    }
  },
  onClickEditHistoryButton: () => {
    const { requestId } = stateProps.selectedExpReport;
    const dispatchOpenEditHistoryDialog = stateProps.isFAExpenseTab
      ? dispatchProps.openEditHistoryDialog
      : dispatchProps.openEditRequestHistoryDialog;
    dispatchOpenEditHistoryDialog(requestId);
  },
  onClickDeleteButton: () => {
    dispatchProps.confirm(msg().Appr_Msg_RequestConfirmRemove, (yes) => {
      if (yes) {
        dispatchProps.onClickDeleteButton(
          stateProps.selectedExpReport.reportId
        );
      }
    });
  },
  onClickCancelRequestButton: () => {
    dispatchProps.clearComments();
    dispatchProps.openCancelDialog();
  },
  onClickApprovalHistoryButton: () => {
    const dispatchOpenApprovalHistoryDialog = stateProps.isFAExpenseTab
      ? dispatchProps.openApprovalHistoryDialog
      : dispatchProps.openApprovalRequestHistoryDialog;
    dispatchOpenApprovalHistoryDialog(stateProps.selectedExpReport.requestId);
  },
  onClickBackButton: () => {
    const dispatchChangeModeToSelect = stateProps.isFAExpenseTab
      ? dispatchProps.changeModetoSelect
      : dispatchProps.requestChangeModetoSelect;
    // only display when report has been edited. Otherwise back to select mode
    if (stateProps.mode === modes.FINANCE_REPORT_EDITED) {
      dispatchProps.confirm(msg().Common_Confirm_DiscardEdits, (yes) => {
        if (yes) {
          dispatchChangeModeToSelect();
        }
      });
    } else {
      dispatchChangeModeToSelect();
    }
  },
  onClickSaveButton: (expReport, reportTypeListAll, defaultTaxType) => {
    const { costCenterHistoryId, jobId } = expReport;
    expReport.attachedFileData = null;
    expReport.records.forEach((record) => {
      if (record.items[0].taxTypeBaseId === 'noIdSelected') {
        const selectedTaxType = get(
          defaultTaxType,
          `${record.items[0].expTypeId}.${record.recordDate}.0`,
          {}
        );
        record.items[0].taxTypeBaseId = selectedTaxType.baseId;
        record.items[0].taxTypeHistoryId = selectedTaxType.historyId;
        record.items[0].taxTypeName = selectedTaxType.name;
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
    });
    const dispatchSaveReport = stateProps.isFAExpenseTab
      ? dispatchProps.saveExpReport
      : dispatchProps.savePreRequestReport;
    dispatchSaveReport(
      expReport,
      stateProps.sortBy,
      stateProps.orderBy,
      stateProps.selectedCompanyId,
      reportTypeListAll
    );
  },
  saveRecord: (
    selectedRecord,
    reportTypeListAll,
    defaultTaxType,
    reportId,
    requestId,
    reportTypeId
  ) => {
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

    // When sync record's cc job to report value, reset record's value so that follow report
    const { costCenterHistoryId: reportCCId, jobId: reportJobId } =
      stateProps.selectedExpReport;
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

    const dispatchSaveRecord = stateProps.isFAExpenseTab
      ? dispatchProps.saveExpRecord
      : dispatchProps.savePreRequestRecord;
    dispatchSaveRecord(
      record,
      stateProps.sortBy,
      stateProps.orderBy,
      reportId,
      requestId,
      reportTypeId,
      stateProps.selectedCompanyId,
      stateProps.employeeId,
      reportTypeListAll
    );
  },
  reportEdit: () => {
    if (stateProps.isFAExpenseTab) {
      dispatchProps.reportEdit();
    } else {
      dispatchProps.requestReportEdit();
    }
  },
  setFinanceReportEdited: () => {
    if (stateProps.isFAExpenseTab) {
      dispatchProps.setFinanceReportEdited();
    } else {
      dispatchProps.requestSetFinanceReportEdited();
    }
  },
});

const expensesRequestForm = withFormik<FormProps, FormikValues>({
  // permission for change by props update (when initialised by reducer)
  enableReinitialize: true,
  mapPropsToValues: (props) => ({
    ui: {
      checkboxes: [],
      recordIdx: -1,
      recalc: false,
      saveMode: false,
      isRecordSave: false,
      submitMode: false,
    },
    report: props.selectedExpReport,
  }),
  validationSchema: (props) =>
    props.isFAExpenseTab ? expenseSchema : requestSchema,
  handleSubmit: (values, { props, setFieldValue }) => {
    const { ui, report } = values;
    const { saveMode, isRecordSave, recordIdx } = ui;

    if (saveMode) {
      const reportTypeListAll = [
        ...props.reportTypeList,
        ...props.reportTypeListInactive,
      ];
      if (isRecordSave) {
        const selectedReportType =
          props.reportTypeList.find(
            ({ id }) => id === report.expReportTypeId
          ) || {};
        const useCashAdvance = get(selectedReportType, 'useCashAdvance');
        const currentRecord = report.records[recordIdx];

        const record = {
          ...currentRecord,
          useCashAdvance,
        };
        // save single Record
        props.saveRecord(
          record,
          reportTypeListAll,
          props.taxTypeListForSaving,
          report.reportId,
          report.requestId,
          report.expReportTypeId
        );
      } else {
        // save whole report without records
        props.onClickSaveButton(
          values.report,
          reportTypeListAll,
          props.taxTypeListForSaving
        );
      }
    } else {
      props.onClickSubmitButton();
    }
    setFieldValue('ui.saveMode', false);
    setFieldValue('ui.isRecordSave', false);
    setFieldValue('ui.submitMode', false);
  },
})(RequestFormView);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(expensesRequestForm) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
