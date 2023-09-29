import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { compose } from 'redux';

import { FormikValues, withFormik } from 'formik';
import { cloneDeep, find, get, isEmpty } from 'lodash';

import { pushHistoryWithPrePage } from '@mobile/concerns/routingHistory';
import itemSchema from '@mobile/schema/ItemNewSchema';
import recordSchema from '@mobile/schema/request/RecordNewSchema';

import msg from '@apps/commons/languages';
import { showToast } from '@apps/commons/modules/toast';
import AppPermissionUtil from '@apps/commons/utils/AppPermissionUtil';
import DateUtil from '@apps/commons/utils/DateUtil';
import { getItemLatestCostCenter } from '@commons/action-dispatchers/CostCenter';
import { showConfirm } from '@mobile/modules/commons/confirm';
import { endLoading, startLoading } from '@mobile/modules/commons/loading';

import STATUS from '@apps/domain/models/approval/request/Status';
import { ExpenseType } from '@apps/domain/models/exp/ExpenseType';
import { getEIsOnly } from '@apps/domain/models/exp/ExtendedItem';
import {
  calcAmountFromRate,
  CurrencyList,
} from '@apps/domain/models/exp/foreign-currency/Currency';
import { JCT_NUMBER_INVOICE } from '@apps/domain/models/exp/JCTNo';
import {
  initialDestinations,
  MileageRate,
} from '@apps/domain/models/exp/Mileage';
import {
  isMileageRecord,
  isUseWithholdingTax,
  newRecord,
  newRecordItem,
  Record,
  RECORD_TYPE,
  RECORD_TYPE_CATEGORY,
  RecordItem,
} from '@apps/domain/models/exp/Record';
import { getDisplayOfRecordVendor } from '@apps/domain/models/exp/Report';
import { calculateTax } from '@apps/domain/models/exp/TaxType';

import { actions as selectedIcCardActions } from '../../../modules/expense/ui/icCard/selectedCard';
import { State } from '@mobile/modules';
import { actions as fileMetadataActions } from '@mobile/modules/expense/entities/fileMetadata';
import { actions as customHintUIActions } from '@mobile/modules/expense/ui/customHint/list';
import { actions as formValueAction } from '@mobile/modules/expense/ui/general/formValues';
import { actions as itemValueAction } from '@mobile/modules/expense/ui/general/itemValues';
import { actions as rateAction } from '@mobile/modules/expense/ui/general/rate';
import { actions as readOnlyAction } from '@mobile/modules/expense/ui/general/readOnly';
import { actions as mileageActions } from '@mobile/modules/expense/ui/mileage';
import { actions as reportFormValueAction } from '@mobile/modules/expense/ui/report/formValues';
import { actions as expTypeUiAction } from '@mobile/modules/expense/ui/selectedExpType';

import {
  getICCardList,
  getICTransactions,
} from '../../../action-dispatchers/expense/ICCard';
import { getCustomHints } from '@mobile/action-dispatchers/expense/CustomHint';
import {
  getExpenseTypeById,
  searchExpTypesByParentRecord,
} from '@mobile/action-dispatchers/expense/ExpenseType';
import {
  getRateFromId,
  searchCurrencyList,
} from '@mobile/action-dispatchers/expense/ForeignCurrency';
import {
  searchMileageRates,
  searchMileageRoute,
  setIsGeneratedPreview,
} from '@mobile/action-dispatchers/expense/Mileage';
import {
  getPaymentMethodOptionList,
  removeInactiveFromOptionList,
} from '@mobile/action-dispatchers/expense/PaymentMethod';
import {
  getBase64files,
  uploadReceipts,
} from '@mobile/action-dispatchers/expense/Receipt';
import {
  cloneRecord,
  createRecord,
  deleteRecord,
} from '@mobile/action-dispatchers/expense/Record';
import { save as saveReport } from '@mobile/action-dispatchers/expense/ReportDetail';
import { getTaxTypeList } from '@mobile/action-dispatchers/expense/TaxType';

import RecordNewPage, {
  UI_TYPE,
} from '@mobile/components/pages/expense/Record/New/General';

import { backType } from './ReceiptLibraryContainer';

type OwnProps = RouteComponentProps & {
  type: string;
  reportId?: string;
  recordId?: string;
  itemIdx?: number;
};

type ContainerProps = OwnProps & ReturnType<typeof mergeProps> & FormikValues;

