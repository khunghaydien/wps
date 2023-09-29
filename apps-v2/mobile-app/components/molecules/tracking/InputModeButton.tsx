import * as React from 'react';

import classNames from 'classnames';

import Icon from '../../atoms/Icon';

import './InputModeButton.scss';

const ROOT = 'mobile-app-molecules-tracking-input-mode-button';

type Mode = 'ratio' | 'time';

type Props = Readonly<{
  testId?: string;
  value: Mode;
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}>;

export default class InputModeButton extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, {
      [`${ROOT}--on`]: this.props.value === 'ratio',
      [`${ROOT}--off`]: this.props.value === 'time',
      [`${ROOT}--disabled`]: this.props.disabled,
    });
    return (
      <button
        className={className}
        onClick={this.props.onClick}
        data-test-id={this.props.testId}
        disabled={this.props.disabled}
      >
        <Icon type="ratio" />
      </button>
    );
  }
}
