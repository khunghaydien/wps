import { connect } from 'react-redux';

import get from 'lodash/get';

import ExpenseTypeSelect, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/ExpenseTypeSelect';

import {
  isFixedAllowanceMulti,
  isFixedAllowanceSingle,
  isRecordItemized,
  newRecord,
  Record as ExpRecord,
} from '../../../../domain/models/exp/Record';
import { calculateTax } from '../../../../domain/models/exp/TaxType';
import { isUseJctNo, JCT_NUMBER_INVOICE } from '@apps/domain/models/exp/JCTNo';

import { actions as searchRouteActions } from '../../../../domain/modules/exp/jorudan/routeOption';
import { State } from '../../../modules';
import { actions as overlapActions } from '../../../modules/ui/expenses/overlap';
import { actions as selectedReceiptActions } from '../../../modules/ui/expenses/receiptLibrary/selectedReceipt';
import { actions as fixedAmountOptionActions } from '../../../modules/ui/expenses/recordItemPane/fixedAmountOption';
import { actions as recordPanelLoadingActions } from '../../../modules/ui/expenses/recordItemPane/isLoading';

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

import { Props as OwnProps } from '../../../components/Requests/Dialog';

const mapStateToProps = (state: State) => ({
  expenseTypeList:
    state.ui.expenses.dialog.expenseTypeSelect.list.selectionList,
  expenseTypeSearchList:
    state.ui.expenses.dialog.expenseTypeSelect.list.searchList,
  expenseTypeRecentItems:
    state.ui.expenses.dialog.expenseTypeSelect.list.recentItems,
  expenseTypeFavoriteItems:
    state.ui.expenses.dialog.expenseTypeSelect.list.favoriteItems,
  isLoading: !!state.ui.expenses.dialog.isLoading,
  selectedReceipt: state.ui.expenses.receiptLibrary.selectedReceipt[0] || {},
  baseCurrencyDecimal: state.userSetting.currencyDecimalPlaces,
  taxRoundingSetting: state.userSetting.expTaxRoundingSetting,
  companyId: state.userSetting.companyId,
  employeeId: state.userSetting.employeeId,
  recordType: state.ui.expenses.dialog.expenseTypeSelect.recordType,
  hintMsg: state.entities.exp.customHint.recordExpenseType,
  hasMore: state.ui.expenses.dialog.expenseTypeSelect.list.hasMore,
  selectedDelegator: state.ui.expenses.delegateApplicant.selectedEmployee,
});

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
    dispatchProps.getExpenseTypeList(
      stateProps.recordType,
      ownProps.expReport.scheduledDate || '',
      ownProps.expReport.expReportTypeId || ''
    );
  },
  onClickExpenseTypeCloseButton: () => {
    dispatchProps.resetSelectedReceipt();
    ownProps.onClickHideDialogButton();
  },
  onClickExpenseTypeSearch: (keyword) => {
    dispatchProps.getExpenseTypeSearchResult(
      stateProps.companyId,
      keyword,
      ownProps.expReport.scheduledDate || '',
      ownProps.expReport.expReportTypeId || '',
      stateProps.recordType,
      stateProps.employeeId
    );
  },

  // @ts-ignore
  listFavoriteExpenseTypes: () => {
    const recordDate = ownProps.expReport.scheduledDate;
    return dispatchProps.getFavoriteExpTypes(
      stateProps.employeeId,
      recordDate || '',
      stateProps.companyId,
      ownProps.expReport.expReportTypeId || ''
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
      dispatchProps.getNextExpenseTypeList(
        selectedExpType,
        hierarExpTypes || [],
        ownProps.expReport.scheduledDate || '',
        stateProps.recordType,
        ownProps.expReport.expReportTypeId || ''
      );
    } // 選択されたものが費目の場合 / if expense type is selected
    else {
      const idx = ownProps.expReport.records.length;

      // show loading skeleton in record panel
      ownProps.hideDialog();
      dispatchProps.overlap();
      dispatchProps.toggleRecordLoading(true);

      // @ts-ignore
      const expType: ExpenseType = await dispatchProps.getExpenseTypeById(
        selectedExpType.id
      );

      const _ = undefined;
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
        _,
        _,
        _,
        _,
        _,
        expType.merchant
      );
      const expTypeId = expType.id;
      const recordDate = ownProps.expReport.scheduledDate || '';

      newRec.recordDate = recordDate;

      // set jct invoice option and jct registration number
      if (expType.jctRegistrationNumberUsage) {
        (newRec as ExpRecord).jctRegistrationNumberUsage =
          expType.jctRegistrationNumberUsage;
        if (isUseJctNo(expType.jctRegistrationNumberUsage)) {
          (newRec as ExpRecord).items[0].jctInvoiceOption =
            JCT_NUMBER_INVOICE.Invoice;
        }
      }

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