const RecordNewContainer = (ownProps: ContainerProps) => {
  useEffect(() => {
    const isAddedRecord = [UI_TYPE.ADD].includes(ownProps.type);

    if (isEmpty(ownProps.customHints)) {
      ownProps.getCustomHints(ownProps.companyId);
    }
    if (isAddedRecord) {
      ownProps.isReadOnly(false);
    }
    if (
      ownProps.isUnderApprovedPreRequest ||
      ownProps.reportDiscarded ||
      ownProps.reportClaimed
    ) {
      ownProps.isReadOnly(true);
    }

    const isMileage = isMileageRecord(ownProps.values.recordType);

    // get payment method option list on record detail page
    const isCreateNewRecord = isAddedRecord;
    const isDetailPage = ownProps.readOnly;
    if (!isCreateNewRecord && isDetailPage)
      ownProps.getPaymentMethodOptionList(ownProps.values);
    // Or you came back from the expense type screen.
    const isExpTypeChanged =
      isAddedRecord || get(ownProps.location, 'state.isExpTypeChanged');
    const itemIdx = ownProps.itemIdx || 0;
    const isParentItem = itemIdx === 0;
    const isChildHasNoExpType =
      !isParentItem && !ownProps.values.items[itemIdx].expTypeId;

    if (isChildHasNoExpType) {
      ownProps.setRate(0);
      return;
    }

    if (isExpTypeChanged) {
      const isForeignCurrency =
        ownProps.values.items[itemIdx].useForeignCurrency;
      const expTypeId = ownProps.values.items[itemIdx].expTypeId;
      const getTaxOrCurrencyInfo = isForeignCurrency
        ? ownProps.getCurrencyList()
        : ownProps
            .getTaxTypeList(expTypeId, ownProps.values.recordDate)
            // @ts-ignore
            .then((res) => get(res, '0.payload', []));
      if (
        !isEmpty(ownProps.values) &&
        ownProps.values.recordDate &&
        expTypeId
      ) {
        Promise.all([
          getTaxOrCurrencyInfo,
          ownProps.getExpenseTypeById(expTypeId, 'REQUEST'),
        ]).then(([infoArray, expTypeRes]) => {
          if (infoArray.length === 0) {
            return;
          }
          // selected expense type with extended items' detail
          const selectedExpenseType = expTypeRes[0];
          const values = cloneDeep(ownProps.values);
          values.withholdingTaxUsage = selectedExpenseType.withholdingTaxUsage;
          values.items[itemIdx].expTypeItemizationSetting =
            selectedExpenseType.itemizationSetting;

          /* Extended Items' details */
          if (selectedExpenseType) {
            const items = get(values, `items.${itemIdx}`) || {};
            const eis = getEIsOnly(selectedExpenseType, items);
            values.items[itemIdx] = { ...items, ...eis };
          }

          if (!isParentItem) {
            ownProps.setValues({ ...values });

            const { taxRate, useForeignCurrency } =
              ownProps.values.items[itemIdx];
            if (!useForeignCurrency) {
              ownProps.setRate(taxRate || 0);
            }
            return;
          }

          /* Multi tax */
          const isMultipleTax =
            selectedExpenseType?.displayMultipleTaxEntryForm;

          if (isParentItem && isMultipleTax) {
            if (infoArray?.length > 0 && !values.items[0]?.taxItems) {
              const taxItemsSkeleton = infoArray.map(
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

              values.items[0] = {
                ...values.items[0],
                taxItems: taxItemsSkeleton,
              };

              ownProps.setValues({ ...values });
            }

            return;
          }

          /* Foreign Currency */
          if (isForeignCurrency) {
            setValuesForFC(
              ownProps,
              infoArray,
              selectedExpenseType,
              values
            ).then((updatedVals) => {
              ownProps.setValues({ ...updatedVals });
            });
            return;
          }

          // For Mileage, need to fetch Mileage Rates

          if (isMileage) {
            // For Existing Record, when we go to view map and come back we need to set state correctly
            const isPreviewGenerated =
              !isAddedRecord || ownProps.mileage?.isGeneratedPreview;
            ownProps.setIsGeneratedPreview(isPreviewGenerated);
            const { expMileageRateId } = selectedExpenseType;
            ownProps
              .searchMileageRates(
                ownProps.companyId,
                ownProps.values.recordDate
              )
              .then((mileageRatesResponse: Array<Array<MileageRate>>) => {
                if (!isEmpty(mileageRatesResponse)) {
                  const mileageRates = mileageRatesResponse[0];
                  const expMileageRateInfo: MileageRate | undefined =
                    mileageRates.find((mR) => mR.id === expMileageRateId);
                  const mileageRateHistoryId = get(
                    expMileageRateInfo,
                    'historyId'
                  );
                  const milaegeRate = get(expMileageRateInfo, 'rate');
                  const mileageRateName = get(expMileageRateInfo, 'name');
                  values.mileageRouteInfo = {
                    destinations: initialDestinations,
                  };
                  values.items[0].mileageRateBaseId = expMileageRateId;
                  values.items[0].mileageRateHistoryId = mileageRateHistoryId;
                  values.items[0].mileageRate = milaegeRate;
                  values.items[0].mileageRateName = mileageRateName;
                }
              });
          }

          // Make sure that you can use the item you are currently setting for the specified date.
          // Also recalculate the amount

          // tax selection
          let taxType;
          let rate = ownProps.values.items[0].taxRate || infoArray[0].rate;
          const historyId =
            ownProps.values.items[0].taxTypeHistoryId || infoArray[0].historyId;
          let taxTypeName = 'default';
          if (historyId) {
            taxType = find(infoArray, {
              historyId,
            });
            if (taxType) {
              rate = taxType ? taxType.rate : 0;
              taxTypeName = taxType.name;
              values.items[0].taxTypeBaseId = taxType.baseId;
              values.items[0].taxTypeHistoryId = historyId;
              values.items[0].taxTypeName = taxTypeName;
            }
          }
          ownProps.setRate(rate);

          let amount = ownProps.values.items[0].amount;

          // fixed allowance part
          if (
            selectedExpenseType &&
            selectedExpenseType.recordType === RECORD_TYPE.FixedAllowanceSingle
          ) {
            amount = selectedExpenseType.fixedAllowanceSingleAmount;
          } else if (
            selectedExpenseType &&
            selectedExpenseType.recordType ===
              RECORD_TYPE.FixedAllowanceMulti &&
            !ownProps.values.items[0].fixedAllowanceOptionId
          ) {
            if (!ownProps.readOnly) {
              amount = 0;
            }

            values.amount = amount;
            values.items[0].amount = amount;
          }

          // tax calculation part
          const isTaxEditted = values.items[0].taxManual;
          if (amount !== 0 && !isTaxEditted) {
            const taxRes = calculateTax(
              rate,
              amount,
              ownProps.currencyDecimalPlace,
              ownProps.taxRoundingSetting
            );

            values.amount = amount;
            values.withoutTax = taxRes.amountWithoutTax;
            values.items[0].amount = amount;
            values.items[0].withoutTax = taxRes.amountWithoutTax;
            values.items[0].gstVat = taxRes.gstVat;
          }
          ownProps.setValues({ ...values });
        });
      }
    }
  }, []);

  useEffect(() => {
    const receiptList = ownProps.values.receiptList;
    if (ownProps.useImageQualityCheck && !isEmpty(receiptList)) {
      const fetchMetadataList = [];
      receiptList.forEach((receipt) => {
        const selectedMetadata = ownProps.fileMetadata.find(
          (x) => x.contentDocumentId === receipt.receiptId
        );
        if (!selectedMetadata) {
          fetchMetadataList.push(receipt.receiptId);
        }
      });
      if (fetchMetadataList.length > 0)
        ownProps.fetchFileMetadata(fetchMetadataList);
    }
  }, [ownProps.values.receiptList, ownProps.useImageQualityCheck]);

  const receiptIds = (ownProps.values.receiptList || []).map(
    (r) => r.receiptId
  );
  const selectedMetadatas = ownProps.fileMetadata.filter(
    (x) => receiptIds.indexOf(x.contentDocumentId) > -1
  );

  return (
    <RecordNewPage
      employeeId={ownProps.employeeId}
      language={ownProps.language}
      companyId={ownProps.companyId}
      report={ownProps.report}
      taxTypeList={ownProps.taxTypeList}
      mileageRates={ownProps.mileageRates}
      isNotEditable={ownProps.isNotEditable}
      isUnderApprovedPreRequest={ownProps.isUnderApprovedPreRequest}
      reportDiscarded={ownProps.reportDiscarded}
      reportClaimed={ownProps.reportClaimed}
      childExpTypes={ownProps.childExpTypes}
      isGeneratedPreview={ownProps.mileage?.isGeneratedPreview}
      values={ownProps.values}
      itemIdx={ownProps.itemIdx}
      rate={ownProps.rate}
      type={ownProps.type}
      errors={ownProps.errors}
      touched={ownProps.touched}
      expRoundingSetting={ownProps.expRoundingSetting}
      taxRoundingSetting={ownProps.taxRoundingSetting}
      allowTaxExcludedAmount={ownProps.allowTaxExcludedAmount}
      allowTaxAmountChange={ownProps.allowTaxAmountChange}
      useTransitManager={ownProps.useTransitManager}
      currencyDecimalPlace={ownProps.currencyDecimalPlace}
      currencySymbol={ownProps.currencySymbol}
      baseCurrencyDecimal={ownProps.baseCurrencyDecimal}
      currencyList={ownProps.currencyList}
      expMileageUnit={ownProps.expMileageUnit}
      exchangeRateMap={ownProps.exchangeRateMap}
      readOnly={ownProps.readOnly}
      hasPermissionError={ownProps.hasPermissionError}
      paymentMethodList={ownProps.paymentMethodList}
      paymentMethodOptionList={ownProps.paymentMethodOptionList}
      selectedExpType={ownProps.selectedExpType}
      history={ownProps.history}
      setFieldTouched={ownProps.setFieldTouched}
      validateForm={ownProps.validateForm}
      setFieldValue={ownProps.setFieldValue}
      setValues={ownProps.setValues}
      setTouched={ownProps.setTouched}
      setRate={ownProps.setRate}
      saveFormValues={ownProps.saveFormValues}
      saveItemValues={ownProps.saveItemValues}
      clearItemValues={ownProps.clearItemValues}
      handleSubmit={ownProps.handleSubmit}
      onDeleteClick={ownProps.onDeleteClick}
      onClickEditButton={ownProps.onClickEditButton}
      onBackClick={ownProps.onBackClick}
      onClickSearchExpType={ownProps.onClickSearchExpType}
      openMileageMap={ownProps.openMileageMap}
      onClickSearchCustomEI={ownProps.onClickSearchCustomEI}
      getBase64files={ownProps.getBase64files}
      uploadReceipts={ownProps.uploadReceipts}
      searchExpTypesByParentRecord={ownProps.searchExpTypesByParentRecord}
      activeHints={ownProps.activeHints}
      customHints={ownProps.customHints}
      onClickHint={ownProps.onClickHint}
      onClickSearchCostCenter={ownProps.onClickSearchCostCenter}
      onClickSearchJob={ownProps.onClickSearchJob}
      getItemLatestCostCenter={ownProps.getItemLatestCostCenter}
      getRateFromId={ownProps.getRateFromId}
      getTaxTypeList={ownProps.getTaxTypeList}
      getMileageRates={ownProps.searchMileageRates}
      searchMileageRoute={ownProps.searchMileageRoute}
      openReceiptLibrary={ownProps.openReceiptLibrary}
      saveFileMetadatas={ownProps.saveFileMetadatas}
      selectedMetadatas={selectedMetadatas}
      useImageQualityCheck={ownProps.useImageQualityCheck}
      clearSelectedExpType={ownProps.clearSelectedExpType}
      onClickCloneRecord={ownProps.onClickCloneRecord}
      getExchangeRate={ownProps.getExchangeRate}
      onClickMileageApply={ownProps.onMileageApply}
      onClickMileageReset={ownProps.onMileageReset}
      removeInactivePaymentMethod={ownProps.removeInactivePaymentMethod}
      isRequest
      jctInvoiceManagement={ownProps.jctInvoiceManagement}
      onClickSearchVendor={ownProps.onClickSearchVendor}
      selectedReportType={ownProps.selectedReportType}
      navigateToItemizationPage={ownProps.navigateToItemizationPage}
      navigateToRecordPage={ownProps.navigateToRecordPage}
      onClickVendorDetail={ownProps.onClickVendorDetail}
      endLoading={ownProps.endLoading}
      startLoading={ownProps.startLoading}
    />
  );
};

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const {
    useExpense,
    employeeId,
    currencyId,
    companyId,
    language,
    expMileageUnit,
  } = state.userSetting;
  const report = state.expense.entities.report;
  const formValues = state.expense.ui.general.formValues;

  const navigateToRecordPage = () => {
    const stateReportId = get(ownProps, 'location.state.reportId');
    const stateRecordId = get(ownProps, 'location.state.recordId');
    const reportId = stateReportId || formValues.reportId;
    const recordId = stateRecordId || formValues.recordId;

    const path = !formValues.recordId
      ? '/request/report/record/new/general'
      : `/request/record/detail/${reportId}/${recordId}`;

    pushHistoryWithPrePage(ownProps.history, path, {
      isExpTypeChanged: true,
    });
  };

  return {
    companyId,
    employeeId,
    language,
    expMileageUnit,
    activeHints: state.expense.ui.customHint.list,
    customHints: state.expense.entities.customHint,
    formValues,
    itemValues: state.expense.ui.general.itemValues,
    taxTypeList: state.expense.entities.taxType,
    currencyList: state.expense.entities.foreignCurrency,
    childExpTypes: state.expense.entities.childExpenseTypes,
    exchangeRateMap: state.expense.entities.exchangeRate,
    mileageRates: state.expense.entities.mileageRates,
    mileage: state.expense.ui.mileage,
    records: state.expense.entities.recordList,
    report,
    expRoundingSetting: state.userSetting.expRoundingSetting,
    taxRoundingSetting: state.userSetting.expTaxRoundingSetting,
    allowTaxExcludedAmount: state.userSetting.allowTaxExcludedAmountInput,
    allowTaxAmountChange: state.userSetting.allowTaxAmountChange,
    currencyDecimalPlace: state.userSetting.currencyDecimalPlaces,
    currencySymbol: state.userSetting.currencySymbol,
    baseCurrencyDecimal: state.userSetting.currencyDecimalPlaces,
    rate: state.expense.ui.general.rate,
    readOnly: state.expense.ui.general.readOnly,
    hasPermissionError: AppPermissionUtil.checkPermissionError(
      useExpense,
      employeeId,
      currencyId
    ),
    useTransitManager: state.userSetting.useTransitManager,
    useImageQualityCheck: state.userSetting.useImageQualityCheck,
    fileMetadata: state.expense.entities.fileMetadata,
    salesId: state.userSetting.salesId,
    customerId: state.userSetting.customerId,
    employeeCode: state.userSetting.employeeCode,
    selectedExpType: state.expense.ui.selectedExpType,
    selectedReportType: state.expense.entities.selectedReportType,
    isUnderApprovedPreRequest: get(
      ownProps.history,
      'location.state.isApprovedPreRequest'
    ),
    reportDiscarded: report.status === STATUS.Discarded,
    reportClaimed: report.status === STATUS.Claimed,
    paymentMethodList: state.expense.entities.paymentMethodList,
    paymentMethodOptionList: state.expense.ui.paymentMethodOption,
    jctInvoiceManagement: state.userSetting.jctInvoiceManagement,
    displayNonInvoiceWarning: state.userSetting.nonInvoiceWarning,
    navigateToRecordPage,
  };
};

