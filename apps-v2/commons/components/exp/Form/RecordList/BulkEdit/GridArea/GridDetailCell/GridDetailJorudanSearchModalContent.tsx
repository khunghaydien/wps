import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { catchApiError } from '@apps/commons/actions/app';
import Button from '@apps/commons/components/buttons/Button';
import IconButton from '@apps/commons/components/buttons/IconButton';
import AutocompleteInput, {
  Option,
} from '@apps/commons/components/exp/AutocompleteInput';
import ImgIconClose from '@apps/core/assets/icons-generic/close.svg';
import Radio from '@commons/components/exp/Form/RecordItem/TransitJorudanJP/RouteForm/Radio';
import msg from '@commons/languages';

import { Route } from '@apps/domain/models/exp/jorudan/Route';
import { MAX_LENGTH_VIA_LIST } from '@apps/domain/models/exp/Record';

import GridDetailModalPortal from '../components/GridDetailModalPortal';

import RouteSelect from '../../../../Dialog/RouteSelect';

import './GridDetailJorudanSearchModalContent.scss';

const ROOT = 'grid-detail-jorudan-search-modal-content';

type StationState = { category: string; company: string; name: string };
type Props = {
  arrival: StationState;
  baseCurrencySymbol: string;
  origin: StationState;
  roundTrip?: boolean;
  seatPreference?: number | string;
  viaList?: Array<StationState>;
  onChangeRoundTrip: (isRoundTrip: boolean) => void;
  onSearchRoute: (origin, arrival, viaList, roundTrip) => any;
  onSelectRoute: (route, origin, arrival, viaList, roundTrip) => any;
  searchStation: (searchQuery: string) => Promise<any>;
};
const GridDetailJorudanSearchModalContent = (
  props: Props
): React.ReactElement => {
  const dispatch = useDispatch();
  const {
    seatPreference,
    baseCurrencySymbol,
    roundTrip,
    searchStation,
    onSearchRoute,
    onSelectRoute,
    onChangeRoundTrip,
  } = props;
  const [origin, setOrigin] = useState<StationState>(props.origin);
  const [arrival, setArrival] = useState<StationState>(props.arrival);
  const [viaList, setViaList] = useState<Array<StationState>>(
    props.viaList || []
  );
  const [isRoundTrip, setIsRoundTrip] = useState(roundTrip);
  const [showRouteSelectionDialog, setShowRouteSelectionDialog] =
    useState(false);
  const [route, setRoute] = useState<Route | undefined>();

  useEffect(() => {
    if (onChangeRoundTrip) onChangeRoundTrip(isRoundTrip);
  }, [isRoundTrip]);

  const getSuggestions = async (station?: string): Promise<Array<Option>> => {
    return searchStation(station).then((stationResult) => {
      const suggestions = get(stationResult, '0.suggestions', []);
      return suggestions.map((s) => ({
        id: s.name,
        label: s.name,
        value: s.name,
        selectData: s,
      }));
    });
  };

  const onAddViaList = () => {
    const viaListClone = Array.from(viaList);
    viaListClone.push({ category: '', company: '', name: '' });
    setViaList(viaListClone);
  };
  const onRemoveViaList = (idx: number) => () => {
    const viaListClone = Array.from(viaList);
    viaListClone.splice(idx, 1);
    setViaList(viaListClone);
  };

  const onSelectOrigin = (_option, selectData) => {
    setOrigin(selectData);
  };
  const onSelectArrival = (_option, selectData) => {
    setArrival(selectData);
  };
  const onSelectViaListSuggestion = (idx: number) => (_option, selectData) => {
    const viaListClone = cloneDeep(viaList);
    viaListClone[idx] = selectData;
    setViaList(viaListClone);
  };

  const onCloseRouteSelectionDialog = () => {
    setShowRouteSelectionDialog(false);
  };

  const onClickSearchRoute = async () => {
    onSearchRoute(
      { name: origin.name, station: origin },
      { name: arrival.name, station: arrival },
      viaList,
      isRoundTrip
    ).then((r) => {
      if (r && r.type === 'CATCH_API_ERROR') {
        dispatch(catchApiError(r.payload, { isContinuable: true }));
      } else {
        setRoute(r);
        setShowRouteSelectionDialog(true);
      }
    });
  };

  const onClickSelectRoute = (route) => {
    onSelectRoute(route, origin, arrival, viaList, isRoundTrip);
    onCloseRouteSelectionDialog();
  };

  const isDisabledSearch =
    !origin.name || !arrival.name || (viaList && viaList.some((v) => !v.name));

  return (
    <div className={ROOT}>
      <div className={`${ROOT}__options-container`}>
        {/* @ts-ignore */}
        <Radio
          name="roundTrip"
          items={roundTripOptions}
          checked={isRoundTrip}
          onChange={setIsRoundTrip}
          readOnly={false}
        />
      </div>
      <div className={`${ROOT}__destinations-container`}>
        <AutocompleteInput
          type="text"
          value={origin.name}
          getSuggestions={getSuggestions}
          onSelectSuggestion={onSelectOrigin}
          className={classNames({
            [`${ROOT}__input`]: true,
            [`${ROOT}__input-error`]: false,
          })}
          disabled={false}
          debounceDuration={500}
          withIndicator
          inputClass={`${ROOT}__input`}
        />
        {!isEmpty(viaList) &&
          viaList.map((v, idx) => (
            <div
              className={`${ROOT}__destinations-container__via-input-container`}
            >
              <AutocompleteInput
                key={idx}
                type="text"
                value={v.name}
                getSuggestions={getSuggestions}
                onSelectSuggestion={onSelectViaListSuggestion(idx)}
                className={classNames({
                  [`${ROOT}__input`]: true,
                  [`${ROOT}__input-error`]: false,
                })}
                disabled={false}
                debounceDuration={500}
                withIndicator
                inputClass={`${ROOT}__input`}
              />
              <IconButton
                srcType="svg"
                src={ImgIconClose}
                onClick={onRemoveViaList(idx)}
                className={`${ROOT}__destinations-container__via-input-clear-button`}
              />
            </div>
          ))}
        <AutocompleteInput
          type="text"
          value={arrival.name}
          getSuggestions={getSuggestions}
          onSelectSuggestion={onSelectArrival}
          className={classNames({
            [`${ROOT}__input`]: true,
            [`${ROOT}__input-error`]: false,
          })}
          disabled={false}
          debounceDuration={500}
          withIndicator
          inputClass={`${ROOT}__input`}
          isFinalDestination
        />
      </div>
      {viaList.length < MAX_LENGTH_VIA_LIST && (
        <Button
          type="text"
          onClick={onAddViaList}
          className={`${ROOT}__add-via-button`}
        >
          {msg().Exp_Lbl_AddViaButton}
        </Button>
      )}
      <div className={`${ROOT}__search-container`}>
        <Button
          onClick={onClickSearchRoute}
          type="primary"
          disabled={isDisabledSearch}
        >
          {msg().Com_Btn_Search}
        </Button>
      </div>
      <div id="grid-detail-jorudan-route-select-dialog" />
      <GridDetailModalPortal
        containerId="grid-detail-jorudan-route-select-dialog"
        show={showRouteSelectionDialog}
      >
        <RouteSelect
          origin={origin}
          arrival={arrival}
          baseCurrencySymbol={baseCurrencySymbol}
          route={route}
          seatPreference={seatPreference}
          viaList={viaList}
          onClickHideDialogButton={onCloseRouteSelectionDialog}
          onClickRouteSelectListItem={onClickSelectRoute}
        />
      </GridDetailModalPortal>
    </div>
  );
};

const roundTripOptions = [
  { key: false, value: msg().Exp_Lbl_RouteOptionOneWay },
  { key: true, value: msg().Exp_Lbl_RouteOptionRoundTrip },
];

export default GridDetailJorudanSearchModalContent;
