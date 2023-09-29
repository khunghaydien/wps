import React from 'react';

import classNames from 'classnames';

import TimeUtil from '../../utils/TimeUtil';

import './AttTime3DigitHourField.scss';

const ROOT = 'commons-fields-att-time-3-digit-hour-field';

export type Props = {
  'data-testid'?: string;
  value: string;
  onBlur: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  maxMinutes?: number;
};

type State = {
  value: string;
  prevValue?: string;
};

/**
 * 共通コンポーネント - 勤怠時刻フィールド
 * TimeField.js と異なり、25:00 以降の表記にも対応している
 * 3桁の時間数を表示できる
 */
export default class AttTime3DigitHourField extends React.Component<
  Props,
  State
> {
  static defaultProps = {
    'data-testid': '',
    required: false,
    disabled: false,
    className: '',
    placeholder: '(00:00)',
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      prevValue: this.props.value,
      value: this.props.value,
    };

    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    // 空白、つまり強制的にクリアされた際にリセットする
    if (nextProps.value !== this.props.value || nextProps.value === '') {
      this.setState({
        value: nextProps.value,
        prevValue: nextProps.value,
      });
    }
  }

  onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({ value: e.currentTarget.value });
  };

  // FormがSubmitされる前に変換処理を通しておく意図
  onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.formatAndApplyValueIfValid(e.currentTarget.value);
    }
  };

  onBlur = (e: React.SyntheticEvent<HTMLInputElement>) => {
    this.formatAndApplyValueIfValid(e.currentTarget.value);
  };

  /**
   * HHH:mm 形式にパースできる文字列だったら値を更新しつつ prevValue も更新
   * invalid だった場合は prevValue に戻す
   */
  formatAndApplyValueIfValid = (value: string) => {
    if (value === '') {
      this.setState({
        prevValue: '',
        value: '',
      });
      this.props.onBlur('');
      return;
    }

    const formattedValue = TimeUtil.supportFormatFor3Digit(
      value,
      this.props.maxMinutes
    );

    if (formattedValue !== '') {
      this.setState({
        prevValue: formattedValue,
        value: formattedValue,
      });
      this.props.onBlur(formattedValue);
    } else {
      this.setState((prevState) => ({ value: prevState.prevValue }));
    }
  };

  render() {
    const cssClass = classNames('slds-input', ROOT, this.props.className);

    return (
      <input
        data-testid={this.props['data-testid']}
        type="text"
        placeholder={this.props.disabled === true ? '' : this.props.placeholder}
        value={this.state.value}
        className={cssClass}
        disabled={this.props.disabled}
        required={this.props.required}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onKeyPress={this.onKeyPress}
      />
    );
  }
}
