import { connect } from 'react-redux';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';

import ExpenseTypeSelect, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/ExpenseTypeSelect';
import { updatePaymentMethodOptionList } from '@commons/action-dispatchers/PaymentMethod';

import { ExpenseType } from '../../../../domain/models/exp/ExpenseType';
import { isUseMerchant } from '../../../../domain/models/exp/Merchant';
import {
  getCCExcludedRecordTypes,
  getOriginalOCRInfo,
  isFixedAllowanceMulti,
  isFixedAllowanceSingle,
  isMileageRecord,
  newRecord,
  Record as ExpRecord,
  RECORD_TYPE,
} from '../../../../domain/models/exp/Record';
import { isUseJctNo, JCT_NUMBER_INVOICE } from '@apps/domain/models/exp/JCTNo';
import {
  initialDestinations,
  MileageRate,
} from '@apps/domain/models/exp/Mileage';
import {
  generateRecordsFromOCRReceipts,
  getLatestOCRDate,
  isBulkRecordUsingDiffReceipts,
} from '@apps/domain/models/exp/OCR';
import { INTEGRATION_SERVICES } from '@apps/domain/models/exp/PaymentMethod';
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
import { setAvailableExpType } from '@apps/domain/modules/exp/expense-type/availableExpType';
import { actions as mileageRateActions } from '@apps/domain/modules/exp/mileageRate';

import { searchTaxTypeList } from '../../../action-dispatchers/Currency';
import {
  openOCRDetailDialog,
  openOCRReceiptLibraryDialog,
} from '../../../action-dispatchers/Dialog';
import {
  endBulkEditLoading,
  saveMultiRecord,
  setIsNeedGenerateMapPreview,
  startBulkEditLoading,
} from '../../../action-dispatchers/Expenses';
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
import { updateRecordInfo } from '@apps/expenses-pc/action-dispatchers/BulkEdit';

