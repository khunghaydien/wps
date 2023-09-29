import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import moment from 'moment';

import { DEFAULT_ROUTE_OPTIONS } from '@apps/domain/models/exp/jorudan/JorudanOption';

import { actions as useChargedExpressActions } from '../../expenses-pc/modules/ui/expenses/recordItemPane/routeForm/option/useChargedExpress';
import { actions as useExReservationActions } from '../../expenses-pc/modules/ui/expenses/recordItemPane/routeForm/option/useExReservation';
import { actions as DetailActions } from '../modules/employee/ui/detail';

import {
  onChangeArrival,
  onChangeOrigin,
  onChangeTmpArrival,
  onChangeTmpOrigin,
  onChangeTmpViaList,
  onChangeViaList,
  onClickAddViaButton,
  onClickDeleteViaButton,
  resetRouteForm,
  resetRouteSearchResult,
  searchRoute,
} from '../../expenses-pc/action-dispatchers/Route';

// presentational component
import CommuterRoute from '../components/CommuterRoute';

const mapStateToProps = (state, ownProps) => ({
  origin: state.commuterRoute.origin,
  viaList: state.commuterRoute.viaList,
  arrival: state.commuterRoute.arrival,
  useChargedExpress:
    state.commuterRoute.option.useChargedExpress ||
    DEFAULT_ROUTE_OPTIONS.useChargedExpress,
  useExReservation:
    state.commuterRoute.option.useExReservation ||
    DEFAULT_ROUTE_OPTIONS.useExReservation,
  fareType: state.commuterRoute.option.fareType,
  errorOrigin: state.commuterRoute.errors.origin,
  errorViaList: state.commuterRoute.errors.viaList,
  errorArrival: state.commuterRoute.errors.arrival,
  tmpOrigin: state.commuterRoute.edits.origin,
  tmpViaList: state.commuterRoute.edits.viaList,
  tmpArrival: state.commuterRoute.edits.arrival,
  route: state.routeList,
  tmpEditRecordHistory: state.employee.ui.detail.historyRecord,
  disabled: ownProps.disabled,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      onClickAddViaButton,
      onChangeOrigin,
      onChangeViaList,
      onChangeArrival,
      onChangeTmpOrigin,
      onChangeTmpViaList,
      onChangeUseChargedExpress: useChargedExpressActions.set,
      onChangeUseExReservation: useExReservationActions.set,
      onChangeTmpArrival,
      searchRoute,
      resetRouteForm,
      resetRouteSearchResult,
      onClickDeleteViaButton,
      onChangeDetailItem: DetailActions.setHistoryRecordByKeyValue,
    },
    dispatch
  ),
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickSearchRouteButton: () => {
    const param = {
      targetDate: moment().format('YYYY-MM-DD'),
      origin: stateProps.origin,
      arrival: stateProps.arrival,
      viaList: stateProps.viaList,
      option: {
        useChargedExpress: stateProps.useChargedExpress,
        seatPreference: 1,
        excludeCommuterRoute: false,
        useExReservationActions: stateProps.useExReservation,
      },
    };

    dispatchProps.searchRoute(
      param,
      stateProps.tmpOrigin,
      stateProps.tmpArrival,
      stateProps.tmpViaList
    );
  },
  onClickResetRouteButton: () => {
    dispatchProps.resetRouteSearchResult();
    dispatchProps.resetRouteForm(null, true);
  },
  onChangeDetailItem: (key, value) =>
    dispatchProps.onChangeDetailItem(key, value),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CommuterRoute);
