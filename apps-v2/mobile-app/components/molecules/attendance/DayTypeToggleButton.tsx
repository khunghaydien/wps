import * as React from 'react';

import classNames from 'classnames';

import { DAY_TYPE } from '../../../constants/timesheet';

import msg from '../../../../commons/languages';

import LabelWithHint from '../../atoms/LabelWithHint';
import ToggleButton from '../../atoms/ToggleButton';

import './DayTypeToggleButton.scss';

const ROOT = 'mobile-app-molecules-commons-switch-field';

type Props = {
  label: string;
  value: boolean;
  requestableDayType: string;
  onChange: (arg0: boolean) => void;
  readOnly: boolean;
  className?: string;
  disabled?: boolean;
};

export default class DayTypeToggleButton extends React.PureComponent<Props> {
  renderSwitchComponent = (props: Props) => {
    const { requestableDayType, readOnly } = props;
    if (requestableDayType === DAY_TYPE.Holiday) {
      return (
        <div
          className={
            readOnly
              ? `${ROOT}__item_wrapper_disabled`
              : `${ROOT}__item_wrapper`
          }
        >
          <span className={`${ROOT}__text`}>
            {msg().Att_Lbl_ChangeToHoliday}
          </span>
          <ToggleButton
            className={`${ROOT}__send-location-toggle-button`}
            value={this.props.value}
            disabled={readOnly}
            onClick={(e) => this.props.onChange(e)}
          />
        </div>
      );
    }
    if (requestableDayType === DAY_TYPE.Workday) {
      return (
        <div
          className={
            readOnly
              ? `${ROOT}__item_wrapper_disabled`
              : `${ROOT}__item_wrapper`
          }
        >
          <span className={`${ROOT}__text`}>
            {msg().Att_Lbl_ChangeHolidayToWorkday}
          </span>
        </div>
      );
    }
  };

  render() {
    const className = classNames(ROOT, this.props.className);
    return (
      <div className={className}>
        <LabelWithHint className={`${ROOT}__label`} text={this.props.label} />
        {this.renderSwitchComponent(this.props)}
      </div>
    );
  }
}
