import React from 'react';

import FormatUtil from '../../../utils/FormatUtil';

const ROOT = 'commons-grid-formatters-currency';

type Props = {
  value: number;
  baseCurrencySymbol: string;
  baseCurrencyDecimal: number;
};

export default class Currency extends React.Component<Props> {
  render() {
    const { baseCurrencySymbol = '', baseCurrencyDecimal, value } = this.props;
    const amount = FormatUtil.formatNumber(value, baseCurrencyDecimal);

    return <div className={ROOT}>{`${baseCurrencySymbol} ${amount}`}</div>;
  }
}
