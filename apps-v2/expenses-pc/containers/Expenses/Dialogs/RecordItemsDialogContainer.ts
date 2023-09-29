import { connect } from 'react-redux';

import { cloneDeep, get, isEmpty, last } from 'lodash';

import RecordItems, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/RecordItems';

import { calcAmountFromRate } from '../../../../domain/models/exp/foreign-currency/Currency';
import { ExchangeRate } from '../../../../domain/models/exp/foreign-currency/ExchangeRate';
import { newRecordItem } from '../../../../domain/models/exp/Record';
import { status } from '../../../../domain/models/exp/Report';
import {
  AmountInputMode,
  calcAmountFromTaxExcluded,
  calculateTax,
  TaxRes,
} from '../../../../domain/models/exp/TaxType';

import { State } from '../../../modules';
import { actions as activeDialogActions } from '../../../modules/ui/expenses/dialog/activeDialog';

import {
  getRateFromId,
  searchTaxTypeList,
} from '../../../action-dispatchers/Currency';
import { openRecordItemsConfirmDialog } from '../../../action-dispatchers/Dialog';
import { searchExpTypesByParentRecord } from '../../../action-dispatchers/ExpenseType';

import { Props as OwnProps } from '../../../components/Expenses/Dialog';

import recordItemContainer from '../RecordItemContainer';

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const activeDialog = state.ui.expenses.dialog.activeDialog;
  const mode = state.ui.expenses.mode;

  const currentDialog = last(activeDialog);
  const readOnlyStatus = [
    status.PENDING,
    status.APPROVED,
    status.CLAIMED,
    status.ACCOUNTING_AUTHORIZED,
    status.ACCOUNTING_REJECTED,
    status.JOURNAL_CREATED,
    status.FULLY_PAID,
    // @ts-ignore
  ].includes(ownProps.expReport.status);
  const isReportEditMode =
    mode === 'REPORT_EDIT' || mode === 'FINANCE_REPORT_EDITED';
  const readOnly =
    ownProps.isFinanceApproval && isReportEditMode ? false : readOnlyStatus;

  const isNewReportFromPreRequest =
    ownProps.expReport.preRequestId && !ownProps.expReport.reportId;
  const recordItemReadOnly = isNewReportFromPreRequest ? true : readOnly;

  return {
    currentDialog,
    readOnly: recordItemReadOnly,
    customHint: state.entities.exp.customHint,
    tax: state.ui.expenses.recordItemPane.tax,
    companyId: state.userSetting.companyId,
    expRoundingSetting: state.userSetting.expRoundingSetting,
    baseCurrencySymbol:
      ownProps.currencySymbol || state.userSetting.currencySymbol,
    baseCurrencyDecimal:
      ownProps.currencyDecimalPlaces || state.userSetting.currencyDecimalPlaces,
    taxRoundingSetting: state.userSetting.expTaxRoundingSetting,
    childExpTypeLists: state.entities.exp.expenseType.childList,
    exchangeRateMap:
      state.ui.expenses.recordItemPane.foreignCurrency.exchangeRate,
    // selectedCompanyId from FA cross Company
    selectedCompanyId:
      ownProps.selectedCompanyId || state.userSetting.companyId,
  };
};

