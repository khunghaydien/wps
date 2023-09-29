import { connect } from 'react-redux';

import { cloneDeep, get, isEmpty, last } from 'lodash';

import RecordItems, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/RecordItems';
import DateUtil from '../../../../commons/utils/DateUtil';

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

import { Props as OwnProps } from '../../../components/Requests/Dialog';

import recordItemContainer from '../RecordItemContainer';

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const activeDialog = state.ui.expenses.dialog.activeDialog;
  const mode = state.ui.expenses.mode;

  const currentDialog = last(activeDialog);
  const readOnlyStatus = [
    status.PENDING,
    status.APPROVED,
    status.CLAIMED,
    // @ts-ignore
  ].includes(ownProps.expReport.status);
  const isReportEditMode = mode === 'REPORT_EDIT';

  const readOnly =
    ownProps.isFinanceApproval && isReportEditMode ? false : readOnlyStatus;

  return {
    currentDialog,
    readOnly,
    customHint: state.entities.exp.customHint,
    tax: state.ui.expenses.recordItemPane.tax,
    companyId: state.userSetting.companyId,
    expRoundingSetting: state.userSetting.expRoundingSetting,
    baseCurrencyDecimal: state.userSetting.currencyDecimalPlaces,
    baseCurrencySymbol: state.userSetting.currencySymbol,
    taxRoundingSetting: state.userSetting.expTaxRoundingSetting,
    childExpTypeLists: state.entities.exp.expenseType.childList,
    exchangeRateMap:
      state.ui.expenses.recordItemPane.foreignCurrency.exchangeRate,
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

      // if exchangeRateManual true, means it was saved once, no need to init again
      if (exchangeRateManual) {
        return itemWithCurrency;
      }

      const getRateAndAmount = (rate, isManual?) => {
        const exchangeRate = rate || 0;
        const rateManual = isManual || exchangeRate === 0;
        const originalExchangeRate = isManual ? 0 : exchangeRate;
        return {
          exchangeRate,
          originalExchangeRate,
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
      const today = DateUtil.getToday();
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
          .getRateFromId(stateProps.companyId, currencyId, recordDate)
          .then((exchangeRate) => {
            if (exchangeRate > 0 || recordDate === today) {
              return {
                ...updatedItem,
                ...getRateAndAmount(exchangeRate),
              };
            } else {
              return dispatchProps
                .getRateFromId(stateProps.companyId, currencyId, today)
                .then((todayRate) => {
                  return {
                    ...updatedItem,
                    ...getRateAndAmount(todayRate, true),
                  };
                });
            }
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
