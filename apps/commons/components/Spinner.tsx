import React from 'react';
import { CSSTransition as ReactCSSTransitionGroup } from 'react-transition-group';

import classNames from 'classnames';

import './Spinner.scss';

const ROOT = 'commons-spinner';

type Props = {
  loading: boolean;
  priority: string;
  className?: string;
  hintMsg?: string;
};
/**
 * 共通コンポーネント - ローディングスピナー
 */
export default class Spinner extends React.Component<Props> {
  static get defaultProps() {
    return {
      priority: 'high',
    };
  }

  renderSpinner() {
    if (this.props.loading) {
      const className = classNames(
        `${ROOT} slds-spinner_container ${this.props.className}`,
        {
          [`${ROOT} slds-spinner_container_low`]: this.props.priority === 'low',
        }
      );

      return (
        <div className={className} key={ROOT}>
          <div role="status" className="slds-spinner slds-spinner--medium">
            <span className="slds-assistive-text">Loading...</span>
            <div className="slds-spinner__dot-a" />
            <div className="slds-spinner__dot-b" />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        classNames={ROOT}
        timeout={{ enter: 100, exit: 100 }}
      >
        <>
          <div>{this.renderSpinner()}</div>
          {this.props.hintMsg && (
            <div className={`${ROOT}__hint`}>{this.props.hintMsg}</div>
          )}
        </>
      </ReactCSSTransitionGroup>
    );
  }
}
