import { connect } from 'react-redux';

import { withFormik } from 'formik';
import { assign, cloneDeep, set } from 'lodash';

import { Props as FormikProps } from '../../../commons/components/exp/Form';
import ForeignCurrencyView, {
  Props as FormProps,
} from '../../../commons/components/exp/Form/RecordItem/General/ForeignCurrency';
import { selectors as appSelectors } from '../../../commons/modules/app';
import CurrencyUtil from '../../../commons/utils/CurrencyUtil';
import DateUtil from '../../../commons/utils/DateUtil';
import { toFixedNumber } from '../../../commons/utils/NumberUtil';

import { calcAmountFromRate } from '../../../domain/models/exp/foreign-currency/Currency';

import { actions as recordPanelLoadingActions } from '../../modules/ui/expenses/recordItemPane/isLoading';

import {
  getRateFromId,
  searchCurrencyList,
} from '../../action-dispatchers/Currency';

const mapStateToProps = (state, ownProps) => ({
  companyId: state.userSetting.companyId,
  expRoundingSetting: state.userSetting.expRoundingSetting,
  currencyRecord: state.ui.expenses.recordItemPane.foreignCurrency.currency,
  exchangeRateMap:
    state.ui.expenses.recordItemPane.foreignCurrency.exchangeRate,
  // helper function to make it easier to updateTargetRecord.
  updateRecord: (updateObj) => {
    const tmpRecord = cloneDeep(ownProps.expRecord);
    const tmpTouched = cloneDeep(ownProps.touched);

    Object.keys(updateObj as any).forEach((key) => {
      set(tmpRecord, key, updateObj[key]);
      set(tmpTouched, key, true);
    });
    ownProps.onChangeEditingExpReport(
      ownProps.targetRecord,
      tmpRecord,
      true,
      tmpTouched
    );
  },
  isLoading: appSelectors.loadingSelector(state),
  loadingAreas: state.common.app.loadingAreas,
});

