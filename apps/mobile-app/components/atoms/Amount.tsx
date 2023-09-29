import * as React from 'react';

import classNames from 'classnames';

import FormatUtil from '../../../commons/utils/FormatUtil';

import './Amount.scss';

const ROOT = 'mobile-app-atoms-amount';

export type Props = Readonly<{
  amount: number;
  decimalPlaces: number;
  symbol: string;
  className?: string;
  noFormat?: boolean;
}>;

export default (props: Props) => {
  // OCR return should not add formatting
  const amount = !props.noFormat
    ? FormatUtil.formatNumber(props.amount, props.decimalPlaces)
    : props.amount;

  const className = classNames(ROOT, props.className);
  return (
    amount !== '' && (
      <div className={className}>
        <div className={`${ROOT}__symbol`}>{props.symbol}</div>
        <div className={`${ROOT}__text`}>{amount}</div>
      </div>
    )
  );
};
