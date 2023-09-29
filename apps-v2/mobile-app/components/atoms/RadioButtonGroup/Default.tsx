// Reference url: https://react.lightningdesignsystem.com/components/radio-button-groups/

import * as React from 'react';

import {
  Radio,
  RadioButtonGroup as RBG,
} from '@salesforce/design-system-react';

import { Props } from './Props';

import './Default.scss';

const ROOT = 'mobile-app-atoms-radio-button-group-default';

export default class RadioButtonGroup extends React.Component<Props> {
  render() {
    return (
      <div className={`${ROOT}`}>
        <RBG
          labels={this.props.label}
          onChange={this.props.onChange}
          required={this.props.required}
          disabled={this.props.disabled}
        >
          {this.props.options.map((option, index) => (
            <Radio
              key={index}
              label={option.label}
              value={option.value}
              checked={this.props.value === option.value}
              variant="button-group"
            />
          ))}
        </RBG>
      </div>
    );
  }
}
