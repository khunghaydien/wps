import * as React from 'react';

import classNames from 'classnames';
import moment from 'moment';

import './StampClock.scss';

type Props = {
  className?: string;
  // eslint-disable-next-line react/no-unused-prop-types
  locale: string;
};

type State = {
  currentTime: moment.Moment;
  locale: string | null;
};

const ROOT =
  'mobile-app-components-molecules-attendance-time-stamp-stamp-clock';

export default class StampClock extends React.PureComponent<Props, State> {
  clockTickTimer: number | null | undefined;

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.locale !== prevState.locale) {
      moment.locale(nextProps.locale);
      return {
        currentTime: moment(),
        locale: nextProps.locale,
      };
    }
    return null;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      currentTime: moment(),
      locale: (window.empInfo && window.empInfo.language) || null,
    };
    this.clockTickTimer = null;
  }

  componentDidMount() {
    this.startClockTicking();
  }

  componentWillUnmount() {
    this.stopClockTicking();
  }

  startClockTicking() {
    const TICKING_INTERVAL = 500;
    this.setState({ currentTime: moment() });

    this.clockTickTimer = window.setInterval(
      () => this.setState({ currentTime: moment() }),
      TICKING_INTERVAL
    );
  }

  stopClockTicking() {
    if (this.clockTickTimer !== null && this.clockTickTimer !== undefined) {
      clearInterval(this.clockTickTimer);
    }
  }

  render() {
    const className = classNames(ROOT, this.props.className);
    const { currentTime } = this.state;

    return (
      <div className={className}>
        <p className={`${ROOT}__date`}>{currentTime.format('M/D(ddd)')}</p>
        <p className={`${ROOT}__time`}>
          {currentTime.format('HH')}
          <span>:</span>
          {currentTime.format('mm')}
        </p>
      </div>
    );
  }
}
