import { connect } from 'react-redux';

import { assign, cloneDeep, find, get, isEmpty, isEqual } from 'lodash';

import {
  getLatestHistoryCostCenter,
  getRecentCostCenters,
  searchCostCenters,
} from '../../../commons/action-dispatchers/CostCenter';
import { confirm } from '../../../commons/actions/app';
import RecordItemView from '../../../commons/components/exp/Form/RecordItem';
import msg from '../../../commons/languages';
import DateUtil from '../../../commons/utils/DateUtil';
import FileUtil from '../../../commons/utils/FileUtil';
import { actions as fileMetadataActions } from '@commons/modules/exp/entities/fileMetadata';

import {
  EISearchObj,
  getEIsOnly,
} from '../../../domain/models/exp/ExtendedItem';
import { calcAmountFromRate } from '../../../domain/models/exp/foreign-currency/Currency';
import { exchangeRateField } from '../../../domain/models/exp/foreign-currency/ExchangeRate';
import {
  isRecordItemized,
  newRouteInfo,
} from '../../../domain/models/exp/Record';
import {
  AmountInputMode,
  calcAmountFromTaxExcluded,
  calculateTax,
  ExpTaxTypeListApiReturn,
  taxSelectField,
} from '../../../domain/models/exp/TaxType';
import { JCT_NUMBER_INVOICE } from '@apps/domain/models/exp/JCTNo';
import { getMetadata } from '@apps/domain/models/exp/Receipt';

import { actions as searchRouteActions } from '../../../domain/modules/exp/jorudan/routeOption';
import { actions as modeActions, modes } from '../../modules/ui/expenses/mode';
import { actions as overlapActions } from '../../modules/ui/expenses/overlap';
import { actions as recordPanelLoadingActions } from '../../modules/ui/expenses/recordItemPane/isLoading';

import {
  getRateFromId,
  searchTaxTypeList,
} from '../../action-dispatchers/Currency';
import {
  openCostCenterDialog,
  openEILookupDialog,
  openJobDialog,
  openReceiptLibraryDialog,
  openRecordItemsConfirmDialog,
  openRecordItemsCreateDialog,
  openRecordItemsDeleteDialog,
} from '../../action-dispatchers/Dialog';
import { searchExpTypesByParentRecord } from '../../action-dispatchers/ExpenseType';
import { getRecentJobs, searchJobs } from '../../action-dispatchers/Job';
import {
  getBase64File,
  uploadReceipts,
} from '../../action-dispatchers/Receipt';
import { resetRouteForm } from '../../action-dispatchers/Route';

import { mapStateToProps as mapExpenseStateToProps } from '../../../expenses-pc/containers/Expenses/RecordItemContainer';

const mapStateToProps = (state, ownProps) => {
  const expenseStateToProps = mapExpenseStateToProps(state, ownProps);

  return {
    ...expenseStateToProps,
    isExpenseRequest: true,
    taxRoundingSetting: state.userSetting.expTaxRoundingSetting,
  };
};

