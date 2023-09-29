import { connect } from 'react-redux';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import ExpenseTypeSelect, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/ExpenseTypeSelect';
import { updatePaymentMethodOptionList } from '@commons/action-dispatchers/PaymentMethod';

import {
  isFixedAllowanceMulti,
  isFixedAllowanceSingle,
  isMileageRecord,
  newRecord,
  Record as ExpRecord,
} from '../../../../domain/models/exp/Record';
import { calculateTax } from '../../../../domain/models/exp/TaxType';
import { isUseJctNo, JCT_NUMBER_INVOICE } from '@apps/domain/models/exp/JCTNo';
import {
  initialDestinations,
  MileageRate,
} from '@apps/domain/models/exp/Mileage';

import { actions as searchRouteActions } from '../../../../domain/modules/exp/jorudan/routeOption';
import { State } from '../../../modules';
import { actions as overlapActions } from '../../../modules/ui/expenses/overlap';
import { actions as selectedReceiptActions } from '../../../modules/ui/expenses/receiptLibrary/selectedReceipt';
import { actions as fixedAmountOptionActions } from '../../../modules/ui/expenses/recordItemPane/fixedAmountOption';
import { actions as recordPanelLoadingActions } from '../../../modules/ui/expenses/recordItemPane/isLoading';
import { setAvailableExpType } from '@apps/domain/modules/exp/expense-type/availableExpType';
import { actions as mileageRateActions } from '@apps/domain/modules/exp/mileageRate';

import { searchTaxTypeList } from '../../../action-dispatchers/Currency';
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
import { updateRecordInfo } from '@apps/requests-pc/action-dispatchers/BulkEdit';
import {
  endBulkEditLoading,
  setIsNeedGenerateMapPreview,
  startBulkEditLoading,
} from '@apps/requests-pc/action-dispatchers/Requests';

import { Props as OwnProps } from '../../../components/Requests/Dialog';

const mapStateToProps = (state: State) => {
  const subroleId = get(state, 'ui.expenses.subrole.selectedRole');
  const selectedDelegator = get(
    state,
    'ui.expenses.delegateApplicant.selectedEmployee'
  );
  const isProxyMode = !isEmpty(selectedDelegator);
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
    isLoading: !!state.ui.expenses.dialog.isLoading,
    selectedReceipt: state.ui.expenses.receiptLibrary.selectedReceipt[0] || {},
    baseCurrencyDecimal: state.userSetting.currencyDecimalPlaces,
    taxRoundingSetting: state.userSetting.expTaxRoundingSetting,
    companyId: state.userSetting.companyId,
    employeeId: state.userSetting.employeeId,
    recordType: state.ui.expenses.dialog.expenseTypeSelect.recordType,
    hintMsg: state.entities.exp.customHint.recordExpenseType,
    hasMore: state.ui.expenses.dialog.expenseTypeSelect.list.hasMore,
    paymentMethodOptionList: state.common.exp.ui.paymentMethodOption,
    selectedDelegator: state.ui.expenses.delegateApplicant.selectedEmployee,
    paymentMethodList: state.common.exp.entities.paymentMethodList,
    subroleId,
    isProxyMode,
    isBulkEditMode: state.common.exp.ui.bulkEditRecord.isEnabled,
    useJctRegistrationNumber: state.userSetting.jctInvoiceManagement,
    availableExpType: state.entities.exp.expenseType.availableExpType,
  };
};

