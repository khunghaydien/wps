import * as React from 'react';

import classNames from 'classnames';

import clickable, { ClickableProps } from '../../../commons/concerns/clickable';
import displayName from '../../../commons/concerns/displayName';

import { compose } from '../../../commons/utils/FnUtil';

import './TextButton.scss';

const ROOT = 'mobile-app-atoms-text-button';

type Props = Readonly<
  ClickableProps & {
    className?: string;
    disabled?: boolean;
    testId?: string;
    type?: string;
    children: string;
  }
>;

type Type = 'button' | 'submit' | 'reset';
class TextButtonPresentation extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    const buttonClassName = classNames(`${ROOT}__button`, {
      [`${ROOT}__button--disabled`]: this.props.disabled,
    });

    return (
      <div className={className}>
        <button
          data-test-id={this.props.testId}
          className={buttonClassName}
          type={this.props.type as Type}
          disabled={this.props.disabled}
          onClick={this.props.onClick}
        >
          {this.props.children}
        </button>
      </div>
    );
  }
}

export default compose(
  displayName('TextButton'),
  clickable
)(TextButtonPresentation) as React.ComponentType<{
  [key: string]: any;
}>;
