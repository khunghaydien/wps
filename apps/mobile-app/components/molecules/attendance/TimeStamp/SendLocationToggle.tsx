import * as React from 'react';

import classNames from 'classnames';
import moment from 'moment';

import msg from '../../../../../commons/languages';

import {
  LOCATION_FETCH_STATUS,
  LocationFetchStatus,
} from '../../../../../domain/models/Location';

import ToggleButton from '../../../atoms/ToggleButton';

import './SendLocationToggle.scss';

type Props = {
  className?: string;
  disabled?: boolean;
  willSendLocation: boolean;
  fetchStatus: LocationFetchStatus;
  locationFetchTime: number | null;
  onClick: (arg0: boolean) => void;
};

const ROOT =
  'mobile-app-components-molecules-attendance-time-stamp-send-location-toggle';

export default class SendLocationToggle extends React.Component<Props> {
  renderToggleButton() {
    const { disabled, willSendLocation, onClick } = this.props;
    return (
      <div className={`${ROOT}__send-location-toggle-button`}>
        <ToggleButton
          id={`${ROOT}__send-location-toggle-button`}
          testId={`${ROOT}__send-location-toggle-button`}
          className={`${ROOT}__send-location-toggle-button`}
          disabled={!!disabled}
          value={willSendLocation}
          onClick={onClick}
          label={msg().Att_Lbl_SendLocation}
        />
      </div>
    );
  }

  renderResultStatus(): React.ReactNode {
    const { fetchStatus, locationFetchTime } = this.props;
    switch (fetchStatus) {
      case LOCATION_FETCH_STATUS.Success:
        // Show fetch time on success
        const fetchTimeString =
          locationFetchTime !== null
            ? moment(locationFetchTime).format('HH:mm')
            : '';
        return (
          <div className={`${ROOT}__result-status--success`}>
            <p>{msg().Att_Lbl_FetchLocationSuccess}</p>
            {fetchTimeString && (
              <p>
                {`${msg().Att_Lbl_FetchLocationFetchTime}: ${fetchTimeString}`}
              </p>
            )}
          </div>
        );
      case LOCATION_FETCH_STATUS.Fetching:
        return (
          <div className={`${ROOT}__result-status--fetching`}>
            <p>{msg().Att_Lbl_FetchLocationFetching}</p>
          </div>
        );
      case LOCATION_FETCH_STATUS.Failure:
        return (
          <div className={`${ROOT}__result-status--failure`}>
            <p>{msg().Att_Lbl_FetchLocationFail}</p>
            <p>{msg().Att_Lbl_FetchLocationFailRemarks}</p>
          </div>
        );
      default:
        return null;
    }
  }

  render() {
    const { className: $className } = this.props;
    const className = classNames(ROOT, $className);

    return (
      <div className={className}>
        {this.renderToggleButton()}
        {this.renderResultStatus()}
      </div>
    );
  }
}