const mapDispatchToProps = {
  resetRouteForm,
  getFavoriteExpTypes,
  favoriteExpTypeAction: favoriteExpType,
  unfavoriteExpTypeAction: unfavoriteExpType,
  getExpenseTypeList,
  getExpenseTypeSearchResult,
  getNextExpenseTypeList,
  getExpenseTypeById,
  searchTaxTypeList,
  searchRouteOption: searchRouteActions.search,
  setFixedAmountOption: fixedAmountOptionActions.set,
  toggleRecordLoading: recordPanelLoadingActions.toggle,
  overlap: overlapActions.overlapRecord,
  resetSelectedReceipt: selectedReceiptActions.clear,
  getMileageRates: mileageRateActions.search,
  setIsNeedGenerateMapPreview,
  endBulkEditLoading,
  startBulkEditLoading,
  updateRecordInfo,
  updatePaymentMethodOptionList,
  setAvailableExpType,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  onClickExpenseTypeSelectByCategory: () => {
    const { isBulkEditMode, isProxyMode } = stateProps;
    const { bulkRecordIdx, expReport } = ownProps;
    const date =
      isBulkEditMode && bulkRecordIdx > -1
        ? expReport.records[bulkRecordIdx].recordDate
        : expReport.scheduledDate;

    dispatchProps.getExpenseTypeList(
      stateProps.recordType,
      date || '',
      expReport.expReportTypeId || '',
      isProxyMode ? undefined : stateProps.subroleId,
      undefined
    );
  },
  onClickExpenseTypeCloseButton: () => {
    dispatchProps.resetSelectedReceipt();
    ownProps.onClickHideDialogButton();
  },
  onClickExpenseTypeSearch: (keyword) => {
    const { bulkRecordIdx, expReport } = ownProps;
    const date =
      stateProps.isBulkEditMode && bulkRecordIdx > -1
        ? expReport.records[bulkRecordIdx].recordDate
        : expReport.scheduledDate;

    dispatchProps.getExpenseTypeSearchResult(
      stateProps.companyId,
      keyword,
      date || '',
      expReport.expReportTypeId || '',
      stateProps.recordType,
      stateProps.employeeId,
      stateProps.subroleId,
      undefined
    );
  },

  // @ts-ignore
  listFavoriteExpenseTypes: () => {
    const { bulkRecordIdx, expReport } = ownProps;
    const date =
      stateProps.isBulkEditMode && bulkRecordIdx > -1
        ? expReport.records[bulkRecordIdx].recordDate
        : expReport.scheduledDate;

    return dispatchProps.getFavoriteExpTypes(
      stateProps.employeeId,
      date || '',
      stateProps.companyId,
      expReport.expReportTypeId || '',
      undefined
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
      dispatchProps.getNextExpenseTypeList(
        selectedExpType,
        hierarExpTypes || [],
        ownProps.expReport.scheduledDate || '',
        stateProps.recordType,
        ownProps.expReport.expReportTypeId || '',
        stateProps.subroleId
      );
    } // 選択されたものが費目の場合 / if expense type is selected
    else {
      const { bulkRecordIdx } = ownProps;
      const { availableExpType, companyId, isBulkEditMode } = stateProps;

      const isBulkExistingRecord = isBulkEditMode && bulkRecordIdx > -1;
      const idx = isBulkExistingRecord
        ? bulkRecordIdx
        : ownProps.expReport.records.length;

      const isUpdateAvailableExpType = !availableExpType.includes(
        selectedExpType.id
      );
      if (isUpdateAvailableExpType) {
        const newAvailableExpType = availableExpType.concat([
          selectedExpType.id,
        ]);
        dispatchProps.setAvailableExpType(newAvailableExpType);
      }

      // show loading skeleton in record panel
      ownProps.hideDialog();
      if (isBulkEditMode) {
        dispatchProps.startBulkEditLoading(!isBulkExistingRecord);
      } else {
        dispatchProps.overlap();
        dispatchProps.toggleRecordLoading(true);
      }

      // @ts-ignore
      const expType: ExpenseType = await dispatchProps.getExpenseTypeById(
        selectedExpType.id,
        stateProps.subroleId
      );

      if (isBulkExistingRecord) {
        const newRec = await dispatchProps.updateRecordInfo(
          companyId,
          ownProps.expReport,
          bulkRecordIdx,
          expType,
          stateProps.useJctRegistrationNumber
        );
        dispatchProps.endBulkEditLoading();
        ownProps.onChangeEditingExpReport(`report.records[${idx}]`, newRec, {});
        return;
      }
      const _ = undefined;
      const expTypeId = expType.id;
      const recordDate = ownProps.expReport.scheduledDate || '';

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
        _,
        _,
        _,
        _,
        expType.merchant,
        expType.withholdingTaxUsage,
        []
      );

      newRec.recordDate = recordDate;

      // Record is Mileage Record, we need to set values accordingly
      if (isMileageRecord(newRec.recordType)) {
        dispatchProps.setIsNeedGenerateMapPreview(true);
        dispatchProps
          .getMileageRates({
            companyId: stateProps.companyId,
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
        }
      }

      // set default payment method
      const selectedReportType = stateProps.reportTypeList.find(
        ({ id }) => id === ownProps.expReport.expReportTypeId
      );
      const paymentMethodIds = get(selectedReportType, 'paymentMethodIds', []);
      const paymentMethodOptionList =
        await dispatchProps.updatePaymentMethodOptionList(
          stateProps.paymentMethodList,
          paymentMethodIds,
          newRec
        );
      const defaultPaymentMethodId =
        get(paymentMethodOptionList, '0.value') || null;
      newRec.paymentMethodId = defaultPaymentMethodId;

      dispatchProps
        .searchTaxTypeList(expTypeId, recordDate, null, true)
        // @ts-ignore
        .then((result) => {
          const initTax = get(result, `payload.${expTypeId}.${recordDate}.0`);
          // 選択された費目の明細タイプがジョルダンの場合 / if record type of selected expense type is Jorudan
          if (expType.recordType === 'TransitJorudanJP') {
            dispatchProps.resetRouteForm(null);
            dispatchProps.searchRouteOption(stateProps.companyId);
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

      ownProps.clearDialog();
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
