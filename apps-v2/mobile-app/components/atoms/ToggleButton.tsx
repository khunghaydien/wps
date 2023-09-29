import * as React from 'react';

import classNames from 'classnames';
import uuid from 'uuid/v4';

import displayName from '../../../commons/concerns/displayName';

import { compose } from '../../../commons/utils/FnUtil';

// NOTE 通常はatoms -> atomsへの依存はよくないのだけど、Iconに限り例外的にそうしている
import Icon from './Icon';

import './ToggleButton.scss';

const ROOT = 'mobile-app-atoms-toggle-button';

type Props = Readonly<{
  id?: string;

  /**
   * Passed to data-test-id
   */
  testId?: string;

  /**
   * Css class
   */
  className?: string;

  /**
   * Label
   */
  label?: string;

  /**
   * Make Toggle Button disalbed
   */
  disabled?: boolean;

  /**
   * Toggle state
   * on: true
   * off: false
   */
  value?: boolean;

  /**
   * click event handler
   */
  onClick: (isToggledOn: boolean) => void;
}>;

const withId = (WrappedComponent: React.ComponentType<Props>) => {
  type State = {
    id: string;
  };

  return class extends React.PureComponent<Props, State> {
    static getDerivedStateFromProps(props: Props, state: State): State {
      return {
        id: state && state.id ? state.id : uuid(),
      };
    }

    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  };
};

class ToggleButtonPresentation extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className, {
      [`${ROOT}--on`]: this.props.value,
      [`${ROOT}--off`]: !this.props.value,
      [`${ROOT}--disabled`]: this.props.disabled,
    });

    const controlClassName = classNames(
      `${ROOT}__control`,
      `${ROOT}__control--neutral` // NOTE neutral 以外のvariantが欲しくなった時に拡張する
    );

    return (
      <div className={className} key={this.props.id}>
        {this.props.label ? (
          <div className={`${ROOT}__label`}>
            <label htmlFor={this.props.id}>{this.props.label}</label>
          </div>
        ) : null}
        <div>
          <label className={controlClassName}>
            <input
              data-test-id={this.props.testId}
              id={this.props.id}
              type="checkbox"
              checked={this.props.value}
              className={`${ROOT}__control-input`}
              onClick={(event: any) => this.props.onClick(event.target.checked)}
            />
            <span className={`${ROOT}__control-toggle`}>
              {this.props.value ? (
                <Icon type="check-copy" size="small" />
              ) : (
                <Icon type="close-copy" size="small" />
              )}
            </span>
          </label>
        </div>
      </div>
    );
  }
}

export default compose(
  displayName('ToggleButton'),
  withId
)(ToggleButtonPresentation) as React.ComponentType<{
  [key: string]: any;
}>;
