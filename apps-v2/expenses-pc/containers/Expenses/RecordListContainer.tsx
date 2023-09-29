import * as React from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';
import { cloneDeep, find, get, isEmpty, isEqual } from 'lodash';

import { confirm } from '../../../commons/actions/app';
import RecordListView from '../../../commons/components/exp/Form/RecordList';
import IconIcCard from '../../../commons/images/icons/icCard.svg';
import IconVoucherReceipt from '../../../commons/images/icons/iconVoucherReceipt.svg';
import IconVoucherTransit from '../../../commons/images/icons/iconVoucherTransit.svg';
import { showErrorToast, showToast } from '../../../commons/modules/toast';
import DateUtil from '../../../commons/utils/DateUtil';
import msg from '@commons/languages';
import { selectors as appSelectors } from '@commons/modules/app';
import { actions as bulkEditRecordActions } from '@commons/modules/exp/ui/bulkEditRecord';
import { getResetFields } from '@commons/utils/exp/BulkEditUtil';

import {
  CLONE_RECORD_OPTIONS,
  isFixedAllowanceMulti,
  isMileageRecord,
  newRecord,
  Receipt,
  Record as TypeRecord,
  RECORD_TYPE,
} from '../../../domain/models/exp/Record';
import { isShowICCCOptionInDropdown } from '@apps/domain/models/exp/PaymentMethod';
import { calcTotalAmount } from '@apps/domain/models/exp/Report';

import { actions as activeDialogActions } from '../../modules/ui/expenses/dialog/activeDialog';
import { actions as progressBarActions } from '../../modules/ui/expenses/dialog/progressBar';
import { actions as recordCloneActions } from '../../modules/ui/expenses/dialog/recordClone/dialog';
import { actions as modeActions } from '../../modules/ui/expenses/mode';
import { actions as overlapActions } from '../../modules/ui/expenses/overlap';
import { actions as selectedReceiptActions } from '../../modules/ui/expenses/receiptLibrary/selectedReceipt';
import { actions as fixedAmountOptionActions } from '../../modules/ui/expenses/recordItemPane/fixedAmountOption';
// import { actions as openEditMenuActions } from '../../modules/ui/expenses/recordListPane/recordList/openEditMenu';
import { actions as openTitleActions } from '../../modules/ui/expenses/recordListPane/summary/openTitle';
import { actions as selectedExpReportActions } from '../../modules/ui/expenses/selectedExpReport';

import {
  openExpenseTypeDialog,
  openIcTransactionDialog,
  openOCRReceiptLibraryDialog,
  openReceiptLibraryDialog,
  openTransactionSelectionDialog,
} from '../../action-dispatchers/Dialog';
import {
  cloneRecords,
  deleteExpRecord,
  setIsNeedGenerateMapPreview,
} from '../../action-dispatchers/Expenses';
import { getExpenseTypeById } from '../../action-dispatchers/ExpenseType';
import { handleDropFiles } from '../../action-dispatchers/Receipt';

import GridAreaContainer from './BulkEdit/GridAreaContainer';

function getImage() {
  return {
    receipt: () => <IconVoucherReceipt aria-hidden="true" />,

    routeSelected: () => <IconVoucherTransit aria-hidden="true" />,

    hasEvidence: (ROOT, isRoute) => {
      const Icon = isRoute ? IconVoucherTransit : IconVoucherReceipt;
      return (
        <Icon aria-hidden="true" className={`${ROOT}__item__proof--attached`} />
      );
    },

    ic: (ROOT, isNotLinked) => {
      const cssClass = classNames(`${ROOT}__item__ic`, {
        'not-linked': isNotLinked,
      });
      return <IconIcCard aria-hidden="true" className={cssClass} />;
    },
  };
}

