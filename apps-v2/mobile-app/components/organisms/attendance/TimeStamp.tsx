import * as React from 'react';

import classNames from 'classnames';
import isNil from 'lodash/isNil';

import RefreshButton from '../../molecules/commons/Buttons/RefreshButton';
import Map from '../../molecules/commons/Map';

import {
  LOCATION_FETCH_STATUS,
  LocationFetchStatus,
} from '../../../../domain/models/Location';
import { CommuteCount } from '@attendance/domain/models/CommuteCount';

import Footer from '../../molecules/attendance/TimeStamp/Footer';
import SendLocationToggle from '../../molecules/attendance/TimeStamp/SendLocationToggle';
import StampClock from '../../molecules/attendance/TimeStamp/StampClock';

import './TimeStamp.scss';

type FixDailyRequest = {
  requestId?: string;
  status?: string;
};
type Record = {
  recordId?: string;
  fixDailyRequest: FixDailyRequest;
};
type Props = {
  className?: string;
  timeLocale: string;
  onClickStartStampButton: () => void;
  onClickEndStampButton: () => void;
  isEnableStartStamp: boolean;
  isEnableEndStamp: boolean;
  isEnableRestartStamp: boolean;
  defaultAction: 'in' | 'out' | 'rein';

  showLocationToggleButton: boolean;
  onClickToggleButton: (arg0: boolean) => void;
  willSendLocation: boolean;
  fetchStatus: LocationFetchStatus;
  locationFetchTime: number | null;
  latitude: number | null;
  longitude: number | null;

  comment: string;
  onChangeCommentField: (comment: string) => void;

  useManageCommuteCount: boolean;
  commuteCount: CommuteCount;
  onChangeCommuteCount: (param: CommuteCount) => void;

  onClickRefresh: () => void;

  isPossibleFixDailyRequest: boolean;
  allowedActionForFixDailyRequest: boolean;
  useDailyFixRequest: boolean;
  record: Record;
  onClickSubmitFixDaily: () => void;
  submitFixDailyWithClockOut: () => void;
};

const ROOT = 'mobile-app-components-organisms-attendance-time-stamp';

export default class TimeStamp extends React.PureComponent<Props> {
  render() {
    const {
      className: $className,
      isEnableStartStamp,
      isEnableEndStamp,
      isEnableRestartStamp,
      showLocationToggleButton,
      willSendLocation,
      fetchStatus,
      timeLocale,
      latitude,
      longitude,
      locationFetchTime,
      comment,
      defaultAction,
      useManageCommuteCount,
      commuteCount,
      onChangeCommentField,
      onClickToggleButton,
      onClickEndStampButton,
      onClickStartStampButton,
      onClickRefresh,
      onChangeCommuteCount,
      isPossibleFixDailyRequest,
      allowedActionForFixDailyRequest,
      useDailyFixRequest,
      record,
      onClickSubmitFixDaily,
    } = this.props;
    const className = classNames(ROOT, $className);
    const canStamp =
      isEnableStartStamp || isEnableEndStamp || isEnableRestartStamp;
    const isCommentRequired =
      showLocationToggleButton &&
      (!willSendLocation || fetchStatus !== LOCATION_FETCH_STATUS.Success);
    const isShowMap =
      showLocationToggleButton &&
      willSendLocation &&
      !isNil(latitude) &&
      !isNil(longitude);
    return (
      <div className={className}>
        <div className={`${ROOT}__content`}>
          {showLocationToggleButton && (
            <RefreshButton
              className={`${ROOT}__refresh`}
              onClick={onClickRefresh}
            />
          )}
          <StampClock
            className={classNames(`${ROOT}__stamp-clock`, {
              [`${ROOT}__stamp-clock--not-showing-map`]:
                !showLocationToggleButton,
            })}
            locale={timeLocale}
          />
          {showLocationToggleButton ? (
            <SendLocationToggle
              className={`${ROOT}__send-location-toggle`}
              willSendLocation={willSendLocation}
              onClick={onClickToggleButton}
              fetchStatus={fetchStatus}
              locationFetchTime={locationFetchTime}
            />
          ) : null}
          {isShowMap && (
            <Map
              className={`${ROOT}__map`}
              latitude={latitude || 0}
              longitude={longitude || 0}
            />
          )}
        </div>
        <Footer
          onClickStartStampButton={onClickStartStampButton}
          onClickEndStampButton={onClickEndStampButton}
          onChangeCommentField={onChangeCommentField}
          onChangeCommuteCount={onChangeCommuteCount}
          isEnableStartStamp={isEnableStartStamp}
          isEnableEndStamp={isEnableEndStamp}
          isEnableRestartStamp={isEnableRestartStamp}
          isCommentRequired={isCommentRequired}
          canStamp={canStamp}
          defaultAction={defaultAction}
          disabled={isCommentRequired && !comment}
          comment={comment}
          useManageCommuteCount={useManageCommuteCount}
          commuteCount={commuteCount}
          isPossibleFixDailyRequest={isPossibleFixDailyRequest}
          allowedActionForFixDailyRequest={allowedActionForFixDailyRequest}
          record={record}
          useDailyFixRequest={useDailyFixRequest}
          onClickSubmitFixDaily={onClickSubmitFixDaily}
        />
      </div>
    );
  }
}
