import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import DateUtil from '@apps/commons/utils/DateUtil';
import TextAreaField from '@commons/components/fields/TextAreaField';
import msg from '@commons/languages';

import { Record } from '@apps/domain/models/exp/Record';

import { actions as activeDialogActions } from '@apps/expenses-pc/modules/ui/expenses/dialog/activeDialog';

import { searchRoute } from '@apps/expenses-pc/action-dispatchers/Route';
import { getStation } from '@apps/expenses-pc/action-dispatchers/Suggest';

import GridDetailModalPortal from '../components/GridDetailModalPortal';
import Input from '../components/Input';
import useClickOutside from '@apps/daily-summary/components/hooks/useClickOutside';

import GridDetailJorudanSearchModalContent from './GridDetailJorudanSearchModalContent';

type StationState = { category: string; company: string; name: string };
type Props = {
  className?: string;
  record: Record;
  recordIdx: number;
  onChangeJorudanDetail: (key: string, value: any) => void;
  onChangeRemarks: (e: ChangeEvent<HTMLInputElement>, remark: string) => void;
};
const GridDetailCellJorudan = (props: Props): React.ReactElement => {
  const {
    record,
    className,
    recordIdx,
    onChangeRemarks,
    onChangeJorudanDetail,
  } = props;
  const dispatch = useDispatch();
  const stateProps = useSelector((state: any) => ({
    companyId: state.userSetting.companyId,
    subroleId: get(state, 'ui.expenses.subrole.selectedRole'),
    baseCurrencySymbol: state.userSetting.currencySymbol,
    employeeId: state.userSetting.employeeId,
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
    highwayBus: state.ui.expenses.recordItemPane.routeForm.option.highwayBus,
    selectedDelegator: state.ui.expenses.delegateApplicant.selectedEmployee,
    route: state.entities.exp.jorudan.route,
  }));

  const clickRef = useRef(null);

  const isProxyMode = !isEmpty(stateProps.selectedDelegator);
  const remarks = get(record, 'items.0.remarks');
  const routeInfo = get(record, 'routeInfo');
  const origin = get(routeInfo, 'origin');
  const arrival = get(routeInfo, 'arrival');
  const viaList = get(routeInfo, 'viaList');
  const roundTrip = get(routeInfo, 'roundTrip', false);

  const [originStation, setOriginStation] = useState<{
    name: string;
    station?: StationState;
  }>({ name: get(origin, 'name', ''), station: undefined });
  const [arrivalStation, setArrivalStation] = useState<{
    name: string;
    station?: StationState;
  }>({ name: get(arrival, 'name', ''), station: undefined });
  const [routeSearchDialogState, setRouteSearchDialogState] = useState({
    show: false,
  });
  const [fromError, setFromError] = useState(!originStation.name);
  const [toError, setToError] = useState(!arrivalStation.name);

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          getStation,
          searchRoute,
          openRouteSelectionDialog: activeDialogActions.routeSelect,
        },
        dispatch
      ),
    [dispatch]
  );

  const searchStation = async (
    stationQuery: string,
    setter?: Dispatch<
      SetStateAction<{
        name: string;
        station?: StationState;
      }>
    >,
    isGetAllResults?: boolean
  ) => {
    return Actions.getStation(
      stationQuery,
      // TODO: change this date
      DateUtil.getToday(),
      undefined,
      stateProps.subroleId
      // @ts-ignore
    ).then((stationResult) => {
      const station = get(stationResult, '0.suggestions.0');
      if (setter && station?.name) setter({ name: station.name, station });
      if (isGetAllResults) return stationResult;
      return station;
    });
  };

  const onSearchRoute = async (
    origin = originStation,
    arrival = arrivalStation,
    viaList = [],
    isSelectFirstDefault = true,
    roundTrip = false
  ): Promise<any> => {
    const hasNoOrigin = isEmpty(origin.name);
    const hasNoArrival = isEmpty(arrival.name);
    if (hasNoOrigin || hasNoArrival) {
      if (hasNoOrigin) setFromError(true);
      if (hasNoArrival) setToError(true);
      return;
    }

    let originResult = origin.station;
    let arrivalResult = arrival.station;
    if (!originResult)
      originResult = await searchStation(origin.name, setOriginStation);
    if (!arrivalResult)
      arrivalResult = await searchStation(arrival.name, setArrivalStation);
    if (!originResult || !arrivalResult) {
      setFromError(true);
      setToError(true);
      return;
    }

    const param: any = {
      empId: stateProps.employeeId,
      targetDate: DateUtil.getToday(),
      roundTrip,
      origin: originResult,
      arrival: arrivalResult,
      viaList,
      option: {
        routeSort: stateProps.routeSort,
        seatPreference: stateProps.seatPreference,
        useChargedExpress: stateProps.useChargedExpress,
        useExReservation: stateProps.useExReservation,
        excludeCommuterRoute: true,
        highwayBus: stateProps.highwayBus,
      },
    };
    if (!isProxyMode) param.empHistoryId = stateProps.subroleId;

    return Actions.searchRoute(
      param,
      origin.name,
      arrival.name,
      viaList.map((v) => v.name),
      isProxyMode ? undefined : stateProps.subroleId,
      false
      // @ts-ignore
    ).then((res) => {
      const routeList = get(res, 'route.routeList', []);
      if (isSelectFirstDefault) {
        const route = routeList[0];
        onSelectRoute(route, originResult, arrivalResult, []);
      }
      return res;
    });
  };

  const onSelectRoute = (
    route,
    origin,
    arrival,
    viaList,
    roundTrip = false
  ) => {
    if (route) {
      const routeInfo = {
        roundTrip,
        origin,
        viaList,
        arrival,
        selectedRoute: route,
      };
      onChangeJorudanDetail('routeInfo', routeInfo);
      onCloseRouteSearchDialog();
    }
  };

  const onOpenRouteSearchDialog = () => {
    setRouteSearchDialogState({ show: true });
  };
  const onCloseRouteSearchDialog = () => {
    setRouteSearchDialogState({ show: false });
  };

  const onSearchStationFromModal = (stationQuery) => {
    return searchStation(stationQuery, undefined, true);
  };

  const onChangeRoundTrip = (roundTrip: boolean) => {
    onChangeJorudanDetail('routeInfo.roundTrip', roundTrip);
  };

  const onChangeOriginStation = (name: string) => {
    setOriginStation({ name, station: undefined });
    setFromError(false);
  };

  const onChangeArrivalStation = (name: string) => {
    setArrivalStation({ name, station: undefined });
    setToError(false);
  };

  const isExistRoute = !isEmpty(origin) && !isEmpty(arrival);

  const renderRoute = (): React.ReactElement => {
    const originName = get(origin, 'name');
    const arrivalName = get(arrival, 'name');
    const viaListNames = (viaList || []).map((v) => v.name);

    const labels = [originName, ...viaListNames, arrivalName];

    return (
      <div className={`${className}__route-block-container`}>
        {roundTrip && (
          <div
            className={`${className}__route-block-container-round-trip-label`}
          >
            <p>{msg().Exp_Lbl_RouteIconRoundTrip}</p>
          </div>
        )}
        <div className={`${className}__route-block-container-text`}>
          <p>{labels.join(' - ')}</p>
        </div>
      </div>
    );
  };

  const renderRouteSelection = (): React.ReactElement => {
    const errorClass = `${className}__input-to-from`;
    const originErrorClass = fromError
      ? !originStation.name
        ? `${errorClass}-no-route-error`
        : `${errorClass}-error`
      : null;
    const arrivalErrorClass = toError
      ? !arrivalStation.name
        ? `${errorClass}-no-route-error`
        : `${errorClass}-error`
      : null;
    return (
      <>
        <div
          className={classNames(
            `${className}__autocomplete-container`,
            `${className}__border-right`
          )}
        >
          <Input
            disabled
            placeholder="From:"
            className={`${className}__input-from`}
          />
          <Input
            className={originErrorClass}
            value={originStation.name}
            onChangeText={onChangeOriginStation}
            onBlur={() => onSearchRoute()}
          />
        </div>
        <div
          className={classNames(
            `${className}__autocomplete-container`,
            `${className}__border-right`
          )}
        >
          <Input
            disabled
            placeholder="To:"
            className={`${className}__input-to`}
          />
          <Input
            className={arrivalErrorClass}
            value={arrivalStation.name}
            onChangeText={onChangeArrivalStation}
            onBlur={() => onSearchRoute()}
          />
        </div>
      </>
    );
  };

  useClickOutside(clickRef, onCloseRouteSearchDialog);
  const containerId = `grid-cell-detail-cell-jorudan-${recordIdx}`;
  return (
    <>
      {isExistRoute && (
        <button
          className={classNames(
            `${className}__autocomplete-container`,
            `${className}__autocomplete-container-lg`,
            `${className}__border-right`,
            `${className}__clickable`
          )}
          id={containerId}
          onClick={onOpenRouteSearchDialog}
          ref={clickRef}
          type="button"
        >
          {renderRoute()}
        </button>
      )}
      {!isExistRoute && renderRouteSelection()}
      <div
        className={`${className}__autocomplete-container  ${className}__remarks`}
      >
        <TextAreaField
          autosize
          minRows={1}
          onChange={onChangeRemarks}
          placeholder={msg().Exp_Clbl_ReportRemarks}
          resize="none"
          value={remarks}
        />
      </div>
      <GridDetailModalPortal
        containerId={containerId}
        show={routeSearchDialogState.show}
      >
        <GridDetailJorudanSearchModalContent
          origin={origin}
          arrival={arrival}
          viaList={viaList}
          roundTrip={roundTrip}
          searchStation={onSearchStationFromModal}
          seatPreference={stateProps.seatPreference}
          baseCurrencySymbol={stateProps.baseCurrencySymbol}
          onSearchRoute={(origin, arrival, viaList, roundTrip) =>
            onSearchRoute(origin, arrival, viaList, false, roundTrip)
          }
          onSelectRoute={(route, origin, arrival, viaList, roundTrip) =>
            onSelectRoute(route, origin, arrival, viaList, roundTrip)
          }
          onChangeRoundTrip={onChangeRoundTrip}
        />
      </GridDetailModalPortal>
    </>
  );
};

export default GridDetailCellJorudan;
