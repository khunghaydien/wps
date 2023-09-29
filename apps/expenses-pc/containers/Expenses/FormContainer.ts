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
import DateUtil from '@apps/commons/utils/DateUtil';

import { JCT_NUMBER_INVOICE } from '@apps/domain/models/exp/JCTNo';

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
import { updateRecordDate } from '@apps/domain/modules/exp/recordDate';

import {
  openApprovalHistoryDialog,
  openEditHistoryDialog,
} from '../../action-dispatchers/Dialog';
import {
  createReportFromRequest,
  deleteExpReport,
  discardApprovedRequest,
  saveExpRecord,
  saveExpReport,
} from '../../action-dispatchers/Expenses';
import { getReportTypeWithLinkedExpType } from '../../action-dispatchers/ReportType';

const mapStateToProps = (state) => ({
  isLoading: appSelectors.loadingSelector(state),
  loadingAreas: state.common.app.loadingAreas,
  loadingHint: state.common.app.loadingHint,
  overlap: state.ui.expenses.overlap,
  reportTypeList: state.entities.exp.expenseReportType.list.active,
  selectedExpReport: state.ui.expenses.selectedExpReport,
  availableExpType: state.entities.exp.expenseType.availableExpType,
  expenseTypeList: state.entities.exp.expenseType.list,
  taxTypeListForSaving: state.ui.expenses.recordItemPane.tax,
  isExpense: true,
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
  accountingPeriodAll: state.ui.expenses.recordListPane.accountingPeriod,
});

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
  reportEdit: modeActions.reportEdit,
  reportSelect: modeActions.reportSelect,
  saveExpReport,
  saveExpRecord,
  showToastWithType,
  createReportFromRequest,
  discardApprovedRequest,
  checkWorkingDays: workingDaysActions.check,
  fixFiles: requestActions.fixFiles,
  setListView: viewAction.setListView,
  setApprovalError: errorActions.set,
  setAvailableExpType,
  setReportTypeLoading,
  getReportTypeWithLinkedExpType,
  updateRecordDate,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onClickSubmitButton: (values) => {
    if (values.report.records.length === 0) {
      dispatchProps.catchApiError(
        {
          errorCode: 'INVALID_PARAMETER',
          message: msg().Exp_Err_SubmitReportNoRecords,
          stackTrace: null,
        },
        { isContinuable: true }
      );
    } else {
      dispatchProps.openApprovalDialog();
      dispatchProps.fixFiles(stateProps.selectedExpReport.reportId);
      if (stateProps.isUseAttendance) {
        const recordDates = stateProps.selectedExpReport.records.map(
          (record) => record.recordDate
        );
        const workingDays = recordDates.filter(
          (x, i, self) => self.indexOf(x) === i
        );
        if (stateProps.expAttendanceValidation) {
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
  },
  onClickDeleteButton: () => {
    dispatchProps.confirm(msg().Att_Msg_DailyReqConfirmRemove, (yes) => {
      if (yes) {
        dispatchProps.onClickDeleteButton(
          stateProps.selectedExpReport.reportId,
          stateProps.employeeId
        );
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
    const { selectedExpReport } = stateProps;
    const hasReportId = selectedExpReport.reportId;
    const hasPreRequestId = selectedExpReport.preRequestId;
    const isNewPreRequest = hasPreRequestId && !hasReportId;

    dispatchProps.updateRecordDate(DateUtil.getToday());
    if (stateProps.mode === modes.REPORT_EDIT && !isNewPreRequest) {
      dispatchProps.confirm(msg().Common_Confirm_DiscardEdits, (yes) => {
        if (yes) {
          dispatchProps.moveBackToReport();
          dispatchProps.setListView();
          dispatchProps.reportSelect();
        }
      });
    } else {
      dispatchProps.moveBackToReport();
      dispatchProps.setListView();
      dispatchProps.reportSelect();
    }
  },
  onClickSaveButton: (expReport, reportTypeList, defaultTaxType) => {
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
    });

    const isReportFromRequest = !expReport.reportId && expReport.preRequestId;

    if (isReportFromRequest) {
      return dispatchProps.createReportFromRequest(
        expReport,
        reportTypeList,
        stateProps.employeeId
      );
    } else {
      return dispatchProps.saveExpReport(
        expReport,
        reportTypeList,
        stateProps.expReportList,
        stateProps.reportIdList,
        stateProps.employeeId
      );
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
        .getReportTypeWithLinkedExpType(report, apActive, companyId)
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

    // reset jct values if invoice option is not Invoice
    if (
      record.items[0].jctInvoiceOption !== JCT_NUMBER_INVOICE.Invoice &&
      record.items[0].jctRegistrationNumber
    ) {
      record.items[0].jctRegistrationNumber = null;
    }

    dispatchProps.saveExpRecord(
      record,
      reportTypeList,
      report,
      stateProps.employeeId
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
      existActiveAp: !isEmpty(props.apActive),
      selectedAccountingPeriod: find(props.accountingPeriodAll, {
        id: props.selectedExpReport.accountingPeriodId,
      }),
    },
    report: props.selectedExpReport,
  }),
  validationSchema: schema,
  handleSubmit: (values, { props, setFieldValue, validateForm }) => {
    const { ui, report } = values;
    const { saveMode, isRecordSave, recordIdx } = ui;

    if (saveMode) {
      if (isRecordSave) {
        const currentRecord = report.records[recordIdx];

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
          .then(validateForm)
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