const mapDispatchToProps = {
  openRecordItemsConfirmDialog,
  searchExpTypesByParentRecord,
  searchTaxTypeList,
  getRateFromId,
  hideAllDialog: activeDialogActions.hideAll,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  recordItemContainer,
  // initialize details (tax, EIs, etc) for child record items
  initTaxAndEIsForRecordItems: (expTypeList) => {
    const expReport = cloneDeep(ownProps.expReport);
    const expRecord = expReport.records[ownProps.recordIdx];
    const isTaxIncluded =
      expRecord.amountInputMode === AmountInputMode.TaxIncluded;
    const calcTaxAction = isTaxIncluded
      ? calculateTax
      : calcAmountFromTaxExcluded;
    // method to get tax detail based on tax & amount
    const getInitTaxInfo = (initTax, item) => {
      const rate = initTax ? initTax.rate : 0;
      const baseId = item.taxTypeBaseId || 'noIdSelected';
      const historyId = initTax ? initTax.historyId : null;
      const name = initTax ? initTax.name : '';
      const taxRes: TaxRes = calcTaxAction(
        rate,
        (isTaxIncluded ? item.amount : item.withoutTax) || 0,
        stateProps.baseCurrencyDecimal,
        stateProps.taxRoundingSetting
      );

      const taxInfo = {
        amount: isTaxIncluded ? item.amount : taxRes.amountWithTax,
        withoutTax: isTaxIncluded ? taxRes.amountWithoutTax : item.withoutTax,
        gstVat: taxRes.gstVat,
        taxTypeBaseId: baseId,
        taxTypeHistoryId: historyId,
        taxTypeName: name,
        taxRate: rate,
      };

      if (item.taxManual) {
        taxInfo.withoutTax = item.withoutTax;
        taxInfo.gstVat = item.gstVat;
        taxInfo.amount = item.amount;
      }

      return taxInfo;
    };

    // array of promise which then return record item info including tax
    const promises = expReport.records[ownProps.recordIdx].items.map(
      async (item, index) => {
        if (index === 0) {
          // keep item 0 (parent record) as it is
          return item;
        }

        const { recordDate, expTypeId, expTypeName } = item;
        const expTypeInfo = expTypeList.find((ele) => ele.id === expTypeId);
        const initItem = newRecordItem(
          expTypeId,
          expTypeName,
          false,
          expTypeInfo,
          false
        );
        const getInitTaxType = (list) => {
          if (!Array.isArray(list)) {
            return null;
          }
          const initialTaxType = list.find((taxType) => {
            return (
              taxType.baseId === item.taxTypeBaseId &&
              taxType.historyId === item.taxTypeHistoryId
            );
          });
          // if first time creating, use 1st one in the tax list as default
          return item.taxTypeHistoryId ? initialTaxType : list[0];
        };

        const taxTypeList = get(stateProps.tax, `${expTypeId}.${recordDate}`);
        if (!isEmpty(taxTypeList)) {
          const selectedTax = getInitTaxType(taxTypeList);
          const taxInfo = selectedTax ? getInitTaxInfo(selectedTax, item) : {};
          return { ...initItem, ...item, ...taxInfo };
        } else {
          return dispatchProps
            .searchTaxTypeList(expTypeId, recordDate) // @ts-ignore
            .then((result) => {
              const typeList = get(
                result,
                `payload.${expTypeId}.${recordDate}`
              );
              const selectedTax = getInitTaxType(typeList);
              const taxInfo = selectedTax
                ? getInitTaxInfo(selectedTax, item)
                : {};
              return { ...initItem, ...item, ...taxInfo };
            });
        }
      }
    );

    Promise.all(promises).then((recordItems) => {
      return ownProps.onChangeEditingExpReport(
        `report.records.${ownProps.recordIdx}.items`,
        recordItems
      );
    });
  },
  initForeignCurrencyAndEIs: (expTypeList) => {
    const items = cloneDeep(
      ownProps.expReport.records[ownProps.recordIdx].items
    );
    const currencyId = items[0].currencyId || '';
    const promises = items.map(async (item, index) => {
      if (index === 0) {
        // keep item 0 (parent record) as it is
        return item;
      }

      const {
        expTypeId,
        expTypeName,
        localAmount,
        exchangeRateManual,
        recordDate,
      } = item;

      const currencyInfo = {
        useForeignCurrency: true,
        currencyId,
        currencyInfo: items[0].currencyInfo,
      };
      const itemWithCurrency = { ...item, ...currencyInfo };

      if (exchangeRateManual) {
        return itemWithCurrency;
      }

      const getRateAndAmount = (rate) => {
        const exchangeRate = rate || 0;
        const rateManual = exchangeRate === 0;
        return {
          exchangeRate,
          originalExchangeRate: exchangeRate,
          exchangeRateManual: rateManual,
          amount: calcAmountFromRate(
            exchangeRate,
            localAmount,
            stateProps.baseCurrencyDecimal,
            stateProps.expRoundingSetting
          ),
        };
      };

      const expTypeInfo = expTypeList.find((ele) => ele.id === expTypeId);
      const initItem = newRecordItem(
        expTypeId,
        expTypeName,
        true,
        expTypeInfo,
        false
      );
      const updatedItem = { ...initItem, ...itemWithCurrency };
      const exchangeRateInfo = get(
        stateProps.exchangeRateMap,
        `${currencyId}.${recordDate}`
      );

      if (exchangeRateInfo) {
        return {
          ...updatedItem,
          ...getRateAndAmount(
            (exchangeRateInfo as Partial<ExchangeRate>).calculationRate
          ),
        };
      } else {
        return dispatchProps
          .getRateFromId(
            stateProps.selectedCompanyId,
            currencyId || '',
            recordDate
          )
          .then((exchangeRate) => {
            return {
              ...updatedItem,
              ...getRateAndAmount(exchangeRate),
            };
          });
      }
    });

    Promise.all(promises).then((recordItems) => {
      return ownProps.onChangeEditingExpReport(
        `report.records.${ownProps.recordIdx}.items`,
        recordItems
      );
    });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RecordItems) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