const mapDispatchToProps = {
  saveFormValues: formValueAction.save,
  saveItemValues: itemValueAction.save,
  clearFormValues: formValueAction.clear,
  clearItemValues: itemValueAction.clear,
  clearReportFormValues: reportFormValueAction.clear,
  clearSelectedExpType: expTypeUiAction.clear,
  setRate: rateAction.set,
  isReadOnly: readOnlyAction.set,
  createRecord,
  deleteRecord,
  cloneRecord,
  getBase64files,
  uploadReceipts,
  getTaxTypeList,
  searchCurrencyList,
  getRateFromId,
  saveReport,
  getICCardList,
  getICTransactions,
  setSelectedCard: selectedIcCardActions.set,
  onClickHint: customHintUIActions.set,
  resetCustomHint: customHintUIActions.clear,
  getCustomHints,
  getExpenseTypeById,
  getItemLatestCostCenter,
  searchExpTypesByParentRecord,
  saveFileMetadatas: fileMetadataActions.saveList,
  fetchFileMetadata: fileMetadataActions.fetch,
  setIsGeneratedPreview,
  searchMileageRates,
  searchMileageRoute,
  showConfirm,
  showToast,
  setDestinations: mileageActions.setDestinations,
  getPaymentMethodOptionList,
  removeInactiveFromOptionList,
  endLoading,
  startLoading,
};

