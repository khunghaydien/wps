import { connect } from 'react-redux';

import { withFormik } from 'formik';
import { cloneDeep, get } from 'lodash';

import { recordDateWithCheckWorkingDaysCheck } from '../../../commons/schema/Expense';
import schema from '../../../expenses-pc/schema/ExpensesRequest';

import { confirm } from '../../../commons/actions/app';
import RequestFormView, {
  Props as FormProps,
  Values as FormikValues,
} from '../../../commons/components/exp/Form';
import msg from '../../../commons/languages';

import { JCT_NUMBER_INVOICE } from '@apps/domain/models/exp/JCTNo';

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
} from '../../action-dispatchers/FinanceApproval';

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
  } = selectedComIndex > -1 ? companyList[selectedComIndex] : {};

  return {
    currencyCode,
    currencySymbol,
    currencyDecimalPlaces,
    selectedCompanyId,
    currentRequestIdx,
    isFinanceApproval: true,
    mode: state.ui.expenses.mode,
    overlap: state.ui.expenses.overlap,
    requestList: state.entities.requestList,
    selectedRequestId,
    requestIdList,
    selectedExpReport: state.ui.expenses.selectedExpReport,
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
  };
};

const mapDispatchToProps = {
  approveFA,
  changeModetoSelect: modeActions.reportSelect,
  clearComments: commentActions.clear,
  confirm,
  fetchExpRequest,
  moveBackToReport: overlapActions.nonOverlapReport,
  onChangeComment: nameActions.set,
  onClickDeleteButton: deleteExpReport,
  onClickSubmitButton: activeDialogActions.approval,
  openConfirmApprovalDialog: activeDialogActions.confirmApproval,
  openApprovalHistoryDialog,
  openCancelDialog: activeDialogActions.cancelRequest,
  openEditHistoryDialog,
  openRejectFADialog: activeDialogActions.rejectFADialog,
  rejectFA,
  reportEdit: modeActions.reportEdit,
  setFinanceReportEdited: modeActions.setFinanceReportEdited,
  saveExpReport,
  saveExpRecord,
  checkWorkingDays: workingDaysActions.check,
  setApprovalError: errorActions.set,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  recordList: RecordListContainer,
  recordItem: RecordItemContainer,
  reportSummary: ReportSummaryContainer,
  baseCurrency: BaseCurrencyContainer,
  foreignCurrency: ForeignCurrencyContainer,
  routeForm: RouteFormContainer,
  dialog: DialogContainer,
  suggest: SuggestContainer,

  onClickRejectButton: () => {
    dispatchProps.openRejectFADialog();
  },
  onClickApproveButton: () => {
    dispatchProps.openConfirmApprovalDialog();
    const { selectedExpReport, isUseAttendance, expAttendanceValidation } =
      stateProps;
    if (isUseAttendance) {
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
  onClickEditHistoryButton: () =>
    dispatchProps.openEditHistoryDialog(stateProps.selectedExpReport.requestId),
  onClickDeleteButton: () => {
    dispatchProps.confirm(msg().Att_Msg_DailyReqConfirmRemove, (yes) => {
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
  onClickApprovalHistoryButton: () =>
    dispatchProps.openApprovalHistoryDialog(
      stateProps.selectedExpReport.requestId
    ),
  onClickBackButton: () => {
    // only display when report has been edited. Otherwise back to select mode
    if (stateProps.mode === modes.FINANCE_REPORT_EDITED) {
      dispatchProps.confirm(msg().Common_Confirm_DiscardEdits, (yes) => {
        if (yes) {
          dispatchProps.changeModetoSelect();
        }
      });
    } else {
      dispatchProps.changeModetoSelect();
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
    dispatchProps.saveExpReport(
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
  validationSchema: schema,
  handleSubmit: (values, { props, setFieldValue }) => {
    const { ui, report } = values;
    const { saveMode, isRecordSave, recordIdx } = ui;

    if (saveMode) {
      const reportTypeListAll = [
        ...props.reportTypeList,
        ...props.reportTypeListInactive,
      ];
      if (isRecordSave) {
        const currentRecord = report.records[recordIdx];

        // save single Record
        props.saveRecord(
          currentRecord,
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
