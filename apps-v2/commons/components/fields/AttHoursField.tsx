import React from 'react';

import classNames from 'classnames';

import './AttHoursField.scss';

const ROOT = 'commons-fields-att-time-field';

export type Props = {
  value: string;
  type: string;
  onBlur: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
};

type State = {
  value: string;
  prevValue?: string;
};

export default class AttHoursField extends React.Component<Props, State> {
  static defaultProps = {
    required: false,
    disabled: false,
    className: '',
    placeholder: '',
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      prevValue: this.props.value || '',
      value: this.props.value || '',
    };

    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
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
      this.formatAndApplyMinutesIfValid(e.currentTarget.value);
    }
  };

  onBlur = (e: React.SyntheticEvent<HTMLInputElement>) => {
    this.formatAndApplyMinutesIfValid(e.currentTarget.value);
  };

  /**
   * mm 形式にパースできる文字列だったら値を更新しつつ prevValue も更新
   */
  formatAndApplyMinutesIfValid = (value: string) => {
    if (
      (this.props.type === 'MAX_HOURS_KEY' ||
        this.props.type === 'MIN_HOURS_KEY') &&
      value === ''
    ) {
      this.setState({
        prevValue: '0',
        value: '0',
      });
      this.props.onBlur('0');
      return;
    }

    if (
      (this.props.type === 'MAX_MINUTES_KEY' ||
        this.props.type === 'MIN_MINUTES_KEY') &&
      value === ''
    ) {
      this.setState({
        prevValue: '00',
        value: '00',
      });
      this.props.onBlur('00');
      return;
    }

    let formattedValue = '';
    if (
      this.props.type === 'MAX_HOURS_KEY' ||
      this.props.type === 'MIN_HOURS_KEY'
    ) {
      if (+value.replace(/\D/g, '') < 48) {
        formattedValue = value.replace(/\D/g, '')
          ? value.replace(/\D/g, '')
          : '';
      }
    }
    if (
      this.props.type === 'MAX_MINUTES_KEY' ||
      this.props.type === 'MIN_MINUTES_KEY'
    ) {
      if (+value.replace(/\D/g, '') < 60) {
        formattedValue = value.replace(/\D/g, '')
          ? value.replace(/\D/g, '').padStart(2, '0')
          : '';
      }
    }

    if (formattedValue !== '') {
      this.props.onBlur(formattedValue);
      this.setState({
        prevValue: formattedValue,
        value: formattedValue,
      });
    } else {
      this.setState((prevState) => ({ value: prevState.prevValue }));
    }
  };

  render() {
    const cssClass = classNames('slds-input', ROOT, this.props.className);
    return (
      <input
        type="text"
        maxLength={2}
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
