import React from 'react';

import DateUtil from '../../../utils/DateUtil';
import ObjectUtil from '../../../utils/ObjectUtil';

const ROOT = 'commons-grid-formatters-request';

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
    const subject = ObjectUtil.getOrEmpty(this.props.value, 'subject');
    const reportNo = ObjectUtil.getOrEmpty(this.props.value, 'reportNo');

    return (
      <div className={`${ROOT}`}>
        <div className={`${ROOT}__subject`}>{subject}</div>
        <div className={`${ROOT}__reportNo`}>{reportNo}</div>
      </div>
    );
  }
}
