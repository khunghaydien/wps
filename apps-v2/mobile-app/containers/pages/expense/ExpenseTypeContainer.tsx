import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';

import {
  goBack,
  pushHistoryWithPrePage,
} from '@mobile/concerns/routingHistory';

import { isUseMerchant } from '../../../../domain/models/exp/Merchant';
import {
  getCCExcludedRecordTypes,
  isMileageRecord,
  newRecord,
  RECEIPT_TYPE,
  RECORD_TYPE,
  RECORD_TYPE_CATEGORY,
} from '../../../../domain/models/exp/Record';
import { Transaction } from '@apps/domain/models/exp/CreditCard';
import { ExpenseType } from '@apps/domain/models/exp/ExpenseType';
import { isUseJctNo, JCT_NUMBER_INVOICE } from '@apps/domain/models/exp/JCTNo';
import { initialDestinations } from '@apps/domain/models/exp/Mileage';
import {
  generateRecordsFromOCRReceipts,
  getLatestOCRDate,
  isBulkRecordUsingDiffReceipts,
} from '@apps/domain/models/exp/OCR';
import {
  generateRecordsFromICTrans,
  getICTransInfo,
  getLatestICDate,
} from '@apps/domain/models/exp/TransportICCard';

import { State } from '../../../modules';
import { actions as routeFormPageActions } from '../../../modules/expense/pages/routeFormPage';
import { actions as selectedCCTransactionActions } from '../../../modules/expense/ui/creditCard/selectedTransactions';
import { actions as formValueAction } from '../../../modules/expense/ui/general/formValues';
import { actions as selectedICTransactionsActions } from '../../../modules/expense/ui/icCard/selectedTransactions';
import { actions as ocrDetailActions } from '../../../modules/expense/ui/ocrDetail';
import { actions as selectedOCRReceiptAction } from '../../../modules/expense/ui/selectedOCRReceipt';
import { actions as mileageActions } from '@mobile/modules/expense/ui/mileage';
import { actions as selectedExpTypeActions } from '@mobile/modules/expense/ui/selectedExpType';

import {
  getExpenseTypeById,
  getExpenseTypeList,
  searchExpenseType,
} from '../../../action-dispatchers/expense/ExpenseType';
import { createMultiRecords } from '../../../action-dispatchers/expense/Record';
import { searchTaxListByDateExpType } from '../../../action-dispatchers/expense/TaxType';
import { getPaymentMethodOptionList } from '@mobile/action-dispatchers/expense/PaymentMethod';

import ExpTypeComponent from '../../../components/pages/expense/Record/New/General/ExpenseType';

type OwnProps = RouteComponentProps & {
  type: string;
  recordType?: string;
  parentGroupId?: string;
  parentParentGroupId?: string;
  keyword?: string;
  level?: number;
};

const ExpenseTypeContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const routeFormPage = useSelector(
    (state: State) => state.expense.pages.routeFormPage
  );
  const generalFormValues = useSelector(
    (state: State) => state.expense.ui.general.formValues
  );
  const expenseTypeList = useSelector(
    (state: State) => state.expense.entities.expenseTypeList.records
  );
  const selectedICTransactions = useSelector(
    (state: State) => state.expense.ui.icCard.selectedTransactions
  );
  const selectedCCTransaction = useSelector(
    (state: State) => state.expense.ui.creditCard.selectedTransactions
  );
  const hasMore = useSelector(
    (state: State) => state.expense.entities.expenseTypeList.hasMore
  );
  const accountingDate = useSelector(
    (state: State) => state.expense.entities.report.accountingDate
  );
  const selectedOCRReceipt = useSelector(
    (state: State) => state.expense.ui.selectedOCRReceipt
  );
  const taxRoundingSetting = useSelector(
    (state: State) => state.userSetting.expTaxRoundingSetting
  );
  const baseCurrencyDecimal = useSelector(
    (state: State) => state.userSetting.currencyDecimalPlaces
  );
  const reportId = useSelector(
    (state: State) => state.expense.entities.report.reportId
  );
  const reportTypeId = useSelector(
    (state: State) => state.expense.entities.report.expReportTypeId
  );
  const employeeId = useSelector(
    (state: State) => state.userSetting.employeeId
  );
  const ocrDetail = useSelector((state: State) => state.expense.ui.ocrDetail);
  const selectedReportType = useSelector(
    (state: State) => state.expense.entities.selectedReportType
  );
  const isUseCashAdvance = get(selectedReportType, 'useCashAdvance');

  const employeeDetails = useSelector(
    (state: State) => state.common.exp.entities.employeeDetails
  );
  const subroleId = get(employeeDetails, 'selectedRole');

  const useJctRegistrationNumber = useSelector(
    (state: State) => state.userSetting.jctInvoiceManagement
  );

  const recordType =
    ownProps.recordType ||
    get(ownProps.history, 'location.state.recordType', '');

  const formValues =
    recordType === RECORD_TYPE.TransitJorudanJP
      ? routeFormPage
      : generalFormValues;

  useEffect(() => {
    const finalReportTypeId = reportTypeId;
    const formDate = accountingDate;
    const icTransactionDate = getLatestICDate(selectedICTransactions);
    const ccTransactionDate = get(selectedCCTransaction, '0.transactionDate');

    const targetDate =
      getLatestOCRDate(ocrDetail) ||
      icTransactionDate ||
      ccTransactionDate ||
      formDate;
    const isCCTrans = !isEmpty(selectedCCTransaction);
    const excludedRecordTypes = isCCTrans
      ? getCCExcludedRecordTypes()
      : undefined;
    if (ownProps.type === 'list') {
      const parentGroupId = ownProps.parentGroupId || null;
      dispatch(
        getExpenseTypeList(
          null,
          parentGroupId,
          targetDate,
          isCCTrans ? '' : recordType,
          finalReportTypeId,
          false,
          subroleId,
          excludedRecordTypes
        )
      );
    } else {
      const keyword = ownProps.keyword || '';
      dispatch(
        searchExpenseType(
          companyId,
          decodeURIComponent(keyword),
          targetDate,
          isCCTrans ? '' : recordType,
          finalReportTypeId,
          undefined,
          excludedRecordTypes
        )
      );
    }

    return () => {
      const pathname = get(ownProps.history, 'location.pathname', '');
      const isNavigateToExpType = pathname.includes('expense-type/');
      const isBackToTransactions = pathname.includes('/transactions');
      const isBackToOCRDetail = pathname.includes('/ocr-confirm');

      if (!isNavigateToExpType && !isBackToTransactions && !isBackToOCRDetail) {
        // don't clear selected trans if search exp type
        dispatch(selectedICTransactionsActions.clear());
        dispatch(selectedCCTransactionActions.clear());
        dispatch(selectedOCRReceiptAction.clear());
        dispatch(ocrDetailActions.reset());
      }
    };
  }, []);

  const getCCTransInfo = (transaction: Transaction) => {
    const {
      id,
      amount,
      cardAssociation,
      cardNumber,
      transactionDate: recordDate,
      transactionDescription,
      merchantName,
    } = transaction;
    const desc = transactionDescription || '';
    const merchant = merchantName ? `${merchantName}: ` : '';
    const remarks = merchant + desc;

    const recordLevelInfo = {
      amount,
      recordDate,
      creditCardAssociation: cardAssociation,
      creditCardNo: cardNumber,
      creditCardTransactionId: id || null,
    };
    const itemLevelInfo = {
      amount,
      recordDate,
      remarks,
      amountPayable: amount,
    };
    return { recordLevelInfo, itemLevelInfo };
  };

  const onSearchClick = (keyword: string) => {
    if (keyword === null) {
      return;
    }
    let level = 2;
    if (ownProps.parentParentGroupId) {
      level = 4;
    } else if (ownProps.parentGroupId) {
      level = 3;
    }

    // Special handling of % because it could not be sanitized with react router.
    const sanitizedKeyword = encodeURIComponent(keyword.replace(/%/g, '%25'));
    const urlPath = `/expense/expense-type/search/keyword=${sanitizedKeyword}/${level}`;
    const state = {
      target: get(ownProps.history, 'location.state.target'),
      recordType,
      recordId: get(ownProps.history, 'location.state.recordId'),
    };
    pushHistoryWithPrePage(ownProps.history, urlPath, state);
  };

  const onRowClick = async (expenseType: ExpenseType) => {
    const { history } = ownProps;
    const target = get(history, 'location.state.target');

    const isRowGroup = expenseType.isGroup;
    const isJorudanRecord =
      expenseType.recordType === RECORD_TYPE.TransitJorudanJP;
    const isMileageRec = isMileageRecord(expenseType.recordType);
    const recordId = get(history, 'location.state.recordId');

    const initValues = {
      recordDate: accountingDate,
      reportId,
      reportTypeId,
      items: [
        {
          expTypeId: expenseType.id,
          remarks: '',
          currencyId: '',
          taxTypeBaseId: '',
          taxTypeHistoryId: '',
          taxTypeName: '',
        },
      ],
    };
    // Records created through Add Record button in record list and report detail screen
    switch (true) {
      case isRowGroup:
        if (ownProps.recordType === RECORD_TYPE_CATEGORY.all) {
          // @ts-ignore
          dispatch(formValueAction.save(initValues));
        }

        pushHistoryWithPrePage(
          history,
          `${ownProps.history.location.pathname}/${expenseType.id}`,
          { target, recordId }
        );
        break;
      case isJorudanRecord:
        const routeForm = cloneDeep(formValues);

        routeForm.expenseType = expenseType.name;
        routeForm.expenseTypeId = expenseType.id;
        dispatch(routeFormPageActions.save(routeForm));

        if (recordId) {
          // existing report record
          history.push(`/expense/report/route/edit/${recordId}/${reportId}`);
        } else {
          // new report record
          dispatch(
            // @ts-ignore
            formValueAction.save({
              ...cloneDeep(newRecord('', '', expenseType.recordType)),
              ...initValues,
            })
          );
          history.push(`/expense/report/route/new`, { target });
        }

        dispatch(selectedExpTypeActions.set(expenseType));
        break;

      default:
        const toForeignCurrency = expenseType.useForeignCurrency;
        const finalFormValues = {
          ...initValues,
          ...cloneDeep(formValues),
          ...(isMileageRec
            ? { mileageRouteInfo: { destinations: initialDestinations } }
            : {}),
        };

        if (isMileageRec) dispatch(mileageActions.setIsGeneratedPreview(false));

        const isExpTypeChanged =
          finalFormValues.items[0].expTypeId !== expenseType.id;
        let record = finalFormValues;
        // generate new record if change expense type
        // Initialize record with report header date or today when added through report detail or record list page
        if (isExpTypeChanged) {
          record = newRecord(
            expenseType.id,
            expenseType.name,
            expenseType.recordType,
            expenseType.useForeignCurrency,
            expenseType,
            true,
            expenseType.fileAttachment,
            expenseType.fixedForeignCurrencyId,
            expenseType.foreignCurrencyUsage,
            0,
            finalFormValues.recordDate,
            null,
            null,
            expenseType.merchant
          );
          record.items[0].remarks = finalFormValues.items[0].remarks;
          record.items[0].allowNegativeAmount = expenseType.allowNegativeAmount;

          if (finalFormValues.reportId) {
            record.reportId = finalFormValues.reportId;
          }

          if (toForeignCurrency) {
            // keep selected currency
            record.items[0].currencyId =
              expenseType.fixedForeignCurrencyId ||
              finalFormValues.items[0].currencyId;
          }
          record.recordId = finalFormValues.recordId;
          record.items[0].itemId = finalFormValues.items[0].itemId; // Temporary fix, change RecordItem for multiple items

          // set jct invoice option and clear jct registration number
          if (
            expenseType.jctRegistrationNumberUsage &&
            useJctRegistrationNumber
          ) {
            record.jctRegistrationNumberUsage =
              expenseType.jctRegistrationNumberUsage;
            if (isUseJctNo(expenseType.jctRegistrationNumberUsage)) {
              record.items[0].jctInvoiceOption = JCT_NUMBER_INVOICE.Invoice;
            }
          }

          // copy all previous extended item values on change of expense type
          Object.keys(finalFormValues.items[0]).forEach((x) => {
            if (
              x.includes('extendedItem') ||
              x.includes('costCenter') ||
              x.includes('job')
            ) {
              record.items[0][x] = finalFormValues.items[0][x];
            }
          });

          if (expenseType.fileAttachment !== RECEIPT_TYPE.NotUsed) {
            const { receiptList } = finalFormValues;
            record.receiptList = receiptList;
          }
        }

        if (!isExpTypeChanged) {
          const selectedOCRReceipts = selectedOCRReceipt;

          if (isBulkRecordUsingDiffReceipts(ocrDetail)) {
            // get tax type info
            const ocrDates = selectedOCRReceipts.map(
              (_, index) => ocrDetail[index].recordDate
            );
            const uniqOcrDates: string[] = uniq(ocrDates);
            const taxTypeListRes = await Promise.all(
              uniqOcrDates.map((date) =>
                dispatch(searchTaxListByDateExpType(expenseType.id, date))
              )
            );
            const taxTypesByDates = uniqOcrDates.reduce((acc, date, i) => {
              const taxesOnTheDay = taxTypeListRes[i][0];
              return { ...acc, [date]: taxesOnTheDay };
            }, {});

            const expTypeWithEI = await dispatch(
              getExpenseTypeById(expenseType.id, 'REPORT')
            );
            const allowNegativeAmount = get(
              expTypeWithEI,
              '0.allowNegativeAmount',
              false
            );
            const records = generateRecordsFromOCRReceipts(
              true,
              selectedOCRReceipts,
              ocrDetail,
              expTypeWithEI[0],
              employeeId,
              reportId,
              taxTypesByDates,
              taxRoundingSetting,
              baseCurrencyDecimal,
              isUseCashAdvance,
              reportTypeId,
              allowNegativeAmount,
              useJctRegistrationNumber
            );

            await dispatch(createMultiRecords(records, reportId, reportTypeId));
            const urlPath = `/expense/report/detail/${reportId}`;
            ownProps.history.push(urlPath);
            return;
          }

          const {
            receiptId,
            receiptFileExtension,
            receiptFileId,
            receiptDataType,
            title: receiptTitle,
            uploadedDate: receiptCreatedDate,
            ocrInfo,
          } = selectedOCRReceipt[0] || {};

          /*
           * OCR record: ocrAmount = 0, ocrDate = '' if no scanned result
           * Normal record: ocrAmount = null, ocrDate = null
           */
          const originalOCRAmount = ocrInfo && (ocrInfo.amount || 0);
          const originalOCRDate = ocrInfo && (ocrInfo.recordDate || '');
          const originalOCRMerchant = ocrInfo && (ocrInfo.merchant || '');
          const originalOCRJctRegistrationNumber =
            ocrDetail && get(ocrDetail[0], 'jctRegistrationNumber');

          // ocr detail manually input by user
          const amount = get(ocrDetail[0], 'amount') || 0;
          const ocrDetailDate = get(ocrDetail[0], 'recordDate');

          const targetDate = finalFormValues.recordDate;

          if (selectedICTransactions.length > 1) {
            const icDates = selectedICTransactions.map(
              ({ paymentDate }) => paymentDate
            );
            const uniqICDates = uniq(icDates) as string[];
            let taxTypesByDates = {};
            const res = await Promise.all(
              uniqICDates.map((date) =>
                dispatch(searchTaxListByDateExpType(expenseType.id, date))
              )
            );
            for (let i = 0; i < uniqICDates.length; i++) {
              const date = uniqICDates[i];
              const taxList = res[i][0];
              taxTypesByDates = { ...taxTypesByDates, [date]: taxList };
            }

            const expTypeWithEI = await dispatch(
              getExpenseTypeById(expenseType.id, 'REPORT')
            );
            // if multiple IC transactions selected, create multiple records immediately
            const _ = undefined;
            const records = generateRecordsFromICTrans(
              selectedICTransactions,
              expTypeWithEI[0],
              employeeId,
              reportId,
              taxTypesByDates,
              taxRoundingSetting,
              baseCurrencyDecimal,
              isUseCashAdvance,
              _,
              _,
              useJctRegistrationNumber
            );
            await dispatch(createMultiRecords(records, reportId, reportTypeId));
            const urlPath = `/expense/report/detail/${reportId}`;
            ownProps.history.push(urlPath);
            return;
          }

          let transInfo = { recordLevelInfo: {}, itemLevelInfo: {} };
          if (selectedICTransactions.length === 1) {
            transInfo = getICTransInfo(selectedICTransactions[0]);
          } else if (selectedCCTransaction.length > 0) {
            transInfo = getCCTransInfo(selectedCCTransaction[0]);
          }

          const receiptList = [];
          if (receiptId) {
            receiptList.push({
              receiptId,
              receiptFileId,
              receiptDataType,
              receiptTitle,
              receiptCreatedDate,
              receiptFileExtension,
            });
          }

          record = newRecord(
            expenseType.id,
            expenseType.name,
            expenseType.recordType,
            expenseType.useForeignCurrency,
            expenseType,
            true,
            expenseType.fileAttachment,
            expenseType.fixedForeignCurrencyId,
            expenseType.foreignCurrencyUsage,
            amount,
            ocrDetailDate || targetDate,
            originalOCRAmount,
            originalOCRDate,
            expenseType.merchant,
            undefined,
            receiptList
          );
          record = {
            ...record,
            ...transInfo.recordLevelInfo,
          };
          record.items[0] = {
            ...record.items[0],
            ...transInfo.itemLevelInfo,
            allowNegativeAmount: expenseType.allowNegativeAmount,
          };
          if (isUseMerchant(expenseType.merchant)) {
            const merchant =
              ocrDetail[0]?.merchant ||
              get(selectedCCTransaction, '0.merchantName') ||
              '';
            record.items[0].merchant = merchant;
          }
          record.items[0].ocrMerchant = originalOCRMerchant; // original scanned data

          if (
            expenseType.jctRegistrationNumberUsage &&
            useJctRegistrationNumber
          ) {
            record.jctRegistrationNumberUsage =
              expenseType.jctRegistrationNumberUsage;
            if (isUseJctNo(expenseType.jctRegistrationNumberUsage)) {
              record.items[0].jctInvoiceOption = JCT_NUMBER_INVOICE.Invoice;
              record.items[0].jctRegistrationNumber =
                originalOCRJctRegistrationNumber; // original scanned data
            }
          }

          if (finalFormValues.reportId) {
            record.reportId = finalFormValues.reportId;
          }
          if (toForeignCurrency) {
            record.items[0].currencyId = expenseType.fixedForeignCurrencyId;
          }
        }

        // get & set payment method option list for new record
        const paymentMethodOptionList = await dispatch(
          getPaymentMethodOptionList(record, isJorudanRecord)
        );
        record.paymentMethodId =
          get(paymentMethodOptionList, '0.value') || null;
        dispatch(formValueAction.save(record));
        // redirect
        if (record.recordId) {
          const url = formValues.reportId
            ? `/expense/record/detail/${formValues.reportId}/${record.recordId}`
            : `/expense/record/detail/${record.recordId}`;
          pushHistoryWithPrePage(ownProps.history, url, {
            isExpTypeChanged,
          });
        } else {
          const targetReport = 'report';
          const path = `/expense/report/record/new/general`;
          pushHistoryWithPrePage(ownProps.history, path, {
            isExpTypeChanged,
            target: targetReport,
          });
        }

        break;
    }
  };

  const onBackClick = () => {
    goBack(ownProps.history);
  };

  return (
    <ExpTypeComponent
      keyword={ownProps.keyword}
      hasMore={hasMore}
      expenseTypeList={expenseTypeList}
      selectedCCTransaction={selectedCCTransaction}
      selectedOCRReceipt={selectedOCRReceipt[0]}
      onBackClick={onBackClick}
      onSearchClick={onSearchClick}
      onRowClick={onRowClick}
    />
  );
};

export default ExpenseTypeContainer;
