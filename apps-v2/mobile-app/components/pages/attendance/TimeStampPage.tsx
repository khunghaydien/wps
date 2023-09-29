import * as React from 'react';

import TimeStamp from '../../organisms/attendance/TimeStamp';

type TimeStampProps = TimeStamp['props'];

const ROOT = 'mobile-app-components-pages-attendance-time-stamp-page';

type Props = TimeStampProps & {
  Containers: {
    AttendanceRequestIgnoreWarningConfirm: React.ComponentType;
  };
};

export default class TimeStampPage extends React.PureComponent<Props> {
  render() {
    const { Containers } = this.props;
    return (
      <div className={ROOT}>
        <TimeStamp className={`${ROOT}__time-stamp`} {...this.props} />
        <Containers.AttendanceRequestIgnoreWarningConfirm />
      </div>
    );
  }
}