const setValuesForFC = async (
  props: ContainerProps,
  currencyList: CurrencyList,
  selectedExpenseType: ExpenseType,
  value: Record
) => {
  const currencyId = props.values.items[0].currencyId || currencyList[0].id;

  const currencyData = find(currencyList, {
    id: currencyId,
  });
  const { isoCurrencyCode, name, decimalPlaces, symbol } = currencyData;

  const values = cloneDeep(value);
  let currencyInfo = get(values, 'items.0.currencyInfo', {});
  currencyInfo = Object.assign(currencyInfo, {
    code: isoCurrencyCode,
    name,
    decimalPlaces,
    symbol,
  });
  values.items[0].currencyId = currencyId;
  values.items[0].currencyInfo = currencyInfo;

  let exchangeRate = await props.getExchangeRate(currencyId, values.recordDate);
  if (!exchangeRate) {
    exchangeRate = await props.getExchangeRate(currencyId, DateUtil.getToday());
  }
  return props
    .getExchangeRate(currencyId, values.recordDate)
    .then((exchangeRate) => {
      values.items[0].exchangeRate =
        props.values.items[0].exchangeRate || exchangeRate;
      values.items[0].originalExchangeRate = exchangeRate;
      if (exchangeRate === 0) {
        values.items[0].exchangeRateManual = true;
      }

      // fixed allowance part
      if (values.recordType === RECORD_TYPE.FixedAllowanceSingle) {
        const localAmount =
          get(selectedExpenseType, 'fixedAllowanceSingleAmount') || 0;
        const amount = calcAmountFromRate(
          values.items[0].exchangeRate,
          localAmount,
          props.currencyDecimalPlace,
          props.expRoundingSetting
        );
        values.amount = Number(amount);
        values.items[0].amount = Number(amount);
        values.items[0].localAmount = localAmount;
      }
      return values;
    });
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps,
  ownProps: OwnProps
) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  isNotEditable: [STATUS.Pending, STATUS.Approved].includes(
    stateProps.report.status
  ),
  onClickSearchExpType: () => {
    const { history } = ownProps;
    const target = ownProps.reportId
      ? 'report'
      : get(history, 'location.state.target');

    history.replace({
      ...history.location,
      state: { isExpTypeChanged: false, target },
    });
    const path = `/request/expense-type/list/${RECORD_TYPE_CATEGORY.noJorudan}`;
    pushHistoryWithPrePage(history, path, {
      target,
    });
  },
  openReceiptLibrary: () => {
    const path = `/request/receipt-library/list/backType=${backType.RECORD}`;
    pushHistoryWithPrePage(ownProps.history, path);
  },
  openMileageMap: (values: Record) => {
    dispatchProps.saveFormValues(values);
    dispatchProps.setDestinations(values.mileageRouteInfo?.destinations);
    const { history } = ownProps;
    const target = ownProps.reportId
      ? 'report'
      : get(history, 'location.state.target');

    history.replace({
      ...history.location,
      state: { isExpTypeChanged: false, target },
    });
    const path = `/expense/record/mileage/map`;
    pushHistoryWithPrePage(history, path, { target });
  },
  navigateToItemizationPage: (idx: number, values: Record) => {
    const isNewItem = values.items.length === idx;
    if (isNewItem) {
      const itemList = values.items;
      const parentItem = itemList[0];
      const {
        currencyId,
        currencyInfo,
        exchangeRate,
        exchangeRateManual,
        originalExchangeRate,
        recordDate,
        useForeignCurrency,
      } = parentItem;
      const _ = undefined;
      const date = itemList[itemList.length - 1].recordDate || recordDate;

      let newItem = newRecordItem(
        '',
        '',
        useForeignCurrency,
        _,
        true,
        '',
        '',
        _,
        date
      );
      if (useForeignCurrency) {
        // carry over currency info from parent
        newItem = {
          ...newItem,
          currencyId,
          currencyInfo,
          exchangeRate,
          exchangeRateManual,
          originalExchangeRate,
        };
      }
      dispatchProps.saveItemValues(newItem);
    }
    dispatchProps.saveFormValues(values);
    const path = `/request/record/item/${idx}`;
    const state = {
      reportId: ownProps.reportId,
      recordId: ownProps.recordId,
      isExpTypeChanged: !isNewItem,
    };
    pushHistoryWithPrePage(ownProps.history, path, state);
  },
  onClickEditButton: () => {
    const { history } = ownProps;
    history.replace({
      ...history.location,
      state: {
        isExpTypeChanged: false,
        type: ownProps.type,
        target: get(ownProps, 'location.state.target'),
      },
    });
    dispatchProps.isReadOnly(false);
  },
  getExchangeRate: (currencyId: string, recordDate: string) => {
    // reduce api call by using cache
    const rateInfo = get(
      stateProps.exchangeRateMap,
      `${currencyId}.${recordDate}`
    );
    let getRate = new Promise((resolve) =>
      resolve(get(rateInfo, 'calculationRate'))
    ) as Promise<number>;
    if (!rateInfo) {
      getRate = dispatchProps
        .getRateFromId(stateProps.companyId, currencyId, recordDate)
        // @ts-ignore
        .then((res: Array<number>) => res[0]);
    }
    return getRate;
  },
  getCurrencyList: () => {
    const listInfo = stateProps.currencyList;
    if (!isEmpty(listInfo)) {
      return listInfo;
    } else {
      return dispatchProps.searchCurrencyList(stateProps.companyId);
    }
  },
  onDeleteClick: () => {
    dispatchProps
      .deleteRecord(ownProps.recordId, true)
      // @ts-ignore
      .then(() => {
        if (ownProps.type === UI_TYPE.REPORT_LIST) {
          dispatchProps.clearFormValues();
          dispatchProps.resetCustomHint();
          ownProps.history.replace(
            `/request/report/detail/${ownProps.reportId}`
          );
        }
      })
      .catch((err) => {
        const errMsg =
          (err.message && ` (${err.message})`) ||
          (err.event && ` (${err.event.message})`) ||
          '';
        dispatchProps.showToast(`${msg().Exp_Lbl_RecordDeleteFailed}${errMsg}`);
      });
  },
  onBackClick: () => {
    if (ownProps.type === UI_TYPE.REPORT_LIST) {
      // clear the isCostCenterChangedManually stored inside form
      dispatchProps.clearReportFormValues();
      ownProps.history.push(`/request/report/detail/${ownProps.reportId}`);
    } else if (ownProps.type === UI_TYPE.ADD) {
      ownProps.history.push(
        `/request/report/detail/${stateProps.formValues.reportId}`
      );
    }

    if (ownProps.itemIdx > 0) {
      dispatchProps.clearItemValues();
      stateProps.navigateToRecordPage();
    } else {
      dispatchProps.clearFormValues();
      dispatchProps.resetCustomHint();
      dispatchProps.clearSelectedExpType();
      dispatchProps.isReadOnly(true);
    }
  },
  onClickSearchCustomEI: (
    customExtendedLookupId: string,
    customExtendedItemId: string,
    customExtendedItemName: string,
    index: string
  ) => {
    const recordId = ownProps.recordId || 'null';
    const reportId = stateProps.report.reportId || 'null';
    const itemIdx = ownProps.itemIdx || 0;
    ownProps.history.replace({
      ...ownProps.history.location,
      state: {
        isExpTypeChanged: false,
        type: ownProps.type,
        target: get(ownProps, 'location.state.target'),
      },
    });
    const backType = ownProps.itemIdx ? 'item' : 'record';
    pushHistoryWithPrePage(
      ownProps.history,
      `/request/customExtendedItem/list/backType=${backType}/reportId=${reportId}/recordId=${recordId}/itemIdx=${itemIdx}/index=${index}/customExtendedItemLookupId=${customExtendedLookupId}/customExtendedItemId=${customExtendedItemId}/customExtendedItemName=${customExtendedItemName}`,
      {
        type: ownProps.type,
        target: get(ownProps, 'location.state.target'),
      }
    );
  },
  onClickSearchCostCenter: (recordDate: string) => {
    const { history, itemIdx } = ownProps;
    const reportId = ownProps.reportId || stateProps.report.reportId;
    history.replace({
      ...history.location,
      state: {
        isExpTypeChanged: false,
        type: ownProps.type,
        target: get(ownProps, 'location.state.target'),
      },
    });
    const path = `/request/cost-center/list/backType=record/targetDate=${recordDate}/reportId=${reportId}`;
    pushHistoryWithPrePage(history, path, {
      type: ownProps.type,
      target: get(ownProps, 'location.state.target'),
      itemIdx: itemIdx || 0,
    });
  },
  onClickSearchJob: (recordDate: string) => {
    const { history, itemIdx } = ownProps;
    const reportId = ownProps.reportId || stateProps.report.reportId;
    history.replace({
      ...history.location,
      state: {
        isExpTypeChanged: false,
        type: ownProps.type,
        target: get(ownProps, 'location.state.target'),
      },
    });
    pushHistoryWithPrePage(
      history,
      `/request/job/list/backType=record/targetDate=${recordDate}/reportId=${reportId}`,
      {
        type: ownProps.type,
        target: get(ownProps, 'location.state.target'),
        itemIdx: itemIdx || 0,
      }
    );
  },
  onClickCloneRecord: (numberOfDays?: number, targetDates?: string[]) => {
    const { history } = ownProps;
    const reportId = ownProps.reportId || stateProps.report.reportId;
    const recordId = [ownProps.recordId];
    dispatchProps
      .cloneRecord(
        recordId,
        numberOfDays,
        targetDates || null,
        stateProps.employeeId,
        true
      )
      // @ts-ignore
      .then((_res) => {
        history.replace(`/request/report/detail/${reportId}`);
      })
      .catch((err) => {
        const errMsg =
          (err.message && ` (${err.message})`) ||
          (err.event && ` (${err.event.message})`) ||
          '';
        dispatchProps.showToast(`${msg().Exp_Lbl_RecordClone}Failed${errMsg}`);
      });
  },
  onMileageApply: (values: Record) => {
    dispatchProps.setIsGeneratedPreview(true);
    dispatchProps.setDestinations(values.mileageRouteInfo?.destinations);
  },
  onMileageReset: () => {
    dispatchProps.setIsGeneratedPreview(false);
    dispatchProps.setDestinations(undefined);
  },
  removeInactivePaymentMethod: (selectedPaymentMethodId: string) => {
    const { paymentMethodOptionList, selectedReportType } = stateProps;
    const reportTypePaymentMethodIds = get(
      selectedReportType,
      'paymentMethodIds'
    );
    dispatchProps.removeInactiveFromOptionList(
      paymentMethodOptionList,
      selectedPaymentMethodId,
      reportTypePaymentMethodIds
    );
  },
  onClickSearchVendor: (backType: string) => {
    const { report } = stateProps;
    const reportId = ownProps.reportId || report.reportId || 'null';
    pushHistoryWithPrePage(
      ownProps.history,
      `/request/vendor/search/reportId=${reportId}/backType=${backType}`
    );
  },
  onClickVendorDetail: (values: Record) => {
    const { history } = ownProps;
    const vendorId = get(values, 'items.0.vendorId');
    pushHistoryWithPrePage(history, `/request/vendor/detail/${vendorId}`);
  },
});

