import React, { useEffect, useRef, useState } from 'react';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';

import Highlight from '@apps/commons/components/exp/Highlight';
import MileageMap, {
  MileageMapRefProps,
} from '@apps/commons/components/exp/MileageMap';
import {
  convertDifferenceValues,
  DifferenceValues,
  isDifferent,
} from '@apps/commons/utils/exp/RequestReportDiffUtils';
import { useScript } from '@apps/core/hooks';
import { Color } from '@apps/core/styles';
import googleMapsApiKey, {
  GOOGLE_MAP_SCRIPT_ID,
} from '@commons/config/exp/googleMapKey';
import msg from '@commons/languages';

import {
  MileageDestinationInfo,
  MileageUnit,
} from '@apps/domain/models/exp/Mileage';
import { ExpRequestRecord } from '@apps/domain/models/exp/request/Report';

import './MileageApproval.scss';

const itemValuesToObjectMapping = {
  mileageDistance: 'mileageDistance',
  mileageRateHistoryId: 'mileageRateHistoryId',
  mileageRate: 'mileageRate',
  mileageRateName: 'mileageRateName',
};
const mileageRouteInfoObjectMapping = {
  estimatedDistance: 'estimatedDistance',
};

type Props = {
  record: ExpRequestRecord;
  isRecordBodyOpen?: boolean;
  preExpRecord?: ExpRequestRecord;
  baseCurrencySymbol: string;
  mileageUnit: MileageUnit;
  isHighlightDiff?: boolean;
};
const RECORD_BODY_ROOT =
  'approvals-pc-expenses-request-pane-detail__records-area-record__body';