import { Props as OwnProps } from '../../../components/Expenses/Dialog';

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const subroleId = get(state, 'ui.expenses.subrole.selectedRole');
  const selectedDelegator = get(
    state,
    'ui.expenses.delegateApplicant.selectedEmployee'
  );
  const isProxyMode = !isEmpty(selectedDelegator);
  const alwaysDisplaySettlementAmount = get(
    state,
    'userSetting.alwaysDisplaySettlementAmount'
  );
  return {
    expenseTypeList:
      state.ui.expenses.dialog.expenseTypeSelect.list.selectionList,
    expenseTypeSearchList:
      state.ui.expenses.dialog.expenseTypeSelect.list.searchList,
    expenseTypeRecentItems:
      state.ui.expenses.dialog.expenseTypeSelect.list.recentItems,
    expenseTypeFavoriteItems:
      state.ui.expenses.dialog.expenseTypeSelect.list.favoriteItems,
    reportTypeList: state.entities.exp.expenseReportType.list.active,
    ocrDetail: state.ui.expenses.receiptLibrary.ocrDetail, // ocr info input by user
    selectedReceipt: state.ui.expenses.receiptLibrary.selectedReceipt,
    selectedTransaction: state.ui.expenses.dialog.transactionSelect.selected,
    selectedICTransaction:
      state.ui.expenses.dialog.ICTransactionSelect.selected,
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
    paymentMethodList: state.common.exp.entities.paymentMethodList,
    selectedDelegator: state.ui.expenses.delegateApplicant.selectedEmployee,
    // selectedCompanyId from FA cross Company
    selectedCompanyId:
      ownProps.selectedCompanyId || state.userSetting.companyId,
    subroleId,
    isProxyMode,
    isBulkEditMode: state.common.exp.ui.bulkEditRecord.isEnabled,
    alwaysDisplaySettlementAmount,
    useJctRegistrationNumber: state.userSetting.jctInvoiceManagement,
    availableExpType: state.entities.exp.expenseType.availableExpType,
  };
};

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
  bulkRecordEdit: modeActions.bulkRecordEdit,
  reportEdit: modeActions.reportEdit,
  getReceiptList: receiptLibraryAction.list,
  getMileageRates: mileageRateActions.search,
  setIsNeedGenerateMapPreview,
  endBulkEditLoading,
  startBulkEditLoading,
  updateRecordInfo,
  updatePaymentMethodOptionList,
  setAvailableExpType,
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
      isBulkEditMode,
      isProxyMode,
      ocrDetail,
      selectedICTransaction,
      selectedTransaction,
      employeeId,
      recordType,
      subroleId,
    } = stateProps;
    const { bulkRecordIdx, expReport } = ownProps;
    const { accountingDate, expReportTypeId } = expReport || {};

    const date =
      isBulkEditMode && bulkRecordIdx > -1
        ? expReport.records[bulkRecordIdx].recordDate
        : accountingDate;
    const recordDate =
      getLatestOCRDate(ocrDetail) ||
      get(selectedTransaction, 'transactionDate') ||
      getLatestICDate(selectedICTransaction) ||
      date;

    // exclude IC exp types except when create IC record
    const excludedRecordTypes = !isEmpty(stateProps.selectedTransaction)
      ? getCCExcludedRecordTypes()
      : getExcludedRecordTypes(selectedICTransaction);
    dispatchProps.getExpenseTypeList(
      employeeId,
      recordType,
      recordDate,
      expReportTypeId,
      excludedRecordTypes,
      isProxyMode ? undefined : subroleId
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
      isBulkEditMode,
      ocrDetail,
      selectedICTransaction,
      recordType,
      employeeId,
      subroleId,
      companyId,
    } = stateProps;
    const { expReport, bulkRecordIdx } = ownProps;
    const { accountingDate, expReportTypeId } = expReport || {};
    const date =
      isBulkEditMode && bulkRecordIdx > -1
        ? expReport.records[bulkRecordIdx].recordDate
        : accountingDate;
    const recordDate =
      getLatestOCRDate(ocrDetail) ||
      get(stateProps.selectedTransaction, 'transactionDate') ||
      getLatestICDate(selectedICTransaction) ||
      date;

    // exclude IC exp types except when create IC record in non-bulk edit mode
    const excludedRecordTypes = !isEmpty(stateProps.selectedTransaction)
      ? getCCExcludedRecordTypes()
      : getExcludedRecordTypes(selectedICTransaction);
    dispatchProps.getExpenseTypeSearchResult(
      companyId,
      keyword,
      recordDate,
      expReportTypeId || '',
      recordType,
      employeeId,
      excludedRecordTypes,
      subroleId
    );
  },
  // @ts-ignore
  listFavoriteExpenseTypes: () => {
    const { bulkRecordIdx, expReport } = ownProps;

    const icTransaction = stateProps.selectedICTransaction;
    const icDate = getLatestICDate(icTransaction);
    const date =
      stateProps.isBulkEditMode && bulkRecordIdx > -1
        ? expReport.records[bulkRecordIdx].recordDate
        : expReport.accountingDate;
    const recordDate =
      getLatestOCRDate(stateProps.ocrDetail) ||
      get(stateProps.selectedTransaction, 'transactionDate') ||
      icDate ||
      date;

    // exclude IC exp types except when create IC record
    const excludedRecordTypes = !isEmpty(stateProps.selectedTransaction)
      ? getCCExcludedRecordTypes()
      : getExcludedRecordTypes(icTransaction);
    return dispatchProps.getFavoriteExpTypes(
      stateProps.employeeId,
      recordDate,
      stateProps.companyId,
      stateProps.recordType,
      expReport.expReportTypeId || '',
      excludedRecordTypes
    );
  },
  favoriteExpType: (item) =>
    // @ts-ignore
    dispatchProps.favoriteExpTypeAction(
      stateProps.employeeId,
      item,
      stateProps.companyId
    ),
  unfavoriteExpType: (item) =>
    // @ts-ignore
    dispatchProps.unfavoriteExpTypeAction(
      stateProps.employeeId,
      item,
      stateProps.companyId
    ),
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
      const {
        selectedICTransaction,
        selectedTransaction,
        subroleId,
        recordType,
      } = stateProps;
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
        excludedRecordTypes,
        subroleId
      );
    } // 選択されたものが費目の場合 / if expense type is selected
    else {
      const { bulkRecordIdx } = ownProps;
      const {
        availableExpType,
        isBulkEditMode,
        subroleId,
        ocrDetail,
        selectedReceipt: selectedReceiptsArr,
        selectedCompanyId,
        reportTypeList,
        paymentMethodList,
      } = stateProps;
      const expTypeId = selectedExpType.id;

      const isUpdateAvailableExpType = !availableExpType.includes(expTypeId);
      if (isUpdateAvailableExpType) {
        const newAvailableExpType = availableExpType.concat([expTypeId]);
        dispatchProps.setAvailableExpType(newAvailableExpType);
      }

      // @ts-ignore
      const expType: ExpenseType = await dispatchProps.getExpenseTypeById(
        expTypeId,
        subroleId
      );
      const isBulkExistingRecord = isBulkEditMode && bulkRecordIdx > -1;
      const idx = isBulkExistingRecord
        ? bulkRecordIdx
        : ownProps.expReport.records.length;
      if (isBulkRecordUsingDiffReceipts(ocrDetail)) {
        const { employeeId } = stateProps;
        const { expReport, isUseCashAdvance } = ownProps;
        const { reportId, expReportTypeId } = expReport || {};

        // get tax type info
        const ocrDates = selectedReceiptsArr.map(
          (_, index) =>
            ocrDetail[index].recordDate || ownProps.expReport.accountingDate
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
          isUseCashAdvance,
          expReportTypeId,
          expType.allowNegativeAmount,
          stateProps.useJctRegistrationNumber
        );

        if (isBulkEditMode) {
          const newRecordList = ownProps.expReport.records.concat(newRecs);
          ownProps.onChangeEditingExpReport(
            'report.records',
            newRecordList,
            true
          );
        } else {
          await dispatchProps.saveMultiRecord(
            newRecs,
            ownProps.expReport,
            ownProps.isUseCashAdvance ||
              stateProps.alwaysDisplaySettlementAmount
          );
          ownProps.validateForm();
        }
        ownProps.hideAllDialogsAndClear();
        dispatchProps.resetOCRDetail();
        dispatchProps.resetSelectedReceipt();
        return;
      }

      const {
        receiptId,
        receiptFileId,
        receiptFileExtension,
        dataType,
        title,
        ocrInfo: originalOCR,
      } = stateProps.selectedReceipt[0] || {};
      const ocrInfo = stateProps.ocrDetail[0] || {};
      const transaction = stateProps.selectedTransaction;
      const icTransaction = stateProps.selectedICTransaction || [];

      if (icTransaction.length <= 1) {
        // show loading skeleton in record panel except when save multi records
        if (isBulkEditMode) {
          dispatchProps.startBulkEditLoading(!isBulkExistingRecord);
        } else {
          dispatchProps.overlap();
          dispatchProps.toggleRecordLoading(true);
        }
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

        let paymentMethodId = null;
        if (isBulkEditMode) {
          const paymentMethod =
            paymentMethodList.find(
              ({ integrationService }) =>
                integrationService === INTEGRATION_SERVICES.ICCard
            ) || {};
          paymentMethodId = paymentMethod.id || null;
        }

        const records = generateRecordsFromICTrans(
          icTransaction,
          expType,
          stateProps.employeeId,
          ownProps.expReport.reportId,
          taxTypesByDates,
          stateProps.taxRoundingSetting,
          stateProps.baseCurrencyDecimal,
          ownProps.isUseCashAdvance,
          stateProps.subroleId,
          paymentMethodId,
          stateProps.useJctRegistrationNumber
        );
        if (isBulkEditMode) {
          const newRecordList = ownProps.expReport.records.concat(records);
          ownProps.onChangeEditingExpReport(
            'report.records',
            newRecordList,
            true
          );
        } else {
          await dispatchProps.saveMultiRecord(
            records,
            ownProps.expReport,
            ownProps.isUseCashAdvance ||
              stateProps.alwaysDisplaySettlementAmount
          );
        }
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

      if (isBulkExistingRecord) {
        const newRec = await dispatchProps.updateRecordInfo(
          selectedCompanyId,
          ownProps.expReport,
          bulkRecordIdx,
          expType,
          stateProps.useJctRegistrationNumber
        );
        dispatchProps.endBulkEditLoading();
        ownProps.onChangeEditingExpReport(`report.records[${idx}]`, newRec, {});
        return;
      }
      const receiptList = [];
      if (receiptId)
        receiptList.push({
          receiptId,
          receiptFileId,
          receiptDataType: dataType,
          receiptTitle: title,
          receiptFileExtension,
        });

      const isMultipleTax = expType?.displayMultipleTaxEntryForm;

      if (isMultipleTax) {
        const taxTypeList = await dispatchProps
          .searchTaxTypeList(expTypeId, recordDate, null, true)
          // @ts-ignore
          .then((result) =>
            get(result, `payload.${expTypeId}.${recordDate}`, [])
          );

        const taxItemsSkeleton = taxTypeList.map(
          ({
            baseId: taxTypeBaseId,
            historyId: taxTypeHistoryId,
            name: taxTypeName,
            rate: taxRate,
          }) => ({
            taxTypeBaseId,
            taxTypeHistoryId,
            taxTypeName,
            taxRate,
            amount: 0,
            withoutTax: 0,
            gstVat: 0,
            taxManual: false,
          })
        );

        expType.taxItems = taxItemsSkeleton;
      }

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
        expType.merchant,
        expType.withholdingTaxUsage,
        receiptList
      );

      // Record is Mileage Record, we need to set values accordingly
      if (isMileageRecord(newRec.recordType)) {
        dispatchProps.setIsNeedGenerateMapPreview(true);
        await dispatchProps
          .getMileageRates({
            companyId: stateProps.selectedCompanyId,
            targetDate: recordDate,
          })
          // @ts-ignore
          .then((mileageRates: Array<MileageRate>) => {
            if (!isEmpty(mileageRates)) {
              const expMileageRateInfo: MileageRate | undefined =
                mileageRates.find(
                  (mR: MileageRate) => mR.id === expType.expMileageRateId
                );
              const mileageRateHistoryId = get(expMileageRateInfo, 'historyId');
              const milaegeRate = get(expMileageRateInfo, 'rate');
              const mileageRateName = get(expMileageRateInfo, 'name');
              (newRec as ExpRecord).mileageRouteInfo = {
                destinations: initialDestinations,
              };
              (newRec as ExpRecord).items[0].mileageRateBaseId =
                expType.expMileageRateId;
              (newRec as ExpRecord).items[0].mileageRateHistoryId =
                mileageRateHistoryId;
              (newRec as ExpRecord).items[0].mileageRate = milaegeRate;
              (newRec as ExpRecord).items[0].mileageRateName = mileageRateName;
              (newRec as ExpRecord).items[0].mileageDistance = undefined;
            }
          });
      }

      // set default payment method in non-bulk edit mode
      if (!isBulkEditMode) {
        const selectedReportType = reportTypeList.find(
          ({ id }) => id === ownProps.expReport.expReportTypeId
        );
        const paymentMethodIds = get(
          selectedReportType,
          'paymentMethodIds',
          []
        );
        const paymentMethodOptionList =
          await dispatchProps.updatePaymentMethodOptionList(
            stateProps.paymentMethodList,
            paymentMethodIds,
            newRec
          );
        const defaultPaymentMethodId =
          get(paymentMethodOptionList, '0.value') || null;
        newRec.paymentMethodId = defaultPaymentMethodId;
      }

      newRec.recordDate = recordDate;
      if (isUseMerchant(expType.merchant)) {
        const merchant =
          get(ocrInfo, 'merchant') || get(transaction, 'merchantName') || '';
        (newRec as ExpRecord).items[0].merchant = merchant;
      }
      (newRec as ExpRecord).items[0].ocrMerchant = originalOCRMerchant; // original scanned data

      // set jct invoice option and jct registration number
      if (
        expType.jctRegistrationNumberUsage &&
        stateProps.useJctRegistrationNumber
      ) {
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
        newRec.creditCardAssociation = transaction.cardAssociation;
        newRec.creditCardNo = transaction.cardNumber;
        // set cc payment method in bulk edit mode
        if (isBulkEditMode) {
          const paymentMethod = paymentMethodList.find(
            ({ integrationService, reimbursement }) =>
              integrationService === INTEGRATION_SERVICES.CorporateCard &&
              reimbursement === transaction.reimbursementFlag
          );
          newRec.paymentMethodId = get(paymentMethod, 'id') || null;
        }
      } else if (icTransaction.length === 1) {
        const { cardName, cardNo, recordId, category } = icTransaction[0];
        newRec.transitIcCardNo = cardNo;
        newRec.transitIcRecordId = recordId;
        newRec.transitIcCardName = cardName;
        const route = getRouteInfo(icTransaction[0]);
        const transitIcRecordInfo = {
          category,
          route,
        };
        newRec.transitIcRecordInfo = transitIcRecordInfo;
        // set ic payment method in bulk edit mode
        if (isBulkEditMode) {
          const paymentMethod = paymentMethodList.find(
            ({ integrationService }) =>
              integrationService === INTEGRATION_SERVICES.ICCard
          );
          newRec.paymentMethodId = get(paymentMethod, 'id') || null;
        }
      }
      newRec.items[0].amountPayable = amount;

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

          const {
            baseId = null,
            name = null,
            rate = 0,
            historyId = null,
          } = initTax || {};
          newRec.items[0].taxTypeBaseId = baseId;
          newRec.items[0].taxTypeName = name;
          newRec.items[0].taxRate = rate;
          newRec.items[0].taxTypeHistoryId = historyId;

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
            if (isBulkEditMode) dispatchProps.bulkRecordEdit();
            else dispatchProps.reportEdit();
          }

          if (isFixedAllowanceMulti(expType.recordType)) {
            const lists = get(expType, 'fixedAllowanceOptionList') || [];
            dispatchProps.setFixedAmountOption(expType.id, lists);
          }
          newRec.items[0].allowNegativeAmount = expType.allowNegativeAmount;

          if (isMultipleTax) {
            // single receipt multi tax, amount from OCR will pre-fill total amount incl tax

            newRec.items[0].taxItems[0] = {
              ...newRec.items[0].taxItems[0],
              amount: 0,
              withoutTax: 0,
              gstVat: 0,
            };

            newRec.items[0] = {
              ...newRec.items[0],
              gstVat: 0,
              withoutTax: 0,
              taxManual: false,
              taxTypeBaseId: undefined,
              taxTypeHistoryId: undefined,
              taxTypeName: undefined,
              taxRate: undefined,
            };
          }

          ownProps.onChangeEditingExpReport(
            `report.records[${idx}]`,
            newRec,
            {}
          );
          if (isBulkEditMode) dispatchProps.endBulkEditLoading();
          else {
            ownProps.onChangeEditingExpReport('ui.recordIdx', idx);
            dispatchProps.toggleRecordLoading(false);
          }
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
