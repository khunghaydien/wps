import React from 'react';

import isNil from 'lodash/isNil';

import FormatUtil from '../../utils/FormatUtil';
import TextUtil from '../../utils/TextUtil';

import msg from '../../languages';
import TextField from './TextField';

import './AmountField.scss';

/**
 * 金額項目
 *
 * TODO:
 * - 全角数字を入力されたときの処理
 * - 有効桁数を超えたときに有効桁数を超える数字は切り捨てる処理
 */
export type Props = {
  value: (number | any) | null | undefined;
  fractionDigits?: number;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onBlur?: (arg0: number | null, arg1?) => void;
  onChange?: (arg0: number | null) => void;
  nullable?: boolean;
  currencySymbol?: string;
  'data-testid'?: string;
  allowNegative?: boolean;
};

type State = {
  focussed: boolean;
  pattern: RegExp;
  value: string;
  fractionDigits: number;
};

export default class AmountField extends React.Component<Props, State> {
  static defaultProps = {
    fractionDigits: 0,
    disabled: false,
    readOnly: false,
  };

  // eslint-disable-next-line react/sort-comp
  makePattern = (fractionDigits?: number, allowNegative?: boolean) => {
    const _allowNegative = !isNil(allowNegative)
      ? allowNegative
      : this.props.allowNegative;
    const negativePattern = _allowNegative ? '(-?)' : '';
    return !isNil(fractionDigits) && fractionDigits > 0
      ? new RegExp(
          `^${negativePattern}(([0-9|０-９]{1}[0-9|０-９]{0,11})|0|０)?(\\.|(\\.[0-9０-９]{0,${fractionDigits}}))?$`
        )
      : new RegExp(`^${negativePattern}([0-9０-９]{1}[0-9０-９]{0,11}|0|０)?$`);
  };

  // TODO: props.value の小数桁が fractionDigits 以上だったら
  // 最初から切り捨てる必要がある
  state = {
    focussed: false,
    value: this.props.value === null ? '' : String(this.props.value),
    pattern: this.makePattern(this.props.fractionDigits),
    fractionDigits: this.props.fractionDigits || 0,
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.value !== this.props.value ||
      String(nextProps.value) === '' ||
      String(nextProps.value) !== this.state.value
    ) {
      this.setState({
        value: String(nextProps.value),
      });
    }
    if (
      nextProps.fractionDigits !== this.state.fractionDigits ||
      nextProps.allowNegative !== this.props.allowNegative
    ) {
      this.setState({
        fractionDigits: nextProps.fractionDigits || 0,
        pattern: this.makePattern(
          nextProps.fractionDigits,
          nextProps.allowNegative
        ),
      });
    }
  }

  onFocus = () => {
    const { value } = this.state;
    const currentValue =
      value.length > 0 && parseFloat(value) === 0 ? '' : value;

    this.setState({
      value: currentValue,
      focussed: true,
    });
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value }: any = e.target;
    if (value.length > 0 && !value.match(this.state.pattern)) {
      return;
    }
    this.setState({
      value,
    });
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  onBlur = () => {
    if (this.props.value !== this.state.value) {
      let formattedValue;
      if (this.props.nullable) {
        formattedValue =
          this.state.value.length > 0
            ? this.convertCharacter(this.state.value)
            : '';
        this.setState({
          focussed: false,
          value: formattedValue,
        });
        formattedValue = formattedValue !== '' ? Number(formattedValue) : null;
      } else {
        const convertedValue =
          this.state.value.length > 0
            ? this.convertCharacter(this.state.value)
            : '0';
        formattedValue = Number(convertedValue) || 0;
        this.setState({
          focussed: false,
          value: String(formattedValue),
        });
      }
      if (this.props.onBlur) {
        this.props.onBlur(formattedValue);
      }
    }
  };

  // Shift character code if Japanese capital number（全角数字を半角に変換）
  // TODO: Consider other language (not only Japanese)
  convertCharacter = (v: string) => {
    return v.replace(/[０-９]/g, (tmpStr) =>
      String.fromCharCode(tmpStr.charCodeAt(0) - 0xfee0)
    );
  };

  countDecimals = (value: string) => {
    if (!!value || Math.floor(parseFloat(value)) === parseFloat(value)) {
      return 0;
    }
    const decimal = value.split('.')[1] || '';
    return decimal.length || 0;
  };

  render() {
    const {
      className,
      disabled,
      readOnly,
      nullable,
      'data-testid': testid,
    } = this.props;
    let value;
    if (nullable && this.state.value === '') {
      value = '';
    } else if (
      this.state.focussed ||
      this.countDecimals(this.state.value) > this.state.fractionDigits
    ) {
      value = this.state.value;
    } else {
      value = FormatUtil.formatNumber(
        this.state.value,
        this.props.fractionDigits
      );
    }

    value =
      !this.state.focussed && this.props.currencySymbol
        ? `${this.props.currencySymbol} ${value}`
        : value;

    return (
      <>
        <TextField
          type="tel"
          className={className}
          value={value}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          disabled={disabled}
          readOnly={readOnly}
          data-testid={testid} // ref={(txtField)=> {this.amtput = txtField;}}
        />
        {this.countDecimals(this.state.value) > this.state.fractionDigits && (
          <div className="amount-field-input-feedback">
            {TextUtil.nl2br(
              TextUtil.template(
                msg().Com_Err_InvalidScale,
                this.state.fractionDigits
              )
            )}
          </div>
        )}
      </>
    );
  }
}
