import React, { useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';

import styled from 'styled-components';

import IconButton from '@apps/commons/components/buttons/IconButton';
import MileageMap, {
  MileageMapRefProps,
} from '@apps/commons/components/exp/MileageMap';
import LabelWithHint from '@apps/commons/components/fields/LabelWithHint';
import TextField from '@apps/commons/components/fields/TextField';
import {
  convertDifferenceValues,
  DifferenceValues,
  isDifferent,
} from '@apps/commons/utils/exp/RequestReportDiffUtils';
import TextUtil from '@apps/commons/utils/TextUtil';
import { Button, Label } from '@apps/core';
import ImgIconAdd from '@apps/core/assets/icons-generic/plus.svg';
import ImgIconReverse from '@apps/core/assets/icons-generic/sort.svg';
import msg from '@commons/languages';

import {
  MAX_DESTINATIONS,
  MileageDestinationInfo,
  MileageUnit,
  MIN_DESTINATIONS,
} from '@apps/domain/models/exp/Mileage';
import { Record } from '@apps/domain/models/exp/Record';

import { BaseCurrencyContainer } from '@apps/expenses-pc/containers/Expenses';

import DestinationInput from '../DestinationInput';
import MileageRate from '../MileageRate';

import './index.scss';

type Props = {
  baseCurrencyCode: string;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  customHint: any;
  destinations: Array<MileageDestinationInfo>;
  distance?: string;
  errors?: any;
  estimatedDistance?: string;
  expPreRecord?: Record;
  expRecord: Record;
  isExistingRecord?: boolean;
  isExpenseRequest;
  isFinanceApproval;
  isHighlightDiff?: boolean;
  isHighlightNewRecord?: boolean;
  isLoading?: boolean;
  librariesLoaded?: boolean;
  loadingAreas?: string[];
  mileageRateInfo?: { name: string; rate: number };
  mileageUnit?: MileageUnit;
  readOnly?: boolean;
  recentlyUsedDestinations?: Array<string>;
  recordItemIdx?: number;
  targetRecord: string;
  touched: any;
  handleDistanceChange: (_e, distance: string) => void;
  onAddDestination: () => void;
  onChangeDestination: (destination: string, idx: number) => void;
  onChangeEditingExpReport: (arg0: string, arg1: any) => void;
  onDeleteDestination: (idx: number) => void;
  onReverseDestinations: () => void;
  onSearchedRouteDistance: (distance: number) => void;
  setGeneratePreviewNeeded: (isNeeded?: boolean) => void;
};

const itemValuesToObjectMapping = {
  mileageDistance: 'mileageDistance',
  mileageRateHistoryId: 'mileageRateHistoryId',
};

const ROOT = 'ts-expenses__form-record-item__mileage-form';
const MileageForm = (props: Props) => {
  const {
    expRecord,
    expPreRecord,
    targetRecord,
    errors,
    customHint,
    touched,
    mileageUnit,
    baseCurrencyCode,
    baseCurrencySymbol,
    baseCurrencyDecimal,
    isFinanceApproval,
    isExpenseRequest,
    recordItemIdx = 0,
    readOnly,
    destinations,
    mileageRateInfo,
    estimatedDistance,
    distance,
    isExistingRecord,
    isHighlightDiff,
    isHighlightNewRecord,
    librariesLoaded,
    recentlyUsedDestinations,
    isLoading,
    loadingAreas,
    handleDistanceChange,
    onChangeEditingExpReport,
    onChangeDestination,
    onDeleteDestination,
    onAddDestination,
    onReverseDestinations,
    onSearchedRouteDistance,
    setGeneratePreviewNeeded,
  } = props;
  const [mapInitialised, setMapInitialised] = useState<boolean>(false);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [noRouteMsg, setNoRouteMsg] = useState<string | undefined>(undefined);
  const [isDistanceFocused, setIsDistanceFocused] = useState<boolean>(false);
  const mapRef = useRef<MileageMapRefProps>(null);

  useEffect(() => {
    if (isExistingRecord && mapInitialised && mapRef.current) {
      onGenerateRoute(true);
      setIsSearched(true);
    }
  }, [mapInitialised, mapRef, expRecord.recordId]);

  const onSearchedRouteError = (
    error:
      | google.maps.DirectionsStatus.NOT_FOUND
      | google.maps.DirectionsStatus.OVER_QUERY_LIMIT
      | google.maps.DirectionsStatus.REQUEST_DENIED
      | google.maps.DirectionsStatus.UNKNOWN_ERROR
  ) => {
    if (!readOnly) {
      const limitExceededStatuses = [
        google.maps.DirectionsStatus.OVER_QUERY_LIMIT,
        google.maps.DirectionsStatus.REQUEST_DENIED,
        google.maps.DirectionsStatus.UNKNOWN_ERROR,
      ];
      if (error === google.maps.DirectionsStatus.NOT_FOUND) {
        setNoRouteMsg('Exp_Lbl_NoRouteExists');
        return;
      }
      if (limitExceededStatuses.indexOf(error) > -1) {
        setGeneratePreviewNeeded(false);
        setNoRouteMsg('Exp_Lbl_ApiLimitExceed');
        return;
      }
      setGeneratePreviewNeeded(false);
      setNoRouteMsg(undefined);
    }
  };

  const onGenerateRoute = (isInitialiseRecord?: boolean) => {
    setNoRouteMsg(undefined);
    if (mapRef.current) {
      mapRef.current.searchDirections(isInitialiseRecord);
      setIsSearched(true);
    }
  };
  const clearRoute = () => {
    if (mapRef.current) mapRef.current.clearDirections();
    if (librariesLoaded) {
      setIsSearched(false);
      setGeneratePreviewNeeded(true);
    }
  };

  const onChangeDestinationInput = (l: string, idx: number) => {
    clearRoute();
    onChangeDestination(l, idx);
  };

  const onDeleteWaypoint = (idx: number) => {
    clearRoute();
    onDeleteDestination(idx);
  };
  const onAddWaypoint = () => {
    clearRoute();
    onAddDestination();
  };
  const onClickReverse = () => {
    clearRoute();
    onReverseDestinations();
  };

  const canShowClearButton = () =>
    destinations && destinations.length > MIN_DESTINATIONS;

  const isGenerateDisabled = () => {
    if (readOnly) return true;
    if (isSearched) return true;
    const isDisabled = destinations.filter((l) => isEmpty(l.name)).length > 0;
    return isDisabled;
  };

  const distanceError = get(
    errors,
    `${targetRecord}.items.${recordItemIdx}.mileageDistance`
  );

  const onDistanceFieldBlur = () => {
    setIsDistanceFocused(false);
    let d: string | number = +distance;
    if (String(distance).length === 0) d = '';
    onChangeEditingExpReport(
      `${targetRecord}.items.${recordItemIdx}.mileageDistance`,
      d
    );
  };

  const getMileageRateLabel = (): string => {
    if (mileageRateInfo)
      return `${mileageRateInfo.name} - ${baseCurrencySymbol}${mileageRateInfo.rate}`;
    return TextUtil.template(
      msg().Com_Err_NotValidAt,
      msg().$Exp_Clbl_MileageRate,
      msg().Exp_Clbl_Date
    );
  };

  let diffValues: DifferenceValues,
    preExpDestinations: Array<MileageDestinationInfo>;
  let isDestinationsDiff = false;
  if (isHighlightDiff && !isHighlightNewRecord) {
    diffValues = convertDifferenceValues(
      itemValuesToObjectMapping,
      expRecord.items[0],
      expPreRecord.items[0]
    );
    preExpDestinations = get(expPreRecord, 'mileageRouteInfo.destinations');
    if (
      preExpDestinations &&
      destinations.length !== preExpDestinations.length
    ) {
      // case where destinations is different by number of destinations
      isDestinationsDiff = true;
    } else {
      // case where we need to check each field to see if any destination is different
      isDestinationsDiff = destinations.some((destination, idx) => {
        const { name } = destination;
        const preRecordDestination = get(preExpDestinations, idx);
        const { name: preRecordName } = preRecordDestination;
        return !isEqual(name, preRecordName);
      });
    }
  }

  const ratePerUnitLabel =
    mileageUnit === MileageUnit.MILE
      ? msg().Exp_Lbl_RatePerMile
      : msg().Exp_Lbl_RatePerKm;
  const mileageUnitLbl =
    mileageUnit === MileageUnit.MILE
      ? msg().Exp_Sel_MileageUnitMile
      : msg().Exp_Sel_MileageUnitKm;
  const estimatedDistanceLbl = isNil(estimatedDistance)
    ? '-'
    : `${estimatedDistance} ${mileageUnitLbl}`;
  const mileageDistanceLbl = `${msg().Exp_Lbl_Distance} (${
    msg().Exp_Lbl_RouteEstimation
  }: ${estimatedDistanceLbl})`;
  const mileageDistance = distance
    ? `${distance}${isDistanceFocused ? '' : ` ${mileageUnitLbl}`}`
    : '';

  return (
    <div className={ROOT}>
      <div className={`${ROOT}__destination-map-container`}>
        <div
          className={classNames({
            [`${ROOT}__destination-map-container-destination`]: true,
            [`${ROOT}-highlight-bg`]:
              isHighlightNewRecord || isDestinationsDiff,
          })}
        >
          <div
            className={`${ROOT}__destination-map-container-destinations-container`}
          >
            <div
              className={`${ROOT}__destination-map-container-destinations-container-left`}
            >
              {librariesLoaded &&
                destinations &&
                destinations.map((destination, idx) => {
                  const isFinalDestination = idx === destinations.length - 1;
                  return (
                    <DestinationInput
                      value={destination.name}
                      key={idx}
                      onChange={(l: string) => onChangeDestinationInput(l, idx)}
                      showClearButton={canShowClearButton()}
                      onClickClear={() => onDeleteWaypoint(idx)}
                      placeholder={`${msg().Exp_Lbl_AddDestination} ${idx + 1}`}
                      isFinalDestination={isFinalDestination}
                      recentlyUsedDestinations={recentlyUsedDestinations}
                      disabled={readOnly}
                    />
                  );
                })}
            </div>
            {!readOnly && destinations.length === 2 && (
              <div
                className={`${ROOT}__destination-map-container-destinations-container-right`}
              >
                <IconButton
                  srcType="svg"
                  src={ImgIconReverse}
                  className={`${ROOT}__destination-map-container-destinations-container-right-button-reverse`}
                  onClick={onClickReverse}
                />
              </div>
            )}
          </div>
          {noRouteMsg && (
            <div className={`${ROOT}-error-message`}>{msg()[noRouteMsg]}</div>
          )}
          <DestinationActionButtons>
            <DestinationActionLeftButton>
              {!readOnly &&
                destinations &&
                destinations.length < MAX_DESTINATIONS && (
                  <div
                    className={`${ROOT}__destination-map-container-preview-button-add-container`}
                    onClick={onAddWaypoint}
                  >
                    <IconButton
                      srcType="svg"
                      src={ImgIconAdd}
                      className={`${ROOT}__destination-map-container-preview-button-add`}
                    />
                    <Label color="accent" backgroundColor="base">
                      {msg().Exp_Lbl_AddDestination}
                    </Label>
                  </div>
                )}
              {!readOnly && (
                <Button
                  className={`${ROOT}__destination-map-container-preview-button`}
                  onClick={() => onGenerateRoute()}
                  type="button"
                  color="primary"
                  disabled={isGenerateDisabled()}
                >
                  {msg().Exp_Lbl_SearchRoute}
                </Button>
              )}
            </DestinationActionLeftButton>
            <DestinationActionRightButton />
          </DestinationActionButtons>
        </div>
      </div>
      <div className={`${ROOT}__destination-details-container`}>
        <DestinationDetailsMileageMapWrapper>
          <MileageMap
            ref={mapRef}
            destinations={destinations}
            readOnly={readOnly}
            libraryLoaded={librariesLoaded}
            onSearchedRouteDistance={onSearchedRouteDistance}
            onSearchedRouteError={onSearchedRouteError}
            onMapInitialised={setMapInitialised}
          />
        </DestinationDetailsMileageMapWrapper>
        <DestinationDetailsMapJourneyInfo>
          <div className="ts-text-field-container">
            <div className={`${ROOT}__destination-details-container-field`}>
              <LabelWithHint text={mileageDistanceLbl} />
              <TextField
                value={mileageDistance}
                onChange={handleDistanceChange}
                onFocus={() => setIsDistanceFocused(true)}
                onBlur={onDistanceFieldBlur}
                disabled={readOnly}
                isRequired
                className={classNames({
                  [`${ROOT}__input-error`]: distanceError,
                })}
                readOnlyClassName={classNames({
                  'highlight-bg':
                    isHighlightNewRecord ||
                    isDifferent('mileageDistance', diffValues),
                })}
              />
              {distanceError && (
                <div className={`${ROOT}-error-message`}>
                  {msg()[distanceError]}
                </div>
              )}
            </div>
          </div>
          <div className={`${ROOT}__rate-container`}>
            <MileageRate
              value={getMileageRateLabel()}
              label={ratePerUnitLabel}
              isLoading={isLoading}
              loadingAreas={loadingAreas}
              isDotLoader
              isLoaderOverride
            />
          </div>
        </DestinationDetailsMapJourneyInfo>
      </div>
      <div className={`${ROOT}__destination-amount-container`}>
        <BaseCurrencyContainer
          readOnly={readOnly}
          customHint={customHint}
          touched={touched}
          errors={errors}
          expRecord={expRecord}
          expPreRecord={expPreRecord}
          isHighlightDiff={isHighlightDiff}
          isHighlightNewRecord={isHighlightNewRecord}
          recordItemIdx={0}
          targetRecord={targetRecord}
          onChangeEditingExpReport={onChangeEditingExpReport}
          baseCurrencyCode={baseCurrencyCode}
          baseCurrencySymbol={baseCurrencySymbol}
          baseCurrencyDecimal={baseCurrencyDecimal}
          isItemized={false}
          isFinanceApproval={isFinanceApproval}
          isExpenseRequest={isExpenseRequest}
          isMileageRecord
        />
      </div>
    </div>
  );
};

export default MileageForm;

const DestinationActionButtons = styled.div`
  display: flex;
`;

const DestinationActionLeftButton = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 19;
  margin-right: 8px;
`;

const DestinationActionRightButton = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

const DestinationDetailsMileageMapWrapper = styled.div`
  display: flex;
  flex: 1;
  min-height: 150px;
  margin-right: 10px;
`;

const DestinationDetailsMapJourneyInfo = styled.div`
  flex: 1;
`;