export default compose<any>(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  withFormik({
    enableReinitialize: true,
    validationSchema: (props: ReturnType<typeof mergeProps>) => {
      if (props.itemIdx) {
        return itemSchema;
      }
      return recordSchema;
    },
    mapPropsToValues: (props: ReturnType<typeof mergeProps>) => {
      const {
        formValues,
        itemValues,
        itemIdx,
        report: { reportId },
        selectedReportType,
      } = props;

      const { isRecordVendorRequired } =
        getDisplayOfRecordVendor(selectedReportType);

      // if exist formValues, always use formValues.
      if (!isEmpty(formValues)) {
        const updateValues = {
          ...formValues,
          reportId,
          isRecordVendorRequired,
        };

        // if back to item page from other page (e.g. EI), keep previous input values
        if (itemIdx && !isEmpty(itemValues)) {
          const items = [...updateValues.items];
          items[itemIdx] = itemValues;
          updateValues.items = items;
        }
        return updateValues;
      }

      if (props.type === UI_TYPE.REPORT_LIST) {
        // from ReportList
        const value = find(props.report.records, { recordId: props.recordId });
        return { ...value, reportId, isRecordVendorRequired };
      }
      // new
      const record = newRecord('', '', RECORD_TYPE.General);
      record.items[0].taxTypeBaseId = 'default';
      record.items[0].taxTypeHistoryId = 'default';
      return { ...record, isRecordVendorRequired };
    },
    handleSubmit: async (values, { props }) => {
      const reportVendorId = get(props.report, 'vendorId');
      const recordVendorId = get(values, 'items.0.vendorId');
      const jctInvoiceOption = get(values, 'items.0.jctInvoiceOption');
      if (
        jctInvoiceOption === JCT_NUMBER_INVOICE.NonInvoice &&
        props.displayNonInvoiceWarning &&
        props.jctInvoiceManagement &&
        !recordVendorId &&
        !reportVendorId
      ) {
        const isConfirm = await props.showConfirm(
          msg().Exp_Clbl_JCTNonInvoiceWarning
        );
        if (!isConfirm) return;
      }

      const isAddedRecord = props.type === UI_TYPE.ADD;
      const isExistingReportList = props.type === UI_TYPE.REPORT_LIST;
      const saveValues = cloneDeep(values);
      if (saveValues.items[0].taxTypeBaseId === 'default') {
        const taxType = props.taxTypeList[0];
        saveValues.items[0].taxTypeBaseId = taxType.baseId;
        saveValues.items[0].taxTypeHistoryId = taxType.historyId;
        saveValues.items[0].taxTypeName = taxType.name;
      }
      const {
        costCenterHistoryId: reportCCId,
        jobId: reportJobId,
        reportId,
        expReportTypeId,
      } = props.report;
      if (
        reportCCId &&
        saveValues.items[0].costCenterHistoryId === reportCCId
      ) {
        saveValues.items[0].costCenterHistoryId = null;
        saveValues.items[0].costCenterCode = '';
        saveValues.items[0].costCenterName = '';
      }
      if (reportJobId && saveValues.items[0].jobId === reportJobId) {
        saveValues.items[0].jobId = null;
        saveValues.items[0].jobName = '';
        saveValues.items[0].jobCode = '';
      }

      const [_, ...childItemList] = saveValues.items;
      childItemList.forEach((item: RecordItem) => {
        const parentItemCCHistoryId =
          saveValues.items[0].costCenterHistoryId || reportCCId;
        const parentItemJobId = saveValues.items[0].jobId || reportJobId;

        if (item.costCenterHistoryId === parentItemCCHistoryId) {
          item.costCenterHistoryId = null;
          item.costCenterCode = '';
          item.costCenterName = '';
        }
        if (item.jobId === parentItemJobId) {
          item.jobId = null;
          item.jobName = '';
          item.jobCode = '';
        }
      });

      if (!isUseWithholdingTax(saveValues.withholdingTaxUsage)) {
        saveValues.items[0].amountPayable = null;
        saveValues.items[0].withholdingTaxAmount = null;
      }
      // reset jct values if invoice option is not Invoice
      if (
        saveValues.items[0].jctInvoiceOption &&
        saveValues.items[0].jctInvoiceOption !== JCT_NUMBER_INVOICE.Invoice &&
        saveValues.items[0].jctRegistrationNumber
      ) {
        saveValues.items[0].jctRegistrationNumber = null;
      }

      if (isAddedRecord) {
        props
          .createRecord(
            saveValues,
            reportId,
            expReportTypeId,
            props.employeeId,
            true
          )
          // @ts-ignore
          .then(() => {
            props.clearFormValues();
            props.resetCustomHint();
            if (isAddedRecord) {
              props.history.push(`/request/report/detail/${values.reportId}`);
              props.showToast(msg().Exp_Lbl_ItemIsSaved);
            }
            props.isReadOnly(true);
          })
          .catch((err) => {
            const errMsg =
              (err.message && ` (${err.message})`) ||
              (err.event && ` (${err.event.message})`) ||
              '';
            props.showToast(`${msg().Exp_Msg_RecordSaveFailed}${errMsg}`);
          });
      } else if (isExistingReportList) {
        props
          .createRecord(
            saveValues,
            reportId,
            expReportTypeId,
            props.employeeId,
            true
          )
          // @ts-ignore
          .then(() => {
            props.clearFormValues();
            props.resetCustomHint();
            props.isReadOnly(true);
          })
          .catch((err) => {
            const errMsg =
              (err.message && ` (${err.message})`) ||
              (err.event && ` (${err.event.message})`) ||
              '';
            props.showToast(`${msg().Exp_Msg_RecordSaveFailed}${errMsg}`);
          });
      }
    },
  })
)(RecordNewContainer) as React.ComponentType<OwnProps>;
