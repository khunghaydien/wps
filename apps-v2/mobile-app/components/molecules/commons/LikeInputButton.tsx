import * as React from 'react';

import classNames from 'classnames';
import isNil from 'lodash/isNil';

import clickable, {
  ClickableProps,
} from '../../../../commons/concerns/clickable';
import displayName from '../../../../commons/concerns/displayName';

import { compose } from '../../../../commons/utils/FnUtil';

import Icon from '../../atoms/Icon';

import './LikeInputButton.scss';

export type ButtonType = 'button' | 'submit' | 'reset';

type Props = Readonly<
  ClickableProps & {
    className?: string;
    testId?: string;
    error?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    placeholder?: string;
    type?: ButtonType;
    value?: string;
    onClick?: () => void;
  }
>;

const ROOT = 'mobile-app-molecules-common-like-input-button';

class LikeInputButtonPresentation extends React.PureComponent<Props> {
  render() {
    const hasValue = !isNil(this.props.value) && !!this.props.value;
    const className = classNames(ROOT, this.props.className);
    const buttonClassName = classNames(`${ROOT}__button`, {
      [`${ROOT}__button--placeholder`]: !hasValue,
      [`${ROOT}__button--error`]: this.props.error,
      [`${ROOT}__button--disabled`]: this.props.disabled,
      [`${ROOT}__button--read-only`]: this.props.readOnly,
    });
    return (
      <div className={className}>
        <button
          className={buttonClassName}
          data-test-id={this.props.testId}
          onClick={this.props.onClick}
          // @ts-ignore
          readOnly={this.props.readOnly}
          disabled={this.props.disabled}
          type={this.props.type || 'button'}
        >
          <div className={`${ROOT}__text`}>
            {hasValue ? this.props.value : this.props.placeholder}
          </div>
          <div className={`${ROOT}__icon`}>
            <Icon type="chevronright" />
          </div>
        </button>
      </div>
    );
  }
}

export default compose(
  displayName('LikeInputButton'),
  clickable
)(LikeInputButtonPresentation) as React.ComponentType<{
  [key: string]: any;
}>;
