import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { compose } from 'redux';

import { FormikValues, withFormik } from 'formik';
import { cloneDeep, find, get, isEmpty } from 'lodash';

import {
  goBack,
  pushHistoryWithPrePage,
} from '@mobile/concerns/routingHistory';
import itemSchema from '@mobile/schema/ItemNewSchema';
import recordSchema from '@mobile/schema/request/RecordNewSchema';

import msg from '@apps/commons/languages';
import { showToast } from '@apps/commons/modules/toast';
import AppPermissionUtil from '@apps/commons/utils/AppPermissionUtil';
import DateUtil from '@apps/commons/utils/DateUtil';
import { showConfirm } from '@mobile/modules/commons/confirm';

import STATUS from '@apps/domain/models/approval/request/Status';
import { ExpenseType } from '@apps/domain/models/exp/ExpenseType';
import { getEIsOnly } from '@apps/domain/models/exp/ExtendedItem';
import {
  calcAmountFromRate,
  CurrencyList,
} from '@apps/domain/models/exp/foreign-currency/Currency';
import { JCT_NUMBER_INVOICE } from '@apps/domain/models/exp/JCTNo';
import {
  isHotelFee,
  newRecord,
  newRecordItem,
  Record,
  RECORD_TYPE,
  RECORD_TYPE_CATEGORY,
  RecordItem,
} from '@apps/domain/models/exp/Record';
import { calculateTax } from '@apps/domain/models/exp/TaxType';

import { actions as selectedIcCardActions } from '../../../modules/expense/ui/icCard/selectedCard';
import { State } from '@mobile/modules';
import { actions as fileMetadataActions } from '@mobile/modules/expense/entities/fileMetadata';
import { actions as customHintUIActions } from '@mobile/modules/expense/ui/customHint/list';
import { actions as formValueAction } from '@mobile/modules/expense/ui/general/formValues';
import { actions as itemValueAction } from '@mobile/modules/expense/ui/general/itemValues';
import { actions as rateAction } from '@mobile/modules/expense/ui/general/rate';
import { actions as readOnlyAction } from '@mobile/modules/expense/ui/general/readOnly';
import { actions as reportFormValueAction } from '@mobile/modules/expense/ui/report/formValues';
import { actions as expTypeUiAction } from '@mobile/modules/expense/ui/selectedExpType';

