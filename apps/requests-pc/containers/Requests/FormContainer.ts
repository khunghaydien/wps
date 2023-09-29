import { connect } from 'react-redux';

import { withFormik } from 'formik';
import { cloneDeep, find, get } from 'lodash';

import schema from '../../schema/ExpensesRequest';

import { confirm } from '../../../commons/actions/app';
import RequestFormView, {
  Props as FormProps,
  Values as FormikValues,
} from '../../../commons/components/exp/Form';
import withLoadingHOC from '../../../commons/components/withLoading';
import msg from '../../../commons/languages';
import { selectors as appSelectors } from '../../../commons/modules/app';
import DateUtil from '@apps/commons/utils/DateUtil';

import { JCT_NUMBER_INVOICE } from '@apps/domain/models/exp/JCTNo';

import { setAvailableExpType } from '../../../domain/modules/exp/expense-type/availableExpType';
import { actions as activeDialogActions } from '../../modules/ui/expenses/dialog/activeDialog';
import { actions as commentActions } from '../../modules/ui/expenses/dialog/approval/comment';
import { actions as errorActions } from '../../modules/ui/expenses/dialog/approval/error';
import { actions as modeActions, modes } from '../../modules/ui/expenses/mode';
import { actions as overlapActions } from '../../modules/ui/expenses/overlap';
import { set as setReportTypeLoading } from '../../modules/ui/expenses/reportTypeLoading';
import { actions as viewAction } from '../../modules/ui/expenses/view';
import { updateRecordDate } from '@apps/domain/modules/exp/recordDate';

import { openApprovalHistoryDialog } from '../../action-dispatchers/Dialog';
import { getReportTypeWithLinkedExpType } from '../../action-dispatchers/ReportType';
import {
  deleteExpReport,
  saveExpRecord,
  saveExpReport,
} from '../../action-dispatchers/Requests';

const mapStateToProps = (state) => ({
  isLoading: appSelectors.loadingSelector(state),
  loadingHint: state.common.app.loadingHint,
  loadingAreas: state.common.app.loadingAreas,
  isLoaderOverride: true,
  overlap: state.ui.expenses.overlap,
  mode: state.ui.expenses.mode,
  selectedExpReport: state.ui.expenses.selectedExpReport,
  expenseTypeList: state.entities.exp.expenseType.list,
  taxTypeListForSaving: state.ui.expenses.recordItemPane.tax,
  reportTypeList: state.entities.exp.expenseReportType.list.active,
  isExpense: false,
  isRequest: true,
  availableExpType: state.entities.exp.expenseType.availableExpType,
  expReportList: state.entities.exp.preRequest.expReportList,
  reportIdList: state.entities.reportIdList.reportIdList,
  foreignCurrency: state.ui.expenses.recordItemPane.foreignCurrency.currency,
  employeeId: state.userSetting.employeeId,
  companyId: state.userSetting.companyId,
  fixedAmountOptionList: state.ui.expenses.recordItemPane.fixedAmountOption,
});

const mapDispatchToProps = {
  clearComments: commentActions.clear,
  confirm,
  moveBackToReport: overlapActions.nonOverlapReport,
  onClickDeleteButton: deleteExpReport,
  onClickSubmitButton: activeDialogActions.approval,
  openApprovalHistoryDialog,
  openCancelDialog: activeDialogActions.cancelRequest,
  reportEdit: modeActions.reportEdit,
  reportSelect: modeActions.reportSelect,
  saveExpReport,
  saveExpRecord,
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
  onClickCancelRequestButton: () => {
    dispatchProps.clearComments();
    dispatchProps.openCancelDialog();
  },
  onClickApprovalHistoryButton: () =>
    dispatchProps.openApprovalHistoryDialog(
      stateProps.selectedExpReport.requestId
    ),
  onClickBackButton: () => {
    dispatchProps.updateRecordDate(DateUtil.getToday());
    if (stateProps.mode === modes.REPORT_EDIT) {
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
      return;
    }
    expReport.expReportTypeName = selectedExpReportType.name;
    // if cost center is unused, remove the default cost center
    const isCostCenterUsed = selectedExpReportType.isCostCenterRequired;
    if (isCostCenterUsed === 'UNUSED') {
      expReport.costCenterName = null;
      expReport.costCenterCode = '';
      expReport.costCenterHistoryId = null;
    }
    expReport.attachedFileData = null;
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
        } else {
          record.items[0].taxTypeBaseId = null;
          record.items[0].taxTypeHistoryId = null;
          record.items[0].taxTypeName = null;
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
    dispatchProps.saveExpReport(
      expReport,
      reportTypeList,
      stateProps.expReportList,
      stateProps.reportIdList,
      stateProps.employeeId
    );
  },
  saveRecord: (selectedRecord, reportTypeList, defaultTaxType, report) => {
    const record = cloneDeep(selectedRecord);
    record.receiptData = null;
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
      record.items[0].currencyInfo.code = currencyCode;
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
      stateProps.employeeId
    );
  },
  updateLinkedExpTypeIds: (report) => {
    // if report type or scheduled date changed, search the report type to get linked expense type
    const {
      companyId,
      selectedExpReport: { scheduledDate, expReportTypeId },
    } = stateProps;
    if (
      scheduledDate !== report.scheduledDate ||
      expReportTypeId !== report.expReportTypeId
    ) {
      dispatchProps.setReportTypeLoading(true);
      dispatchProps
        .getReportTypeWithLinkedExpType(report, companyId)
        .then((res) => {
          dispatchProps.setAvailableExpType(res.expTypeIds || []);
          dispatchProps.setReportTypeLoading(false);
        });
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
  validationSchema: schema,
  handleSubmit: (values, { props, setFieldValue }) => {
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
        props.onClickSaveButton(
          values.report,
          props.reportTypeList,
          props.taxTypeListForSaving
        );
      }
    }
    setFieldValue('ui.saveMode', false);
    setFieldValue('ui.isRecordSave', false);
    setFieldValue('ui.submitMode', false);
  },
})(withLoadingHOC(RequestFormView));

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(expensesRequestForm) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
