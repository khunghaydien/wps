import get from 'lodash/get';

import DateUtil from '@commons/utils/DateUtil';
import {
  CalculateBaseCurrencyAmount,
  CalculateForeignCurrencyAmount,
  getResetFields,
  MileageRateInfo,
} from '@commons/utils/exp/BulkEditUtil';
import {
  calculateBCChildItemListAmount,
  calculateFCChildItemListAmount,
  updateChildItemExpType,
  updateChildItemInfo,
} from '@commons/utils/exp/ItemizationUtil';
import { toFixedNumber } from '@commons/utils/NumberUtil';

import { ExpenseType } from '@apps/domain/models/exp/ExpenseType';
import { getEIsOnly } from '@apps/domain/models/exp/ExtendedItem';
import {
  calcAmountFromRate,
  ROUNDING_TYPE,
} from '@apps/domain/models/exp/foreign-currency/Currency';
import { isUseJctNo, JCT_NUMBER_INVOICE } from '@apps/domain/models/exp/JCTNo';
import { MERCHANT_USAGE } from '@apps/domain/models/exp/Merchant';
import { getPaymentMethodOptions } from '@apps/domain/models/exp/PaymentMethod';
import {
  calculateAmountPayable,
  isCCRecord,
  isItemizedRecord,
  isMileageRecord,
  newRecord,
  RECEIPT_TYPE,
  Record,
  RECORD_TYPE,
  RecordItem,
  WITHHOLDING_TAX_TYPE,
} from '@apps/domain/models/exp/Record';
import { Report } from '@apps/domain/models/exp/Report';
import {
  AmountInputMode,
  calcAmountFromTaxExcluded,
  calculateTax,
  ExpTaxType,
  RoundingModeType,
  TaxRes,
} from '@apps/domain/models/exp/TaxType';

import { State } from '../modules';
import { AppDispatch } from '../modules/AppThunk';
import { actions as mileageRateActions } from '@apps/domain/modules/exp/mileageRate';
import { actions as recordUpdatedActions } from '@apps/expenses-pc/modules/ui/expenses/dialog/recordUpdated/dialog';

import {
  getRateFromId,
  searchChildItemTaxTypeList,
  searchCurrencyList,
  searchTaxTypeList,
} from '@apps/expenses-pc/action-dispatchers/Currency';
import {
  getExpenseTypeById,
  searchExpTypesByParentRecord,
} from '@apps/expenses-pc/action-dispatchers/ExpenseType';