const ROOT = `${RECORD_BODY_ROOT}-mileage-container`;
const MileageApproval = (props: Props) => {
  const {
    record,
    preExpRecord,
    isHighlightDiff,
    baseCurrencySymbol,
    mileageUnit,
    isRecordBodyOpen,
  } = props;
  const { loading } = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`,
    GOOGLE_MAP_SCRIPT_ID
  );

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isMapSearched, setIsMapSearched] = useState(false);
  const mapRef = useRef<MileageMapRefProps>();
  const mileageRateName = get(record, 'items.0.mileageRateName', '');
  const mileageRate = get(record, 'items.0.mileageRate', '');
  const mileageDistance = get(record, 'items.0.mileageDistance', '');
  const estimatedDistance = get(
    record,
    'mileageRouteInfo.estimatedDistance',
    ''
  );
  const destinations: Array<MileageDestinationInfo> = get(
    record,
    'mileageRouteInfo.destinations',
    []
  );

  useEffect(() => {
    if (isRecordBodyOpen && isMapLoaded && !isMapSearched) {
      if (destinations && mapRef.current) {
        mapRef.current.searchDirections(true);
        setIsMapSearched(true);
      }
    }
  }, [isRecordBodyOpen, isMapLoaded]);

  const onMapLoaded = () => {
    setIsMapLoaded(true);
  };

  const ratePerUnitLabel =
    mileageUnit === MileageUnit.MILE
      ? 'Exp_Lbl_RatePerMile'
      : 'Exp_Lbl_RatePerKm';
  const mileageUnitLbl =
    mileageUnit === MileageUnit.MILE
      ? msg().Exp_Sel_MileageUnitMile
      : msg().Exp_Sel_MileageUnitKm;

  const isNewRecord = isEmpty(preExpRecord);
  let diffValues: DifferenceValues | undefined,
    preExpDestinations: Array<MileageDestinationInfo> | undefined;
  if (isHighlightDiff && !isNewRecord) {
    diffValues = {
      ...convertDifferenceValues(
        itemValuesToObjectMapping,
        record.items[0],
        get(preExpRecord, 'items.0')
      ),
      ...convertDifferenceValues(
        mileageRouteInfoObjectMapping,
        record.mileageRouteInfo,
        get(preExpRecord, 'mileageRouteInfo')
      ),
    };
    preExpDestinations = get(preExpRecord, 'mileageRouteInfo.destinations');
  }

  const getDiffValue = (diffValues: DifferenceValues, key: string) => {
    if (!diffValues) return undefined;
    const values = diffValues[key];
    return get(values, 'original', '');
  };

  const renderDestinations = (
    toRenderDestinations?: Array<MileageDestinationInfo>
  ) => {
    if (!toRenderDestinations) return null;
    return toRenderDestinations.map((destination, idx) => {
      const { name } = destination;
      return (
        <li key={`${name}__${idx}`} className={`${ROOT}-destination-list-item`}>
          <div className={`${ROOT}-destination-list-item-indicator`}></div>
          {name}
        </li>
      );
    });
  };

  let isDestinationsDiff = false;
  if (isHighlightDiff && !isNewRecord) {
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

  const getRouteEstimationLabel = (value) => {
    if (!isNil(estimatedDistance)) return `${value} ${mileageUnitLbl}`;
    return '-';
  };

  const getMileageDistanceDiffValue = () => {
    const mileageDistanceDiff =
      getDiffValue(diffValues, 'mileageDistance') || mileageDistance;
    const estimatedDistanceDiff =
      getDiffValue(diffValues, 'estimatedDistance') || estimatedDistance;
    return `(${mileageDistanceDiff} ${mileageUnitLbl} (${
      msg().Exp_Lbl_RouteEstimation
    }: ${getRouteEstimationLabel(estimatedDistanceDiff)}))`;
  };

  return (
    <div className={ROOT}>
      <MileageMap
        mapId={record.recordId}
        key={record.recordId}
        ref={mapRef}
        destinations={destinations}
        readOnly
        libraryLoaded={!loading}
        onMapInitialised={onMapLoaded}
        containerClass={`${ROOT}-map`}
      />
      <Highlight highlight={isDestinationsDiff}>
        <ul className={`${ROOT}-destination-list`}>
          {renderDestinations(destinations)}
        </ul>
      </Highlight>
      {isDestinationsDiff && (
        <Highlight
          highlight={isDestinationsDiff}
          highlightColor={Color.bgDisabled}
        >
          <ul className={`${ROOT}-destination-list`}>
            {renderDestinations(preExpDestinations)}
          </ul>
        </Highlight>
      )}
      <div className={`${ROOT}-details`}>
        <div className={`${RECORD_BODY_ROOT}-item`}>
          <div className={`${RECORD_BODY_ROOT}-item-title`}>
            {msg().Exp_Lbl_Distance}
          </div>
          <div className={`${RECORD_BODY_ROOT}-item-body`}>
            <Highlight highlight={isDifferent('mileageDistance', diffValues)}>
              {`${mileageDistance} ${mileageUnitLbl} (${
                msg().Exp_Lbl_RouteEstimation
              }: ${getRouteEstimationLabel(estimatedDistance)})`}
            </Highlight>
            {isDifferent('mileageDistance', diffValues) && (
              <Highlight
                highlightColor={Color.bgDisabled}
                className={`${RECORD_BODY_ROOT}-item-body-highlight`}
              >
                {getMileageDistanceDiffValue()}
              </Highlight>
            )}
          </div>
        </div>
        <div className={`${RECORD_BODY_ROOT}-item`}>
          <div className={`${RECORD_BODY_ROOT}-item-title`}>
            {msg()[ratePerUnitLabel]}
          </div>
          <div className={`${RECORD_BODY_ROOT}-item-body`}>
            <Highlight
              highlight={isDifferent('mileageRateHistoryId', diffValues)}
            >
              {`${mileageRateName} - ${baseCurrencySymbol} ${mileageRate}`}
            </Highlight>
            {isDifferent('mileageRateHistoryId', diffValues) && (
              <Highlight
                highlightColor={Color.bgDisabled}
                className={`${RECORD_BODY_ROOT}-item-body-highlight`}
              >
                {`(${getDiffValue(
                  diffValues,
                  'mileageRateName'
                )} - ${baseCurrencySymbol} ${getDiffValue(
                  diffValues,
                  'mileageRate'
                )})`}
              </Highlight>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MileageApproval;
