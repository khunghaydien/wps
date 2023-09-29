import React from 'react';

import classNames from 'classnames';

import Highlight from '@apps/commons/components/exp/Highlight';

import FormatUtil from '../../../../../../utils/FormatUtil';

import msg from '../../../../../../languages';

import './index.scss';

type Props = {
  amount: number;
  baseCurrencySymbol: string;
  isHighlight?: boolean;
};

const ROOT = 'ts-expenses-requests__contents__form__amount';

export default class Amount extends React.Component<Props> {
  render() {
    const { isHighlight } = this.props;
    const amount = FormatUtil.formatNumber(this.props.amount);
    return (
      <div className={`${ROOT} slds-grid`}>
        <div className="slds-col slds-size--3-of-12 slds-align-middle">
          <div className="key key--amount">{msg().Exp_Clbl_Amount}</div>
        </div>
        <div className="slds-col slds-size--1-of-12 slds-align-middle" />
        <div className="slds-col slds-size--8-of-12 slds-align-middle">
          <div className="value" data-testid={`${ROOT}-value`}>
            <Highlight
              highlight={isHighlight}
              className={classNames({ highlight: isHighlight })}
            >
              {`${this.props.baseCurrencySymbol} ${amount}`}
            </Highlight>
          </div>
        </div>
      </div>
    );
  }
}
