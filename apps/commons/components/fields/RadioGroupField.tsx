import React from 'react';

import classNames from 'classnames';
import { $Values } from 'utility-types';
import uuid from 'uuid/v1';

import './RadioGroupField.scss';

const ROOT = 'commons-fields-radio-group-fields';

export const LAYOUT_TYPE = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

type Props = {
  options: Array<any>;
  value: string | number;
  name: string;
  onChange: Function;
  layout: $Values<typeof LAYOUT_TYPE>;
  showSelectedTextOnly: boolean;
  disabled?: boolean;
};

export default class RadioGroupField extends React.Component<Props> {
  static defaultProps = {
    name: `r-${uuid()}`,
    onChange: null,
    value: '',
    layout: LAYOUT_TYPE.horizontal,
    showSelectedTextOnly: false,
  };

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.isChecked = this.isChecked.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
  }

  onChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e.target.value, e);
    }
  }

  isChecked(optionValue) {
    return optionValue === this.props.value;
  }

  lookupSelectedText() {
    const { options, value } = this.props;
    return (options.find((item) => item.value === value) || {}).text;
  }

  renderInputs(option) {
    const id = `${ROOT}-id-${uuid()}`;

    const checked = this.isChecked(option.value);

    return (
      <div key={option.value} className={`${ROOT}__radio-wrapper`}>
        <input
          className={`${ROOT}__radio`}
          id={id}
          type="radio"
          value={option.value}
          name={this.props.name}
          checked={checked}
          onChange={this.onChange}
          disabled={this.props.disabled}
        />
        <label htmlFor={id} className={`${ROOT}__label`}>
          {option.text}
        </label>
      </div>
    );
  }

  render() {
    const className = classNames(ROOT, `${ROOT}--layout-${this.props.layout}`);

    const content = this.props.showSelectedTextOnly
      ? this.lookupSelectedText()
      : this.props.options.map(this.renderInputs);

    return <div className={className}>{content}</div>;
  }
}
