import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { searchDirections } from '@apps/commons/action-dispatchers/Mileage';
import { showToastWithType } from '@apps/commons/modules/toast';
import { getDistanceInUnit } from '@apps/commons/utils/exp/MileageUtils';
import DestinationInput from '@commons/components/exp/Form/RecordItem/Mileage/DestinationInput';
import TextAreaField from '@commons/components/fields/TextAreaField';
import msg from '@commons/languages';

import {
  API_LIMIT_EXCEEDED_STATUSES,
  MileageDestinationInfo,
  MileageUnit,
  NO_ROUTE_STATUSES,
} from '@apps/domain/models/exp/Mileage';
import { Record } from '@apps/domain/models/exp/Record';

import GridDetailModalPortal from '../components/GridDetailModalPortal';
import Input from '../components/Input';
import useClickOutside from '@apps/daily-summary/components/hooks/useClickOutside';

import GridDetailMileageSearchModalContent from './GridDetailMileageSearchModalContent';

type Props = {
  className?: string;
  mileageUnit?: MileageUnit;
  record: Record;
  recordIdx: number;
  onChangeMileageDetail: (key: string, value: any) => void;
  onChangeRemarks: (e: ChangeEvent<HTMLInputElement>, remark: string) => void;
};
const GridDetailCellMileage = (props: Props): React.ReactElement => {
  const {
    record,
    className,
    recordIdx,
    mileageUnit,
    onChangeRemarks,
    onChangeMileageDetail,
  } = props;
  const dispatch = useDispatch();
  const clickRef = useRef();
  const [isShowDestinationsDialog, setIsShowDestinationsDialog] =
    useState<boolean>(false);
  const [isExistDestinations, setIsExistsDestinations] =
    useState<boolean>(false);
  const remarks = get(record, 'items.0.remarks');
  const destinations = get(record, 'mileageRouteInfo.destinations', []);
  const destinationNames = destinations.map((d) => d.name);
  const from = get(destinationNames, '0', '');
  const to = get(destinationNames, `${destinationNames.length - 1}`, '');
  const [fromError, setFromError] = useState<boolean>(!from);
  const [toError, setToError] = useState<boolean>(!to);

  const Actions = useMemo(
    () => bindActionCreators({ showToastWithType }, dispatch),
    [dispatch]
  );

  useEffect(() => {
    if (!isEmpty(from) && !isEmpty(to)) setIsExistsDestinations(true);
  }, []);

  const onOpenDestinationsDialog = () => {
    if (!isEmpty(from) && !isEmpty(to)) setIsShowDestinationsDialog(true);
  };
  const onCloseDestinationsDialog = () => {
    setIsShowDestinationsDialog(false);
  };

  const onChangeDestination = (idx) => (value) => {
    onChangeMileageDetail(`mileageRouteInfo.destinations.${idx}.name`, value);
    const isValueEmpty = !value;
    if (idx === 0) setFromError(isValueEmpty);
    else setToError(isValueEmpty);
  };

  const checkDestinations = () => {
    const hasNoFrom = isEmpty(from);
    const hasNoTo = isEmpty(to);
    if (hasNoFrom || hasNoTo) {
      if (hasNoFrom) setFromError(true);
      if (hasNoTo) setToError(true);
      return;
    }
    onSearchRoute();
  };

  const onSearchRoute = () => {
    searchDirections(destinations, handleSearchedRouteResult);
  };

  const handleSearchedRouteResult = (
    _directionsResult?: google.maps.DirectionsResult,
    distance?: number,
    err?: string
  ) => {
    const isApiLimitExceeded = API_LIMIT_EXCEEDED_STATUSES.includes(
      err as google.maps.DirectionsStatus
    );
    if (err) {
      if (isApiLimitExceeded) {
        Actions.showToastWithType(msg().Exp_Lbl_ApiLimitExceed, 4000, 'error');
      } else {
        if (NO_ROUTE_STATUSES.includes(err as google.maps.DirectionsStatus)) {
          if (!isExistDestinations) {
            Actions.showToastWithType(
              msg().Exp_Lbl_NoRouteExists,
              4000,
              'error'
            );
          }
          setIsExistsDestinations(false);
          setFromError(true);
          setToError(true);
          onChangeMileageDetail('mileageRouteInfo.estimatedDistance', 0);
          onChangeMileageDetail('mileageRouteInfo.mileageDistance', undefined);
        }
      }
      return;
    }
    setIsExistsDestinations(true);
    setFromError(false);
    setToError(false);
    const convertedDistance = getDistanceInUnit(distance, mileageUnit);
    onChangeMileageDetail(
      'mileageRouteInfo.estimatedDistance',
      convertedDistance
    );
    onChangeMileageDetail(`items.0.mileageDistance`, convertedDistance);
  };

  const onSetRoute = (
    destinations: Array<MileageDestinationInfo>,
    _directionsResult?: google.maps.DirectionsResult,
    distance?: number,
    err?: string
  ) => {
    onChangeMileageDetail('mileageRouteInfo.destinations', destinations);
    handleSearchedRouteResult(_directionsResult, distance, err);
    setIsShowDestinationsDialog(false);
  };

  const renderRoute = (): React.ReactElement => {
    return (
      <div className={`${className}__route-block-container`}>
        <div className={`${className}__route-block-container-text`}>
          <p>{destinationNames.join(' - ')}</p>
        </div>
      </div>
    );
  };

  useClickOutside(clickRef, onCloseDestinationsDialog);
  const containerId = `grid-cell-detail-cell-mileage-${recordIdx}`;
  const destinationInputClass = `${className}__destination-input`;
  const fromErrorClass = fromError
    ? !from
      ? `${destinationInputClass}-no-route-error`
      : `${destinationInputClass}-error`
    : null;
  const toErrorClass = toError
    ? !to
      ? `${destinationInputClass}-no-route-error`
      : `${destinationInputClass}-error`
    : null;
  return (
    <>
      {isExistDestinations && (
        <button
          className={classNames(
            `${className}__autocomplete-container`,
            `${className}__autocomplete-container-lg`,
            `${className}__clickable`,
            `${className}__border-right`
          )}
          id={containerId}
          onClick={onOpenDestinationsDialog}
          ref={clickRef}
          type="button"
        >
          {renderRoute()}
        </button>
      )}
      {!isExistDestinations && (
        <div
          className={classNames(
            `${className}__destination-from-to`,
            `${className}__autocomplete-container-lg`
          )}
          id={containerId}
        >
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
            <DestinationInput
              value={from}
              onChange={onChangeDestination(0)}
              withIndicator={false}
              containerClass={`${destinationInputClass} ${fromErrorClass}`}
              autocompleteContainerClass={`${className}__destination-input__autocomplete-input`}
              onBlur={checkDestinations}
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
            <DestinationInput
              value={to}
              onChange={onChangeDestination(1)}
              withIndicator={false}
              containerClass={`${destinationInputClass} ${toErrorClass}`}
              autocompleteContainerClass={`${destinationInputClass}__autocomplete-input`}
              onBlur={checkDestinations}
            />
          </div>
        </div>
      )}
      <div
        className={`${className}__autocomplete-container ${className}__remarks`}
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
        show={isShowDestinationsDialog}
      >
        <GridDetailMileageSearchModalContent
          destinations={destinations}
          onSearchRoute={searchDirections}
          onSetRoute={onSetRoute}
        />
      </GridDetailModalPortal>
    </>
  );
};

export default GridDetailCellMileage;
