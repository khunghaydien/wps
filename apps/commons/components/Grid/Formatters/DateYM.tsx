import React from 'react';

import DateUtil from '../../../utils/DateUtil';

type Props = {
  value: string;
};
export default class DateYM extends React.Component<Props> {
  render() {
    return <span>{DateUtil.formatYM(this.props.value)}</span>;
  }
}