// export this common stateProps to reuse in Request and FA Containers
export const mapStateToProps = (state: any, ownProps: any) => {
  const subroleId = get(state, 'ui.expenses.subrole.selectedRole');
  const subroleIds = get(state, 'ui.expenses.subrole.ids');
  const employHistories = get(
    state,
    'common.exp.entities.employeeDetails.details'
  );
  const companyId = state.userSetting.companyId;
  let isPrimaryCompany = true;
  if (!isEmpty(employHistories)) {
    const primaryRole = employHistories.find((h) => h.primary);
    isPrimaryCompany = primaryRole.companyId === companyId;
  }
  // payment method create from record options
  const paymentMethodList = state.common.exp.entities.paymentMethodList;
  const reportTypeList = state.entities.exp.expenseReportType.list.active || [];
  const selectedReportType = reportTypeList.find(
    ({ id }) => id === ownProps.selectedExpReport.expReportTypeId
  );
  const { isShowCCOption = false, isShowICOption = false } = ownProps.isExpense
    ? isShowICCCOptionInDropdown(paymentMethodList, selectedReportType)
    : {};

  const alwaysDisplaySettlementAmount = get(
    state,
    'userSetting.alwaysDisplaySettlementAmount'
  );

  return {
    ...ownProps,
    accountingPeriodAll: state.ui.expenses.recordListPane.accountingPeriod,
    baseCurrencySymbol:
      ownProps.currencySymbol || state.userSetting.currencySymbol,
    baseCurrencyDecimal:
      ownProps.currencyDecimalPlaces || state.userSetting.currencyDecimalPlaces,
    isPrimaryCompany,
    companyId,
    employeeId: state.userSetting.employeeId,
    expenseTypeList: state.entities.exp.expenseType.list,
    getImage,
    mode: state.ui.expenses.mode,
    openEditMenu: state.ui.expenses.recordListPane.recordList.openEditMenu,
    fileMetadata: state.common.exp.entities.fileMetadata,
    fixedAmountOptionList: state.ui.expenses.recordItemPane.fixedAmountOption,
    reportTypeList,
    workingDays: state.ui.expenses.recordItemPane.workingDays,
    overlap: state.ui.expenses.overlap,
    useReceiptScan: state.userSetting.useReceiptScan,
    selectedTab: state.ui.expenses.tab.tabIdx,
    isErrDisplay: !state.ui.expenses.reportTypeLoading,
    subroleId,
    subroleIds,
    isBulkEditMode: state.common.exp.ui.bulkEditRecord.isEnabled,
    bulkEditRemoveIds: state.common.exp.ui.bulkEditRecord.removeIds,
    isLoading: appSelectors.loadingSelector(state),
    isUseBetaFeatures: state.userSetting.useExpBetaFeatures,
    loadingAreas: state.common.app.loadingAreas,
    loadingHint: state.common.app.loadingHint,
    isShowCCOption,
    isShowICOption,
    useTransitManager: state.userSetting.useTransitManager,
    alwaysDisplaySettlementAmount,
    useJctRegistrationNumber: state.userSetting.jctInvoiceManagement,
  };
};

