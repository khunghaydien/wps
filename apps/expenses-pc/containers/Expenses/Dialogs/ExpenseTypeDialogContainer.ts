import { connect } from 'react-redux';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';

import ExpenseTypeSelect, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/ExpenseTypeSelect';

import { ExpenseType } from '../../../../domain/models/exp/ExpenseType';
import { isUseMerchant } from '../../../../domain/models/exp/Merchant';
import {
  getOriginalOCRInfo,
  isFixedAllowanceMulti,
  isFixedAllowanceSingle,
  isRecordItemized,
  newRecord,
  Record as ExpRecord,
  RECORD_TYPE,
} from '../../../../domain/models/exp/Record';
import { isUseJctNo, JCT_NUMBER_INVOICE } from '@apps/domain/models/exp/JCTNo';
import {
  generateRecordsFromOCRReceipts,
  getLatestOCRDate,
  isBulkRecordUsingDiffReceipts,
} from '@apps/domain/models/exp/OCR';
import { calculateTax } from '@apps/domain/models/exp/TaxType';
import {
  generateRecordsFromICTrans,
  getLatestICDate,
  getRouteInfo,
} from '@apps/domain/models/exp/TransportICCard';

import { actions as searchRouteActions } from '../../../../domain/modules/exp/jorudan/routeOption';
import { actions as receiptLibraryAction } from '../../../../domain/modules/exp/receiptLibrary/list';
import { State } from '../../../modules';
import { actions as expenseTypeSelectListActions } from '../../../modules/ui/expenses/dialog/expenseTypeSelect/list';
import { actions as ICTransactionSelectActions } from '../../../modules/ui/expenses/dialog/ICTransactionSelect/selected';
import { actions as progressBarActions } from '../../../modules/ui/expenses/dialog/progressBar';
import { actions as transactionSelectActions } from '../../../modules/ui/expenses/dialog/transactionSelect/selected';
import { actions as modeActions } from '../../../modules/ui/expenses/mode';
import { actions as overlapActions } from '../../../modules/ui/expenses/overlap';
import { actions as ocrDetailActions } from '../../../modules/ui/expenses/receiptLibrary/ocrDetail';
import { actions as selectedReceiptActions } from '../../../modules/ui/expenses/receiptLibrary/selectedReceipt';
import { actions as fixedAmountOptionActions } from '../../../modules/ui/expenses/recordItemPane/fixedAmountOption';
import { actions as recordPanelLoadingActions } from '../../../modules/ui/expenses/recordItemPane/isLoading';

import { searchTaxTypeList } from '../../../action-dispatchers/Currency';
import {
  openOCRDetailDialog,
  openOCRReceiptLibraryDialog,
} from '../../../action-dispatchers/Dialog';
import { saveMultiRecord } from '../../../action-dispatchers/Expenses';
import {
  favoriteExpType,
  getExpenseTypeById,
  getExpenseTypeList,
  getExpenseTypeSearchResult,
  getFavoriteExpTypes,
  getNextExpenseTypeList,
  unfavoriteExpType,
} from '../../../action-dispatchers/ExpenseType';
import { resetRouteForm } from '../../../action-dispatchers/Route';

import { Props as OwnProps } from '../../../components/Expenses/Dialog';

