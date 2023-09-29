import { connect } from 'react-redux';

import { assign, cloneDeep, find, get, isEmpty, isEqual, set } from 'lodash';

import { getItemLatestCostCenter } from '../../../commons/action-dispatchers/CostCenter';
import {
  confirm,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';
import RecordItemView from '../../../commons/components/exp/Form/RecordItem';
import msg from '../../../commons/languages';
import { selectors as appSelectors } from '../../../commons/modules/app';
import FileUtil from '../../../commons/utils/FileUtil';
import { startCalendarLoading } from '@commons/action-dispatchers/ExpCalendar';
import { updatePaymentMethodOptionList } from '@commons/action-dispatchers/PaymentMethod';
import { actions as fileMetadataActions } from '@commons/modules/exp/entities/fileMetadata';
import { actions as toastActions } from '@commons/modules/toast';
import {
  calculateBCChildItemListAmount,
  updateChildItemExpType,
} from '@commons/utils/exp/ItemizationUtil';

import { getEIsOnly } from '../../../domain/models/exp/ExtendedItem';
import { calcAmountFromRate } from '../../../domain/models/exp/foreign-currency/Currency';
import { exchangeRateField } from '../../../domain/models/exp/foreign-currency/ExchangeRate';
import {
  calculateTotalTaxes,
  isCCRecord,
  isIcRecord,
  isItemizedRecord,
  isMileageRecord,
  newRouteInfo,
  RECORD_ATTACHMENT_MAX_COUNT,
  updateTaxItemRates,
} from '../../../domain/models/exp/Record';
import {
  AmountInputMode,
  calcAmountFromTaxExcluded,
  calculateTax,
  ExpTaxTypeListApiReturn,
  taxSelectField,
} from '../../../domain/models/exp/TaxType';
import { JCT_NUMBER_INVOICE } from '@apps/domain/models/exp/JCTNo';
import { MileageRate } from '@apps/domain/models/exp/Mileage';
import {
  isCCPaymentMethod,
  isICPaymentMethod,
  PaymentMethod,
} from '@apps/domain/models/exp/PaymentMethod';
import { getMetadata } from '@apps/domain/models/exp/Receipt';
import {
  generateVendorTypes,
  VendorBackType,
  vendorTypes,
} from '@apps/domain/models/exp/Vendor';

import { actions as searchRouteActions } from '../../../domain/modules/exp/jorudan/routeOption';
import { actions as activeDialogActions } from '../../modules/ui/expenses/dialog/activeDialog';
import { actions as vendorIdActions } from '../../modules/ui/expenses/dialog/vendor/id';
import { actions as modeActions, modes } from '../../modules/ui/expenses/mode';
import { actions as overlapActions } from '../../modules/ui/expenses/overlap';
import { actions as selectedReceiptActions } from '../../modules/ui/expenses/receiptLibrary/selectedReceipt';
import { actions as recordPanelLoadingActions } from '../../modules/ui/expenses/recordItemPane/isLoading';
import {
  actions as mileageRateActions,
  mileageRateSelect,
} from '@apps/domain/modules/exp/mileageRate';

import {
  getRateFromId,
  searchChildItemTaxTypeList,
  searchTaxTypeList,
} from '../../action-dispatchers/Currency';
import {
  openCostCenterDialog,
  openEILookupDialog,
  openIcTransactionDialog,
  openJobDialog,
  openReceiptLibraryDialog,
  openTransactionSelectionDialog,
  openVendorDetailModal,
  openVendorLookupDialog,
} from '../../action-dispatchers/Dialog';
import { searchExpTypesByParentRecord } from '../../action-dispatchers/ExpenseType';
import {
  getBase64File,
  uploadReceipts,
} from '../../action-dispatchers/Receipt';
import { resetRouteForm } from '../../action-dispatchers/Route';
import {
  getRecentVendors,
  searchVendors,
} from '../../action-dispatchers/Vendor';

import ItemizationTabContainer from './ItemizationTabContainer';
import JobCCEISumContainer from './JobCCEISumContainer';

export const mapStateToProps = (state: any, ownProps: any) => {
  const {
    onChangeEditingExpReport,
    errors,
    touched,
    expReport,
    recordIdx,
    selectedRecord,
    recordItemIdx,
    availablePaymentMethodIds,
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
    isTouched = true,
    isUpdateUI = false
  ) => {
    if (isUpdateUI) {
      onChangeEditingExpReport(`ui.${key}`, value);
      return;
    }
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
      onChangeEditingExpReport(`ui.recalc`, true, undefined, false);
    }
  };

  // payment method
  const currReportType =
    state.entities.exp.expenseReportType.list.active.find(
      ({ id }) => id === expReport.expReportTypeId
    ) || {};
  const reportPaymentMethodIds = currReportType.paymentMethodIds || [];
  const currRecord = expReport.records[recordIdx];
  const paymentMethodList = state.common.exp.entities.paymentMethodList;
  const selectedPaymentMethod =
    paymentMethodList.find(
      ({ id }) => id === get(currRecord, 'paymentMethodId')
    ) || ({} as PaymentMethod);

  const vendorTypes = generateVendorTypes(
    state.userSetting,
    ownProps.isFinanceApproval
  );

  const { useCompanyVendor, usePersonalVendor } = state.userSetting;
  const showVendorFilter = !(useCompanyVendor ^ usePersonalVendor);

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
    expenseTypeList: state.entities.exp.expenseType.list,
    mode: state.ui.expenses.mode,
    overlap: state.ui.expenses.overlap,
    baseCurrencyCode: state.userSetting.currencyCode,
    baseCurrencySymbol:
      ownProps.currencySymbol || state.userSetting.currencySymbol,
    baseCurrencyDecimal:
      ownProps.currencyDecimalPlaces || state.userSetting.currencyDecimalPlaces,
    allowTaxExcludedAmount: state.userSetting.allowTaxExcludedAmountInput,
    displayCalendar:
      state.userSetting.displayCalendarOnExpenseModule &&
      isEmpty(state.ui.expenses.delegateApplicant.selectedEmployee),
    expRoundingSetting: state.userSetting.expRoundingSetting,
    taxRoundingSetting: state.userSetting.expTaxRoundingSetting,
    companyId: state.userSetting.companyId,
    customHint: state.entities.exp.customHint,
    fileMetadata: state.common.exp.entities.fileMetadata,
    employeeId: state.userSetting.employeeId,
    expenseTaxTypeList: state.entities.exp.taxType,
    accountingPeriodAll: state.ui.expenses.recordListPane.accountingPeriod,
    isUseAttendance: state.userSetting.useAttendance,
    loadingAreas: state.common.app.loadingAreas,
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
    selectedCompanyId:
      ownProps.selectedCompanyId || state.userSetting.companyId,
    useTransitManager: state.userSetting.useTransitManager,
    isLoading: appSelectors.loadingSelector(state),
    reportTypeList: state.entities.exp.expenseReportType.list.active,
    routeOptions: state.ui.expenses.recordItemPane.routeForm.option,
    reportPaymentMethodIds,
    paymentMethodList,
    paymentMethodOptionList: state.common.exp.ui.paymentMethodOption,
    mileageUnit: ownProps.expMileageUnit || state.userSetting.expMileageUnit,
    needGenerateMapPreview:
      state.ui.expenses.recordItemPane.mileage.needGenerateMapPreview,
    selectedPaymentMethod,
    isShowToast: state.common.toast.isShow,
    isBulkEditMode: state.common.exp.ui.bulkEditRecord.isEnabled,
    availablePaymentMethodIds,
    useJctRegistrationNumber,
    vendorTypes,
    useCompanyVendor,
    usePersonalVendor,
    showVendorFilter,
    displayNonInvoiceWarning: state.userSetting.nonInvoiceWarning,
    // component
    itemizationTabContainer: ItemizationTabContainer,
    jobCCEISumContainer: JobCCEISumContainer,
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
  openJobDialog,
  openCostCenterDialog,
  openEILookupDialog,
  openVendorLookupDialog,
  openVendorDetailModal,
  openCCTransactionDialog: openTransactionSelectionDialog,
  openICTransactionDialog: openIcTransactionDialog,
  resetSelectedReceipt: selectedReceiptActions.clear,
  clearRecordLoading: recordPanelLoadingActions.clear,
  saveFileMetadata: fileMetadataActions.save,
  fetchFileMetadata: fileMetadataActions.fetch,
  getItemLatestCostCenter,
  searchRouteOption: searchRouteActions.search,
  getMileageRates: mileageRateActions.search,
  startCalendarLoading,
  hideToast: toastActions.hide,
  showToast: toastActions.showWithType,
  updatePaymentMethodOptionList,
  loadingStart,
  loadingEnd,
  hideAllDialogs: activeDialogActions.hideAll,
  getRecentVendors,
  searchVendors,
  searchChildItemTaxTypeList,
  setVendorIdDialog: vendorIdActions.set,
  clearVendorIdDialog: vendorIdActions.clear,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  onClickOpenLibraryButton: () => {
    dispatchProps.openReceiptLibraryDialog(
      stateProps.useReceiptScan,
      RECORD_ATTACHMENT_MAX_COUNT
    );
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
  onClickHideRecordButton: async () => {
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
      });
    } else {
      dispatchProps.hideRecord();
      dispatchProps.clearRecordLoading();
      // unselect the recordItem
      await ownProps.onChangeEditingExpReport(`ui.recordIdx`, -1);
      ownProps.onChangeEditingExpReport(`ui.saveMode`, false);
      ownProps.onChangeEditingExpReport(`ui.isRecordSave`, false);
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
      // start calendar loading
      if (stateProps.displayCalendar) dispatchProps.startCalendarLoading();

      const { useForeignCurrency } = target.items[0];
      let finalUpdateObj = {};

      if (!recordDate) {
        finalUpdateObj = { recordDate };
      } else if (useForeignCurrency) {
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

        if (isItemizedRecord(target.items.length)) {
          const [parentItem, ...childItemList] = target.items;
          const expTypList = await dispatchProps.searchExpTypesByParentRecord(
            recordDate,
            parentItem.expTypeId
          );
          const updateExpTypeObj = updateChildItemExpType(
            childItemList,
            expTypList
          );
          Object.assign(finalUpdateObj, updateExpTypeObj);
        }
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
        const isMileage = isMileageRecord(target.recordType);

        if (isMileage) {
          const updateObj = {
            recordDate,
            'items.0.recordDate': recordDate,
          };
          const mileageRateBaseId = target.items[0].mileageRateBaseId;
          await dispatchProps
            .getMileageRates(
              {
                companyId: stateProps.selectedCompanyId,
                targetDate: recordDate,
              },
              true,
              mileageRateSelect
            )
            // @ts-ignore
            .then((mileageRates: Array<MileageRate>) => {
              const expMileageRateInfo: MileageRate | undefined = (
                mileageRates || []
              ).find((mR: MileageRate) => mR.id === mileageRateBaseId);
              const mileageRateHistoryId = get(expMileageRateInfo, 'historyId');
              const milaegeRate = get(expMileageRateInfo, 'rate');
              const mileageRateName = get(expMileageRateInfo, 'name');
              Object.assign(updateObj, {
                'items.0.mileageRateHistoryId': mileageRateHistoryId,
                'items.0.mileageRate': milaegeRate,
                'items.0.mileageRateName': mileageRateName,
              });
            });
          finalUpdateObj = updateObj;
        }
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

        finalUpdateObj = Object.assign(finalUpdateObj, updateObj);

        /* Child Items */
        if (isItemizedRecord(target.items.length)) {
          const [parentItem, ...childItemList] = target.items;

          const taxTypeObj = await dispatchProps.searchChildItemTaxTypeList(
            childItemList,
            recordDate
          );
          const updateChildItemObj = calculateBCChildItemListAmount(
            target.amountInputMode,
            stateProps.baseCurrencyDecimal,
            childItemList,
            recordDate,
            stateProps.taxRoundingSetting,
            taxTypeObj
          );
          Object.assign(finalUpdateObj, updateChildItemObj);

          const expTypList = await dispatchProps.searchExpTypesByParentRecord(
            recordDate,
            parentItem.expTypeId
          );
          const updateExpTypeObj = updateChildItemExpType(
            childItemList,
            expTypList
          );
          Object.assign(finalUpdateObj, updateExpTypeObj);
        }

        /* Multi tax */
        if (selectedRecord?.taxItems) {
          const multiTaxUpdatedObj = (() => {
            const taxItems = selectedRecord?.taxItems;

            if (!taxItems) {
              return undefined;
            }

            const taxTypeList = get(
              result,
              `payload.${expTypeId}.${recordDate}`,
              []
            );

            if (!taxTypeList || taxTypeList.length <= 0) {
              return undefined;
            }

            const updatedTaxItems = updateTaxItemRates({
              taxItems,
              taxTypeList,
              baseCurrencyDecimal: stateProps.baseCurrencyDecimal,
              taxRoundingSetting: stateProps.taxRoundingSetting,
              isTaxIncludedMode:
                target.amountInputMode === AmountInputMode.TaxIncluded,
            });

            const { totalAmountInclTax, totalAmountExclTax, totalGstVat } =
              calculateTotalTaxes(
                updatedTaxItems,
                stateProps.baseCurrencyDecimal
              );

            const commonProps = {
              'items.0.taxItems': updatedTaxItems,
              'items.0.gstVat': totalGstVat,
            };

            if (target.amountInputMode === AmountInputMode.TaxExcluded) {
              return {
                ...commonProps,
                amount: totalAmountInclTax,
                amountPayable: totalAmountInclTax,
                withoutTax: selectedRecord.withoutTax,
                'items.0.taxItems': updatedTaxItems,
                'items.0.amount': totalAmountInclTax,
                'items.0.withoutTax': selectedRecord.withoutTax,
                'items.0.gstVat': totalGstVat,
              };
            }

            return {
              ...commonProps,
              amount: selectedRecord.amount,
              amountPayable: selectedRecord.amount,
              withoutTax: totalAmountExclTax,
              'items.0.taxItems': updatedTaxItems,
              'items.0.amount': selectedRecord.amount,
              'items.0.withoutTax': totalAmountExclTax,
              'items.0.gstVat': totalGstVat,
            };
          })();

          Object.assign(finalUpdateObj, multiTaxUpdatedObj);
        }
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
        const updatedItemCCList = await dispatchProps.getItemLatestCostCenter(
          currentHistoryId,
          target.items,
          recordDate
        );
        Object.assign(finalUpdateObj, updatedItemCCList);
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
        stateProps.updateRecord(updateObj, !stateProps.isBulkEditMode);
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
      stateProps.updateRecord(
        { [`${path}.recordDate`]: recordDate },
        !stateProps.isBulkEditMode
      );
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
  onImageDrop: async (files: Array<File>) => {
    const { expReport, recordIdx } = ownProps;
    const targetRecord = expReport.records[recordIdx];
    const updateReceiptList = [...(targetRecord.receiptList || [])];
    dispatchProps.loadingStart();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64File = await dispatchProps.getBase64File(file);
      const uploadReceiptRes = await dispatchProps.uploadReceipts([base64File]);
      if (uploadReceiptRes) {
        const { contentVersionId, contentDocumentId } = uploadReceiptRes;
        const metadata = await getMetadata(file);
        if (metadata) {
          await dispatchProps.saveFileMetadata({
            ...metadata,
            contentDocumentId,
          });
        }
        updateReceiptList.push({
          receiptId: contentDocumentId,
          receiptFileId: contentVersionId,
          receiptTitle: FileUtil.getFileNameWithoutExtension(base64File.name),
          receiptDataType: base64File.type,
          receiptCreatedDate: new Date(),
          receiptFileExtension: FileUtil.getFileExtension(base64File.name),
        });
      }
    }
    dispatchProps.loadingEnd();
    stateProps.updateRecord({ receiptList: updateReceiptList });
  },
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
  toggleICCCCardAlert: (isHide?: boolean) => {
    // toggle alert for IC/CC with invalid payment method
    const { expReport, recordIdx } = ownProps;
    const { paymentMethodList } = stateProps;
    const { hideToast, showToast } = dispatchProps;
    const record = expReport.records[recordIdx] || {};
    const { recordType } = record;

    const isSelectedInvalid = !paymentMethodList.find(
      ({ id }) => id === record.paymentMethodId
    );
    const isShowICError =
      isSelectedInvalid &&
      isIcRecord(recordType) &&
      !paymentMethodList.some(({ integrationService }) =>
        isICPaymentMethod(integrationService, recordType)
      );
    const isShowCCError =
      isSelectedInvalid &&
      isCCRecord(record) &&
      !paymentMethodList.some(({ integrationService }) =>
        isCCPaymentMethod(integrationService)
      );

    if (isHide && (isShowICError || isShowCCError)) {
      hideToast();
      return;
    }

    if (isShowICError) {
      showToast(msg().Exp_Err_ContactAdministratorForICCardPaymentMethod);
    } else if (isShowCCError) {
      showToast(msg().Exp_Err_ContactAdministratorForCCCardPaymentMethod);
    } else {
      hideToast();
    }
  },
  isShowFACCAlert: (paymentMethodId: string) => {
    // toggle alert for selected payment method uses CC integration service in FA
    const { paymentMethodList } = stateProps;
    const { hideToast, showToast } = dispatchProps;

    const selectedPaymentMethod =
      paymentMethodList.find(({ id }) => id === paymentMethodId) ||
      ({} as PaymentMethod);
    const isShowCCError = isCCPaymentMethod(
      selectedPaymentMethod.integrationService
    );

    if (isShowCCError) {
      showToast(msg().Exp_Err_CannotSaveRecordWithSelectedPaymentMethod);
    } else {
      hideToast();
    }
    return isShowCCError;
  },
  toggleVendorDetail: (toOpen: boolean) => {
    if (toOpen) {
      const { expReport, recordIdx } = ownProps;
      const vendorId = get(expReport, `records[${recordIdx}].items.0.vendorId`);
      dispatchProps.setVendorIdDialog(vendorId);
      dispatchProps.openVendorDetailModal();
    } else {
      dispatchProps.hideAllDialogs();
      dispatchProps.clearVendorIdDialog();
    }
  },
  onClickVendorSearch: async (backType: VendorBackType) =>
    dispatchProps.openVendorLookupDialog(
      stateProps.employeeId,
      stateProps.selectedCompanyId,
      stateProps.vendorTypes,
      stateProps.isSkipRecentlyUsedFetch,
      backType
    ),
  getRecentVendors: async (_, types) => {
    const { COMPANY, PERSONAL } = vendorTypes;
    const { employeeId, usePersonalVendor, companyId } = stateProps;
    const { getRecentVendors } = dispatchProps;

    if (!isEmpty(types)) {
      const [resPersonal, resCompany] = await Promise.all([
        getRecentVendors(employeeId, companyId, true),
        getRecentVendors(employeeId, companyId),
      ]);
      return resPersonal
        .map((x) => ({ ...x, type: PERSONAL }))
        .concat(resCompany.map((x) => ({ ...x, type: COMPANY })));
    } else if (usePersonalVendor) {
      return await getRecentVendors(employeeId, companyId, true);
    } else {
      return await getRecentVendors(employeeId, companyId);
    }
  },
  searchVendors: async (keyword, types: Array<string>) => {
    const emptyPromise = new Promise((resolve) => resolve([]));

    const { selectedCompanyId } = stateProps;
    const { searchVendors } = dispatchProps;
    const employeeId =
      ownProps.expReport.employeeBaseId || stateProps.employeeId;
    const promisePersonal = () =>
      searchVendors(selectedCompanyId, keyword, employeeId);
    const promiseCompany = () => searchVendors(selectedCompanyId, keyword);

    const { COMPANY, PERSONAL } = vendorTypes;

    const promiseArray = [
      types.includes(PERSONAL) ? promisePersonal() : emptyPromise,
      types.includes(COMPANY) || isEmpty(types)
        ? promiseCompany()
        : emptyPromise,
    ];

    const [result1, result2] = await Promise.all(promiseArray);

    return result1
      .map((x) => ({ ...x, type: PERSONAL }))
      .concat(result2.map((x) => ({ ...x, type: COMPANY })));
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
