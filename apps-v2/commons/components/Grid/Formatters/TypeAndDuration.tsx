import React from 'react';

import DateUtil from '../../../utils/DateUtil';
import ObjectUtil from '../../../utils/ObjectUtil';

const ROOT = 'commons-grid-formatters-type-and-duration';

type Props = {
  value: string;
};

export default class TypeAndDuration extends React.Component<Props> {
  renderEndDate() {
    const startDate = ObjectUtil.getOrEmpty(this.props.value, 'startDate');
    const endDate = ObjectUtil.getOrEmpty(this.props.value, 'endDate');

    if (endDate && startDate !== endDate) {
      return `–${DateUtil.formatYMD(endDate)}`;
    } else {
      return null;
    }
  }

  render() {
    const startDate = ObjectUtil.getOrEmpty(this.props.value, 'startDate');
    const type = ObjectUtil.getOrEmpty(this.props.value, 'type');

    return (
      <div className={`${ROOT}`}>
        <div>
          {DateUtil.formatYMD(startDate)}
          {this.renderEndDate()}
        </div>
        <div>{type}</div>
      </div>
    );
  }
}
