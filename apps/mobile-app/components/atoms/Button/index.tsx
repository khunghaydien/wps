import * as React from 'react';

import classNames from 'classnames';

import clickable, {
  ClickableProps,
} from '../../../../commons/concerns/clickable';
import displayName from '../../../../commons/concerns/displayName';

import { compose } from '../../../../commons/utils/FnUtil';

import floatable, { FloatableProps } from './floatable';

import './index.scss';

const ROOT = 'mobile-app-atoms-button';

type Props = Readonly<
  ClickableProps &
    FloatableProps & {
      variant: 'neutral' | 'add' | 'alert';
      priority: 'primary' | 'secondary';
      disabled?: boolean;
      children?: React.ReactNode;
      type?: string;
      testId?: string;
    }
>;

type Type = 'button' | 'submit' | 'reset';
class ButtonPresentation extends React.PureComponent<Props> {
  props: Props;
  render() {
    const className = classNames(
      ROOT,
      this.props.className,
      `${ROOT}__container`
    );
    const classNameInner = classNames(
      ROOT,
      `${ROOT}__${this.props.variant}--${this.props.priority}`,
      { [`${ROOT}--disabled`]: this.props.disabled }
    );
    return (
      <div className={className}>
        <button
          data-test-id={this.props.testId}
          type={this.props.type as Type}
          className={classNameInner}
          disabled={this.props.disabled}
          onClick={this.props.onClick}
        >
          {this.props.children}
        </button>
      </div>
    );
  }
}
// @ts-ignore
export default compose(
  displayName('Button'),
  floatable,
  clickable
)(ButtonPresentation) as React.ComponentType<{
  [key: string]: any;
}>;
