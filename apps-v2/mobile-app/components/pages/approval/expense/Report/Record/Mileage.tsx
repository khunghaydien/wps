import React from 'react';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import Highlight from '@apps/commons/components/exp/Highlight';
import {
  convertDifferenceValues,
  DifferenceValues,
  isDifferent,
} from '@apps/commons/utils/exp/RequestReportDiffUtils';
import { Color } from '@apps/core/styles';
import ViewItem from '@apps/mobile-app/components/molecules/commons/ViewItem';
import msg from '@commons/languages';

import {
  MileageDestinationInfo,
  MileageUnit,
} from '@apps/domain/models/exp/Mileage';
import { ExpRequestRecord } from '@apps/domain/models/exp/request/Report';

import Icon from '@mobile/components/atoms/Icon';
import Label from '@mobile/components/atoms/Label';

import './Mileage.scss';

type Props = {
  record: ExpRequestRecord;
  preRecord?: ExpRequestRecord;
  currencySymbol: string;
  mileageUnit: MileageUnit;
  isHighlightDiff?: boolean;
  onClickOpenMap?: (destinations: Array<MileageDestinationInfo>) => void;
};

const itemValuesToObjectMapping = {
  mileageDistance: 'mileageDistance',
  mileageRateHistoryId: 'mileageRateHistoryId',
  mileageRate: 'mileageRate',
  mileageRateName: 'mileageRateName',
};
const mileageRouteInfoObjectMapping = {
  estimatedDistance: 'estimatedDistance',
};

const ROOT = 'mobile-app-pages-approval-page-expense-record-mileage';
const MileageApproval = (props: Props) => {
  const {
    record,
    preRecord,
    currencySymbol,
    mileageUnit,
    isHighlightDiff,
    onClickOpenMap,
  } = props;

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

  const isNewRecord = isEmpty(preRecord);

  let diffValues: DifferenceValues | undefined,
    preRecordDestinations: Array<MileageDestinationInfo> | undefined;
  if (isHighlightDiff && !isNewRecord) {
    diffValues = {
      ...convertDifferenceValues(
        itemValuesToObjectMapping,
        record.items[0],
        get(preRecord, 'items.0')
      ),
      ...convertDifferenceValues(
        mileageRouteInfoObjectMapping,
        record.mileageRouteInfo,
        get(preRecord, 'mileageRouteInfo')
      ),
    };
    preRecordDestinations = get(preRecord, 'mileageRouteInfo.destinations');
  }

  let isDestinationsDiff = false;
  if (isHighlightDiff && !isNewRecord) {
    if (
      preRecordDestinations &&
      destinations.length !== preRecordDestinations.length
    ) {
      // case where destinations is different by number of destinations
      isDestinationsDiff = true;
    } else {
      isDestinationsDiff = destinations.some((destination, idx) => {
        const { name } = destination;
        const preRecordDestination = get(preRecordDestinations, idx);
        const { name: preRecordName } = preRecordDestination;
        return !isEqual(name, preRecordName);
      });
    }
  }

  const getDiffValue = (diffValues: DifferenceValues, key: string) => {
    if (!diffValues) return undefined;
    const values = diffValues[key];
    return get(values, 'original', '');
  };

  const onClickMap = () => {
    onClickOpenMap && onClickOpenMap(record.mileageRouteInfo?.destinations);
  };

  const getMileageDistanceDiffValue = () => {
    const mileageDistanceDiff =
      getDiffValue(diffValues, 'mileageDistance') || mileageDistance;
    const estimatedDistanceDiff =
      getDiffValue(diffValues, 'estimatedDistance') || estimatedDistance;
    return `(${mileageDistanceDiff} ${mileageUnitLbl} (${
      msg().Exp_Lbl_RouteEstimation
    } = ${estimatedDistanceDiff} ${mileageUnitLbl}))`;
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

  const ratePerUnitLabel =
    mileageUnit === MileageUnit.MILE
      ? msg().Exp_Lbl_RatePerMile
      : msg().Exp_Lbl_RatePerKm;
  const mileageUnitLbl =
    mileageUnit === MileageUnit.MILE
      ? msg().Exp_Sel_MileageUnitMile
      : msg().Exp_Sel_MileageUnitKm;

  return (
    <div className={ROOT}>
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
            {renderDestinations(preRecordDestinations)}
          </ul>
        </Highlight>
      )}
      <div className={`${ROOT}-divider`} />
      <div className={`${ROOT}-open-map-container`} onClick={onClickMap}>
        <Icon className={`${ROOT}-open-map-container-icon`} type="open" />
        <Label
          text={msg().Exp_Lbl_OpenMap}
          className={`${ROOT}-open-map-container-label`}
        />
      </div>
      <div className={`${ROOT}-divider`} />
      <div className={`${ROOT}-details`}>
        <ViewItem label={msg().Exp_Lbl_Distance} className="block">
          <Highlight highlight={isDifferent('mileageDistance', diffValues)}>
            {`${mileageDistance} ${mileageUnitLbl} (${
              msg().Exp_Lbl_RouteEstimation
            } = ${estimatedDistance} ${mileageUnitLbl})`}
          </Highlight>
          {isDifferent('mileageDistance', diffValues) && (
            <Highlight
              highlightColor={Color.bgDisabled}
              className={`${ROOT}-details-item-body-highlight`}
            >
              {getMileageDistanceDiffValue()}
            </Highlight>
          )}
        </ViewItem>
        <ViewItem label={ratePerUnitLabel} className="block">
          <Highlight
            highlight={isDifferent('mileageRateHistoryId', diffValues)}
          >
            {`${mileageRateName} - ${currencySymbol} ${mileageRate}`}
          </Highlight>
          {isDifferent('mileageRateHistoryId', diffValues) && (
            <Highlight
              highlightColor={Color.bgDisabled}
              className={`${ROOT}-details-item-body-highlight`}
            >
              {`(${getDiffValue(
                diffValues,
                'mileageRateName'
              )} - ${currencySymbol} ${getDiffValue(
                diffValues,
                'mileageRate'
              )})`}
            </Highlight>
          )}
        </ViewItem>
      </div>
    </div>
  );
};

export default MileageApproval;
