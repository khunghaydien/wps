import React from 'react';

import { isEqual } from 'lodash';

import Highlight from '../../exp/Highlight';
import Currency from './Currency';

const CurrencyHighlighted = (props: {
  amountColumnKey: string;
  value: number;
  data: { preRequestItem?: string };
  baseCurrencySymbol: string;
  baseCurrencyDecimal: number;
}): React.ReactElement => {
  const { amountColumnKey, value, data } = props;
  let highlight = false;
  if (
    props.data.preRequestItem &&
    !isEqual(data.preRequestItem[amountColumnKey], value)
  ) {
    highlight = true;
  }
  return (
    <Highlight highlight={highlight}>
      <Currency {...props} />
    </Highlight>
  );
};

export default CurrencyHighlighted;
