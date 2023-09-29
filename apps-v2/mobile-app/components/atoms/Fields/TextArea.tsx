import * as React from 'react';

import classNames from 'classnames';

import { mapPropsToTextAreaProps, TextAreaProps } from './TextAreaProps';

import './TextArea.scss';

const ROOT = 'mobile-app-atoms-textarea';

type Props = TextAreaProps & {
  className?: string;
  error?: boolean;
  testId?: string;
  'aria-describedby'?: string;
};

export default class TextArea extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className, {
      [`${ROOT}--error`]: this.props.error,
      [`${ROOT}--disabled`]: this.props.disabled,
      [`${ROOT}--read-only`]: this.props.readOnly,
    });

    return (
      <div className={className}>
        <textarea
          {...mapPropsToTextAreaProps(this.props)}
          className={`${ROOT}__textarea`}
          data-testid={this.props.testId}
          onChange={this.props.onChange}
          value={this.props.value}
          placeholder={this.props.placeholder}
          required={this.props.required}
          autoFocus={this.props.autoFocus}
          aria-invalid={this.props.error}
          aria-describedby={this.props['aria-describedby']}
        />
      </div>
    );
  }
}
