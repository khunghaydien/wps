import React from 'react';

import FormatUtil from '../../../utils/FormatUtil';

import './Amount.scss';

const ROOT = 'commons-grid-formatters-amount';

type Props = {
  value: number;
};

export default class Amount extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>{FormatUtil.formatNumber(this.props.value)}</div>
    );
  }
}