import {
  getICCardList,
  getICTransactions,
} from '../../../action-dispatchers/expense/ICCard';
import { getLatestHistoryCostCenter } from '@mobile/action-dispatchers/expense/CostCenter';
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

    const isHotelRecord = isHotelFee(ownProps.values.recordType);
    const isChildItem = isHotelRecord && ownProps.itemIdx > 0;
    if (isChildItem) {
      return;
    }

    // This screen was opened by recordList or reportList.
    // Or you came back from the expense type screen.
    const isExpTypeChanged =
      isAddedRecord || get(ownProps.location, 'state.isExpTypeChanged');
    if (isExpTypeChanged) {
      const isForeignCurrency = ownProps.values.items[0].useForeignCurrency;
      const expTypeId = ownProps.values.items[0].expTypeId;
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

          /* Extended Items' details */
          if (selectedExpenseType) {
            const items = get(values, 'items.0') || {};
            const eis = getEIsOnly(selectedExpenseType, items);
            values.items[0] = { ...items, ...eis };
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

          /* Base Currency */
          if (isHotelRecord) {
            return;
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
    const contentDocumentId = ownProps.values.receiptId;

    if (ownProps.useImageQualityCheck && contentDocumentId) {
      const selectedMetadata = ownProps.fileMetadata.find(
        (x) => x.contentDocumentId === contentDocumentId
      );

      if (!selectedMetadata) {
        ownProps.fetchFileMetadata([contentDocumentId]);
      }
    }
  }, [ownProps.values.receiptId, ownProps.useImageQualityCheck]);

  const selectedMetadata = ownProps.fileMetadata.find(
    (x) => x.contentDocumentId === ownProps.values.receiptId
  );

  return (
    <RecordNewPage
      language={ownProps.language}
      companyId={ownProps.companyId}
      report={ownProps.report}
      taxTypeList={ownProps.taxTypeList}
      isNotEditable={ownProps.isNotEditable}
      isUnderApprovedPreRequest={ownProps.isUnderApprovedPreRequest}
      reportDiscarded={ownProps.reportDiscarded}
      reportClaimed={ownProps.reportClaimed}
      childExpTypes={ownProps.childExpTypes}
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
      currencyList={ownProps.currencyList}
      exchangeRateMap={ownProps.exchangeRateMap}
      readOnly={ownProps.readOnly}
      hasPermissionError={ownProps.hasPermissionError}
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
      onClickSearchCustomEI={ownProps.onClickSearchCustomEI}
      showConfirm={ownProps.showConfirm}
      getBase64files={ownProps.getBase64files}
      uploadReceipts={ownProps.uploadReceipts}
      searchExpTypesByParentRecord={ownProps.searchExpTypesByParentRecord}
      activeHints={ownProps.activeHints}
      customHints={ownProps.customHints}
      onClickHint={ownProps.onClickHint}
      onClickSearchCostCenter={ownProps.onClickSearchCostCenter}
      onClickSearchJob={ownProps.onClickSearchJob}
      getLatestHistoryCostCenter={ownProps.getLatestHistoryCostCenter}
      getRateFromId={ownProps.getRateFromId}
      getTaxTypeList={ownProps.getTaxTypeList}
      openReceiptLibrary={ownProps.openReceiptLibrary}
      saveFileMetadata={ownProps.saveFileMetadata}
      selectedMetadata={selectedMetadata}
      useImageQualityCheck={ownProps.useImageQualityCheck}
      clearSelectedExpType={ownProps.clearSelectedExpType}
      onClickCloneRecord={ownProps.onClickCloneRecord}
      onClickLinkBtn={ownProps.onClickLinkBtn}
      getExchangeRate={ownProps.getExchangeRate}
      onClickAddItem={ownProps.onClickAddItem}
      onClickChildItem={ownProps.onClickChildItem}
      isRequest
      jctInvoiceManagement={ownProps.jctInvoiceManagement}
    />
  );
};

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const { useExpense, employeeId, currencyId, companyId, language } =
    state.userSetting;
  const report = state.expense.entities.report;
  return {
    companyId,
    employeeId,
    language,
    activeHints: state.expense.ui.customHint.list,
    customHints: state.expense.entities.customHint,
    formValues: state.expense.ui.general.formValues,
    itemValues: state.expense.ui.general.itemValues,
    taxTypeList: state.expense.entities.taxType,
    currencyList: state.expense.entities.foreignCurrency,
    childExpTypes: state.expense.entities.childExpenseTypes,
    exchangeRateMap: state.expense.entities.exchangeRate,
    records: state.expense.entities.recordList,
    report,
    expRoundingSetting: state.userSetting.expRoundingSetting,
    taxRoundingSetting: state.userSetting.expTaxRoundingSetting,
    allowTaxExcludedAmount: state.userSetting.allowTaxExcludedAmountInput,
    allowTaxAmountChange: state.userSetting.allowTaxAmountChange,
    currencyDecimalPlace: state.userSetting.currencyDecimalPlaces,
    currencySymbol: state.userSetting.currencySymbol,
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
    isUnderApprovedPreRequest: get(
      ownProps.history,
      'location.state.isApprovedPreRequest'
    ),
    reportDiscarded: report.status === STATUS.Discarded,
    reportClaimed: report.status === STATUS.Claimed,
    jctInvoiceManagement: state.userSetting.jctInvoiceManagement,
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
  getLatestHistoryCostCenter,
  searchExpTypesByParentRecord,
  saveFileMetadata: fileMetadataActions.save,
  fetchFileMetadata: fileMetadataActions.fetch,
  showConfirm,
  showToast,
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

  const isHotelRecord = isHotelFee(props.values.recordType);
  if (isHotelRecord) {
    // hotel parent item no need exchange rate info
    return new Promise((resolve) => resolve(values)) as Promise<Record>;
  }
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
  isNotEditable:
    ownProps.type === UI_TYPE.REPORT_LIST &&
    [STATUS.Pending, STATUS.Approved].includes(stateProps.report.status),
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
  onClickAddItem: (values: Record) => {
    dispatchProps.saveFormValues(values);
    const parentItem = values.items[0];
    const { useForeignCurrency, currencyId, currencyInfo } = parentItem;
    let newItem = newRecordItem('', '', useForeignCurrency, null, true, '', '');
    if (useForeignCurrency) {
      // carry over currency info from parent
      newItem = { ...newItem, currencyId, currencyInfo };
    }
    dispatchProps.saveItemValues(newItem as RecordItem);
    // child item start from 1
    const idx = values.items.length;
    const path = `/request/record/item/${idx}`;
    pushHistoryWithPrePage(ownProps.history, path);
  },
  onClickChildItem: (idx: number, values: Record) => {
    dispatchProps.saveFormValues(values);
    const { expTypeId, recordDate } = values.items[idx];
    if (expTypeId && recordDate) {
      dispatchProps.getTaxTypeList(expTypeId, recordDate);
    }
    const path = `/request/record/item/${idx}`;
    pushHistoryWithPrePage(ownProps.history, path);
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
      goBack(ownProps.history);
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
    const { history } = ownProps;
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
    });
  },
  onClickSearchJob: (recordDate: string) => {
    const { history } = ownProps;
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
      } = props;

      // if exist formValues, always use formValues.
      if (!isEmpty(formValues)) {
        const updateValues = { ...formValues, reportId };

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
        return { ...value, reportId };
      }
      // new
      const record = newRecord('', '', RECORD_TYPE.General);
      record.items[0].taxTypeBaseId = 'default';
      record.items[0].taxTypeHistoryId = 'default';
      return record;
    },
    handleSubmit: (values, { props }) => {
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