/** update and clear record info */
export const updateRecordInfo =
  (
    companyId: string,
    report: Report,
    recordIdx: number,
    selectedExpenseType: ExpenseType,
    useJctRegistrationNumber?: boolean
  ) =>
  async (dispatch: AppDispatch, getState: () => State) => {
    const record = report.records[recordIdx];
    const {
      amount,
      amountInputMode,
      creditCardAssociation,
      creditCardNo,
      creditCardTransactionId,
      expPreRequestRecordId,
      mileageRouteInfo,
      ocrAmount,
      ocrDate,
      paymentMethodId,
      receiptList,
      recordId,
      remarks,
      recordDate,
      reportId,
      routeInfo,
    } = record;
    const recordItem = record.items[0];
    const {
      expMileageRateId,
      fileAttachment,
      fixedAllowanceOptionList,
      fixedAllowanceSingleAmount = 0,
      fixedForeignCurrencyId,
      foreignCurrencyUsage,
      id,
      merchant: merchantUsage,
      name,
      recordType,
      useForeignCurrency,
      withholdingTaxUsage,
      jctRegistrationNumberUsage,
      allowNegativeAmount,
      displayMultipleTaxEntryForm,
    } = selectedExpenseType;

    if (id === recordItem.expTypeId) return record;

    /** create new record, receipt setting applies to both BC & FC */
    const isReceiptNotUsed = fileAttachment === RECEIPT_TYPE.NotUsed;
    const newExpRecord = newRecord(
      id,
      name,
      recordType,
      useForeignCurrency,
      selectedExpenseType,
      useForeignCurrency, // for FC, taxTypeBaseId must set to ''
      fileAttachment,
      fixedForeignCurrencyId,
      foreignCurrencyUsage,
      amount,
      recordDate,
      ocrAmount,
      ocrDate,
      merchantUsage,
      withholdingTaxUsage,
      isReceiptNotUsed ? [] : receiptList
    ) as Record;

    const { currencyDecimalPlaces, expRoundingSetting } =
      getState().userSetting;
    const isOriginalRecordCC = isCCRecord(record);

    /** set default payment method when creating record or switching expense type */
    const isGeneralExpType = recordType === RECORD_TYPE.General;
    if (isOriginalRecordCC && isGeneralExpType) {
      // payment method remains the same for CC linked record and General expense type
      newExpRecord.paymentMethodId = paymentMethodId;
    } else {
      // set to default payment method
      newExpRecord.paymentMethodId = dispatch(
        getDefaultPaymentMethod(report.expReportTypeId, newExpRecord)
      );
    }

    /** keep existing info if selected expense type is the same as original
    & define new amount based on selected expense type */
    const isSameRecordType = recordType === record.recordType;
    let newAmount = // used in calculation below
      recordItem.useForeignCurrency !== useForeignCurrency
        ? 0
        : recordItem.useForeignCurrency
        ? recordItem.localAmount
        : amount;

    switch (recordType) {
      case RECORD_TYPE.Mileage:
        const {
          mileageRate,
          mileageRateBaseId,
          mileageRateHistoryId,
          mileageRateName,
        } = await dispatch(
          getMileageRateInfo(companyId, recordDate, expMileageRateId)
        );
        newExpRecord.items[0].mileageRate = mileageRate;
        newExpRecord.items[0].mileageRateBaseId = mileageRateBaseId;
        newExpRecord.items[0].mileageRateHistoryId = mileageRateHistoryId;
        newExpRecord.items[0].mileageRateName = mileageRateName;

        let finalMileageRouteInfo = mileageRouteInfo;
        if (
          !mileageRouteInfo ||
          !mileageRouteInfo.destinations ||
          mileageRouteInfo.destinations.length === 0
        ) {
          // New Record, no mileage route info, initialise with 2 input fields
          finalMileageRouteInfo = {
            destinations: [{ name: '' }, { name: '' }],
          };
        }
        if (!mileageRouteInfo)
          newExpRecord.mileageRouteInfo = finalMileageRouteInfo;
        if (isSameRecordType) {
          // keep mileage info & calculate amount from rate
          newExpRecord.items[0].mileageDistance = recordItem.mileageDistance;
          newAmount = Number(
            calcAmountFromRate(
              mileageRate,
              recordItem.mileageDistance,
              currencyDecimalPlaces,
              ROUNDING_TYPE.RoundUp
            )
          );
        } else {
          // reset as it requires a route
          newAmount = 0;
        }
        break;
      case RECORD_TYPE.FixedAllowanceMulti:
        // select first option as default
        const optionList = fixedAllowanceOptionList || [];
        const firstOption = optionList[0];
        if (firstOption) {
          newAmount = firstOption.allowanceAmount;
          newExpRecord.items[0].fixedAllowanceOptionId = firstOption.id;
        } else {
          newAmount = 0;
        }
        break;
      case RECORD_TYPE.FixedAllowanceSingle:
        newAmount = fixedAllowanceSingleAmount;
        break;
      case RECORD_TYPE.TransitJorudanJP:
        // keep route info
        if (isSameRecordType) newExpRecord.routeInfo = routeInfo;
        // reset as it requires a route
        else newAmount = 0;
        break;
      case RECORD_TYPE.General:
        // keep CC info
        if (isOriginalRecordCC) {
          newExpRecord.creditCardTransactionId = creditCardTransactionId;
          newExpRecord.creditCardAssociation = creditCardAssociation;
          newExpRecord.creditCardNo = creditCardNo;
        }
        break;
      default:
    }

    /** calculate BC/FC amount */
    if (useForeignCurrency) {
      const {
        amount,
        currencyId,
        currencyInfo,
        exchangeRate,
        exchangeRateManual,
        localAmount,
      } = await dispatch(
        calculateForeignCurrencyAmount(
          newAmount,
          companyId,
          currencyDecimalPlaces,
          expRoundingSetting,
          recordDate,
          fixedForeignCurrencyId
        )
      );
      newExpRecord.amount = amount;
      newExpRecord.amountPayable = amount;
      newExpRecord.items[0].amount = amount;
      newExpRecord.items[0].amountPayable = amount;
      newExpRecord.items[0].currencyId = currencyId;
      newExpRecord.items[0].currencyInfo = currencyInfo;
      newExpRecord.items[0].exchangeRate = exchangeRate;
      newExpRecord.items[0].originalExchangeRate = exchangeRate;
      newExpRecord.items[0].exchangeRateManual = exchangeRateManual;
      newExpRecord.items[0].localAmount = localAmount;
    } else {
      const {
        amount,
        amountPayable,
        gstVat,
        taxTypeBaseId,
        taxTypeHistoryId,
        taxTypeName,
        taxRate,
        withoutTax,
      } = await dispatch(
        calculateBaseCurrencyAmount(
          newAmount,
          amountInputMode,
          currencyDecimalPlaces,
          expRoundingSetting,
          recordDate,
          id,
          recordItem.withholdingTaxAmount,
          withholdingTaxUsage
        )
      );
      newExpRecord.amount = amount;
      newExpRecord.amountPayable = amountPayable;
      newExpRecord.withoutTax = withoutTax;
      newExpRecord.items[0].amount = amount;
      newExpRecord.items[0].amountPayable = amountPayable;
      newExpRecord.items[0].gstVat = gstVat;
      newExpRecord.items[0].withoutTax = withoutTax;
      newExpRecord.items[0].taxTypeBaseId = taxTypeBaseId;
      newExpRecord.items[0].taxTypeHistoryId = taxTypeHistoryId;
      newExpRecord.items[0].taxTypeName = taxTypeName;
      newExpRecord.items[0].taxRate = taxRate;
      newExpRecord.items[0].taxManual = recordItem.taxManual;

      const isMultipleTax = displayMultipleTaxEntryForm;

      if (isMultipleTax) {
        const taxTypeList = await dispatch(
          searchTaxTypeList(id, recordDate, null, true)
        )
          // @ts-ignore
          .then((result) => get(result, `payload.${id}.${recordDate}`, []));

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

        newExpRecord.items[0] = {
          ...newExpRecord.items[0],
          amount,
          amountPayable,
          gstVat: 0,
          withoutTax: 0,
          taxItems: taxItemsSkeleton,
          taxManual: false,
          taxTypeBaseId: undefined,
          taxTypeHistoryId: undefined,
          taxTypeName: undefined,
          taxRate: undefined,
        };
      }
    }

    /** remaining fields that apply to both BC & FC */
    newExpRecord.expPreRequestRecordId = expPreRequestRecordId || null;
    // merchant
    if (merchantUsage !== MERCHANT_USAGE.NotUsed) {
      newExpRecord.items[0].merchant = recordItem.merchant;
    }
    // jct invoice option
    if (jctRegistrationNumberUsage && useJctRegistrationNumber) {
      newExpRecord.jctRegistrationNumberUsage = jctRegistrationNumberUsage;
      if (isUseJctNo(jctRegistrationNumberUsage)) {
        newExpRecord.items[0].jctInvoiceOption =
          recordItem.jctInvoiceOption || JCT_NUMBER_INVOICE.Invoice;
        newExpRecord.items[0].jctRegistrationNumber =
          recordItem.jctRegistrationNumber;
      }
    }

    // extended items
    const extendedItems = getEIsOnly(selectedExpenseType, record.items[0]);
    newExpRecord.items[0] = { ...newExpRecord.items[0], ...extendedItems };
    // remarks
    newExpRecord.remarks = remarks;
    newExpRecord.items[0].remarks = recordItem.remarks;
    newExpRecord.items[0].allowNegativeAmount = allowNegativeAmount;

    return {
      ...newExpRecord,
      recordId,
      reportId,
    };
  };

