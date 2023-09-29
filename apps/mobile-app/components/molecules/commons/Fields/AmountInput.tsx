import * as React from 'react';

import classNames from 'classnames';

import FormatUtil from '../../../../../commons/utils/FormatUtil';
import StringUtil from '../../../../../commons/utils/StringUtil';

import Input from '../../../atoms/Fields/Input';
import {
  InputProps,
  mapPropsToInputProps,
} from '../../../atoms/Fields/InputProps';
import { IconSetType } from '../../../atoms/Icon/IconSet';

const ROOT = 'mobile-app-molecules-commons-amount-input';

type State = {
  isFocus: boolean;
  value: number | '';
};

type Props = Readonly<
  InputProps & {
    className?: string;
    testId?: string;
    error?: boolean;
    icon?: IconSetType;
    value: number;
    decimalPlaces?: number;
    onBlur: (arg0: number) => void;
  }
>;

export default class AmountInput extends React.Component<Props, State> {
  state = {
    isFocus: false,
    value: this.props.value,
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.value !== this.props.value ||
      String(nextProps.value) === '' ||
      nextProps.value !== this.state.value
    ) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  onBlur = () => {
    this.setState(({ value }) => {
      const formattedValue = Number(value) || 0;

      if (this.props.onBlur) {
        this.props.onBlur(formattedValue);
      }
      return {
        value: formattedValue,
        isFocus: false,
      };
    });
  };

  onFocus = () => {
    this.setState(({ value }) => ({
      value: value || '',
      isFocus: true,
    }));
  };

  onChange = (e: any) => {
    const decimalPlaces = this.props.decimalPlaces || 0;
    const value = e.target.value;
    if (value === '') {
      this.setState({ value });
    } else if (value.match(/^[0-9|０-９]+$/)) {
      const hanValue = StringUtil.convertToHankaku(value);
      if (hanValue < 1000000000000) {
        this.setState({
          value: hanValue,
        });
      }
    } else if (
      decimalPlaces > 0 &&
      value.match(`^[0-9|０-９]+[\\\\.]?([0-9|０-９]{1,${decimalPlaces}})?$`)
    ) {
      const hanValue = StringUtil.convertToHankaku(value);
      if (hanValue < 1000000000000) {
        this.setState({
          value: hanValue,
        });
      }
    }
  };

  render() {
    const className = classNames(ROOT, this.props.className);

    const value = !this.state.isFocus
      ? FormatUtil.formatNumber(this.state.value, this.props.decimalPlaces || 0)
      : this.state.value;

    return (
      <Input
        {...mapPropsToInputProps(this.props)}
        className={className}
        testId={this.props.testId}
        type="text"
        icon={this.props.icon}
        error={this.props.error}
        value={String(value)}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onChange={this.onChange}
        maxLength={13}
      />
    );
  }
}
