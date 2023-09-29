import { connect } from 'react-redux';

import cloneDeep from 'lodash/cloneDeep';

import RouteSelect, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/RouteSelect';

import { calculateTax, TaxRes } from '../../../../domain/models/exp/TaxType';

import { State } from '../../../modules';

import { searchTaxTypeList } from '../../../action-dispatchers/Currency';

import { Props as OwnProps } from '../../../components/Expenses/Dialog';

const mapStateToProps = (state: State) => ({
  origin: state.ui.expenses.recordItemPane.routeForm.origin,
  viaList: state.ui.expenses.recordItemPane.routeForm.viaList,
  arrival: state.ui.expenses.recordItemPane.routeForm.arrival,
  route: state.entities.exp.jorudan.route,
  roundTrip: state.ui.expenses.recordItemPane.routeForm.roundTrip,
  expenseTaxTypeList: state.ui.expenses.recordItemPane.tax,
  baseCurrencySymbol: state.userSetting.currencySymbol,
  baseCurrencyDecimal: state.userSetting.currencyDecimalPlaces,
  taxRoundingSetting: state.userSetting.expTaxRoundingSetting,
  seatPreference:
    state.ui.expenses.recordItemPane.routeForm.option.seatPreference,
});

const mapDispatchToProps = {
  searchTaxTypeList,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  onClickRouteSelectListItem: (item) => {
    const viaList = stateProps.viaList.filter(Boolean);
    const routeInfo = {
      roundTrip: stateProps.roundTrip,
      origin: stateProps.origin,
      viaList,
      arrival: stateProps.arrival,
      selectedRoute: item,
    };
    const expReport = cloneDeep(ownProps.expReport);
    const targetRecord = expReport.records[ownProps.recordIdx];
    const touched = cloneDeep(ownProps.touched);
    if (!touched.records) {
      touched.records = {};
    }
    if (!touched.records[ownProps.recordIdx]) {
      touched.records[ownProps.recordIdx] = {};
    }
    const touchedRecord = touched.records[ownProps.recordIdx];
    targetRecord.routeInfo = routeInfo;
    touchedRecord.routeInfo = {};
    const cost = stateProps.roundTrip ? item.roundTripCost : item.cost;
    targetRecord.items[0].amount = cost;

    const expTypeId =
      ownProps.expReport.records[ownProps.recordIdx].items[0].expTypeId;
    const recordDate =
      ownProps.expReport.records[ownProps.recordIdx].recordDate;

    // the expense type of jorudan should have only 1 tax type
    const tax =
      stateProps.expenseTaxTypeList &&
      stateProps.expenseTaxTypeList[expTypeId] &&
      stateProps.expenseTaxTypeList[expTypeId][recordDate] &&
      stateProps.expenseTaxTypeList[expTypeId][recordDate][0];

    let taxRes = {} as TaxRes;

    let getTaxList;

    // if there are no tax yet, fetch it via API.
    if (tax) {
      getTaxList = new Promise((resolve) => resolve(tax));
    } else {
      getTaxList = dispatchProps
        .searchTaxTypeList(expTypeId, recordDate) // @ts-ignore
        .then((result) => {
          return result.payload[expTypeId][recordDate][0];
        });
    }

    getTaxList.then((taxResult) => {
      taxRes = calculateTax(
        taxResult.rate,
        targetRecord.items[0].amount,
        stateProps.baseCurrencyDecimal,
        stateProps.taxRoundingSetting
      );
      targetRecord.withoutTax = taxRes.amountWithoutTax;
      targetRecord.items[0].withoutTax = taxRes.amountWithoutTax;
      targetRecord.items[0].gstVat = taxRes.gstVat;

      if (!touchedRecord.items) {
        touchedRecord.items = [{}];
      }
      touchedRecord.items[0].amount = true;
      ownProps.onChangeEditingExpReport(`report`, expReport, touched);
      ownProps.onChangeEditingExpReport(`ui.recalc`, true, true);
      ownProps.hideDialog();
    });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RouteSelect) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