const mapStateToProps = (state: State, ownProps: OwnProps) => ({
  expenseTypeList:
    state.ui.expenses.dialog.expenseTypeSelect.list.selectionList,
  expenseTypeSearchList:
    state.ui.expenses.dialog.expenseTypeSelect.list.searchList,
  expenseTypeRecentItems:
    state.ui.expenses.dialog.expenseTypeSelect.list.recentItems,
  expenseTypeFavoriteItems:
    state.ui.expenses.dialog.expenseTypeSelect.list.favoriteItems,
  ocrDetail: state.ui.expenses.receiptLibrary.ocrDetail, // ocr info input by user
  selectedReceipt: state.ui.expenses.receiptLibrary.selectedReceipt,
  selectedTransaction: state.ui.expenses.dialog.transactionSelect.selected,
  selectedICTransaction: state.ui.expenses.dialog.ICTransactionSelect.selected,
  baseCurrencyDecimal: state.userSetting.currencyDecimalPlaces,
  taxRoundingSetting: state.userSetting.expTaxRoundingSetting,
  companyId: state.userSetting.companyId,
  employeeId: state.userSetting.employeeId,
  tax: state.ui.expenses.recordItemPane.tax,
  recordType: state.ui.expenses.dialog.expenseTypeSelect.recordType,
  progressBar: state.ui.expenses.dialog.progressBar,
  hintMsg: state.entities.exp.customHint.recordExpenseType,
  hasMore: state.ui.expenses.dialog.expenseTypeSelect.list.hasMore,
  isLoading: !!state.ui.expenses.dialog.isLoading,
  selectedDelegator: state.ui.expenses.delegateApplicant.selectedEmployee,
  // selectedCompanyId from FA cross Company
  selectedCompanyId: ownProps.selectedCompanyId || state.userSetting.companyId,
});

const mapDispatchToProps = {
  resetRouteForm,
  getFavoriteExpTypes,
  favoriteExpTypeAction: favoriteExpType,
  unfavoriteExpTypeAction: unfavoriteExpType,
  clearExpenseTypes: expenseTypeSelectListActions.clear,
  getExpenseTypeList,
  getExpenseTypeSearchResult,
  getNextExpenseTypeList,
  getExpenseTypeById,
  searchTaxTypeList,
  openOCRReceiptLibraryDialog,
  openOCRDetailDialog,
  searchRouteOption: searchRouteActions.search,
  setFixedAmountOption: fixedAmountOptionActions.set,
  toggleRecordLoading: recordPanelLoadingActions.toggle,
  overlap: overlapActions.overlapRecord,
  setProgressBar: progressBarActions.set,
  resetProgressBar: progressBarActions.clear,
  resetSelectedReceipt: selectedReceiptActions.clear,
  resetOCRDetail: ocrDetailActions.reset,
  clearSelectedTransaction: transactionSelectActions.clear,
  clearSelectedICTransaction: ICTransactionSelectActions.clear,
  saveMultiRecord,
  reportEdit: modeActions.reportEdit,
  getReceiptList: receiptLibraryAction.list,
};