const mapDispatchToProps = {
  searchCurrencyList,
  getRateFromId,
  toggleRecordLoading: recordPanelLoadingActions.toggle,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...ownProps,
  searchCurrencyList: () => {
    dispatchProps.toggleRecordLoading(true);
    const loadInbackground = true;
    dispatchProps
      .searchCurrencyList(stateProps.companyId, loadInbackground)
      .then((currencyRecords) => {
        dispatchProps.toggleRecordLoading(false);
        const { useFixedForeignCurrency } = ownProps.expRecord.items[0];
        // set currency info on first init if currencyId is not null
        if (
          !ownProps.expRecord.items[0].currencyId ||
          (!ownProps.expRecord.items[0].currencyId && useFixedForeignCurrency)
        ) {
          const currencyId = useFixedForeignCurrency
            ? ownProps.expRecord.items[0].fixedForeignCurrencyId
            : currencyRecords[0].id;
          const selectedCurrency = currencyRecords.find(
            (x) => x.id === currencyId
          );
          const currencyDecimal = selectedCurrency.decimalPlaces;
          const currencySymbol = selectedCurrency.symbol;
          const localAmount = toFixedNumber(
            ownProps.expRecord.items[0].localAmount,
            currencyDecimal
          );
          const today = DateUtil.getToday();
          const recordDate = ownProps.expRecord.recordDate;
          let exchangeRateManual = recordDate === '';
          const rateDate = recordDate || today;
          const updateObj = {
            'items.0.currencyId': currencyId,
            'items.0.localAmount': localAmount,
            'items.0.currencyInfo.decimalPlaces': currencyDecimal,
            'items.0.currencyInfo.symbol': currencySymbol,
          };

          const fetchRate = dispatchProps
            .getRateFromId(
              stateProps.companyId,
              currencyId,
              rateDate,
              null,
              loadInbackground
            )
            .then((exchangeRate) => {
              if (exchangeRate > 0) {
                return exchangeRate;
              } else if (rateDate === today) {
                exchangeRateManual = true;
                return exchangeRate;
              } else {
                return dispatchProps
                  .getRateFromId(
                    stateProps.companyId,
                    currencyId,
                    today,
                    null,
                    loadInbackground
                  )
                  .then((todayRate) => {
                    exchangeRateManual = true;
                    return todayRate;
                  });
              }
            });
          dispatchProps.toggleRecordLoading(true);
          fetchRate.then((exchangeRate) => {
            dispatchProps.toggleRecordLoading(false);
            const amount = calcAmountFromRate(
              exchangeRate,
              localAmount,
              ownProps.baseCurrencyDecimal,
              stateProps.expRoundingSetting
            );
            const updatedExchangeRate =
              useFixedForeignCurrency &&
              ownProps.expRecord.items[0].exchangeRate
                ? ownProps.expRecord.items[0].exchangeRate
                : exchangeRate;

            const originalExchangeRate = exchangeRateManual
              ? 0
              : updatedExchangeRate;

            assign(updateObj, {
              'items.0.exchangeRate': updatedExchangeRate,
              'items.0.originalExchangeRate': originalExchangeRate,
              'items.0.exchangeRateManual': exchangeRateManual,
            });
            if (!ownProps.isItemized) {
              assign(updateObj, {
                amount,
                'items.0.amount': amount,
              });
            }
            stateProps.updateRecord(updateObj);
          });
        }
      });
  },
  onCurrencyChange: (
    currencyId: any,
    decimalPlaces: number,
    symbol: string,
    loadInBackground: boolean
  ) => {
    const localAmount = toFixedNumber(
      ownProps.expRecord.items[0].localAmount,
      decimalPlaces
    );
    const today = DateUtil.getToday();
    const recordDate = ownProps.expRecord.recordDate;
    let exchangeRateManual = recordDate === '';
    const rateDate = recordDate || today;
    const updateObj = {
      'items.0.currencyId': currencyId,
      'items.0.localAmount': localAmount,
      'items.0.currencyInfo.decimalPlaces': decimalPlaces,
      'items.0.currencyInfo.symbol': symbol,
    };
    const fetchRate = dispatchProps
      .getRateFromId(
        stateProps.companyId,
        currencyId,
        rateDate,
        null,
        loadInBackground
      )
      .then((exchangeRate) => {
        if (exchangeRate > 0) {
          return exchangeRate;
        } else if (rateDate === today) {
          exchangeRateManual = true;
          return exchangeRate;
        } else {
          return dispatchProps
            .getRateFromId(
              stateProps.companyId,
              currencyId,
              today,
              null,
              loadInBackground
            )
            .then((todayRate) => {
              exchangeRateManual = true;
              return todayRate;
            });
        }
      });

    if (loadInBackground) {
      dispatchProps.toggleRecordLoading(true);
    }
    fetchRate.then((exchangeRate) => {
      if (loadInBackground) {
        dispatchProps.toggleRecordLoading(false);
      }
      const originalExchangeRate = exchangeRateManual ? 0 : exchangeRate;
      const amount = calcAmountFromRate(
        exchangeRate,
        localAmount,
        ownProps.baseCurrencyDecimal,
        stateProps.expRoundingSetting
      );

      assign(updateObj, {
        'items.0.exchangeRate': exchangeRate,
        'items.0.originalExchangeRate': originalExchangeRate,
        'items.0.exchangeRateManual': exchangeRateManual,
      });

      if (!ownProps.isItemized) {
        assign(updateObj, {
          amount,
          'items.0.amount': amount,
        });
      }
      stateProps.updateRecord(updateObj);
    });
  },
  onChangeAmountField: (localAmount: number) => {
    const recordItemIdx = ownProps.recordItemIdx || 0;
    const isParentItem = recordItemIdx === 0;
    const amount = calcAmountFromRate(
      ownProps.expRecord.items[recordItemIdx].exchangeRate,
      localAmount,
      ownProps.baseCurrencyDecimal,
      stateProps.expRoundingSetting
    );
    const updateObj = {
      [`items.${recordItemIdx}.localAmount`]: localAmount,
    };

    if (isParentItem) {
      if (!ownProps.isItemized) {
        assign(updateObj, {
          amount,
          [`items.${recordItemIdx}.amount`]: amount,
        });
      }
    } else {
      assign(updateObj, { [`items.${recordItemIdx}.amount`]: amount });
    }
    stateProps.updateRecord(updateObj);
  },
  calcNewRate: (exchangeRate: number) => {
    const itemIdx = ownProps.recordItemIdx || 0;
    const amount = calcAmountFromRate(
      exchangeRate,
      ownProps.expRecord.items[itemIdx].localAmount,
      ownProps.baseCurrencyDecimal,
      stateProps.expRoundingSetting
    );

    const updateObj = {
      [`items.${itemIdx}.amount`]: amount,
      [`items.${itemIdx}.exchangeRate`]: exchangeRate,
    };
    if (itemIdx === 0) {
      assign(updateObj, { amount });
    }
    stateProps.updateRecord(updateObj);
  },
  updateNewRate: (exchangeRate: number) => {
    const itemIdx = ownProps.recordItemIdx || 0;
    const exchangeRateManual =
      exchangeRate !== ownProps.expRecord.items[itemIdx].originalExchangeRate;

    stateProps.updateRecord({
      [`items.${itemIdx}.exchangeRateManual`]: exchangeRateManual,
    });
  },
  validateValue: CurrencyUtil.validateCurrency,
  validateRate: CurrencyUtil.validateExchangeRate,
});

type FCProps = {
  currencySelector: string;
  exchangeRate: number;
  localAmount: number;
};

const foreignCurrencyContainer = withFormik<FormikProps, FCProps>({
  enableReinitialize: true,
  // @ts-ignore
  mapPropsToValues: (props: FormProps) => {
    const itemIdx = props.recordItemIdx || 0;
    return {
      currencySelector: props.expRecord.items[itemIdx].currencyId || '',
      localAmount: props.expRecord.items[itemIdx].localAmount,
      exchangeRate: props.expRecord.items[itemIdx].exchangeRate,
    };
  },
  handleSubmit: () => {
    // handleSubmit is required in withFormik
  },
  // @ts-ignore Formik Values are updated in parent
})(ForeignCurrencyView);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(foreignCurrencyContainer) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
