import React from 'react';

import isNil from 'lodash/isNil';

import msg from '../../languages';
import Button from '../buttons/Button';
import AmountField from './AmountField';

import './DropdownAmountRange.scss';

const ROOT = 'commons-fields-dropdown-amount';

export type AmountRangeOption = {
  minAmount?: number;
  maxAmount?: number;
};

type Props = {
  amountRange: AmountRangeOption;
  onClickUpdateAmount: (amountRangeOption: AmountRangeOption) => void;
  currencyDecimalPlaces: number;
  toggleDropdown: any;
};

type State = {
  minAmount?: number;
  maxAmount?: number;
  error?: string;
};

class DropdownAmountRange extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      minAmount: this.props.amountRange.minAmount,
      maxAmount: this.props.amountRange.maxAmount,
      error: null,
    };
  }

  updateStartAmount = (value: number | null) => {
    const valueNumber = value === null ? null : Number(value);
    if (
      valueNumber !== null &&
      valueNumber !== undefined &&
      this.state.maxAmount !== null &&
      this.state.maxAmount !== undefined &&
      valueNumber > this.state.maxAmount
    ) {
      this.setState({
        error: msg().Exp_Err_AmountLeftLessThanRight,
      });
    } else {
      this.clearError();
    }
    this.setState({
      minAmount: valueNumber,
    });
  };

  updateEndAmount = (value: number | null) => {
    const valueNumber = value === null ? null : Number(value);
    if (
      valueNumber !== null &&
      valueNumber !== undefined &&
      this.state.minAmount !== null &&
      this.state.minAmount !== undefined &&
      valueNumber < this.state.minAmount
    ) {
      this.setState({
        error: msg().Exp_Err_AmountLeftLessThanRight,
      });
    } else {
      this.clearError();
    }
    this.setState({
      maxAmount: valueNumber,
    });
  };

  updateResult = () => {
    const { minAmount, maxAmount } = this.state;
    this.props.onClickUpdateAmount({ minAmount, maxAmount });
    this.props.toggleDropdown();
  };

  clearError = () => {
    this.setState({
      error: '',
    });
  };

  render() {
    const { error, minAmount, maxAmount } = this.state;

    return (
      <div className={`${ROOT}`}>
        <span className={`${ROOT}__input1`}>
          <AmountField
            value={isNil(minAmount) ? '' : minAmount}
            onBlur={this.updateStartAmount}
            fractionDigits={this.props.currencyDecimalPlaces}
            nullable
          />
        </span>
        <span className={`${ROOT}__separation`}>
          <span className={`${ROOT}__separation-inner`}>–</span>
        </span>
        <span className={`${ROOT}__input2`}>
          <AmountField
            value={isNil(maxAmount) ? '' : maxAmount}
            onBlur={this.updateEndAmount}
            fractionDigits={this.props.currencyDecimalPlaces}
            nullable
          />
        </span>

        {error && <p className={`${ROOT}__error`}>{error}</p>}

        <div className={`${ROOT}__amount-buttons`}>
          <Button
            onClick={this.updateResult}
            disabled={this.state.error !== ''}
          >
            {msg().Com_Btn_Update}
          </Button>
        </div>
      </div>
    );
  }
}

export default DropdownAmountRange;
