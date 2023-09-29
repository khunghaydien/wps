import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import styled from 'styled-components';

import MileageUtils from '@apps/commons/utils/exp/MileageUtils';
import { Spinner } from '@apps/core';
import ImgIconAttention from '@commons/images/icons/attention.svg';
import InfoIcon from '@commons/images/icons/info.svg';
import msg from '@commons/languages';

import { MileageDestinationInfo } from '@apps/domain/models/exp/Mileage';

import Tooltip from '../Tooltip';

import './MileageMap.scss';

const ROOT = 'commons-map';

export type MileageMapRefProps = {
  clearDirections: () => void;
  searchDirections: (isInitialiseRecord?: boolean) => void;
};
type Props = {
  containerClass?: string;
  destinations?: Array<MileageDestinationInfo>;
  libraryLoaded?: boolean;
  mapId?: string;
  readOnly?: boolean;
  onMapInitialised?: (initialised: boolean) => void;
  onSearchedRouteDistance?: (distance: number) => void;
  onSearchedRouteError?: (
    error:
      | google.maps.DirectionsStatus.NOT_FOUND
      | google.maps.DirectionsStatus.OVER_QUERY_LIMIT
  ) => void;
};

/**
 * In case you are including multiple map instances in a page, please set the mapId prop with different ids
 */
const MileageMap = forwardRef<MileageMapRefProps, Props>(
  (props: Props, ref) => {
    const {
      mapId = 'mileage-map',
      destinations,
      readOnly,
      containerClass,
      libraryLoaded,
      onMapInitialised,
      onSearchedRouteError,
      onSearchedRouteDistance,
    } = props;
    const [apiExceedError, setApiExceedError] = useState(false);
    const [mapInitialised, setMapInitialised] = useState(false);

    const map = useRef<google.maps.Map>();
    const directionsService = useRef<google.maps.DirectionsService>();
    const directionsRenderer = useRef<google.maps.DirectionsRenderer>();

    useEffect(() => {
      if (libraryLoaded) initialiseMap();
    }, [libraryLoaded]);

    useImperativeHandle(ref, () => ({
      searchDirections: (isInitialiseRecord?: boolean) => {
        if (libraryLoaded && map.current) {
          setApiExceedError(false);
          const conditions: google.maps.DirectionsRequest | undefined =
            MileageUtils.getDirectionConditions(destinations);
          directionsService.current.route(
            conditions,
            function (response, status) {
              const apiLimitExceededStatuses = [
                google.maps.DirectionsStatus.OVER_QUERY_LIMIT,
                google.maps.DirectionsStatus.REQUEST_DENIED,
                google.maps.DirectionsStatus.UNKNOWN_ERROR,
              ];
              if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.current.setOptions({
                  map: map.current,
                  directions: response,
                });
                onSearchedRouteError && onSearchedRouteError(undefined);
                // if isInitialiseRecord, that means we are retrieving details first time existing record is opened
                if (!isInitialiseRecord) calculateDistance(response);
              } else if (apiLimitExceededStatuses.indexOf(status) > -1) {
                onSearchedRouteError &&
                  onSearchedRouteError(
                    google.maps.DirectionsStatus.OVER_QUERY_LIMIT
                  );
                setApiExceedError(true);
              } else {
                onSearchedRouteError &&
                  onSearchedRouteError(google.maps.DirectionsStatus.NOT_FOUND);
              }
            }
          );
        }
      },
      clearDirections: () => {
        if (directionsRenderer.current)
          // User might have changed the routes using the form
          directionsRenderer.current.setMap(null);
      },
    }));

    const initialiseMap = () => {
      const options: google.maps.MapOptions = {
        disableDefaultUI: readOnly,
        keyboardShortcuts: readOnly,
        gestureHandling: readOnly ? 'none' : null,
        zoomControl: true,
        zoom: 10,
        center: { lat: 36.2048, lng: 138.2529 },
      };
      const initMap = (position) => {
        if (position && position.coords && position.coords.latitude) {
          options.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        }
        const m = new window.google.maps.Map(
          document.getElementById(mapId),
          options
        );
        const dR = new google.maps.DirectionsRenderer();
        const dS = new google.maps.DirectionsService();
        map.current = m;
        directionsService.current = dS;
        directionsRenderer.current = dR;
        setMapInitialised(true);
        if (onMapInitialised) onMapInitialised(true);
      };
      navigator.geolocation.getCurrentPosition(initMap, initMap);
    };

    const calculateDistance = (response: google.maps.DirectionsResult) => {
      const { routes } = response;
      const legs = routes[0].legs;
      const distance = legs.reduce((dist, leg) => dist + leg.distance.value, 0);
      if (onSearchedRouteDistance) onSearchedRouteDistance(distance);
    };

    return (
      <div className={classNames(ROOT, containerClass)}>
        <MapWrapper>
          {!apiExceedError && libraryLoaded && (
            <MapTooltip
              align="right"
              content={msg().Exp_Lbl_MapRouteWarning}
              contentStyle={{ fontSize: '1em' }}
            >
              <InfoIcon />
            </MapTooltip>
          )}
          <div className={classNames('map', `${ROOT}__map`)} id={mapId} />
          {!mapInitialised && (
            <div className={`${ROOT}__spinner`}>
              <Spinner size="small" />
            </div>
          )}
        </MapWrapper>
        {apiExceedError && (
          <div className={`${ROOT}__warning`}>
            <ImgIconAttention className={`${ROOT}__warning-appear`} />
            <div className={`${ROOT}__warning-message`}>
              {msg().Exp_Lbl_MapUsageLimitExceed}
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default MileageMap;

const MapWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const MapTooltip = styled(Tooltip)`
  position: absolute;
  top: 5px;
  left: 7px;
  z-index: 1;
  cursor: pointer;
`;
