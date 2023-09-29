import { connect } from 'react-redux';

import { assign, cloneDeep, find, get, isEmpty, isEqual, set } from 'lodash';

import {
  getLatestHistoryCostCenter,
  getRecentCostCenters,
  searchCostCenters,
} from '../../../commons/action-dispatchers/CostCenter';
import { confirm } from '../../../commons/actions/app';
import RecordItemView from '../../../commons/components/exp/Form/RecordItem';
import msg from '../../../commons/languages';
import { selectors as appSelectors } from '../../../commons/modules/app';
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
import { actions as selectedReceiptActions } from '../../modules/ui/expenses/receiptLibrary/selectedReceipt';
import { actions as recordPanelLoadingActions } from '../../modules/ui/expenses/recordItemPane/isLoading';

import {
  getRateFromId,
  searchTaxTypeList,
} from '../../action-dispatchers/Currency';
import {
  openCostCenterDialog,
  openEILookupDialog,
  openIcTransactionDialog,
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

export const mapStateToProps = (state: any, ownProps: any) => {
  const {
    onChangeEditingExpReport,
    errors,
    touched,
    expReport,
    recordIdx,
    selectedRecord,
    recordItemIdx,
  } = ownProps;

  const deleteRecord = () => {
    const tmpReport = cloneDeep(expReport);
    tmpReport.records.splice(recordIdx, 1);
    onChangeEditingExpReport(`report`, tmpReport);
    onChangeEditingExpReport(`ui.recalc`, true);
  };

  const restoreOldRecord = () => {
    const tmpReport = cloneDeep(expReport);
    tmpReport.records.splice(recordIdx, 1, selectedRecord);
    onChangeEditingExpReport(`report`, tmpReport);
    onChangeEditingExpReport(`ui.recalc`, true);
  };

  const updateReport = (
    key: string,
    value: any,
    recalc = false,
    isTouched = true
  ) => {
    onChangeEditingExpReport(`report.${key}`, value, isTouched);
    if (recalc) {
      onChangeEditingExpReport(`ui.recalc`, true, undefined, false);
    }
  };

  const updateRecord = (
    updateObj: {
      [key: string]: any;
    },
    recalc = false
  ) => {
    const tmpRecord = cloneDeep(expReport.records[recordIdx]);

    const touchedRecords = get(touched, `records[${recordIdx}]`);
    const tmpTouched = touchedRecords ? cloneDeep(touchedRecords) : {};

    Object.keys(updateObj).forEach((key) => {
      set(tmpRecord, key, updateObj[key]);
      if (
        key !== 'routeInfo' &&
        key !== 'receiptData' &&
        key !== 'fileName' &&
        key !== 'dataType'
      ) {
        set(tmpTouched, key, true);
      }
    });

    const targetRecord = `report.records[${recordIdx}]`;
    onChangeEditingExpReport(targetRecord, tmpRecord, tmpTouched);

    if (recalc) {
      onChangeEditingExpReport(`ui.recalc`, true);
    }
  };

  let useJctRegistrationNumber = get(state, 'userSetting.jctInvoiceManagement');
  if (ownProps.isFinanceApproval && ownProps.selectedCompanyId) {
    const companyList = state.entities.companyList;
    const companySetting = find(companyList, {
      value: ownProps.selectedCompanyId,
    });
    if (companySetting) {
      useJctRegistrationNumber = companySetting.jctInvoiceManagement;
    }
  }

  return {
    touched,
    errors,
    recordItemIdx,
    mode: state.ui.expenses.mode,
    overlap: state.ui.expenses.overlap,
    baseCurrencyCode: state.userSetting.currencyCode,
    baseCurrencySymbol:
      ownProps.currencySymbol || state.userSetting.currencySymbol,
    baseCurrencyDecimal:
      ownProps.currencyDecimalPlaces || state.userSetting.currencyDecimalPlaces,
    expRoundingSetting: state.userSetting.expRoundingSetting,
    taxRoundingSetting: state.userSetting.expTaxRoundingSetting,
    companyId: state.userSetting.companyId,
    customHint: state.entities.exp.customHint,
    fileMetadata: state.common.exp.entities.fileMetadata,
    employeeId: state.userSetting.employeeId,
    expenseTypeList: state.entities.exp.expenseType.list,
    expenseTaxTypeList: state.entities.exp.taxType,
    accountingPeriodAll: state.ui.expenses.recordListPane.accountingPeriod,
    isUseAttendance: state.userSetting.useAttendance,
    useImageQualityCheck: state.userSetting.useImageQualityCheck,
    deleteRecord,
    updateRecord,
    restoreOldRecord,
    updateReport,
    tax: state.ui.expenses.recordItemPane.tax,
    exchangeRateMap:
      state.ui.expenses.recordItemPane.foreignCurrency.exchangeRate,
    fixedAmountOptionList: state.ui.expenses.recordItemPane.fixedAmountOption,
    useReceiptScan: state.userSetting.useReceiptScan,
    isRecordLoading: !!state.ui.expenses.recordItemPane.isLoading,
    selectedDelegator: state.ui.expenses.delegateApplicant.selectedEmployee,
    isSkipRecentlyUsedFetch:
      !isEmpty(state.ui.expenses.delegateApplicant.selectedDelegator) ||
      ownProps.isFinanceApproval,
    // selectedCompanyId from FA cross Company
    selectedCompanyId:
      ownProps.selectedCompanyId || state.userSetting.companyId,
    useTransitManager: state.userSetting.useTransitManager,
    isLoading: appSelectors.loadingSelector(state),
    reportTypeList: state.entities.exp.expenseReportType.list.active,
    routeOptions: state.ui.expenses.recordItemPane.routeForm.option,
    useJctRegistrationNumber,
    loadingAreas: state.common.app.loadingAreas,
    displayNonInvoiceWarning: state.userSetting.nonInvoiceWarning,
  };
};

const mapDispatchToProps = {
  confirm,
  resetRouteForm,
  searchTaxTypeList,
  searchExpTypesByParentRecord,
  getRateFromId,
  openReceiptLibraryDialog,
  getBase64File,
  uploadReceipts,
  hideRecord: overlapActions.nonOverlapRecord,
  reportEdit: modeActions.reportEdit,
  reportSelectMode: modeActions.reportSelect,
  onClickRecordItemsCreateButton: () => openRecordItemsCreateDialog(),
  onClickRecordItemsConfirmButton: () => openRecordItemsConfirmDialog(),
  onClickRecordItemsDeleteButton: () => openRecordItemsDeleteDialog(),
  openJobDialog,
  openCostCenterDialog,
  openEILookupDialog,
  openIcTransactionDialog,
  resetSelectedReceipt: selectedReceiptActions.clear,
  clearRecordLoading: recordPanelLoadingActions.clear,
  saveFileMetadata: fileMetadataActions.save,
  fetchFileMetadata: fileMetadataActions.fetch,
  getLatestHistoryCostCenter,
  getRecentJobs,
  searchJobs,
  getRecentCostCenters,
  searchCostCenters,
  searchRouteOption: searchRouteActions.search,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  searchJobs: (keyword) => {
    const recordDate = ownProps.expReport.accountingDate;
    return dispatchProps.searchJobs(
      keyword,
      recordDate,
      ownProps.expReport.employeeBaseId || stateProps.employeeId,
      stateProps.selectedCompanyId
    );
  },
  getRecentJobs: (targetDate) => {
    return dispatchProps.getRecentJobs(targetDate, stateProps.employeeId);
  },
  searchCostCenters: (keyword) => {
    const { expReport, recordIdx } = ownProps;
    return dispatchProps.searchCostCenters(
      stateProps.selectedCompanyId,
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
    dispatchProps.openReceiptLibraryDialog(stateProps.useReceiptScan);
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
    const hasReportId = expReport.reportId;
    const hasPreRequestId = expReport.preRequestId;
    const isNewPreRequest = hasPreRequestId && !hasReportId;
    const isNewRecord = !get(expReport, `records[${recordIdx}].recordId`);
    const isReportEditMode =
      stateProps.mode === modes.REPORT_EDIT ||
      stateProps.mode === modes.FINANCE_REPORT_EDITED;
    const tmpRecord = cloneDeep(expReport.records[recordIdx]);

    // Remove any ocr data
    dispatchProps.resetSelectedReceipt();

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
        ownProps.onChangeEditingExpReport(`ui.saveMode`, false);
        ownProps.onChangeEditingExpReport(`ui.isRecordSave`, false);
      });
    } else {
      dispatchProps.hideRecord();
      dispatchProps.clearRecordLoading();
      // unselect the recordItem
      ownProps.onChangeEditingExpReport(`ui`, {
        ...ownProps.ui,
        recordIdx: -1,
        tempSavedRecordItems: null,
        saveMode: false,
        isRecordSave: false,
      });
      if (isNewRecord && !isNewPreRequest) {
        // delete record from redux store if it's new record
        stateProps.deleteRecord();
      }
      dispatchProps.reportSelectMode();
    }
  },
  onChangeRecordDate: async (recordDate) => {
    const target = ownProps.expReport.records[ownProps.recordIdx];
    if (target.recordDate !== recordDate) {
      const isItemized = isRecordItemized(target.recordType, false);
      let finalUpdateObj = {};
      if (isItemized || !recordDate) {
        finalUpdateObj = { recordDate };
      } else if (target.items[0].useForeignCurrency) {
        let exchangeRateManual = false;
        const rateInfo = get(
          stateProps.exchangeRateMap,
          `${target.items[0].currencyId}.${recordDate}`
        );
        let getExchangeRate;
        if (rateInfo) {
          getExchangeRate = new Promise((resolve) =>
            resolve(rateInfo.calculationRate)
          );
        } else {
          getExchangeRate = dispatchProps
            .getRateFromId(
              stateProps.selectedCompanyId,
              target.items[0].currencyId,
              recordDate,
              exchangeRateField
            )
            .then((exchangeRate) => {
              exchangeRateManual = exchangeRate === 0;
              return exchangeRate;
            });
        }
        const exchangeRate = await getExchangeRate;
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
          'items.0.originalExchangeRate': exchangeRate,
          'items.0.exchangeRateManual': exchangeRateManual,
        };
        stateProps.updateReport(ownProps.recordIdx, target, true, false);
      } else {
        // this 2 lines are for giving formik information of accounting period and displaying error if the recordDate is out of accounting period range
        const selectedAccountingPeriod = find(stateProps.accountingPeriodAll, {
          id: ownProps.expReport.accountingPeriodId,
        });
        ownProps.onChangeEditingExpReport(
          'ui.selectedAccountingPeriod',
          selectedAccountingPeriod,
          false
        );

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
      // search for cc revised name
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
  // when change date or exp type for child item which use base currency
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
    } // when recordDate or expType change, update tax info
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
  // when change expense type for child item which use Foreign currency
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
    const path = `items.${recordItemIdx}`;
    if (!recordDate || targetItem.recordDate === recordDate) {
      stateProps.updateRecord({ [`${path}.recordDate`]: recordDate }, true);
      return;
    }
    let exchangeRateManual = false;
    const rateInfo = get(
      stateProps.exchangeRateMap,
      `${targetItem.currencyId}.${recordDate}`
    );
    let getExchangeRate;
    if (rateInfo) {
      getExchangeRate = new Promise((resolve) =>
        resolve(rateInfo.calculationRate)
      );
    } else {
      getExchangeRate = dispatchProps
        .getRateFromId(
          stateProps.selectedCompanyId,
          targetItem.currencyId,
          recordDate
        )
        .then((exchangeRate) => {
          exchangeRateManual = exchangeRate === 0;
          return exchangeRate;
        });
    }
    getExchangeRate.then((exchangeRate) => {
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
        [`${path}.originalExchangeRate`]: exchangeRate,
        [`${path}.exchangeRateManual`]: exchangeRateManual,
      });
    });
  },
  onImageDrop: (file: File) => {
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
    });
  },
  onClickJobBtn: (recordDate) => {
    dispatchProps.openJobDialog(
      recordDate,
      stateProps.employeeId,
      stateProps.isSkipRecentlyUsedFetch
    );
  },
  onClickCostCenterBtn: (recordDate) => {
    dispatchProps.openCostCenterDialog(
      recordDate,
      stateProps.employeeId,
      stateProps.isSkipRecentlyUsedFetch
    );
  },
  onClickLookupEISearch: (item: EISearchObj) =>
    dispatchProps.openEILookupDialog(
      item,
      stateProps.employeeId,
      stateProps.isSkipRecentlyUsedFetch
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