const getDefaultPaymentMethod =
  (reportTypeId: string, record: Record) => (_, getState: () => State) => {
    const reportTypeList =
      getState().entities.exp.expenseReportType.list.active;
    const paymentMethodList = getState().common.exp.entities.paymentMethodList;
    const selectedReportType = reportTypeList.find(
      ({ id }) => id === reportTypeId
    );
    const paymentMethodIds = get(selectedReportType, 'paymentMethodIds', []);
    const paymentMethodOptionList = getPaymentMethodOptions(
      paymentMethodList,
      paymentMethodIds,
      record
    );
    return get(paymentMethodOptionList, '0.value') || null;
  };

export const getCurrencyList =
  (companyId: string) =>
  async (dispatch: AppDispatch, getState: () => State) => {
    const reduxCurrencyList =
      getState().ui.expenses.recordItemPane.foreignCurrency.currency;
    return reduxCurrencyList.length === 0
      ? await dispatch(searchCurrencyList(companyId))
      : reduxCurrencyList;
  };

/** fetch currency and exchange rate info to calculate foreign currency amount / localAmount */
export const calculateForeignCurrencyAmount =
  (
    amount: number,
    companyId: string,
    currencyDecimalPlaces: number,
    expRoundingSetting: string,
    recordDate: string,
    fixedForeignCurrencyId?: string,
    selectedCurrencyId?: string
  ) =>
  async (dispatch: AppDispatch): Promise<CalculateForeignCurrencyAmount> => {
    // get currency list, exchange rate, currency info
    const currencyList = await dispatch(getCurrencyList(companyId));
    const currencyId =
      selectedCurrencyId || fixedForeignCurrencyId || currencyList[0].id;
    const exchangeRate = await dispatch(
      getRateFromId(companyId, currencyId, recordDate)
    );
    const {
      decimalPlaces = 0,
      isoCurrencyCode = '',
      name = '',
      symbol = '',
    } = currencyList.find(({ id }) => id === currencyId) || {};
    // calculate amount
    const localAmount = toFixedNumber(amount, decimalPlaces);
    const newAmount = calcAmountFromRate(
      exchangeRate,
      localAmount,
      currencyDecimalPlaces,
      expRoundingSetting
    );
    return {
      amount: Number(newAmount),
      currencyId,
      currencyInfo: {
        code: isoCurrencyCode,
        decimalPlaces,
        name,
        symbol,
      },
      exchangeRate,
      exchangeRateManual: exchangeRate === 0,
      localAmount,
    };
  };

