import * as React from 'react';

import classNames from 'classnames';

import Errors from '../Errors';
import Label from '../Label';
import { Props } from './Props';

import './Classic.scss';

const ROOT = 'mobile-app-atoms-radio-button-group-classic';

export default class Classic extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        <fieldset>
          <Label text={this.props.label.label} marked={this.props.required} />
          <div className={`${ROOT}__control`}>
            <div className={`${ROOT}__radio-button-group`}>
              {(this.props.options || []).map((option, index) => (
                <label className={`${ROOT}__radio-button`} key={index}>
                  <input
                    className={`${ROOT}__radio-button--input`}
                    disabled={this.props.readOnly}
                    readOnly={this.props.readOnly}
                    type="radio"
                    id={String(index)}
                    name={this.props.label.label}
                    value={option.value}
                    checked={option.value === this.props.value}
                    onChange={this.props.onChange}
                  />
                  <div
                    className={classNames(`${ROOT}__radio-button--checked`, {
                      [`${ROOT}__radio-button--readonly`]: this.props.readOnly,
                      [`${ROOT}__radio-button--disabled`]: this.props.disabled,
                    })}
                  />
                  <div className={`${ROOT}__radio-button--label`}>
                    {option.label}
                  </div>
                </label>
              ))}
            </div>
            <div className={`${ROOT}__error`}>
              {this.props.label.error && (
                <Errors messages={[this.props.label.error]} />
              )}
            </div>
          </div>
        </fieldset>
      </div>
    );
  }
}