const getExcludedRecordTypes = (icTransactions) => {
  return icTransactions.length > 0 ? null : [RECORD_TYPE.TransportICCardJP];
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  onClickBackButton: () => {
    dispatchProps.clearExpenseTypes();
    if (
      stateProps.selectedTransaction ||
      !isEmpty(stateProps.selectedICTransaction)
    ) {
      ownProps.hideDialog();
      return;
    }
    ownProps.hideDialog();
    dispatchProps.openOCRDetailDialog();
  },
  onClickExpenseTypeSelectByCategory: (): void => {
    const {
      ocrDetail,
      selectedICTransaction,
      selectedTransaction,
      employeeId,
      recordType,
    } = stateProps;
    const { expReport } = ownProps;
    const { accountingDate, expReportTypeId } = expReport || {};

    const recordDate =
      getLatestOCRDate(ocrDetail) ||
      get(selectedTransaction, 'transactionDate') ||
      getLatestICDate(selectedICTransaction) ||
      accountingDate;

    // exclude IC exp types except when create IC record
    const excludedRecordTypes = getExcludedRecordTypes(selectedICTransaction);

    dispatchProps.getExpenseTypeList(
      employeeId,
      recordType,
      recordDate,
      expReportTypeId,
      excludedRecordTypes
    );
  },
  onClickExpenseTypeCloseButton: () => {
    dispatchProps.resetSelectedReceipt();
    dispatchProps.resetOCRDetail();
    dispatchProps.clearSelectedTransaction();
    dispatchProps.clearSelectedICTransaction();
    dispatchProps.resetProgressBar();
    ownProps.hideAllDialogsAndClear();
  },
  onClickExpenseTypeSearch: (keyword) => {
    const {
      ocrDetail,
      selectedICTransaction,
      recordType,
      employeeId,
      companyId,
    } = stateProps;
    const { expReport } = ownProps;
    const { accountingDate, expReportTypeId } = expReport || {};
    const recordDate =
      getLatestOCRDate(ocrDetail) ||
      get(stateProps.selectedTransaction, 'transactionDate') ||
      getLatestICDate(selectedICTransaction) ||
      accountingDate;

    // exclude IC exp types except when create IC record
    const excludedRecordTypes = getExcludedRecordTypes(selectedICTransaction);

    dispatchProps.getExpenseTypeSearchResult(
      companyId,
      keyword,
      recordDate,
      expReportTypeId || '',
      recordType,
      employeeId,
      excludedRecordTypes
    );
  },
  // @ts-ignore
  listFavoriteExpenseTypes: () => {
    const icTransaction = stateProps.selectedICTransaction;
    const icDate = getLatestICDate(icTransaction);
    const recordDate =
      getLatestOCRDate(stateProps.ocrDetail) ||
      get(stateProps.selectedTransaction, 'transactionDate') ||
      icDate ||
      ownProps.expReport.accountingDate;

    // exclude IC exp types except when create IC record
    const excludedRecordTypes = getExcludedRecordTypes(icTransaction);
    return dispatchProps.getFavoriteExpTypes(
      stateProps.employeeId,
      recordDate,
      stateProps.companyId,
      stateProps.recordType,
      ownProps.expReport.expReportTypeId || '',
      excludedRecordTypes
    );
  },
  favoriteExpType: (item) =>
    // @ts-ignore
    dispatchProps.favoriteExpTypeAction(stateProps.employeeId, item),
  unfavoriteExpType: (item) =>
    // @ts-ignore
    dispatchProps.unfavoriteExpTypeAction(stateProps.employeeId, item),
  onClickExpenseTypeItem: async (selectedExpType, hierarExpTypes) => {
    /**
     * 新規明細ボタンを押されて呼ばれた費目選択ダイアログ内のアイテム（費目or費目グループ）が押された時の挙動を定義する関数
     * define behavior when item (===expense type or expType group) in expense type dialog is selected
     * only about when new record button clicked
     * @param selectedExpType 選択された費目or費目グループ / selected expense type or expense type group
     * @param hierarExpTypes 費目or費目グループの階層構造 / hierarchal expense type or expense type group
     */

    // 選択されたものが費目グループの場合 / if expense group is selected
    if (selectedExpType.isGroup) {
      const { selectedICTransaction, selectedTransaction, recordType } =
        stateProps;
      const { expReport } = ownProps;
      const { accountingDate, expReportTypeId } = expReport || {};
      const recordDate =
        getLatestOCRDate(stateProps.ocrDetail) ||
        get(selectedTransaction, 'transactionDate') ||
        getLatestICDate(selectedICTransaction) ||
        accountingDate;
      const excludedRecordTypes =
        selectedICTransaction.length > 0
          ? null
          : [RECORD_TYPE.TransportICCardJP];

      dispatchProps.getNextExpenseTypeList(
        selectedExpType,
        hierarExpTypes || [],
        recordDate,
        recordType,
        expReportTypeId || '',
        excludedRecordTypes
      );
    } // 選択されたものが費目の場合 / if expense type is selected
    else {
      const { ocrDetail, selectedReceipt: selectedReceiptsArr } = stateProps;
      const expTypeId = selectedExpType.id;
      // @ts-ignore
      const expType: ExpenseType = await dispatchProps.getExpenseTypeById(
        expTypeId
      );

      if (isBulkRecordUsingDiffReceipts(ocrDetail)) {
        const { employeeId } = stateProps;
        const { expReport, hideAllDialogsAndClear } = ownProps;
        const { reportId, expReportTypeId } = expReport || {};

        // get tax type info
        const ocrDates = selectedReceiptsArr.map(
          (_, index) => ocrDetail[index].recordDate || expReport.accountingDate
        );
        const uniqOcrDates = uniq(ocrDates);
        const taxTypeListRes = await Promise.all(
          uniqOcrDates.map((date) =>
            dispatchProps.searchTaxTypeList(expTypeId, date)
          )
        );
        const taxTypesByDates = uniqOcrDates.reduce((acc, date, i) => {
          const taxesOnTheDay = (taxTypeListRes[i] as any).payload[expTypeId][
            date
          ];

          return { ...acc, [date]: taxesOnTheDay };
        }, stateProps.tax[expTypeId] || {});

        const newRecs = generateRecordsFromOCRReceipts(
          false,
          selectedReceiptsArr,
          ocrDetail,
          expType,
          employeeId,
          reportId,
          taxTypesByDates,
          stateProps.taxRoundingSetting,
          stateProps.baseCurrencyDecimal,
          expReportTypeId
        );

        await dispatchProps.saveMultiRecord(newRecs, expReport);

        ownProps.validateForm();
        hideAllDialogsAndClear();
        dispatchProps.resetOCRDetail();
        dispatchProps.resetSelectedReceipt();
        return;
      }

      const idx = ownProps.expReport.records.length;
      const {
        receiptId,
        receiptFileId,
        dataType,
        ocrInfo: originalOCR,
      } = stateProps.selectedReceipt[0] || {};
      const ocrInfo = stateProps.ocrDetail[0] || {};
      const transaction = stateProps.selectedTransaction;
      const icTransaction = stateProps.selectedICTransaction || [];

      if (icTransaction.length <= 1) {
        // show loading skeleton in record panel except when save multi records
        dispatchProps.overlap();
        dispatchProps.toggleRecordLoading(true);
      }
      ownProps.hideAllDialogsAndClear();

      if (icTransaction.length > 1) {
        // if multi ic selected, create records immediately

        const icDates = icTransaction.map(({ paymentDate }) => paymentDate);
        const uniqICDates = uniq(icDates) as string[];
        let taxTypesByDates = stateProps.tax[expTypeId] || {};
        const res = await Promise.all(
          uniqICDates.map((date) =>
            dispatchProps.searchTaxTypeList(expTypeId, date)
          )
        );
        for (let i = 0; i < uniqICDates.length; i++) {
          const date = uniqICDates[i];
          const taxesOnTheDay = (res[i] as any).payload[expTypeId][date];
          taxTypesByDates = { ...taxTypesByDates, [date]: taxesOnTheDay };
        }

        const records = generateRecordsFromICTrans(
          icTransaction,
          expType,
          stateProps.employeeId,
          ownProps.expReport.reportId,
          taxTypesByDates,
          stateProps.taxRoundingSetting,
          stateProps.baseCurrencyDecimal
        );
        await dispatchProps.saveMultiRecord(records, ownProps.expReport);
        ownProps.hideAllDialogsAndClear();
        dispatchProps.clearSelectedICTransaction();
        ownProps.validateForm();
        return;
      }
      const selectedInfo =
        (!isEmpty(ocrInfo) && ocrInfo) || transaction || icTransaction[0];

      const amount = get(selectedInfo, 'amount') || 0;

      const recordDate =
        getLatestOCRDate(ocrDetail) ||
        get(transaction, 'transactionDate') ||
        get(icTransaction, '0.paymentDate') ||
        ownProps.expReport.accountingDate;
      const {
        originalOCRAmount,
        originalOCRDate,
        originalOCRMerchant,
        originalOCRJctRegistrationNumber,
      } = getOriginalOCRInfo(originalOCR);

      const newRec = newRecord(
        expType.id,
        expType.name,
        expType.recordType,
        expType.useForeignCurrency,
        expType,
        false,
        expType.fileAttachment,
        expType.fixedForeignCurrencyId,
        expType.foreignCurrencyUsage,
        amount,
        recordDate,
        originalOCRAmount,
        originalOCRDate,
        receiptId,
        receiptFileId,
        dataType,
        null,
        null,
        expType.merchant
      );

      newRec.recordDate = recordDate;
      if (isUseMerchant(expType.merchant)) {
        const merchant =
          ocrInfo.merchant || get(transaction, 'merchantName') || '';
        (newRec as ExpRecord).items[0].merchant = merchant;
      }
      (newRec as ExpRecord).items[0].ocrMerchant = originalOCRMerchant; // original scanned data

      if (expType.jctRegistrationNumberUsage) {
        (newRec as ExpRecord).jctRegistrationNumberUsage =
          expType.jctRegistrationNumberUsage;
        if (isUseJctNo(expType.jctRegistrationNumberUsage)) {
          (newRec as ExpRecord).items[0].jctInvoiceOption =
            JCT_NUMBER_INVOICE.Invoice;
          (newRec as ExpRecord).items[0].jctRegistrationNumber =
            originalOCRJctRegistrationNumber; // original scanned data
        }
      }

      if (transaction) {
        newRec.creditCardTransactionId = get(transaction, 'id', null);
        const desc = transaction.transactionDescription || '';
        const merchant = transaction.merchantName
          ? `${transaction.merchantName}: `
          : '';
        newRec.items[0].remarks = merchant + desc;
      } else if (icTransaction.length === 1) {
        const { cardNo, recordId, category } = icTransaction[0];
        newRec.transitIcCardNo = cardNo;
        newRec.transitIcRecordId = recordId;
        const route = getRouteInfo(icTransaction[0]);
        const transitIcRecordInfo = {
          category,
          route,
        };
        newRec.transitIcRecordInfo = transitIcRecordInfo;
      }

      dispatchProps
        .searchTaxTypeList(expTypeId, recordDate, null, true)
        // @ts-ignore
        .then((result) => {
          const initTax = get(result, `payload.${expTypeId}.${recordDate}.0`);
          // 選択された費目の明細タイプがジョルダンの場合 / if record type of selected expense type is Jorudan
          if (expType.recordType === 'TransitJorudanJP') {
            dispatchProps.resetRouteForm(null);
            dispatchProps.searchRouteOption(stateProps.selectedCompanyId);
          }

          newRec.items[0].taxTypeBaseId = 'noIdSelected';
          newRec.items[0].taxTypeHistoryId = initTax ? initTax.historyId : null;

          if (isRecordItemized(expType.recordType, false)) {
            newRec.items[0].taxTypeBaseId = null;
            newRec.items[0].taxTypeHistoryId = null;
            newRec.items[0].taxTypeName = null;
          }

          if (isFixedAllowanceSingle(expType.recordType)) {
            const singleFixedAmout = expType.fixedAllowanceSingleAmount || 0;
            newRec.amount = singleFixedAmout;
            newRec.items[0].amount = singleFixedAmout;
            if (expType.fixedForeignCurrencyId) {
              newRec.items[0].localAmount = singleFixedAmout;
            } else {
              const taxRes = calculateTax(
                initTax.rate,
                singleFixedAmout,
                stateProps.baseCurrencyDecimal,
                stateProps.taxRoundingSetting
              );
              // TODO remove `any` after `calculateTax` return number instead of string
              (newRec.items[0].gstVat as any) = taxRes.gstVat;
              (newRec.items[0].withoutTax as any) = taxRes.amountWithoutTax;
            }
          }

          if (amount && !expType.useForeignCurrency) {
            const taxRes = calculateTax(
              initTax.rate,
              amount,
              stateProps.baseCurrencyDecimal,
              stateProps.taxRoundingSetting
            );
            // TODO remove `any` after `calculateTax` return number instead of string
            (newRec.items[0].gstVat as any) = taxRes.gstVat;
            (newRec.items[0].withoutTax as any) = taxRes.amountWithoutTax;
            dispatchProps.reportEdit();
          }

          if (isFixedAllowanceMulti(expType.recordType)) {
            const lists = get(expType, 'fixedAllowanceOptionList') || [];
            dispatchProps.setFixedAmountOption(expType.id, lists);
          }
          ownProps.onChangeEditingExpReport(
            `report.records[${idx}]`,
            newRec,
            {}
          );
          ownProps.onChangeEditingExpReport('ui.recordIdx', idx);
          dispatchProps.toggleRecordLoading(false);
        });

      dispatchProps.resetProgressBar();
      dispatchProps.resetOCRDetail();
      dispatchProps.resetSelectedReceipt();
      dispatchProps.clearSelectedTransaction();
      dispatchProps.clearSelectedICTransaction();
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ExpenseTypeSelect) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