/** calculate amount, amount payable, withoutTax, gstVat based on tax type  */
export const calculateBaseCurrencyAmount =
  (
    amount: number,
    amountInputMode: string,
    currencyDecimalPlaces: number,
    expRoundingSetting: string,
    recordDate: string,
    selectedExpTypeId: string,
    withholdingTaxAmount: number,
    withholdingTaxUsage: string
  ) =>
  async (
    dispatch: AppDispatch,
    getState: () => State
  ): Promise<CalculateBaseCurrencyAmount> => {
    // get tax type list of selected expense type
    const reduxTaxTypeList = getState().ui.expenses.recordItemPane.tax;
    const selectedTaxType = get(reduxTaxTypeList, [
      selectedExpTypeId,
      recordDate,
      '0',
    ]);
    let taxType = {} as ExpTaxType;
    if (selectedTaxType) {
      taxType = selectedTaxType;
    } else {
      const taxTypeList = await dispatch(
        searchTaxTypeList(selectedExpTypeId, recordDate)
      );
      taxType = get(
        taxTypeList,
        `payload.${selectedExpTypeId}.${recordDate}.0`,
        {}
      );
    }
    const { baseId = '', historyId = '', name = '', rate = 0 } = taxType;
    const isTaxIncluded = amountInputMode === AmountInputMode.TaxIncluded;
    const calculateTaxAction = isTaxIncluded
      ? calculateTax
      : calcAmountFromTaxExcluded;
    const { amountWithoutTax, amountWithTax, gstVat }: TaxRes =
      calculateTaxAction(
        rate,
        amount,
        currencyDecimalPlaces,
        expRoundingSetting as RoundingModeType
      );
    // calculate amount payable
    const newAmount = isTaxIncluded ? amount : amountWithTax;
    const itemWithoutTax = isTaxIncluded ? amountWithoutTax : amount;
    const amountPayable =
      withholdingTaxUsage !== WITHHOLDING_TAX_TYPE.NotUsed
        ? calculateAmountPayable(
            newAmount,
            currencyDecimalPlaces,
            withholdingTaxAmount
          )
        : amount;
    return {
      amount: newAmount,
      amountPayable,
      gstVat,
      taxTypeBaseId: baseId,
      taxTypeHistoryId: historyId,
      taxTypeName: name,
      taxRate: rate,
      withoutTax: itemWithoutTax,
    };
  };

