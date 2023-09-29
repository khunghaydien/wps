import React from 'react';

import classNames from 'classnames';

import FormatUtil from '@apps/commons/utils/FormatUtil';

import './index.scss';

const ROOT = 'ts-psa__summary-panel';

type Props = {
  summaryInfo: Array<any>;
  currencyDecimal: number;
  currencySymbol: string;
};

const FinanceSummaryPanel = (props: Props) => {
  const { summaryInfo, currencyDecimal } = props;

  return (
    <div className={`${ROOT}`}>
      {summaryInfo &&
        summaryInfo.map((data) => {
          const currencySymbolLabel = props.currencySymbol
            ? `  (${props.currencySymbol})`
            : '';
          return (
            <div
              key={data.key}
              className={`${ROOT}__field`}
              data-testid={`${ROOT}__${data.key}`}
            >
              <span
                className={`${ROOT}__label`}
              >{`${data.label} ${currencySymbolLabel}`}</span>
              <span className={classNames(`${ROOT}__value`)}>
                {typeof data.value === 'number'
                  ? FormatUtil.formatNumber(data.value, currencyDecimal)
                  : data.value}
              </span>
            </div>
          );
        })}
    </div>
  );
};

export default FinanceSummaryPanel;