const mapDispatchToProps = {
  overlapRecord: overlapActions.overlapRecord,
  closeRecord: overlapActions.nonOverlapRecord,
  nonOverlapReport: overlapActions.nonOverlapReport,
  closeTitle: openTitleActions.close,
  openExpenseTypeDialog,
  deleteExpRecord,
  confirm,
  openRecordCloneCalendarDialog: activeDialogActions.recordCloneDate,
  openRecordCloneNumnberDialog: activeDialogActions.recordCloneNumber,
  setCloneReport: recordCloneActions.setRecord,
  searchOptionList: fixedAmountOptionActions.search,
  openReceiptLibraryDialog,
  openOCRReceiptLibraryDialog,
  openTransactionSelectionDialog,
  openIcTransactionDialog,
  resetSelectedReceipt: selectedReceiptActions.clear,
  resetProgressBar: progressBarActions.clear,
  setReport: selectedExpReportActions.select,
  cloneRecords,
  showErrorToast,
  showToast,
  setIsNeedGenerateMapPreview,
  handleDropFiles,
  toggleBulkEditMode: bulkEditRecordActions.toggle,
  setBulkEditRemoveIds: bulkEditRecordActions.setRemove,
  clearBulkEditRemoveIds: bulkEditRecordActions.clearRemove,
  reportSelect: modeActions.reportSelect,
  getExpenseTypeById,
  // Edit dropdown has been removed, can be used in future
  // onClickOpenEditMenu: openEditMenuActions.open,
  // onClickCloseEditMenu: openEditMenuActions.close,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  gridAreaContainer: GridAreaContainer,
  onClickOpenLibraryButton: () => {
    dispatchProps.resetSelectedReceipt();
    dispatchProps.openOCRReceiptLibraryDialog(stateProps.employeeId);
  },
  onClickNewRecordButton() {
    dispatchProps.closeTitle();
    dispatchProps.resetProgressBar();
    dispatchProps.resetSelectedReceipt();

    const excludedRecordTypes = [RECORD_TYPE.TransportICCardJP];
    dispatchProps.openExpenseTypeDialog(
      stateProps.employeeId,
      stateProps.companyId,
      ownProps.expReport.accountingDate,
      '',
      ownProps.expReport.expReportTypeId,
      false,
      excludedRecordTypes
    );
    const selectedAccountingPeriod = find(stateProps.accountingPeriodAll, {
      id: ownProps.expReport.accountingPeriodId,
    });
    ownProps.onChangeEditingExpReport(
      'ui.selectedAccountingPeriod',
      selectedAccountingPeriod,
      false
    );
  },
  onClickNewRecordFromCreditCard: () => {
    dispatchProps.openTransactionSelectionDialog();
    const selectedAccountingPeriod = find(stateProps.accountingPeriodAll, {
      id: ownProps.expReport.accountingPeriodId,
    });
    ownProps.onChangeEditingExpReport(
      'ui.selectedAccountingPeriod',
      selectedAccountingPeriod,
      false
    );
  },
  onClickNewRecordFromIcCard: () => {
    dispatchProps.openIcTransactionDialog();
    const selectedAccountingPeriod = find(stateProps.accountingPeriodAll, {
      id: ownProps.expReport.accountingPeriodId,
    });
    ownProps.onChangeEditingExpReport(
      'ui.selectedAccountingPeriod',
      selectedAccountingPeriod,
      false
    );
  },
  onClickCloneRecordButton(cloneMode?: string) {
    const checkboxes = ownProps.checkboxes;
    const records = cloneDeep(ownProps.expReport.records);
    const selectedRecordIds = [];
    switch (cloneMode) {
      case CLONE_RECORD_OPTIONS.MULTIPLE_CLONE:
        checkboxes.forEach((index) =>
          selectedRecordIds.push(records[index].recordId)
        );
        dispatchProps.setCloneReport(selectedRecordIds);
        dispatchProps.openRecordCloneNumnberDialog();
        break;
      case CLONE_RECORD_OPTIONS.SPECIFIED_CLONE:
        let latestDate = records[`${checkboxes[0]}`].recordDate;
        checkboxes.forEach((index) => {
          selectedRecordIds.push(records[index].recordId);
          if (DateUtil.isBefore(latestDate, records[index].recordDate)) {
            latestDate = records[index].recordDate;
          }
        });
        dispatchProps.setCloneReport(
          selectedRecordIds,
          DateUtil.addDays(latestDate, 1)
        );
        dispatchProps.openRecordCloneCalendarDialog();
        break;
      case CLONE_RECORD_OPTIONS.SINGLE_CLONE:
      default:
        checkboxes.forEach((index) =>
          selectedRecordIds.push(records[index].recordId)
        );
        dispatchProps
          .cloneRecords(
            null,
            selectedRecordIds,
            ownProps.expReport.reportId,
            stateProps.reportTypeList,
            1,
            stateProps.employeeId,
            ownProps.isUseCashAdvance,
            ownProps.expReport.isCostCenterChangedManually
          )
          .then((res) => {
            if (!isEmpty(res.recordIds)) {
              dispatchProps.showToast(msg().Exp_Msg_CloneRecords, 4000);
            }
          });
        break;
    }
  },
  onClickRecord: (idx: number) => {
    dispatchProps.closeTitle();
    const selectedAccountingPeriod = find(stateProps.accountingPeriodAll, {
      id: ownProps.expReport.accountingPeriodId,
    });

    /*
      selectedAccountingPeriod:
        for displaying error if the recordDate is out of accounting period range
      selectedRecord:
        for store old state into temp ui state to restore later
      selectedPreRecord:
        previous record data for diff view
    */
    const selectedRecord = ownProps.expReport.records[idx];
    const selectedPreRecord = ownProps.expPreRequest
      ? ownProps.expPreRequest.records.find(
          (record: TypeRecord) =>
            record.recordId === selectedRecord.expPreRequestRecordId
        )
      : undefined;
    const updatedUI = {
      ...ownProps.ui,
      recordIdx: idx,
      selectedRecord,
      selectedPreRecord,
      selectedAccountingPeriod,
    };

    ownProps.onChangeEditingExpReport('ui', updatedUI);

    // fetch amount option list if record type is Multiple Fixed Allowance and redux doesn't have data
    const recordType = ownProps.expReport.records[idx].recordType;
    const expTypeId = ownProps.expReport.records[idx].items[0].expTypeId;
    const optionList = get(stateProps.fixedAmountOptionList, expTypeId);
    if (isFixedAllowanceMulti(recordType) && isEmpty(optionList)) {
      dispatchProps.searchOptionList(expTypeId, stateProps.subroleId);
    }
    if (isMileageRecord(recordType))
      dispatchProps.setIsNeedGenerateMapPreview(false);

    // fetch expense type for new selected record item
    const expTypeInfo = stateProps.expenseTypeList.find(
      ({ id }) => id === expTypeId
    );
    if (!expTypeInfo) {
      dispatchProps.getExpenseTypeById(
        expTypeId,
        ownProps.expReport.empHistoryId
      );
    }

    dispatchProps.overlapRecord();
  },
  onChangeCheckBox: (idx: number) => {
    const target = ownProps.checkboxes.indexOf(idx);
    const checkboxes = cloneDeep(ownProps.checkboxes);
    if (target > -1) {
      checkboxes.splice(target, 1);
    } else {
      checkboxes.push(idx);
    }
    ownProps.onChangeEditingExpReport('ui.checkboxes', checkboxes);
  },
  onChangeCheckBoxes: (idxList: number[]) => {
    ownProps.onChangeEditingExpReport('ui.checkboxes', idxList);
  },
  onClickDeleteRecordItem: () => {
    dispatchProps.confirm(msg().Exp_Msg_ConfirmDeleteSelectedRecords, (yes) => {
      if (yes) {
        const checkboxes = ownProps.checkboxes.sort((a, b) => (a > b ? -1 : 1));
        const records = cloneDeep(ownProps.expReport.records);
        let recordsTouched = [];
        const selectedRecordIds = [];
        checkboxes.forEach((index) => {
          selectedRecordIds.push(records[index].recordId);
          records.splice(index, 1);
        });
        if (ownProps.touched && ownProps.touched.records) {
          recordsTouched = cloneDeep(ownProps.touched.records);
          if (!recordsTouched) {
            checkboxes.forEach((index) => {
              recordsTouched.splice(index, 1);
            });
          }
        }

        // Change touched into false so that report remains in Select mode.
        ownProps.onChangeEditingExpReport(`report.records`, records, false);

        const updateReport = cloneDeep(ownProps.expReport);
        updateReport.records = records;
        updateReport.totalAmount = calcTotalAmount(updateReport);
        dispatchProps.setReport(updateReport, stateProps.reportTypeList);
        dispatchProps
          .deleteExpRecord(
            selectedRecordIds,
            stateProps.employeeId,
            ownProps.expReport.reportId,
            ownProps.isUseCashAdvance ||
              stateProps.alwaysDisplaySettlementAmount,
            {
              empHistoryIds: stateProps.subroleIds,
            }
          )
          .then(() => {
            // pass formik information of workdays to check record date warning
            ownProps.onChangeEditingExpReport(
              'ui.workingDays',
              stateProps.workingDays
            );
            // pass formik information of accounting period and displaying error if the recordDate is out of accounting period range
            const selectedAccountingPeriod = find(
              stateProps.accountingPeriodAll,
              {
                id: ownProps.expReport.accountingPeriodId,
              }
            );
            ownProps.onChangeEditingExpReport(
              'ui.selectedAccountingPeriod',
              selectedAccountingPeriod,
              false
            );
            ownProps.onChangeEditingExpReport('ui', {
              ...ownProps.ui,
              checkboxes: [],
              recordIdx: -1,
              recalc: true,
              editMode: true,
            });
          });
      }
    });
  },
  onClickBulkNewRecordButton: () => {
    const { expReport, onChangeEditingExpReport } = ownProps;
    const recordList = expReport.records;
    const lastRecordDate = get(
      recordList,
      `${recordList.length - 1}.recordDate`
    );
    const recordDate =
      lastRecordDate || expReport.accountingDate || DateUtil.getToday();
    const _ = undefined;

    const record = newRecord(_, _, _, _, _, _, _, _, _, 0, recordDate);
    const newRecordList = recordList.concat(record);
    onChangeEditingExpReport('report.records', newRecordList, true);
  },
  onClickBulkEditButton: () => {
    ownProps.onChangeEditingExpReport('ui', {
      ...ownProps.ui,
      checkboxes: [],
      isBulkEditMode: true,
      submitMode: false,
    });
    dispatchProps.toggleBulkEditMode();
    dispatchProps.closeTitle();
  },
  onClickBulkCancelButton: async () => {
    const { expReport, onChangeEditingExpReport, selectedExpReport } = ownProps;
    const { bulkEditRemoveIds } = stateProps;
    const originalRecordList = selectedExpReport.records;
    const currentRecordList = expReport.records;
    const isRecordEdited = !isEqual(originalRecordList, currentRecordList);

    if (isRecordEdited) {
      const isDiscardEdit = await dispatchProps.confirm(
        msg().Common_Confirm_DiscardEdits
      );
      if (!isDiscardEdit) return;
      // toggle bulk edit mode first to prevent recalculate amount on field change
      onChangeEditingExpReport('ui.isBulkEditMode', false);
      dispatchProps.toggleBulkEditMode();
      onChangeEditingExpReport('report.records', originalRecordList);
      if (bulkEditRemoveIds.length > 0) dispatchProps.clearBulkEditRemoveIds();
    } else {
      onChangeEditingExpReport('ui.isBulkEditMode', false);
      dispatchProps.toggleBulkEditMode();
    }
    onChangeEditingExpReport('ui.isRecordBulkSave', false);
    onChangeEditingExpReport('ui.bulkRecordIdx', -1);
    onChangeEditingExpReport('ui.checkboxes', []);
    dispatchProps.resetSelectedReceipt();
    dispatchProps.reportSelect();
  },
  onClickBulkCloneButton: (cloneMode?: string) => {
    const {
      checkboxes: selectedIndexes,
      expReport,
      onChangeEditingExpReport,
    } = ownProps;
    const recordList = expReport.records;
    switch (cloneMode) {
      case CLONE_RECORD_OPTIONS.MULTIPLE_CLONE:
        dispatchProps.setCloneReport(selectedIndexes);
        dispatchProps.openRecordCloneNumnberDialog();
        break;
      case CLONE_RECORD_OPTIONS.SPECIFIED_CLONE:
        let latestDate = recordList[`${selectedIndexes[0]}`].recordDate;
        selectedIndexes.forEach((idx: string) => {
          const { recordDate } = recordList[idx];
          if (DateUtil.isBefore(latestDate, recordDate))
            latestDate = recordDate;
        });
        dispatchProps.setCloneReport(
          selectedIndexes,
          DateUtil.addDays(latestDate, 1)
        );
        dispatchProps.openRecordCloneCalendarDialog();
        break;
      case CLONE_RECORD_OPTIONS.SINGLE_CLONE:
      default:
        const newRecords = selectedIndexes.map((idx: number) =>
          getResetFields(recordList[idx])
        );
        const newRecordList = recordList.concat(newRecords);
        onChangeEditingExpReport('report.records', newRecordList, true);
        break;
    }
  },
  onClickBulkDeleteButton: () => {
    dispatchProps.confirm(
      msg().Exp_Msg_ConfirmDeleteSelectedRecords,
      async (yes: boolean) => {
        if (yes) {
          const { checkboxes, expReport, onChangeEditingExpReport } = ownProps;
          const descCheckboxes = checkboxes.sort(
            (a: number, b: number) => b - a
          );
          const recordList = cloneDeep(expReport.records);
          const removeIdList = [];
          descCheckboxes.forEach((idx: number) => {
            const removeId = get(recordList, `${idx}.recordId`, '');
            if (removeId) removeIdList.push(removeId);
            recordList.splice(idx, 1);
          });
          if (removeIdList.length > 0) {
            dispatchProps.setBulkEditRemoveIds(removeIdList);
          }
          onChangeEditingExpReport('report.records', recordList, true);
          onChangeEditingExpReport('ui.checkboxes', [], undefined, false);
        }
      }
    );
  },
  onDropReceiptFiles: async (files: File[]) => {
    const { expReport, onChangeEditingExpReport } = ownProps;
    const uploadedReceiptList = await dispatchProps.handleDropFiles(files);
    if (uploadedReceiptList.length > 0) {
      // create records
      const _ = undefined;
      const recordList = expReport.records;
      const recordLength = recordList.length;
      const lastRecordDate = get(recordList, `${recordLength - 1}.recordDate`);
      const recordDate =
        lastRecordDate || expReport.accountingDate || DateUtil.getToday();

      const newRecords = uploadedReceiptList.map((receiptList: Receipt) =>
        newRecord(_, _, _, _, _, _, _, _, _, 0, recordDate, _, _, _, _, [
          receiptList,
        ])
      );
      const newRecordList = [...recordList, ...newRecords];
      onChangeEditingExpReport('report.records', newRecordList, true);
    }
  },
  disableBulkEditMode: () => {
    ownProps.onChangeEditingExpReport('ui.checkboxes', []);
    dispatchProps.toggleBulkEditMode();
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RecordListView) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