const mapDispatchToProps = {
  confirm,
  hideRecord: overlapActions.nonOverlapRecord,
  openEILookupDialog,
  getRateFromId,
  openReceiptLibraryDialog,
  resetRouteForm,
  reportSelectMode: modeActions.reportSelect,
  searchTaxTypeList,
  searchExpTypesByParentRecord,
  getBase64File,
  uploadReceipts,
  openJobDialog,
  openCostCenterDialog,
  onClickRecordItemsCreateButton: () => openRecordItemsCreateDialog(),
  onClickRecordItemsConfirmButton: () => openRecordItemsConfirmDialog(),
  onClickRecordItemsDeleteButton: () => openRecordItemsDeleteDialog(),
  clearRecordLoading: recordPanelLoadingActions.clear,
  getRecentJobs,
  searchJobs,
  getLatestHistoryCostCenter,
  getRecentCostCenters,
  searchCostCenters,
  saveFileMetadata: fileMetadataActions.save,
  fetchFileMetadata: fileMetadataActions.fetch,
  searchRouteOption: searchRouteActions.search,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  searchJobs: (keyword) => {
    const recordDate = ownProps.expReport.scheduledDate || '';
    return dispatchProps.searchJobs(
      keyword,
      recordDate,
      stateProps.employeeId,
      stateProps.companyId
    );
  },
  getRecentJobs: (targetDate) => {
    return dispatchProps.getRecentJobs(targetDate, stateProps.employeeId);
  },
  searchCostCenters: (keyword) => {
    const { expReport, recordIdx } = ownProps;
    return dispatchProps.searchCostCenters(
      stateProps.companyId,
      keyword,
      expReport.records[recordIdx].recordDate
    );
  },
  getRecentCostCenters: (targetDate) => {
    return dispatchProps.getRecentCostCenters(
      stateProps.employeeId,
      targetDate
    );
  },
  onClickOpenLibraryButton: () => {
    dispatchProps.openReceiptLibraryDialog();
  },
  onClickResetRouteInfoButton: () => {
    const updateObj = {
      routeInfo: cloneDeep(newRouteInfo),
      'items[0].amount': 0,
    };
    stateProps.updateRecord(updateObj, true);
    dispatchProps.resetRouteForm(null, false);
    // set route option to default only if there are empty option
    const isOptionEmpty = Object.values(stateProps.routeOptions).some(
      (value) => !value
    );
    if (isOptionEmpty) {
      dispatchProps.searchRouteOption(stateProps.selectedCompanyId);
    }
  },
  onClickHideRecordButton: () => {
    const { expReport, recordIdx, selectedRecord } = ownProps;
    const isNewRecord = !get(expReport, `records[${recordIdx}].recordId`);
    const isReportEditMode =
      stateProps.mode === modes.REPORT_EDIT ||
      stateProps.mode === modes.FINANCE_REPORT_EDITED;
    const tmpRecord = expReport.records[recordIdx];

    const isRecordEdited = !isEqual(tmpRecord, selectedRecord);

    if (isReportEditMode && isRecordEdited) {
      // if confirm discard changes
      dispatchProps.confirm(msg().Common_Confirm_DiscardEdits, (yes) => {
        if (yes) {
          dispatchProps.hideRecord();
          dispatchProps.clearRecordLoading();

          if (isNewRecord) {
            // delete record from redux store if it's new record
            stateProps.deleteRecord();
          } else {
            // restore from tmpRecord
            stateProps.restoreOldRecord();
          }
          dispatchProps.reportSelectMode();
        }
      });
    } else {
      dispatchProps.hideRecord();
      dispatchProps.clearRecordLoading();
      dispatchProps.reportSelectMode();
      if (isNewRecord) {
        // delete new added record from formik value
        stateProps.deleteRecord();
      }
      // unselect the recordItem
      ownProps.onChangeEditingExpReport(`ui.recordIdx`, -1);
      ownProps.onChangeEditingExpReport(`ui.tempSavedRecordItems`, null);
    }
    ownProps.onChangeEditingExpReport(`ui.saveMode`, false);
    ownProps.onChangeEditingExpReport(`ui.isRecordSave`, false);
  },
  onChangeRecordDate: async (recordDate) => {
    if (
      ownProps.expReport.records[ownProps.recordIdx].recordDate !== recordDate
    ) {
      const target = ownProps.expReport.records[ownProps.recordIdx];
      const isItemized = isRecordItemized(target.recordType, false);
      let finalUpdateObj = {};
      if (isItemized) {
        finalUpdateObj = { recordDate };
      } else if (target.items[0].useForeignCurrency) {
        let exchangeRateManual = recordDate === '';
        const today = DateUtil.getToday();
        const rateDate = recordDate || today;
        const rateInfo = get(
          stateProps.exchangeRateMap,
          `${target.items[0].currencyId}.${rateDate}`
        );

        let getExchangeRate;
        if (rateInfo) {
          getExchangeRate = new Promise((resolve) =>
            resolve(rateInfo.calculationRate)
          );
        } else {
          getExchangeRate = dispatchProps
            .getRateFromId(
              stateProps.companyId,
              target.items[0].currencyId,
              rateDate,
              exchangeRateField
            )
            .then((exchangeRate) => {
              if (exchangeRate > 0) {
                return exchangeRate;
              } else if (rateDate === today) {
                exchangeRateManual = true;
                return exchangeRate;
              } else {
                // if no rate on recordDate, get rate on today
                return dispatchProps
                  .getRateFromId(
                    stateProps.companyId,
                    target.items[0].currencyId,
                    today
                  )
                  .then((todayRate) => {
                    exchangeRateManual = true;
                    return todayRate;
                  });
              }
            });
        }

        const exchangeRate = await getExchangeRate;
        const originalExchangeRate = exchangeRateManual ? 0 : exchangeRate;
        const amount = calcAmountFromRate(
          exchangeRate,
          target.items[0].localAmount,
          stateProps.baseCurrencyDecimal,
          stateProps.expRoundingSetting
        );
        finalUpdateObj = {
          recordDate,
          amount,
          'items.0.amount': amount,
          'items.0.recordDate': recordDate,
          'items.0.exchangeRate': exchangeRate,
          'items.0.originalExchangeRate': originalExchangeRate,
          'items.0.exchangeRateManual': exchangeRateManual,
        };
        stateProps.updateReport(ownProps.recordIdx, target, true, false);
      } else {
        // when base currency
        const expTypeId =
          ownProps.expReport.records[ownProps.recordIdx].items[0].expTypeId;

        const result = await dispatchProps.searchTaxTypeList(
          expTypeId,
          recordDate,
          taxSelectField
        );
        const selectedRecord =
          ownProps.expReport.records[ownProps.recordIdx].items[0];

        const initTax =
          find(result.payload[expTypeId][recordDate], {
            historyId: selectedRecord.taxTypeHistoryId,
          }) ||
          find(result.payload[expTypeId][recordDate], {
            baseId: selectedRecord.taxTypeBaseId,
          }) ||
          result.payload[expTypeId][recordDate][0];

        const amount = selectedRecord.amount;
        const rate = initTax ? initTax.rate : 0;
        const baseId = initTax ? initTax.baseId : 'noIdSelected';
        const historyId = initTax ? initTax.historyId : null;
        const name = initTax ? initTax.name : null;

        const updateObj = {
          recordDate,
          'items.0.recordDate': recordDate,
          'items.0.taxTypeBaseId': baseId,
          'items.0.taxTypeHistoryId': historyId,
          'items.0.taxTypeName': name,
          'items.0.taxRate': rate,
        };

        if (selectedRecord.taxManual) {
          // keep existing amount info
        } else if (target.amountInputMode === AmountInputMode.TaxIncluded) {
          const taxRes = calculateTax(
            rate,
            amount || 0,
            stateProps.baseCurrencyDecimal,
            stateProps.taxRoundingSetting
          );
          Object.assign(updateObj, {
            amount: amount || 0,
            withoutTax: taxRes.amountWithoutTax,
            'items.0.amount': amount || 0,
            'items.0.withoutTax': taxRes.amountWithoutTax,
            'items.0.gstVat': taxRes.gstVat,
          });
        } else {
          const { amountWithTax, gstVat } = calcAmountFromTaxExcluded(
            rate,
            selectedRecord.withoutTax,
            stateProps.baseCurrencyDecimal,
            stateProps.taxRoundingSetting
          );
          Object.assign(updateObj, {
            amount: amountWithTax,
            'items.0.amount': amountWithTax,
            'items.0.gstVat': gstVat,
          });
        }
        finalUpdateObj = updateObj;
      }
      // search for selected cc revised name
      const isCcUsedInReport = stateProps.reportTypeList.find(
        (reportType) =>
          reportType.id === ownProps.expReport.expReportTypeId &&
          reportType.isCostCenterRequired !== 'UNUSED'
      );
      const currentHistoryId =
        target.items[0].costCenterHistoryId ||
        ownProps.expReport.costCenterHistoryId;
      if (isCcUsedInReport && currentHistoryId) {
        const latestCostCenter =
          (await dispatchProps.getLatestHistoryCostCenter(
            currentHistoryId,
            recordDate
          )) || {};
        const { baseCode, id, name } = latestCostCenter || {};
        const costCenter = {
          'items.0.costCenterCode': baseCode,
          'items.0.costCenterHistoryId': id,
          'items.0.costCenterName': name,
        };
        Object.assign(finalUpdateObj, costCenter);
      }
      stateProps.updateRecord(finalUpdateObj, true);
    }
  },
  onChangeChildDateOrTypeForBC: (selectedValues) => {
    const targetRecordItem =
      ownProps.expReport.records[ownProps.recordIdx].items[
        ownProps.recordItemIdx
      ];
    const recordDate = selectedValues.recordDate;
    const expTypeId = selectedValues.expTypeId;
    const isRecordDateChange = targetRecordItem.recordDate !== recordDate;
    const isExpTypeChange = targetRecordItem.expTypeId !== expTypeId;
    const targetPath = `items.${ownProps.recordItemIdx}`;
    const updateObj = {};

    // if change expense type, need to update EIs
    if (expTypeId && isExpTypeChange) {
      const expTypeInfo = ownProps.expTypeList.find(
        (expType) => expType.id === expTypeId
      );
      const EIs = getEIsOnly(expTypeInfo);
      Object.keys(EIs).forEach((key) => {
        updateObj[`${targetPath}.${key}`] = EIs[key];
      });
      updateObj[`${targetPath}.expTypeName`] = expTypeInfo.name;
    }

    // if input empty recordDate or expType, only update value
    if (!recordDate || !expTypeId) {
      assign(updateObj, {
        [`${targetPath}.recordDate`]: recordDate,
        [`${targetPath}.expTypeId`]: expTypeId,
      });
      stateProps.updateRecord(updateObj);
    } // else when recordDate or expType change, update tax info
    else if (isRecordDateChange || isExpTypeChange) {
      const taxTypeList = get(stateProps.tax, `${expTypeId}.${recordDate}`);
      const amount = targetRecordItem.amount;

      let getTaxInfo;
      if (taxTypeList) {
        const initTax =
          find(taxTypeList, {
            historyId: targetRecordItem.taxTypeHistoryId,
          }) || taxTypeList[0];

        getTaxInfo = new Promise((resolve) => resolve(initTax));
      } else {
        getTaxInfo = dispatchProps
          .searchTaxTypeList(expTypeId, recordDate)
          .then((result: ExpTaxTypeListApiReturn) => {
            const initTax =
              find(result.payload[expTypeId][recordDate], {
                historyId: targetRecordItem.taxTypeHistoryId,
              }) || result.payload[expTypeId][recordDate][0];

            return initTax;
          });
      }
      getTaxInfo.then((initTax) => {
        const rate = initTax ? initTax.rate : 0;
        const baseId = initTax ? initTax.baseId : 'noIdSelected';
        const historyId = initTax ? initTax.historyId : null;
        const name = initTax ? initTax.name : null;

        assign(updateObj, {
          [`${targetPath}.recordDate`]: recordDate,
          [`${targetPath}.taxTypeBaseId`]: baseId,
          [`${targetPath}.taxTypeHistoryId`]: historyId,
          [`${targetPath}.taxTypeName`]: name,
          [`${targetPath}.taxRate`]: rate,
          [`${targetPath}.expTypeId`]: expTypeId,
        });

        if (targetRecordItem.taxManual) {
          // keep existing amount info
        } else if (
          ownProps.expReport.records[ownProps.recordIdx].amountInputMode ===
          AmountInputMode.TaxIncluded
        ) {
          const taxRes = calculateTax(
            rate,
            amount || 0,
            stateProps.baseCurrencyDecimal,
            stateProps.taxRoundingSetting
          );
          assign(updateObj, {
            [`${targetPath}.withoutTax`]: taxRes.amountWithoutTax,
            [`${targetPath}.gstVat`]: taxRes.gstVat,
          });
        } else {
          const taxRes = calcAmountFromTaxExcluded(
            rate,
            targetRecordItem.withoutTax,
            stateProps.baseCurrencyDecimal,
            stateProps.taxRoundingSetting
          );
          assign(updateObj, {
            [`${targetPath}.amount`]: taxRes.amountWithTax,
            [`${targetPath}.gstVat`]: taxRes.gstVat,
          });
        }

        stateProps.updateRecord(updateObj, true);
      });
    }
  },
  onChangeChildExpTypeForFC: (expTypeId) => {
    const { expReport, recordIdx, recordItemIdx, expTypeList } = ownProps;
    const targetRecordItem = expReport.records[recordIdx].items[recordItemIdx];
    const isExpTypeChange = targetRecordItem.expTypeId !== expTypeId;
    // if change expense type, need to update EIs
    if (expTypeId && isExpTypeChange) {
      const updateObj = {};
      const targetPath = `items.${recordItemIdx}`;
      const expTypeInfo = expTypeList.find(
        (expType) => expType.id === expTypeId
      );
      const EIs = getEIsOnly(expTypeInfo);
      Object.keys(EIs).forEach((key) => {
        updateObj[`${targetPath}.${key}`] = EIs[key];
      });
      updateObj[`${targetPath}.expTypeName`] = expTypeInfo.name;
      updateObj[`${targetPath}.expTypeId`] = expTypeId;
      stateProps.updateRecord(updateObj);
    }
  },
  // when change date for child item which use Foreign currency
  onChangeChildDateForFC: (recordDate) => {
    const { expReport, recordIdx, recordItemIdx } = ownProps;
    const targetItem = expReport.records[recordIdx].items[recordItemIdx];
    if (targetItem.recordDate === recordDate) {
      return;
    }

    let exchangeRateManual = recordDate === '';
    const today = DateUtil.getToday();
    const rateDate = recordDate || today;
    const rateInfo = get(
      stateProps.exchangeRateMap,
      `${targetItem.currencyId}.${rateDate}`
    );
    let getExchangeRate;

    if (rateInfo) {
      getExchangeRate = new Promise((resolve) =>
        resolve(rateInfo.calculationRate)
      );
    } else {
      getExchangeRate = dispatchProps
        .getRateFromId(stateProps.companyId, targetItem.currencyId, rateDate)
        .then((exchangeRate) => {
          if (exchangeRate > 0) {
            return exchangeRate;
          } else if (rateDate === today) {
            exchangeRateManual = true;
            return exchangeRate;
          } else {
            // if no rate on recordDate, get rate on today
            return dispatchProps
              .getRateFromId(stateProps.companyId, targetItem.currencyId, today)
              .then((todayRate) => {
                exchangeRateManual = true;
                return todayRate;
              });
          }
        });
    }

    const path = `items.${recordItemIdx}`;
    getExchangeRate.then((exchangeRate) => {
      const originalExchangeRate = exchangeRateManual ? 0 : exchangeRate;
      const amount = calcAmountFromRate(
        exchangeRate,
        targetItem.localAmount,
        stateProps.baseCurrencyDecimal,
        stateProps.expRoundingSetting
      );

      stateProps.updateRecord({
        [`${path}.recordDate`]: recordDate,
        [`${path}.amount`]: amount,
        [`${path}.exchangeRate`]: exchangeRate,
        [`${path}.originalExchangeRate`]: originalExchangeRate,
        [`${path}.exchangeRateManual`]: exchangeRateManual,
      });
    });
  },
  onImageDrop: (file: File) =>
    dispatchProps.getBase64File(file).then((base64File) => {
      dispatchProps.uploadReceipts([base64File]).then(async (res) => {
        const { contentVersionId, contentDocumentId } = res;
        if (res) {
          const metadata = await getMetadata(file);
          if (metadata) {
            await dispatchProps.saveFileMetadata({
              ...metadata,
              contentDocumentId,
            });
          }
          stateProps.updateRecord({
            receiptId: contentDocumentId,
            receiptFileId: contentVersionId,
            receiptTitle: FileUtil.getFileNameWithoutExtension(base64File.name),
            receiptDataType: base64File.type,
            receiptCreatedDate: new Date(),
          });
        }
      });
    }),
  onClickJobBtn: (recordDate) => {
    dispatchProps.openJobDialog(
      recordDate,
      stateProps.employeeId,
      !isEmpty(stateProps.selectedDelegator)
    );
  },
  onClickCostCenterBtn: (recordDate) => {
    dispatchProps.openCostCenterDialog(
      recordDate,
      stateProps.employeeId,
      !isEmpty(stateProps.selectedDelegator)
    );
  },
  onClickLookupEISearch: (item: EISearchObj) =>
    dispatchProps.openEILookupDialog(
      item,
      stateProps.employeeId,
      !isEmpty(stateProps.selectedDelegator)
    ),
  onChangeAmountSelection: (amountId: string) => {
    const { expReport, recordIdx } = ownProps;
    const record = expReport.records[recordIdx];
    const expTypeId = get(record, 'items[0].expTypeId');
    const useFixedForeignCurrency = get(
      record,
      'items[0].useFixedForeignCurrency'
    );
    const amountOption = get(stateProps.fixedAmountOptionList, `${expTypeId}`);
    const selectedAmount = amountOption.find((item) => item.id === amountId);
    const fixedAmount = isEmpty(selectedAmount)
      ? 0
      : selectedAmount.allowanceAmount;
    const updateObj = {} as any;
    const targetPath = 'items.0';
    updateObj[`${targetPath}.fixedAllowanceOptionId`] = amountId;

    if (useFixedForeignCurrency) {
      updateObj[`${targetPath}.localAmount`] = fixedAmount;
    } else {
      updateObj.amount = fixedAmount;
      updateObj[`${targetPath}.amount`] = fixedAmount;
    }
    stateProps.updateRecord(updateObj);
  },
  removeAllChildItems: () => {
    const { expReport, recordIdx } = ownProps;
    const parentRecord = cloneDeep(expReport.records[recordIdx]);
    parentRecord.amount = 0;
    parentRecord.withoutTax = 0;
    parentRecord.items[0].amount = 0;
    parentRecord.items[0].withoutTax = 0;
    parentRecord.items[0].gstVat = 0;
    parentRecord.items.splice(1);
    ownProps.onChangeEditingExpReport(
      `report.records.${recordIdx}`,
      parentRecord
    );
    ownProps.onChangeEditingExpReport(
      'ui.tempSavedRecordItems',
      parentRecord.items
    );
  },
  onClickSaveButton: (isCCRecord: boolean) => {
    const { expReport, onClickSaveButton, recordIdx } = ownProps;
    const { useJctRegistrationNumber, displayNonInvoiceWarning } = stateProps;
    const jctInvoiceOption = get(
      expReport,
      `records[${recordIdx}].items.0.jctInvoiceOption`
    );
    const reportVendorId = get(expReport, 'vendorId');
    const recordVendorId = get(
      expReport,
      `records[${recordIdx}].items.0.vendorId`
    );
    if (
      jctInvoiceOption === JCT_NUMBER_INVOICE.NonInvoice &&
      useJctRegistrationNumber &&
      displayNonInvoiceWarning &&
      !reportVendorId &&
      !recordVendorId
    ) {
      dispatchProps.confirm(msg().Exp_Clbl_JCTNonInvoiceWarning, (yes) => {
        if (yes) {
          onClickSaveButton(isCCRecord);
        }
      });
      return;
    }
    onClickSaveButton(isCCRecord);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RecordItemView) as React.ComponentType<Record<string, any>>;
