import React, { useState } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import Button from '@apps/commons/components/buttons/Button';
import Spinner from '@apps/commons/components/Spinner';
import ImgIconAdd from '@apps/core/assets/icons-generic/plus.svg';
import DestinationInput from '@commons/components/exp/Form/RecordItem/Mileage/DestinationInput';
import msg from '@commons/languages';

import {
  API_LIMIT_EXCEEDED_STATUSES,
  MAX_DESTINATIONS,
  MileageDestinationInfo,
  MIN_DESTINATIONS,
  NO_ROUTE_STATUSES,
} from '@apps/domain/models/exp/Mileage';

import IconLabelButton from '../components/IconLabelButton';

import './GridDetailMileageSearchModalContent.scss';

const ROOT = 'grid-detail-mileage-search-modal-content';

type Props = {
  destinations: Array<MileageDestinationInfo>;
  onSearchRoute: (
    destinations: Array<MileageDestinationInfo>,
    callback: (
      _directionsResult?: google.maps.DirectionsResult,
      distance?: number,
      err?: string
    ) => void
  ) => void;
  onSetRoute: (
    destinations: Array<MileageDestinationInfo>,
    _directionsResult?: google.maps.DirectionsResult,
    distance?: number,
    err?: string
  ) => void;
};
const GridDetailMileageSearchModalContent = (
  props: Props
): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const { onSearchRoute, onSetRoute } = props;
  const [destinations, setDestinations] = useState<
    Array<MileageDestinationInfo>
  >(props.destinations);
  const [noRouteMsg, setNoRouteMsg] = useState<string | undefined>();

  const onAddWaypoint = () => {
    const destinationsClone = cloneDeep(destinations);
    destinationsClone.push({ name: '' });
    setDestinations(destinationsClone);
  };

  const onChangeDestinationInput = (destinationQuery, idx) => {
    const destinationsClone = cloneDeep(destinations);
    destinationsClone[idx].name = destinationQuery;
    setDestinations(destinationsClone);
  };

  const onClickSearchRoute = () => {
    setLoading(true);
    onSearchRoute(destinations, handleSearchedRouteResult);
  };

  const handleSearchedRouteResult = (
    _directionsResult?: google.maps.DirectionsResult,
    distance?: number,
    err?: google.maps.DirectionsStatus | string
  ) => {
    if (err) {
      if (NO_ROUTE_STATUSES.includes(err as google.maps.DirectionsStatus)) {
        setNoRouteMsg('Exp_Lbl_NoRouteExists');
      }
      if (
        API_LIMIT_EXCEEDED_STATUSES.includes(
          err as google.maps.DirectionsStatus
        )
      ) {
        setNoRouteMsg('Exp_Lbl_ApiLimitExceed');
        setLoading(false);
        onSetRoute(destinations, _directionsResult, undefined, err);
      }
      setLoading(false);
    } else {
      setLoading(false);
      onSetRoute(destinations, _directionsResult, distance, err);
    }
  };

  const onDeleteWaypoint = (idx: number) => () => {
    const destinationsClone = cloneDeep(destinations);
    destinationsClone.splice(idx, 1);
    setDestinations(destinationsClone);
  };

  const canShowClearButton =
    destinations && destinations.length > MIN_DESTINATIONS;
  const canShowAddButton =
    destinations && destinations.length < MAX_DESTINATIONS;
  const isDisabledSearchButton =
    !destinations || destinations.some((d) => isEmpty(d.name));

  return (
    <div className={ROOT}>
      <div className={`${ROOT}__destinations-container`}>
        {destinations &&
          destinations.map((destination, idx) => {
            const isFinalDestination = idx === destinations.length - 1;
            return (
              <DestinationInput
                value={destination.name}
                key={idx}
                onChange={(l: string) => onChangeDestinationInput(l, idx)}
                showClearButton={canShowClearButton}
                onClickClear={onDeleteWaypoint(idx)}
                placeholder={`${msg().Exp_Lbl_AddDestination} ${idx + 1}`}
                isFinalDestination={isFinalDestination}
              />
            );
          })}
      </div>
      {noRouteMsg && (
        <div className={`${ROOT}-error-message`}>{msg()[noRouteMsg]}</div>
      )}
      {canShowAddButton && (
        <IconLabelButton
          icon={ImgIconAdd}
          label={msg().Exp_Lbl_AddDestination}
          onClick={onAddWaypoint}
        />
      )}
      {loading && <Spinner loading />}
      {!loading && (
        <div className={`${ROOT}__search-container`}>
          <Button
            onClick={onClickSearchRoute}
            type="primary"
            disabled={isDisabledSearchButton}
          >
            {msg().Com_Btn_Search}
          </Button>
        </div>
      )}
    </div>
  );
};

export default GridDetailMileageSearchModalContent;
