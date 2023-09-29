import * as React from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';
import { cloneDeep, find, get, isEmpty } from 'lodash';

import { confirm } from '../../../commons/actions/app';
import RecordListView from '../../../commons/components/exp/Form/RecordList';
import IconIcCard from '../../../commons/images/icons/icCard.svg';
import IconVoucherReceipt from '../../../commons/images/icons/iconVoucherReceipt.svg';
import IconVoucherTransit from '../../../commons/images/icons/iconVoucherTransit.svg';
import msg from '../../../commons/languages';
import { showToast } from '../../../commons/modules/toast';
import DateUtil from '../../../commons/utils/DateUtil';

import {
  CLONE_RECORD_OPTIONS,
  isFixedAllowanceMulti,
  RECORD_TYPE,
} from '../../../domain/models/exp/Record';
import { calcTotalAmount } from '@apps/domain/models/exp/Report';

import { actions as activeDialogActions } from '../../modules/ui/expenses/dialog/activeDialog';
import { actions as progressBarActions } from '../../modules/ui/expenses/dialog/progressBar';
import { actions as recordCloneActions } from '../../modules/ui/expenses/dialog/recordClone/dialog';
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
} from '../../action-dispatchers/Expenses';
import { getExpenseTypeById } from '../../action-dispatchers/ExpenseType';

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
export const mapStateToProps = (state: any, ownProps: any) => ({
  ...ownProps,
  accountingPeriodAll: state.ui.expenses.recordListPane.accountingPeriod,
  baseCurrencySymbol:
    ownProps.currencySymbol || state.userSetting.currencySymbol,
  baseCurrencyDecimal:
    ownProps.currencyDecimalPlaces || state.userSetting.currencyDecimalPlaces,
  companyId: state.userSetting.companyId,
  employeeId: state.userSetting.employeeId,
  expenseTypeList: state.entities.exp.expenseType.list,
  getImage,
  mode: state.ui.expenses.mode,
  openEditMenu: state.ui.expenses.recordListPane.recordList.openEditMenu,
  fixedAmountOptionList: state.ui.expenses.recordItemPane.fixedAmountOption,
  reportTypeList: state.entities.exp.expenseReportType.list.active,
  workingDays: state.ui.expenses.recordItemPane.workingDays,
  overlap: state.ui.expenses.overlap,
  useMasterCardImport: state.userSetting.useMasterCardImport,
  useReceiptScan: state.userSetting.useReceiptScan,
  useTransitManager: state.userSetting.useTransitManager,
  selectedTab: state.ui.expenses.tab,
  isErrDisplay: !state.ui.expenses.reportTypeLoading,
  useJctRegistrationNumber: state.userSetting.jctInvoiceManagement,
});

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
  showToast,
  getExpenseTypeById,
  // Edit dropdown has been removed, can be used in future
  // onClickOpenEditMenu: openEditMenuActions.open,
  // onClickCloseEditMenu: openEditMenuActions.close,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
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
      tempSavedRecordItems:
        1. serve as a temp save copy when user temporarily "save" record items
        2. restore formik to the temp saved items when user cancel editing
    */
    const updatedUI = {
      ...ownProps.ui,
      recordIdx: idx,
      selectedRecord: ownProps.expReport.records[idx],
      tempSavedRecordItems: ownProps.expReport.records[idx].items,
      selectedAccountingPeriod,
    };

    ownProps.onChangeEditingExpReport('ui', updatedUI);

    // fetch amount option list if record type is Multiple Fixed Allowance and redux doesn't have data
    const recordType = ownProps.expReport.records[idx].recordType;
    const expTypeId = ownProps.expReport.records[idx].items[0].expTypeId;
    const optionList = get(stateProps.fixedAmountOptionList, expTypeId);
    if (isFixedAllowanceMulti(recordType) && isEmpty(optionList)) {
      dispatchProps.searchOptionList(expTypeId);
    }

    // fetch expense type for new selected record item
    const currExpenseType = stateProps.expenseTypeList[0] || [];
    if (isEmpty(currExpenseType) || currExpenseType.id !== expTypeId) {
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
          .deleteExpRecord(selectedRecordIds, stateProps.employeeId)
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RecordListView) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
