import React from 'react';

import FormatUtil from '../../../../../../utils/FormatUtil';

import msg from '../../../../../../languages';

import './index.scss';

type Props = {
  amount: number;
  baseCurrencySymbol: string;
};

const ROOT = 'ts-expenses-requests__contents__form__amount';

export default class Amount extends React.Component<Props> {
  render() {
    const amount = FormatUtil.formatNumber(this.props.amount);
    return (
      <div className={`${ROOT} slds-grid`}>
        <div className="slds-col slds-size--3-of-12 slds-align-middle">
          <div className="key key--amount">{msg().Exp_Clbl_Amount}</div>
        </div>
        <div className="slds-col slds-size--1-of-12 slds-align-middle" />
        <div className="slds-col slds-size--8-of-12 slds-align-middle">
          <div className="value" data-testid={`${ROOT}-value`}>
            {`${this.props.baseCurrencySymbol} ${amount}`}
          </div>
        </div>
      </div>
    );
  }
}