/** get mileage rate */
export const getMileageRateInfo =
  (companyId: string, recordDate: string, selectedMileageRateBaseId?: string) =>
  async (dispatch: AppDispatch): Promise<MileageRateInfo> => {
    const mileageRateList =
      (await dispatch(
        mileageRateActions.search({
          companyId,
          targetDate: recordDate,
        })
      )) || [];
    const mileageRate = selectedMileageRateBaseId
      ? mileageRateList.find(({ id }) => id === selectedMileageRateBaseId)
      : mileageRateList[0];
    const { historyId = null, id = null, name = null, rate = 0 } = mileageRate;
    return {
      mileageRate: rate,
      mileageRateBaseId: id,
      mileageRateHistoryId: historyId,
      mileageRateName: name,
    };
  };

export const getRecordsClonedToSpecifiedDate =
  (dates: Date[], recordIdxList: number[], report: Report) =>
  async (dispatch: AppDispatch, getState: () => State) => {
    const { companyId, currencyDecimalPlaces, expRoundingSetting } =
      getState().userSetting;
    const recordUpdateInfo = [];
    const { empHistoryId, records } = report;

    const cloneFromRecordPromiseList = recordIdxList.map(
      async (idx: number) => {
        const cloneFromRecord = records[idx];

        if (!cloneFromRecord) return [];

        const isItemized = isItemizedRecord(cloneFromRecord.items.length);

        const { name = '' } = await dispatch(
          getExpenseTypeById(cloneFromRecord.items[0].expTypeId, empHistoryId)
        );
        const clonedRecordList = dates.map(async (date: Date) => {
          const selectedDate = DateUtil.format(date.toString(), 'YYYY-MM-DD');
          const resetFields = getResetFields(cloneFromRecord, selectedDate);
          const {
            amount,
            amountInputMode,
            items,
            recordType,
            withholdingTaxUsage,
          } = cloneFromRecord;
          const {
            currencyId,
            exchangeRate,
            exchangeRateManual,
            expTypeId,
            fixedForeignCurrencyId,
            localAmount,
            mileageDistance,
            mileageRate,
            taxRate,
            useForeignCurrency,
            withholdingTaxAmount,
          } = items[0];

          if (selectedDate === cloneFromRecord.recordDate) return resetFields;

          const { items: resetRecordItems, ...rest } = resetFields;
          const [_, ...resetChildItemList] = resetRecordItems;
          let updatedItemList = resetRecordItems;

          if (isItemized) {
            const expTypList = await dispatch(
              searchExpTypesByParentRecord(selectedDate, expTypeId)
            );
            const updateExpTypeObj = updateChildItemExpType(
              resetChildItemList,
              expTypList
            );
            updatedItemList = updateChildItemInfo(
              updateExpTypeObj,
              resetRecordItems
            );
          }

          const [parentItem = {} as RecordItem, ...childItemList] =
            updatedItemList;

          if (useForeignCurrency) {
            if (exchangeRateManual) {
              const exchangeRate = await dispatch(
                getRateFromId(companyId, currencyId, selectedDate)
              );

              const updatedChildItemList = isItemized
                ? childItemList.map((childItem) => ({
                    ...childItem,
                    originalExchangeRate: exchangeRate,
                  }))
                : [];

              return {
                ...rest,
                recordDate: selectedDate,
                items: [
                  {
                    ...parentItem,
                    recordDate: selectedDate,
                    originalExchangeRate: exchangeRate,
                  },
                  ...updatedChildItemList,
                ],
              };
            }

            const {
              amount: newAmount,
              currencyId: newCurrencyId,
              currencyInfo,
              exchangeRate: newExchangeRate,
              exchangeRateManual: newExchangeRateManual,
              localAmount: newLocalAmount,
            } = await dispatch(
              calculateForeignCurrencyAmount(
                localAmount,
                companyId,
                currencyDecimalPlaces,
                expRoundingSetting,
                selectedDate,
                fixedForeignCurrencyId,
                currencyId
              )
            );

            if (newExchangeRate !== exchangeRate) {
              recordUpdateInfo.push({
                expenseTypeName: name,
                isForeignCurrency: useForeignCurrency,
                recordDate: date,
                recordType,
              });
            }

            const updatedParentItemList = [
              {
                ...parentItem,
                recordDate: selectedDate,
                amount: newAmount,
                amountPayable: newAmount,
                currencyId: newCurrencyId,
                currencyInfo,
                exchangeRate: newExchangeRate,
                originalExchangeRate: newExchangeRate,
                exchangeRateManual: newExchangeRateManual,
                localAmount: newLocalAmount,
              },
            ] as RecordItem[];
            let updatedChildItemList = [];

            if (isItemized) {
              const itemList = updatedParentItemList.concat(childItemList);
              const firstChildExchangeRate = get(itemList, '1.exchangeRate', 0);
              const parentExchangeRate = get(itemList, '0.exchangeRate', 0);
              const isExchangeRateChanged =
                firstChildExchangeRate !== parentExchangeRate;
              updatedChildItemList = isExchangeRateChanged
                ? calculateFCChildItemListAmount(
                    currencyDecimalPlaces,
                    expRoundingSetting,
                    itemList
                  )
                : childItemList;
            }

            return {
              ...rest,
              recordDate: selectedDate,
              amount: newAmount,
              amountPayable: newAmount,
              items: [...updatedParentItemList, ...updatedChildItemList],
            };
          }

          let isMileageRateDifferent = false;
          // mileage rate
          let newAmount = amount;
          let mileageRateUpdateObj = {} as MileageRateInfo;
          if (isMileageRecord(recordType)) {
            mileageRateUpdateObj = await dispatch(
              getMileageRateInfo(companyId, selectedDate)
            );
            isMileageRateDifferent =
              mileageRateUpdateObj.mileageRate !== mileageRate;
            if (isMileageRateDifferent) {
              newAmount = Number(
                calcAmountFromRate(
                  mileageRateUpdateObj.mileageRate,
                  mileageDistance,
                  currencyDecimalPlaces,
                  ROUNDING_TYPE.RoundUp
                )
              );
            }
          }

          // tax rate
          const {
            amount: finalAmount,
            amountPayable,
            gstVat,
            taxTypeBaseId,
            taxTypeHistoryId,
            taxTypeName,
            taxRate: newTaxRate,
            withoutTax,
          } = await dispatch(
            calculateBaseCurrencyAmount(
              newAmount,
              amountInputMode,
              currencyDecimalPlaces,
              expRoundingSetting,
              selectedDate,
              expTypeId,
              withholdingTaxAmount,
              withholdingTaxUsage
            )
          );
          if (isMileageRateDifferent || newTaxRate !== taxRate) {
            recordUpdateInfo.push({
              expenseTypeName: name,
              isForeignCurrency: useForeignCurrency,
              recordDate: date,
              recordType,
            });
          }

          const updatedParentItem = {
            ...parentItem,
            ...mileageRateUpdateObj,
            recordDate: selectedDate,
            amount: finalAmount,
            amountPayable,
            gstVat,
            withoutTax,
            taxTypeBaseId,
            taxTypeHistoryId,
            taxTypeName,
            taxRate: newTaxRate,
          } as RecordItem;
          let updatedBCItemList = [updatedParentItem];

          if (isItemized) {
            const taxTypeObj = await dispatch(
              searchChildItemTaxTypeList(childItemList, selectedDate)
            );
            const updateChildItemObj = calculateBCChildItemListAmount(
              amountInputMode,
              currencyDecimalPlaces,
              childItemList,
              selectedDate,
              expRoundingSetting as RoundingModeType,
              taxTypeObj
            );
            const itemList = updatedBCItemList.concat(childItemList);
            updatedBCItemList = updateChildItemInfo(
              updateChildItemObj,
              itemList
            );
          }

          return {
            ...rest,
            recordDate: selectedDate,
            amount: finalAmount,
            amountPayable,
            withoutTax,
            items: updatedBCItemList,
          };
        });
        return Promise.all(clonedRecordList);
      }
    );
    return Promise.all(cloneFromRecordPromiseList).then((cloneRecordList) => {
      const isShowRecordUpdateDialog = recordUpdateInfo.length > 0;
      if (isShowRecordUpdateDialog) {
        dispatch(recordUpdatedActions.setCloneUpdate(recordUpdateInfo));
      }
      return {
        clonedRecordList: cloneRecordList.flat(),
        isShowRecordUpdateDialog,
      };
    });
  };
