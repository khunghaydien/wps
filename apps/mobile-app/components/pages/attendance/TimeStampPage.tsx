import * as React from 'react';

import TimeStamp from '../../organisms/attendance/TimeStamp';

type TimeStampProps = TimeStamp['props'];

const ROOT = 'mobile-app-components-pages-attendance-time-stamp-page';

type Props = TimeStampProps;

export default class TimeStampPage extends React.PureComponent<Props> {
  render() {
    return (
      <div className={ROOT}>
        <TimeStamp className={`${ROOT}__time-stamp`} {...this.props} />
      </div>
    );
  }
}
