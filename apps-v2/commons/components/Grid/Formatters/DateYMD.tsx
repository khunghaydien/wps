import React from 'react';

import DateUtil from '../../../utils/DateUtil';

type Props = {
  value: string;
};
export default class DateYMD extends React.Component<Props> {
  render() {
    return <span>{DateUtil.formatYMD(this.props.value)}</span>;
  }
}
