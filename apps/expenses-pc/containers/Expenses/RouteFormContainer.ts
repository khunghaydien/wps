import { connect } from 'react-redux';

import { cloneDeep } from 'lodash';

import RouteFormView from '../../../commons/components/exp/Form/RecordItem/TransitJorudanJP/RouteForm';

import {
  calculateTax,
  ExpTaxTypeListApiReturn,
} from '../../../domain/models/exp/TaxType';

import { actions as highwayBusActions } from '../../modules/ui/expenses/recordItemPane/routeForm/option/highwayBus';
import { actions as routeSortActions } from '../../modules/ui/expenses/recordItemPane/routeForm/option/routeSort';
import { actions as seatPreferenceActions } from '../../modules/ui/expenses/recordItemPane/routeForm/option/seatPreference';
import { actions as useChargedExpressActions } from '../../modules/ui/expenses/recordItemPane/routeForm/option/useChargedExpress';
import { actions as useExReservation } from '../../modules/ui/expenses/recordItemPane/routeForm/option/useExReservation';
import { actions as roundTripActions } from '../../modules/ui/expenses/recordItemPane/routeForm/roundTrip';

import { searchTaxTypeList } from '../../action-dispatchers/Currency';
import {
  onChangeArrival,
  onChangeOrigin,
  onChangeTmpArrival,
  onChangeTmpOrigin,
  onChangeTmpViaList,
  onChangeViaList,
  onClickAddViaButton,
  onClickDeleteViaButton,
  onReverseViaList,
  resetRouteForm,
  searchRoute,
} from '../../action-dispatchers/Route';

const mapStateToProps = (state) => ({
  roundTrip: state.ui.expenses.recordItemPane.routeForm.roundTrip,
  origin: state.ui.expenses.recordItemPane.routeForm.origin,
  viaList: state.ui.expenses.recordItemPane.routeForm.viaList,
  arrival: state.ui.expenses.recordItemPane.routeForm.arrival,
  routeSort: state.ui.expenses.recordItemPane.routeForm.option.routeSort,
  seatPreference:
    state.ui.expenses.recordItemPane.routeForm.option.seatPreference,
  useChargedExpress:
    state.ui.expenses.recordItemPane.routeForm.option.useChargedExpress,
  useExReservation:
    state.ui.expenses.recordItemPane.routeForm.option.useExReservation,
  jorudanUseExReservation:
    state.ui.expenses.recordItemPane.routeForm.option.useExReservation,
  jorudanUseChargedExpress:
    state.entities.exp.jorudan.routeOption.jorudanUseChargedExpress,
  routeOptionSetting: state.entities.exp.jorudan.routeOption[3],
  highwayBus: state.ui.expenses.recordItemPane.routeForm.option.highwayBus,
  errorOrigin: state.ui.expenses.recordItemPane.routeForm.errors.origin,
  errorViaList: state.ui.expenses.recordItemPane.routeForm.errors.viaList,
  errorArrival: state.ui.expenses.recordItemPane.routeForm.errors.arrival,
  tmpOrigin: state.ui.expenses.recordItemPane.routeForm.edits.origin,
  tmpViaList: state.ui.expenses.recordItemPane.routeForm.edits.viaList,
  tmpArrival: state.ui.expenses.recordItemPane.routeForm.edits.arrival,
  employeeId: state.userSetting.employeeId,
  expenseTaxTypeList: state.ui.expenses.recordItemPane.tax,
  taxRoundingSetting: state.userSetting.expTaxRoundingSetting,
  baseCurrencyDecimal: state.userSetting.currencyDecimalPlaces,
});

const mapDispatchToProps = {
  onChangeRoundTrip: roundTripActions.set,
  onClickAddViaButton,
  onChangeOrigin,
  onChangeViaList,
  onChangeArrival,
  onChangeTmpOrigin,
  onChangeTmpViaList,
  onChangeTmpArrival,
  onChangeUseChargedExpress: useChargedExpressActions.set,
  onChangeUseExReservation: useExReservation.set,
  onChangeRouteSort: routeSortActions.set,
  onChangeSeatPreference: seatPreferenceActions.set,
  onChangeHighwayBus: highwayBusActions.set,
  searchRoute,
  resetRouteForm,
  searchTaxTypeList,
  onClickDeleteViaButton,
  onReverseViaList,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onReverseOriginArrival: () => {
    const { origin, arrival, tmpOrigin, tmpArrival } = stateProps;
    dispatchProps.onChangeArrival(origin);
    dispatchProps.onChangeTmpArrival((origin && origin.name) || tmpOrigin);
    dispatchProps.onChangeOrigin(arrival);
    dispatchProps.onChangeTmpOrigin((arrival && arrival.name) || tmpArrival);
    dispatchProps.onReverseViaList();
  },
  onClickSearchRouteButton: () => {
    const param = {
      empId: ownProps.expReport.employeeBaseId || stateProps.employeeId,
      targetDate: ownProps.targetDate,
      roundTrip: stateProps.roundTrip,
      origin: stateProps.origin,
      arrival: stateProps.arrival,
      viaList: stateProps.viaList,
      option: {
        routeSort: stateProps.routeSort,
        seatPreference: stateProps.seatPreference,
        useChargedExpress: stateProps.useChargedExpress,
        useExReservation: stateProps.useExReservation,
        excludeCommuterRoute: true,
        highwayBus: stateProps.highwayBus,
      },
    };
    dispatchProps.searchRoute(
      param,
      stateProps.tmpOrigin,
      stateProps.tmpArrival,
      stateProps.tmpViaList
    );
  },
  onChangeRoundTrip: (roundTrip) => {
    if (ownProps.routeInfo.selectedRoute) {
      const newAmount = roundTrip
        ? ownProps.routeInfo.selectedRoute.roundTripCost
        : ownProps.routeInfo.selectedRoute.cost;

      const expRecord = cloneDeep(ownProps.expRecord);

      const expTypeId = expRecord.items[0].expTypeId;
      const recordDate = expRecord.recordDate;

      // the expense type of jorudan should have only 1 tax type
      let tax =
        stateProps.expenseTaxTypeList &&
        stateProps.expenseTaxTypeList[expTypeId] &&
        stateProps.expenseTaxTypeList[expTypeId][recordDate] &&
        stateProps.expenseTaxTypeList[expTypeId][recordDate][0];

      const calcTax = () => {
        const taxRes = calculateTax(
          tax.rate,
          newAmount,
          stateProps.baseCurrencyDecimal,
          stateProps.taxRoundingSetting
        );

        expRecord.amount = newAmount;
        expRecord.withoutTax = taxRes.amountWithoutTax;
        expRecord.items[0].amount = newAmount;
        expRecord.items[0].withoutTax = taxRes.amountWithoutTax;
        expRecord.items[0].gstVat = taxRes.gstVat;
        expRecord.routeInfo.roundTrip = roundTrip;

        ownProps.onChangeEditingExpReport(
          `${ownProps.targetRecord}`,
          expRecord,
          true,
          ownProps.touched
        );
        ownProps.onChangeEditingExpReport(`ui.recalc`, true, true);
      };

      // if tax state has not already existed, fetch it from API
      if (!tax) {
        dispatchProps
          .searchTaxTypeList(expTypeId, recordDate)
          .then((result: ExpTaxTypeListApiReturn) => {
            tax = result.payload[expTypeId][recordDate][0];
            calcTax();
          });
      } else {
        calcTax();
      }
    }
    dispatchProps.onChangeRoundTrip(roundTrip);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RouteFormView) as React.ComponentType<Record<string, any>>;
